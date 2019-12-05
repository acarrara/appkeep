import { RestResource } from './RestResource';

export interface Category extends RestResource {
  category: string;
  hue: number;
  income: boolean;
}
