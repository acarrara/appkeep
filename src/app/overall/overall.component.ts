import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { Details } from '../models/Details';

@Component({
  selector: 'ak-overall',
  templateUrl: 'overall.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverallComponent {
  public details: Details;
  public rangesTitle = 'years';

  public allAppKeep: number;
  public allIncome: number;

  private highest: number;

  constructor(activatedRoute: ActivatedRoute, store: StoreService<AppKeepState>) {
    this.details = store.snapshot<Details>(['statistics', 'overall']);
    this.computeStatistics();
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
