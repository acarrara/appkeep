import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Listen } from '../../redux/listen.decorator';
import { User } from '../models/User';

@Component({
  selector: 'ak-home-header',
  templateUrl: 'home-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeHeaderComponent {

  @Listen(['user'])
  public user$: Observable<User>;

}
