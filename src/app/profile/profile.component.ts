import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, SocialUser } from 'angularx-social-login';
import { Listen } from '../../redux/listen.decorator';
import { Router } from '@angular/router';

@Component({
  selector: 'ak-profile',
  templateUrl: 'profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  @Listen(['user'])
  public user$: Observable<SocialUser>;

  constructor(private auth: AuthService, private router: Router) {
  }

  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
    this.auth.authState.subscribe(user => {
      if (user === null) {
        this.router.navigate(['/login']);
      }
    });
  }
}
