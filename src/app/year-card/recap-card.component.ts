import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Recap } from '../models/Recap';

@Component({
  selector: 'ak-recap-card',
  templateUrl: 'recap-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecapCardComponent implements OnChanges {
  @Input()
  year: string;
  @Input()
  hue = 0;
  @Input()
  recaps: Recap[];
  @Input()
  itemRootPath: string[] = [];
  @Input()
  explorable = false;

  total: number;
  topTotal: number;

  ngOnChanges(changes: SimpleChanges): void {
    this.total = this.recaps.reduce((partial, currentRecap) => partial + currentRecap.incomeTotal + currentRecap.appKeepTotal, 0);
    this.topTotal = this.recaps.reduce(((partial, currentRecap) => this.biggest(partial, currentRecap)), 0);
  }

  getIncomePercentage(recap: Recap) {
    return this.getPercentage(recap.incomeTotal);
  }

  getAppKeepPercentage(recap: Recap) {
    return this.getPercentage(recap.appKeepTotal);
  }

  itemLink(label: string) {
    return [...this.itemRootPath, label];
  }

  private getPercentage(appKeepTotal: number) {
    return appKeepTotal ? Math.abs((appKeepTotal / this.topTotal * 100)).toFixed(0) + '%' : '0%';
  }

  private biggest(partial: number, currentRecap: Recap) {
    return Math.max(partial, Math.abs(currentRecap.incomeTotal), Math.abs(currentRecap.appKeepTotal));
  }
}
