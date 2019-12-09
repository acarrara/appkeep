import { Pipe, PipeTransform } from '@angular/core';
import { Category } from './models/Category';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';

@Pipe({
  name: 'akCategoryHue'
})
export class CategoryHuePipe implements PipeTransform {

  transform(categoryTitle: string, categories: Category[]): number {
    const match = categories.find(category => category.category === categoryTitle);
    return match ? match.hue : 0;
  }

}
