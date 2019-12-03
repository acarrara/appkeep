import { Listen } from '../redux/listen.decorator';
import { Observable } from 'rxjs';
import { Option } from './models/Option';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';
import { AppActions } from './app.actions';
import { Category } from './models/Category';

export abstract class OptionableComponent {

  @Listen(['options'])
  public options$: Observable<Option[]>;
  @Listen(['categories'])
  public categories$: Observable<Category[]>;

  constructor(protected store: StoreService<AppKeepState>,
              protected actions: AppActions) {
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
      this.store.dispatch(this.actions.addCategory({category, hue: categories.length % 8 + 1, date: Date.now()}));
    }
  }

  protected optionFromList(title: string, options: Option[]) {
    return options.find(current => current.title.toLowerCase() === title.toLowerCase());
  }
}
