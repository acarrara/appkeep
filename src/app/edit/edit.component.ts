import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { map } from 'rxjs/operators';
import { AppActions } from '../app.actions';
import { Option } from '../models/Option';
import { OptionableComponent } from '../optionable.component';

@Component({
  selector: 'ak-edit',
  templateUrl: 'edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent extends OptionableComponent {

  public appKeep: AppKeep;

  constructor(private activatedRoute: ActivatedRoute,
              store: StoreService<AppKeepState>,
              actions: AppActions,
              private router: Router) {
    super(store, actions);
    this.activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('id'))).subscribe(id => {
      this.appKeep = {
        ...this.store.snapshot<AppKeep>(['appKeeps'], appkeeps => appkeeps.find(item => item._id === id))
      };
    });
  }

  edit(options: Option[]) {
    this.store.dispatch(this.actions.editAppKeep(this.appKeep));
    const {title, category} = this.appKeep;
    this.updateOptions(title, category, options);
    this.close();
  }

  close() {
    this.router.navigate(['']);
  }

  delete() {
    this.store.dispatch(this.actions.deleteAppKeep(this.appKeep));
    this.close();
  }

  toDate($event: string) {
    this.appKeep.date = new Date($event).getTime();
  }

  onChange(options: Option[]) {
    const option: Option = this.optionFromList(this.appKeep.title, options);
    this.appKeep.category = option ? option.category : this.appKeep.category;
  }

}
