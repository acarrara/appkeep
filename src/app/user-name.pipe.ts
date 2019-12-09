import { Pipe, PipeTransform } from '@angular/core';
import { UserInfo } from './models/UserInfo';
import { StoreService } from '../redux/store.service';

@Pipe({
  name: 'akUserName',
  pure: false
})
export class UserNamePipe implements PipeTransform {

  users: UserInfo[];

  constructor(store: StoreService<UserInfo[]>) {
    store.get<UserInfo[]>(['users']).subscribe(users => this.users = users);
  }

  transform(userEmail: string): string {
    const match = this.users.find(user => user.email === userEmail);
    return match ? match.name.toLocaleLowerCase() : userEmail.toLocaleLowerCase();
  }

}
