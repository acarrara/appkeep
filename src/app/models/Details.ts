import { Recap } from './Recap';
import { CategoryAmount } from './CategoryAmount';

export interface Details {
  users: Recap[];
  outCategories: CategoryAmount[];
  inCategories: CategoryAmount[];
  ranges?: Recap[];
}
