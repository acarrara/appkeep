import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { Details } from '../models/Details';

@Component({
  selector: 'ak-year',
  templateUrl: 'year.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearComponent {
  public details: Details;
  public rangesTitle = 'months';

  public allAppKeep: number;
  public allIncome: number;
  public year: string;

  private highest: number;

  constructor(activatedRoute: ActivatedRoute, store: StoreService<AppKeepState>, actions: AppActions, cdr: ChangeDetectorRef) {
    activatedRoute.paramMap.subscribe(params => {
      if (!params.has('year')) {
        this.details = store.snapshot<Details>(['statistics', 'thisYear']);
        this.computeStatistics();
      } else {
        this.year = params.get('year');
        store.dispatch(actions.loadYearStatistics(this.year));
        store.get<Details>(['yearStatistics']).subscribe(yearStatistics => {
          this.details = yearStatistics;
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
