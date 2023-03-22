import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { Category } from '../models/Category';
import { Observable } from 'rxjs';
import { UserInfo } from '../models/UserInfo';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';

@Component({
  selector: 'ak-appkeeps-card',
  templateUrl: 'appkeeps-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppkeepsCardComponent {

  categories$: Observable<Category[]>;
  users$: Observable<UserInfo[]>;

  constructor(private readonly store: StoreService<AppKeepState>) {
    this.categories$ = this.store.get(['categories']);
    this.users$ = this.store.get(['users']);
  }

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
