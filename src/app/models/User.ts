import { RestResource } from './RestResource';

export interface User extends RestResource {
  email: string;
  oauthId: number;
}
