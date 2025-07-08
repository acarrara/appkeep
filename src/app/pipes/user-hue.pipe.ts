import {Pipe, PipeTransform, inject} from '@angular/core';
import {UserInfo} from '../models/UserInfo';
import {StoreService} from '../../redux/store.service';

@Pipe({
  name: 'akUserHue',
  pure: false
})
export class UserHuePipe implements PipeTransform {

  users: UserInfo[];

  store = inject<StoreService<UserInfo[]>>(StoreService);

  constructor() {
    this.store.get<UserInfo[]>(['users']).subscribe(users => this.users = users);
  }

  transform(userEmail: string): number {
    const match = this.users.find(user => user.email === userEmail);
    return match ? match.hue : 0;
  }

}
