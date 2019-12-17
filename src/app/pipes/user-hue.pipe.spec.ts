import { UserHuePipe } from './user-hue.pipe';
import { StoreService } from '../../redux/store.service';
import { Observable, of } from 'rxjs';
import { UserInfo } from '../models/UserInfo';

describe('UserHuePipe', () => {

  it('should return the user hue from the user email', () => {
    const store: StoreService<any> = {
      get(path: string[]): Observable<any> {
        return of([
          {email: 'user1@mail.com', hue: 3} as UserInfo,
          {email: 'user2@mail.com', hue: 4} as UserInfo
        ]);
      }
    } as StoreService<any>;

    const userHuePipe: UserHuePipe = new UserHuePipe(store);

    expect(userHuePipe.transform('user1@mail.com')).toEqual(3);
  });

  it('should return the user email when match is not found', () => {
    const store: StoreService<any> = {
      get(path: string[]): Observable<any> {
        return of([
          {email: 'user1@mail.com', hue: 3} as UserInfo,
          {email: 'user2@mail.com', hue: 4} as UserInfo
        ]);
      }
    } as StoreService<any>;

    const userHuePipe: UserHuePipe = new UserHuePipe(store);

    expect(userHuePipe.transform('user3@mail.com')).toEqual(0);
  });
});
