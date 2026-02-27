import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppKeep} from '../models/AppKeep';
import {AppActions} from '../app.actions';
import {OptionableComponent} from '../optionable.component';
import {Observable} from 'rxjs';
import {User} from '../models/User';
import {NavigationHeaderComponent} from '../navigation-header/navigation-header.component';
import {AsyncPipe, DatePipe, LowerCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AmountPipe} from '../pipes/amount.pipe';
import {IncomeIndicatorComponent} from '../income-indicator/income-indicator.component';
import {CategoryHuePipe} from '../pipes/category-hue.pipe';
import {UserHuePipe} from '../pipes/user-hue.pipe';
import {UserNamePipe} from '../pipes/user-name.pipe';
import {RouterLink} from '@angular/router';
import {EmptyStateComponent} from '../card/empty-state.component';
import {first} from 'rxjs/operators';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'ak-search',
  templateUrl: 'search.component.html',
  imports: [
    AsyncPipe,
    NavigationHeaderComponent,
    FormsModule,
    AmountPipe,
    DatePipe,
    IncomeIndicatorComponent,
    CategoryHuePipe,
    LowerCasePipe,
    UserHuePipe,
    UserNamePipe,
    RouterLink,
    EmptyStateComponent,
    IconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent extends OptionableComponent {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  user$: Observable<User> = this.store.get(['user']);

  query = '';
  results: AppKeep[] | null = null;
  searched = false;

  constructor() {
    const actions = inject(AppActions);
    super(actions);
    this.store.dispatch(actions.loadOptions());
    this.store.dispatch(actions.loadCategories());
    this.store.dispatch(actions.loadUsers());
  }

  get total(): number {
    if (!this.results?.length) { return 0; }
    return this.results.reduce((sum, a) => sum + a.amount * (a.income ? 1 : -1), 0);
  }

  search() {
    const q = this.query.trim();
    if (!q) { return; }
    this.http.get<AppKeep[]>(`/api/appkeeps/search?q=${encodeURIComponent(q)}`).pipe(first()).subscribe(results => {
      this.results = results;
      this.searched = true;
      this.cdr.markForCheck();
    });
  }
}
