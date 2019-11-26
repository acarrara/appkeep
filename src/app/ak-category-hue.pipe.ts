import { Pipe, PipeTransform } from '@angular/core';
import { Category } from './models/Category';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';

@Pipe({
  name: 'akCategoryHue',
  pure: false
})
export class AkCategoryHuePipe implements PipeTransform {

  categories: Category[];

  constructor(store: StoreService<AppKeepState>) {
    store.get<Category[]>(['categories']).subscribe(categories => this.categories = categories);
  }

  transform(categoryTitle: string): number {
    const match = this.categories.find(category => category.category === categoryTitle);
    return match ? match.hue : 0;
  }

}
