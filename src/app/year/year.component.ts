import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { YearStatistics } from '../models/YearStatistics';

@Component({
  selector: 'ak-year',
  templateUrl: 'year.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearComponent {
  public yearStatistics: YearStatistics;

  public allAppKeep: number;
  public allIncome: number;
  public year: string;

  private highest: number;

  constructor(activatedRoute: ActivatedRoute, store: StoreService<AppKeepState>, actions: AppActions, cdr: ChangeDetectorRef) {
    activatedRoute.paramMap.subscribe(params => {
      if (!params.has('year')) {
        this.yearStatistics = store.snapshot<YearStatistics>(['statistics', 'thisYear']);
        this.computeStatistics();
      } else {
        this.year = params.get('year');
        store.dispatch(actions.loadYearStatistics(this.year));
        store.get<YearStatistics>(['yearStatistics']).subscribe(yearStatistics => {
          this.yearStatistics = yearStatistics;
          this.computeStatistics();
          cdr.markForCheck();
        });
      }
    });
  }

  private computeStatistics() {
    this.allAppKeep = this.yearStatistics.users.reduce((partial, current) => partial + current.appKeepTotal, 0);
    this.allIncome = this.yearStatistics.users.reduce((partial, current) => partial + current.incomeTotal, 0);
    this.highest = Math.max(
      this.allIncome,
      this.allAppKeep
    );
  }

  percentage(partial: number): string {
    return partial ? Math.abs((partial / this.highest * 100)).toFixed(0) + '%' : '0%';
  }

}
