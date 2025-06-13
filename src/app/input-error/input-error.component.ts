import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'ak-input-error',
  templateUrl: 'input-error.component.html',
  imports: [
    IconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputErrorComponent {

  @Input()
  message: string;

}
