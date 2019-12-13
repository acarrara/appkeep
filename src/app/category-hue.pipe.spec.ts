import { CategoryHuePipe } from './category-hue.pipe';
import { Category } from './models/Category';

describe('CategoryHuePipe', () => {

  it('should return the category hue from the category', () => {
    const categories = [
      {category: 'category1', hue: 3} as Category,
      {category: 'category2', hue: 4} as Category
    ];

    const categoryHuePipe: CategoryHuePipe = new CategoryHuePipe();

    expect(categoryHuePipe.transform('category1', categories)).toEqual(3);
  });

  it('should return the category email when match is not found', () => {
    const categories = [
      {category: 'category1', hue: 3} as Category,
      {category: 'category2', hue: 4} as Category
    ];

    const categoryHuePipe: CategoryHuePipe = new CategoryHuePipe();

    expect(categoryHuePipe.transform('category3', categories)).toEqual(0);
  });
});
