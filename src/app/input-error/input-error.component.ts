import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'ak-input-error',
  templateUrl: 'input-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputErrorComponent {

  @Input()
  message: string;

}
