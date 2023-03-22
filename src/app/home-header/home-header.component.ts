import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';

@Component({
  selector: 'ak-home-header',
  templateUrl: 'home-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeaderComponent {

  public user$: Observable<User>;

  constructor(store: StoreService<AppKeepState>) {
    this.user$ = store.get(['user']);
  }

}
