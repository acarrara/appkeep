import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../models/Category';

@Pipe({
    name: 'akCategoryHue'
})
export class CategoryHuePipe implements PipeTransform {

  transform(categoryTitle: string, categories: Category[]): number {
    const match = categories.find(category => category.category === categoryTitle);
    return match ? match.hue : 0;
  }

}
