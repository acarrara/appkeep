import { CategoryAmount } from './CategoryAmount';
import { Recap } from './Recap';

export interface MonthStatistics {
  users: Recap[];
  appKeepCategories: CategoryAmount[];
  incomeCategories: CategoryAmount[];
}
