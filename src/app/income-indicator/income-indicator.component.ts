import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ak-income-indicator',
  templateUrl: 'income-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeIndicatorComponent {
  @Input()
  income: boolean;
}
