import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ak-logo',
  templateUrl: 'logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
}
