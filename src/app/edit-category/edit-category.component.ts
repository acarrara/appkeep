import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ak-edit-category',
  templateUrl: 'edit-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCategoryComponent {

  constructor() {
    // this.activatedRoute.paramMap.pipe(map(paramMap => paramMap.get('id'))).subscribe(id => {
    //   this.category = {
    //     ...this.store.snapshot<AppKeep>(['appKeeps'], appkeeps => appkeeps.find(item => item._id === id))
    //   };
    // });
  }

}
