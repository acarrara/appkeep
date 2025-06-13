import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/User';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';
import {AsyncPipe} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'ak-home-header',
  templateUrl: 'home-header.component.html',
  imports: [
    AsyncPipe,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeaderComponent {

  store: StoreService<AppKeepState> = inject(StoreService);

  public user$: Observable<User> = this.store.get(['user']);

}
