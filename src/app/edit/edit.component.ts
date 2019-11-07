import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppKeep } from '../models/AppKeep';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { map } from 'rxjs/operators';
import { AppActions } from '../app.actions';

@Component({
  selector: 'ak-edit',
  templateUrl: 'edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent {

  public appKeep: AppKeep;

  constructor(private activatedRoute: ActivatedRoute,
              private store: StoreService<AppKeepState>,
              private actions: AppActions,
              private router: Router) {
    this.activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('id'))).subscribe(id => {
      this.appKeep = this.store.snapshot<AppKeep>(['appKeeps'], appkeeps => appkeeps.find(item => item._id === id));
    });
  }

  edit() {
    this.store.dispatch(this.actions.editAppKeep(this.appKeep));
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
}
