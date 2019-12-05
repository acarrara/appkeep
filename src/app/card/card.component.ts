import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ak-card',
  templateUrl: 'card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  @Input()
  when: string;
  @Input()
  total: number;
  @Input()
  indicator = false;

}
