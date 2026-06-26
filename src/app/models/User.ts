import { SocialUser } from '@abacritt/angularx-social-login';
import { UserInfo } from './UserInfo';

export interface User {
  social: SocialUser | null;
  info: UserInfo;
}
