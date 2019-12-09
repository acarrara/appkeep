import { Pipe, PipeTransform } from '@angular/core';
import { UserInfo } from './models/UserInfo';
import { StoreService } from '../redux/store.service';

@Pipe({
  name: 'akUserHue',
  pure: false
})
export class UserHuePipe implements PipeTransform {

  users: UserInfo[];

  constructor(store: StoreService<UserInfo[]>) {
    store.get<UserInfo[]>(['users']).subscribe(users => this.users = users);
  }

  transform(userEmail: string): number {
    const match = this.users.find(user => user.email === userEmail);
    return match ? match.hue : 0;
  }

}
