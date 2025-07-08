import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {AppKeep} from '../models/AppKeep';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {AppActions} from '../app.actions';
import {Option} from '../models/Option';
import {OptionableComponent} from '../optionable.component';
import {Observable} from 'rxjs';
import {Category} from '../models/Category';
import {AsyncPipe, DatePipe, Location} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {NavigationHeaderComponent} from '../navigation-header/navigation-header.component';
import {CategoryHuePipe} from '../pipes/category-hue.pipe';
import {AmountPipe} from '../pipes/amount.pipe';
import {FocusOnErrorDirective} from '../focus-on-error.directive';
import {IconComponent} from '../icon/icon.component';
import {InputErrorComponent} from '../input-error/input-error.component';

@Component({
  selector: 'ak-edit',
  templateUrl: 'edit.component.html',
  imports: [
    AsyncPipe,
    NavigationHeaderComponent,
    CategoryHuePipe,
    AmountPipe,
    DatePipe,
    FormsModule,
    FocusOnErrorDirective,
    IconComponent,
    InputErrorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent extends OptionableComponent {
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);


  public users$: Observable<string[]> = this.store.get(['users'], users => users.map(user => user.email));

  public appKeep: AppKeep;

  constructor() {
    const actions = inject(AppActions);

    super(actions);
    this.activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('id'))).subscribe(id => {
      this.appKeep = {
        ...this.lookupAppKeep(id, ['appKeeps']) ||
        this.lookupAppKeep(id, ['categoryStatistics', 'thisMonthAppKeeps'])
      };
    });
  }

  edit(form: NgForm, options: Option[], categories: Category[]) {
    if (form.invalid) {
      return;
    }
    this.store.dispatch(this.actions.editAppKeep(this.appKeep));
    const {title, category} = this.appKeep;
    this.updateOptions(title, category, options, categories);
    this.store.dispatch(this.actions.loadStatistics());
    this.close();
  }

  close() {
    this.location.back();
  }

  delete() {
    this.store.dispatch(this.actions.deleteAppKeep(this.appKeep));
    this.store.dispatch(this.actions.loadStatistics());
    this.close();
  }

  toDate($event: string) {
    this.appKeep.date = new Date($event).getTime();
  }

  private lookupAppKeep(id, path: string[]) {
    return this.store.snapshot<AppKeep[]>(path).find(appKeep => appKeep._id === id);
  }

  onCategoryChange(categories: Category[]) {
    const category = this.lookupCategory(categories, this.appKeep.category);
    if (category) {
      this.appKeep.income = category.income;
    }
  }
}
