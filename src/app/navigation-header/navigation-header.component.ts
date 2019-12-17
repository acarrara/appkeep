import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'ak-navigation-header',
  templateUrl: 'navigation-header.component.html',
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
