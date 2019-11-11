import { Listen } from '../redux/listen.decorator';
import { Observable } from 'rxjs';
import { Option } from './models/Option';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';
import { AppActions } from './app.actions';

export abstract class OptionableComponent {

  @Listen(['options'])
  public options$: Observable<Option[]>;
  @Listen(['options'], options => options.map(option => option.category).filter((value, index, self) => index === self.indexOf(value)))
  public categories$: Observable<string[]>;

  constructor(protected store: StoreService<AppKeepState>,
              protected actions: AppActions) {
  }

  protected updateOptions(title, category, options) {
    const option = this.optionFromList(title, options);
    const updatedOption = {title, category, date: new Date().getTime()};
    if (option) {
      this.store.dispatch(this.actions.editOption({_id: option._id, ...updatedOption}));
    } else {
      this.store.dispatch(this.actions.addOption(updatedOption));
    }
  }

  protected optionFromList(title: string, options: Option[]) {
    return options.find(current => current.title === title);
  }
}
