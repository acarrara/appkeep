import { Recap } from './Recap';
import { CategoryAmount } from './CategoryAmount';

export interface YearStatistics {
  months: Recap[];
  users: Recap[];
  appKeepCategories: CategoryAmount[];
  incomeCategories: CategoryAmount[];
}
