import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OverallStatistics } from '../models/OverallStatistics';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';

@Component({
  selector: 'ak-overall',
  templateUrl: 'overall.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverallComponent {
  public overallStatistics: OverallStatistics;

  public allAppKeep: number;
  public allIncome: number;

  private highest: number;

  constructor(activatedRoute: ActivatedRoute, store: StoreService<AppKeepState>) {
    this.overallStatistics = store.snapshot<OverallStatistics>(['statistics', 'overall']);
    this.computeStatistics();
  }

  private computeStatistics() {
    this.allAppKeep = this.overallStatistics.users.reduce((partial, current) => partial + current.appKeepTotal, 0);
    this.allIncome = this.overallStatistics.users.reduce((partial, current) => partial + current.incomeTotal, 0);
    this.highest = Math.max(
      this.allIncome,
      this.allAppKeep
    );
  }

  percentage(partial: number): string {
    return partial ? Math.abs((partial / this.highest * 100)).toFixed(0) + '%' : '0%';
  }
}
