import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {IconComponent} from "../icon/icon.component";
import {EmptyStateComponent} from "./empty-state.component";
import {AmountPipe} from "../pipes/amount.pipe";

@Component({
  selector: 'ak-card',
  templateUrl: 'card.component.html',
  imports: [
    IconComponent,
    EmptyStateComponent,
    AmountPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  @Input()
  title: string;
  @Input()
  total: number;
  @Input()
  indicator = false;

}
