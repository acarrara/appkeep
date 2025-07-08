import {UserNamePipe} from './user-name.pipe';
import {StoreService} from '../../redux/store.service';
import {Observable, of} from 'rxjs';
import {UserInfo} from '../models/UserInfo';
import {TestBed} from '@angular/core/testing';

describe('UserNamePipe', () => {

  const store: StoreService<any> = {
    get(path: string[]): Observable<any> { // eslint-disable-line @typescript-eslint/no-unused-vars
      return of([
        {email: 'user1@mail.com', name: 'User1'} as UserInfo,
        {email: 'user2@mail.com', name: 'User2'} as UserInfo
      ]);
    }
  } as StoreService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: StoreService, useValue: store}]
    });
  });

  it('should return the user name from the user email', () => {
    TestBed.runInInjectionContext(() => {
      const userNamePipe: UserNamePipe = new UserNamePipe();

      expect(userNamePipe.transform('user1@mail.com')).toEqual('user1');
    });
  });

  it('should return the user email when match is not found', () => {
    TestBed.runInInjectionContext(() => {
      const userNamePipe: UserNamePipe = new UserNamePipe();

      expect(userNamePipe.transform('user3@mail.com')).toEqual('user3@mail.com');
    });
  });
});
