import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppKeep } from '../models/AppKeep';

@Component({
  selector: 'ak-appkeeps-card',
  templateUrl: 'appkeeps-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppkeepsCardComponent {

  @Input()
  appKeeps: AppKeep[];
  @Input()
  total: number;
  @Input()
  when: string;
  @Input()
  hue = 0;
  @Input()
  showDate = false;
}
