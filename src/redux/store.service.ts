import { BehaviorSubject, identity, Observable, Subject } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { Action } from './Action';
import { StoreSetup } from './StoreSetup';
import { Reducer } from './Reducer';
import { Epic } from './Epic';

export class StoreService<State> {

  public static instance: any;

  private state$: BehaviorSubject<State>;

  private reducers: Reducer<State, any>[] = [];

  private epics: Epic<any, any>[] = [];

  private actions$: Subject<Action<any>> = new Subject<Action<any>>();

  constructor() {
    StoreService.instance = this;
  }

  public setup(storeSetup: StoreSetup<State>): void {
    this.actions$ = new Subject<Action<any>>();
    this.state$ = new BehaviorSubject<State>(storeSetup.initialState);
    this.epics = [...storeSetup.epics];
    this.reducers = [...storeSetup.reducers];
    this.epics.forEach(epic => {
      epic(this.actions$).subscribe(action => this.dispatch(action));
    });
  }

  public get<T>(path: string[], mappingFunction: (toTransform: any) => T = identity): Observable<T> {
    return this.state$.pipe(
      map(state => path.reduce((previousState: any, currentField: string) => previousState[currentField], state)),
      map(mappingFunction),
      share()
    );
  }

  public snapshot<T>(path: string[], mappingFunction: (toTransform: any) => T = identity): T {
    return mappingFunction(path.reduce((previousState: any, currentField: string) => previousState[currentField], this.state$.getValue()));
  }

  public dispatch(action: Action<any>): void {
    this.actions$.next(action);
    const newState: State = this.reducers.reduce((previousState, reducer) => reducer(action, previousState), this.state$.getValue());
    this.state$.next(newState);
  }
}
