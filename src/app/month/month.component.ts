import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { Details } from '../models/Details';

@Component({
  selector: 'ak-month',
  templateUrl: 'month.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthComponent {
  public details: Details;

  public allAppKeep: number;
  public allIncome: number;
  public year: string;
  public month: string;

  private highest: number;

  constructor(activatedRoute: ActivatedRoute, store: StoreService<AppKeepState>, actions: AppActions, cdr: ChangeDetectorRef) {
    activatedRoute.paramMap.subscribe(params => {
      if (!params.has('year') || !params.has('month')) {
        this.details = store.snapshot<Details>(['statistics', 'thisMonth']);
        this.computeStatistics();
      } else {
        this.year = params.get('year');
        this.month = params.get('month');
        store.dispatch(actions.loadMonthStatistics(this.year, this.month));
        store.get<Details>(['monthStatistics']).subscribe(monthStatistics => {
          this.details = monthStatistics;
          this.computeStatistics();
          cdr.markForCheck();
        });
      }
    });
  }

  private computeStatistics() {
    this.allAppKeep = this.details.users.reduce((partial, current) => partial + current.outTotal, 0);
    this.allIncome = this.details.users.reduce((partial, current) => partial + current.inTotal, 0);
    this.highest = Math.max(
      this.allIncome,
      this.allAppKeep
    );
  }

  percentage(partial: number): string {
    return partial ? Math.abs((partial / this.highest * 100)).toFixed(0) + '%' : '0%';
  }
}
