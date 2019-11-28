import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { Category } from '../models/Category';
import { Listen } from '../../redux/listen.decorator';
import { Observable } from 'rxjs';

@Component({
  selector: 'ak-appkeeps-card',
  templateUrl: 'appkeeps-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppkeepsCardComponent {

  @Listen(['categories'])
  categories$: Observable<Category[]>;

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
