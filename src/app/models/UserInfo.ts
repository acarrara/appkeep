import { RestResource } from './RestResource';

export interface UserInfo extends RestResource {
  email: string;
  hue: number;
  name: string;
}
