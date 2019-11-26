import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { Category } from '../models/Category';

@Component({
  selector: 'ak-appkeeps-card',
  templateUrl: 'appkeeps-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppkeepsCardComponent {

  @Input()
  appKeeps: AppKeep[];
  @Input()
  categories: Category[] = [];
  @Input()
  total: number;
  @Input()
  when: string;
  @Input()
  hue = 0;
  @Input()
  showDate = false;

  lookupHue(categoryTitle: string, categories: Category[]) {
    const match = categories.find(category => category.category === categoryTitle);
    return match ? match.hue : 0;
  }

}
