import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Recap } from '../models/Recap';
import { Category } from '../models/Category';

@Component({
  selector: 'ak-category-recap-card',
  templateUrl: 'category-recap-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryRecapCardComponent implements OnChanges {
  @Input()
  title: string;
  @Input()
  category: Category;
  @Input()
  recaps: Recap[];

  total: number;
  topTotal: number;

  ngOnChanges(changes: SimpleChanges): void {
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
    const path = ['/category', this.category.category];
    if (recap.scope) {
      path.push(recap.scope);
      path.push(recap.label);
    } else {
      path.push(recap.label);
      path.push('1');
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
