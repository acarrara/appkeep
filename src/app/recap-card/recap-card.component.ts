import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {Recap} from '../models/Recap';
import {CardComponent} from '../card/card.component';
import {MonthNamePipe} from '../pipes/month-name.pipe';
import {LowerCasePipe} from '@angular/common';
import {AmountPipe} from '../pipes/amount.pipe';
import {IncomeIndicatorComponent} from '../income-indicator/income-indicator.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'ak-recap-card',
  templateUrl: 'recap-card.component.html',
  imports: [
    CardComponent,
    MonthNamePipe,
    LowerCasePipe,
    AmountPipe,
    IncomeIndicatorComponent,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecapCardComponent implements OnChanges {
  @Input()
  title: string;
  @Input()
  recaps: Recap[];

  total: number;
  topTotal: number;

  ngOnChanges(): void {
    this.total = this.recaps.reduce((partial, currentRecap) => partial + currentRecap.inTotal + currentRecap.outTotal, 0);
    this.topTotal = this.recaps.reduce(((partial, currentRecap) => this.biggest(partial, currentRecap)), 0);
  }

  getIncomePercentage(recap: Recap) {
    return this.getPercentage(recap.inTotal);
  }

  getAppKeepPercentage(recap: Recap) {
    return this.getPercentage(recap.outTotal);
  }

  itemLink(recap: Recap) {
    const path = ['/details'];
    if (recap.scope) {
      path.push(recap.scope);
    }
    if (recap.label) {
      path.push(recap.label);
    }
    return path;
  }

  private getPercentage(outTotal: number) {
    return outTotal ? Math.abs((outTotal / this.topTotal * 100)).toFixed(0) + '%' : '0%';
  }

  private biggest(partial: number, currentRecap: Recap) {
    return Math.max(partial, Math.abs(currentRecap.inTotal), Math.abs(currentRecap.outTotal));
  }
}
