import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'ak-category-header',
  templateUrl: 'category-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryHeaderComponent {

  constructor(private location: Location) {
  }

  back() {
    this.location.back();
  }
}
