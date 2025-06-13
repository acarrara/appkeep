import {ChangeDetectionStrategy, Component, inject, Inject, Input} from '@angular/core';
import {AppKeep} from '../models/AppKeep';
import {Category} from '../models/Category';
import {Observable} from 'rxjs';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';
import {AsyncPipe, DatePipe, LowerCasePipe, NgClass} from '@angular/common';
import {IncomeIndicatorComponent} from "../income-indicator/income-indicator.component";
import {AmountPipe} from "../pipes/amount.pipe";
import {RouterLink} from "@angular/router";
import {CardComponent} from "../card/card.component";
import {CategoryHuePipe} from "../pipes/category-hue.pipe";
import {UserHuePipe} from "../pipes/user-hue.pipe";
import {UserNamePipe} from "../pipes/user-name.pipe";

@Component({
  selector: 'ak-appkeeps-card',
  templateUrl: 'appkeeps-card.component.html',
  imports: [
    AsyncPipe,
    IncomeIndicatorComponent,
    AmountPipe,
    DatePipe,
    RouterLink,
    NgClass,
    CardComponent,
    CategoryHuePipe,
    LowerCasePipe,
    UserHuePipe,
    UserNamePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppkeepsCardComponent {

  store: StoreService<AppKeepState> = inject(StoreService);

  categories$: Observable<Category[]> = this.store.get(['categories']);

  @Input()
  appKeeps: AppKeep[];
  @Input()
  total: number;
  @Input()
  when: string;
  @Input()
  hue = 0;
  @Input()
  showDate = false;
}
