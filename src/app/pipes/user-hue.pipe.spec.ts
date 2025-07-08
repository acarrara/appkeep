import {UserHuePipe} from './user-hue.pipe';
import {StoreService} from '../../redux/store.service';
import {Observable, of} from 'rxjs';
import {UserInfo} from '../models/UserInfo';
import {TestBed} from '@angular/core/testing';

describe('UserHuePipe', () => {

  const store: StoreService<any> = {
    get(path: string[]): Observable<any> { // eslint-disable-line @typescript-eslint/no-unused-vars
      return of([
        {email: 'user1@mail.com', hue: 3} as UserInfo,
        {email: 'user2@mail.com', hue: 4} as UserInfo
      ]);
    }
  } as StoreService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: StoreService, useValue: store}]
    });
  });

  it('should return the user hue from the user email', () => {
    TestBed.runInInjectionContext(() => {
      const userHuePipe: UserHuePipe = new UserHuePipe();
      userHuePipe.store = store;

      expect(userHuePipe.transform('user1@mail.com')).toEqual(3);
    });
  });

  it('should return the user email when match is not found', () => {
    TestBed.runInInjectionContext(() => {
      const userHuePipe: UserHuePipe = new UserHuePipe();
      userHuePipe.store = store;

      expect(userHuePipe.transform('user3@mail.com')).toEqual(0);
    });
  });
});
