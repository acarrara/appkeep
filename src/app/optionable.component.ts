import {Observable} from 'rxjs';
import {Option} from './models/Option';
import {StoreService} from '../redux/store.service';
import {AppKeepState} from './models/AppKeepState';
import {AppActions} from './app.actions';
import {Category} from './models/Category';
import {AppKeep} from './models/AppKeep';
import {inject} from '@angular/core';

export abstract class OptionableComponent {

  store: StoreService<AppKeepState> = inject(StoreService);

  public options$: Observable<Option[]> = this.store.get(['options']);
  public categories$: Observable<Category[]> = this.store.get(['categories']);

  protected constructor(protected actions: AppActions) {
  }

  public onChange(appKeep: AppKeep, options: Option[], categories: Category[]) {
    const option: Option = this.optionFromList(appKeep.title, options);
    appKeep.category = option ? option.category : appKeep.category;
    appKeep.income = option ? this.lookupCategory(categories, option.category).income : false;
  }

  protected updateOptions(title, category, options, categories) {
    const option = this.optionFromList(title, options);
    const updatedOption = {title, category, date: new Date().getTime()};
    if (option) {
      this.store.dispatch(this.actions.editOption({_id: option._id, ...updatedOption}));
    } else {
      this.store.dispatch(this.actions.addOption(updatedOption));
    }
    this.updateCategory(categories, category);
  }

  protected updateCategory(categories, category) {
    if (!categories.map(current => current.category).includes(category)) {
      this.store.dispatch(this.actions.addCategory({
        category,
        hue: categories.length % 8 + 1,
        date: Date.now(),
        income: false
      }));
    }
  }

  protected optionFromList(title: string, options: Option[]) {
    return options.find(current => current.title.toLowerCase() === title.toLowerCase());
  }

  protected lookupCategory(categories: Category[], optionCategory: string): Category {
    return categories.find(current => current.category === optionCategory);
  }
}
