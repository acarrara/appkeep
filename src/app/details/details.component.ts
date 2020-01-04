import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Details } from '../models/Details';

@Component({
  selector: 'ak-details',
  templateUrl: 'details.component.html',
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
