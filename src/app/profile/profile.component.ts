import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Listen } from '../../redux/listen.decorator';
import { Observable } from 'rxjs';
import { AuthService, SocialUser } from 'angularx-social-login';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'ak-profile',
  templateUrl: 'profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  @Listen(['user'])
  user$: Observable<SocialUser>;

  subscribed$: Observable<boolean>;

  constructor(private auth: AuthService, private notificationService: NotificationService) {
  }

  logout() {
    this.auth.signOut();
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

}
