import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Listen } from '../../redux/listen.decorator';
import { Observable } from 'rxjs';
import { SocialUser } from 'angularx-social-login';
import { NotificationService } from '../notification.service';
import { ApiAuthenticationService } from '../api-authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ak-profile',
  templateUrl: 'profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  @Listen(['user'])
  user$: Observable<SocialUser>;

  subscribed$: Observable<boolean>;

  constructor(private apiTokenService: ApiAuthenticationService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  logout() {
    this.apiTokenService.signOut().subscribe(() => this.router.navigate(['/login']));
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
