import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Listen } from '../../redux/listen.decorator';
import { Observable } from 'rxjs';
import { SocialUser } from 'angularx-social-login';
import { NotificationService } from '../notification.service';
import { ApiAuthenticationService } from '../api-authentication.service';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { AppKeep } from '../models/AppKeep';

@Component({
  selector: 'ak-profile',
  templateUrl: 'profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  @Listen(['user'])
  user$: Observable<SocialUser>;
  @Listen(['users'])
  users$: Observable<User[]>;

  subscribed$: Observable<boolean>;
  newUser = '';

  constructor(private apiAuth: ApiAuthenticationService,
              private notificationService: NotificationService,
              private router: Router,
              private store: StoreService<AppKeepState>,
              private actions: AppActions) {
  }

  logout() {
    this.apiAuth.signOut().subscribe(() => this.router.navigate(['/login']));
  }

  subscribeToNotifications(subscribed: boolean) {
    if (subscribed) {
      this.notificationService.subscribeToNotifications();
    } else {
      this.notificationService.unsubscribeFromNotifications();
    }
  }

  ngOnInit(): void {
    this.subscribed$ = this.notificationService.isSubscribed();
  }

  addUser() {
    this.store.dispatch(this.actions.addUser({email: this.newUser, date: Date.now()}));
    this.newUser = '';
  }

  removeUser(user: User) {
    this.store.dispatch(this.actions.deleteUser(user));
  }
}
