import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'ak-empty-state',
    templateUrl: 'empty-state.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {

}
