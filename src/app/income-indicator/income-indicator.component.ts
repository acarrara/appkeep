import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'ak-income-indicator',
  templateUrl: 'income-indicator.component.html',
  imports: [
    IconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeIndicatorComponent {
  @Input()
  income: boolean;
}
