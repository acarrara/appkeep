import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { map } from 'rxjs/operators';
import { AppActions } from '../app.actions';
import { Option } from '../models/Option';
import { OptionableComponent } from '../optionable.component';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ak-edit',
  templateUrl: 'edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent extends OptionableComponent {

  public users$: Observable<string[]>;

  public appKeep: AppKeep;

  constructor(private activatedRoute: ActivatedRoute,
              store: StoreService<AppKeepState>,
              actions: AppActions,
              private location: Location) {
    super(store, actions);
    this.users$ = store.get(['users'], users => users.map(user => user.email));
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
