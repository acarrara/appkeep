import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OptionableComponent } from '../optionable.component';
import { AppKeep } from '../models/AppKeep';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { StoreService } from '../../redux/store.service';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { Location } from '@angular/common';
import { Listen } from '../../redux/listen.decorator';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../models/Category';

@Component({
  selector: 'ak-monthly',
  templateUrl: 'monthly.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthlyComponent extends OptionableComponent implements OnInit {

  @Listen(['users'], users => users.map(user => user.email))
  users$: Observable<User[]>;
  monthlyAppkeep: AppKeep;
  edit: boolean;

  constructor(store: StoreService<AppKeepState>,
              actions: AppActions,
              private location: Location,
              private route: ActivatedRoute) {
    super(store, actions);
  }

  ngOnInit(): void {
    this.reset();
    this.route.paramMap.subscribe(paramMap => {
      this.edit = paramMap.has('id');
      if (this.edit) {
        const id = paramMap.get('id');
        this.monthlyAppkeep = {...this.store.snapshot(['monthlyAppKeeps'], appKeeps => appKeeps.find(appKeep => appKeep._id === id))};
      }
    });
  }

  reset() {
    this.monthlyAppkeep = {
      category: '',
      title: 'New appKeep',
      amount: 0,
      date: Date.now(),
      user: '',
      income: false
    };
  }

  primaryAction(categories: Category[]) {
    this.updateCategory(categories, this.monthlyAppkeep.category);
    if (this.edit) {
      this.store.dispatch(this.actions.editMonthlyAppKeep(this.monthlyAppkeep));
    } else {
      this.store.dispatch(this.actions.addMonthlyAppKeep(this.monthlyAppkeep));
    }
    this.location.back();
  }

  criticalAction() {
    if (this.edit) {
      this.store.dispatch(this.actions.deleteMonthlyAppKeep(this.monthlyAppkeep));
      this.location.back();
    } else {
      this.reset();
    }
  }
}
