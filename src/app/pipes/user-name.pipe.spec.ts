import { UserNamePipe } from './user-name.pipe';
import { StoreService } from '../../redux/store.service';
import { Observable, of } from 'rxjs';
import { UserInfo } from '../models/UserInfo';

describe('UserNamePipe', () => {

  it('should return the user name from the user email', () => {
    const store: StoreService<any> = {
      get(path: string[]): Observable<any> {
        return of([
          {email: 'user1@mail.com', name: 'User1'} as UserInfo,
          {email: 'user2@mail.com', name: 'User2'} as UserInfo
        ]);
      }
    } as StoreService<any>;

    const userNamePipe: UserNamePipe = new UserNamePipe(store);

    expect(userNamePipe.transform('user1@mail.com')).toEqual('user1');
  });

  it('should return the user email when match is not found', () => {
    const store: StoreService<any> = {
      get(path: string[]): Observable<any> {
        return of([
          {email: 'user1@mail.com', name: 'User1'} as UserInfo,
          {email: 'user2@mail.com', name: 'User2'} as UserInfo
        ]);
      }
    } as StoreService<any>;

    const userNamePipe: UserNamePipe = new UserNamePipe(store);

    expect(userNamePipe.transform('user3@mail.com')).toEqual('user3@mail.com');
  });
});
