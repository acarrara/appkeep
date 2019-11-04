import { Observable } from 'rxjs';
import { Action } from './Action';

export type Epic<PayloadIn, PayloadOut> = (actions$: Observable<Action<PayloadIn>>) => Observable<Action<PayloadOut>>;
