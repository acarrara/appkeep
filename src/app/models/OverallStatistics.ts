import { Recap } from './Recap';
import { CategoryAmount } from './CategoryAmount';

export interface OverallStatistics {
  years: Recap[];
  users: Recap[];
  appKeepCategories: CategoryAmount[];
  incomeCategories: CategoryAmount[];
}
