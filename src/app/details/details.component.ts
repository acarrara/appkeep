import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Details} from '../models/Details';
import {NavigationHeaderComponent} from '../navigation-header/navigation-header.component';
import {AmountPipe} from '../pipes/amount.pipe';
import {UserHuePipe} from '../pipes/user-hue.pipe';
import {MonthNamePipe} from '../pipes/month-name.pipe';
import {UserNamePipe} from '../pipes/user-name.pipe';
import {IncomeIndicatorComponent} from '../income-indicator/income-indicator.component';
import {RecapCardComponent} from '../recap-card/recap-card.component';
import {CategoriesCardComponent} from '../categories-card/categories-card.component';

@Component({
  selector: 'ak-details',
  templateUrl: 'details.component.html',
  imports: [
    NavigationHeaderComponent,
    AmountPipe,
    UserHuePipe,
    MonthNamePipe,
    UserNamePipe,
    IncomeIndicatorComponent,
    RecapCardComponent,
    CategoriesCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  public details: Details;

  public outTotal: number;
  public inTotal: number;
  public title: string;
  public rangesTitle: string;
  public month: string;
  public year: string;

  private highest: number;

  constructor(activatedRoute: ActivatedRoute, cdr: ChangeDetectorRef) {
    activatedRoute.data.subscribe(data => {
      this.details = data.details;
      this.rangesTitle = data.rangesTitle;
      if (data.title) {
        this.title = data.title;
      } else {
        activatedRoute.paramMap.subscribe(params => {
          this.year = params.get('year');
          this.month = params.get('month');
        });
      }
      this.computeStatistics();
      cdr.markForCheck();
    });
  }

  private computeStatistics() {
    this.outTotal = this.details.users.reduce((partial, current) => partial + current.outTotal, 0);
    this.inTotal = this.details.users.reduce((partial, current) => partial + current.inTotal, 0);
    this.highest = Math.max(
      Math.abs(this.inTotal),
      Math.abs(this.outTotal)
    );
  }

  percentage(partial: number): string {
    return partial ? Math.abs((partial / this.highest * 100)).toFixed(0) + '%' : '0%';
  }
}
