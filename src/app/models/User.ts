import { SocialUser } from 'angularx-social-login';
import { UserInfo } from './UserInfo';

export interface User {
  social: SocialUser;
  info: UserInfo;
}
