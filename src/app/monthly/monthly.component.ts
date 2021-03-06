import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { OptionableComponent } from '../optionable.component';
import { AppKeep } from '../models/AppKeep';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { StoreService } from '../../redux/store.service';
import { Observable } from 'rxjs';
import { UserInfo } from '../models/UserInfo';
import { Location } from '@angular/common';
import { Listen } from '../../redux/listen.decorator';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../models/Category';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'ak-monthly',
  templateUrl: 'monthly.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthlyComponent extends OptionableComponent implements OnInit {

  @Listen(['users'], users => users.map(user => user.email))
  users$: Observable<UserInfo[]>;
  monthlyAppkeep: AppKeep;
  edit: boolean;

  @ViewChildren('NgModel') models: QueryList<NgModel>;

  constructor(store: StoreService<AppKeepState>,
              actions: AppActions,
              private location: Location,
              private route: ActivatedRoute) {
    super(store, actions);
  }

  ngOnInit(): void {
    this.resetValue();
    this.route.paramMap.subscribe(paramMap => {
      this.edit = paramMap.has('id');
      if (this.edit) {
        const id = paramMap.get('id');
        this.monthlyAppkeep = {...this.store.snapshot(['monthlyAppKeeps'], appKeeps => appKeeps.find(appKeep => appKeep._id === id))};
      }
    });
  }

  reset(form: NgForm) {
    form.reset();
    this.resetValue();
  }

  private resetValue() {
    this.monthlyAppkeep = {
      category: '',
      title: 'New appKeep',
      amount: 0,
      date: Date.now(),
      user: '',
      income: false
    };
  }

  primaryAction(form: NgForm, categories: Category[]) {
    if (form.invalid) {
      return;
    }
    this.updateCategory(categories, this.monthlyAppkeep.category);
    if (this.edit) {
      this.store.dispatch(this.actions.editMonthlyAppKeep(this.monthlyAppkeep));
    } else {
      this.store.dispatch(this.actions.addMonthlyAppKeep(this.monthlyAppkeep));
    }
    this.location.back();
  }

  criticalAction(form: NgForm) {
    if (this.edit) {
      this.store.dispatch(this.actions.deleteMonthlyAppKeep(this.monthlyAppkeep));
      this.location.back();
    } else {
      this.reset(form);
    }
  }
}
