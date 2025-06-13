import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
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

  @Input()
  hue = 0;

  constructor(private location: Location) {
  }

  back() {
    this.location.back();
  }
}
