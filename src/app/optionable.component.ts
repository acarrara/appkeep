import { Listen } from '../redux/listen.decorator';
import { Observable } from 'rxjs';
import { Option } from './models/Option';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';
import { AppActions } from './app.actions';

export abstract class OptionableComponent {

  @Listen(['options'])
  public options$: Observable<Option[]>;
  @Listen(['categories'], categories => categories.map(category => category.category))
  public categories$: Observable<string[]>;

  constructor(protected store: StoreService<AppKeepState>,
              protected actions: AppActions) {
  }

  protected updateOptions(title, category, options, categories) {
    const option = this.optionFromList(title, options);
    const updatedOption = {title, category: category.toLowerCase(), date: new Date().getTime()};
    if (option) {
      this.store.dispatch(this.actions.editOption({_id: option._id, ...updatedOption}));
    } else {
      this.store.dispatch(this.actions.addOption(updatedOption));
    }
    if (!categories.includes(category)) {
      this.store.dispatch(this.actions.addCategory({category, hue: categories.length % 8}));
    }
  }

  protected optionFromList(title: string, options: Option[]) {
    return options.find(current => current.title === title);
  }
}
