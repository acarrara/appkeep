import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Listen } from '../../redux/listen.decorator';
import { Observable } from 'rxjs';
import { AuthService, SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'ak-profile',
  templateUrl: 'profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {

  @Listen(['user'])
  public user$: Observable<SocialUser>;

  constructor(private auth: AuthService) {
  }

  logout() {
    this.auth.signOut();
  }

}
