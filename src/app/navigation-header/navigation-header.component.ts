import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import {Location} from '@angular/common';
import {IconComponent} from '../icon/icon.component';

@Component({
  selector: 'ak-navigation-header',
  templateUrl: 'navigation-header.component.html',
  imports: [
    IconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationHeaderComponent {
  private location = inject(Location);


  @Input()
  hue = 0;

  back() {
    this.location.back();
  }
}
