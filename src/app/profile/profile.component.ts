import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Listen } from '../../redux/listen.decorator';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { ApiAuthenticationService } from '../api-authentication.service';
import { Router } from '@angular/router';
import { UserInfo } from '../models/UserInfo';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { AppActions } from '../app.actions';
import { Location } from '@angular/common';

@Component({
  selector: 'ak-profile',
  templateUrl: 'profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  @Listen(['users'])
  users$: Observable<UserInfo[]>;

  user: UserInfo;

  subscribed$: Observable<boolean>;
  newUser = '';

  constructor(private apiAuth: ApiAuthenticationService,
              private notificationService: NotificationService,
              private router: Router,
              private location: Location,
              private store: StoreService<AppKeepState>,
              private actions: AppActions) {
    this.lookupUser();
  }

  private lookupUser() {
    this.user = {
      ...this.store.snapshot<UserInfo>(['user', 'info'])
    };
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

  addUser(users: UserInfo[]) {
    this.store.dispatch(this.actions.addUser({
      email: this.newUser,
      date: Date.now(),
      hue: users.length % 8 + 1,
      name: ''
    }));
    this.newUser = '';
  }

  removeUser(user: UserInfo) {
    this.store.dispatch(this.actions.deleteUser(user));
  }

  editUser(user: UserInfo) {
    this.store.dispatch(this.actions.editUser(user));
    this.location.back();
  }

  reset() {
    this.lookupUser();
  }
}
