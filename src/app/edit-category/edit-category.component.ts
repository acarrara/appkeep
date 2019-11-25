import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';
import { Category } from '../models/Category';
import { map } from 'rxjs/operators';
import { AppActions } from '../app.actions';

@Component({
  selector: 'ak-edit-category',
  templateUrl: 'edit-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCategoryComponent {

  category: Category;

  constructor(private activatedRoute: ActivatedRoute,
              private store: StoreService<AppKeepState>,
              private router: Router,
              private actions: AppActions) {
    this.activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('category'))).subscribe(category => {
      this.category = {
        ...this.store.snapshot<Category>(['categories'], categories => categories.find(item => item.category === category))
      };
    });
  }

  close() {
    this.router.navigate(['']);
  }

  edit() {
    this.store.dispatch(this.actions.editCategory(this.category));
    this.close();
  }
}
