import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'ak-icon',
    templateUrl: 'icon.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {

  @Input()
  type: string;
  @Input()
  mood: string;
  @Input()
  size: string;
}
