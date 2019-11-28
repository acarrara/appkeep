import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialUser } from 'angularx-social-login';
import { Listen } from '../../redux/listen.decorator';

@Component({
  selector: 'ak-home-header',
  templateUrl: 'home-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeaderComponent {

  @Listen(['user'])
  public user$: Observable<SocialUser>;

}
