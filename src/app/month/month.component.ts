import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { MonthStatistics } from '../models/MonthStatistic';

@Component({
  selector: 'ak-month',
  templateUrl: 'month.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthComponent {
  public monthStatistics: MonthStatistics;

  public allAppKeep: number;
  public allIncome: number;

  private highest: number;

  constructor(activatedRoute: ActivatedRoute, store: StoreService<AppKeepState>) {
    activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('id'))).subscribe(id => {
      if (!id) {
        this.monthStatistics = store.snapshot<MonthStatistics>(['statistics', 'thisMonth']);
      }
      this.allAppKeep = this.monthStatistics.users.reduce((partial, current) => partial + current.appKeepTotal, 0);
      this.allIncome = this.monthStatistics.users.reduce((partial, current) => partial + current.incomeTotal, 0);
      this.highest = Math.max(
        this.allIncome,
        this.allAppKeep
      );
    });
  }

  percentage(partial: number): string {
    return partial ? Math.abs((partial / this.highest * 100)).toFixed(0) + '%' : '0%';
  }
}
