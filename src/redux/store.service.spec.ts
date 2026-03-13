import {StoreService} from './store.service';
import {Reducer} from './Reducer';
import {Epic} from './Epic';
import {filter, switchMap} from 'rxjs/operators';
import {firstValueFrom, of} from 'rxjs';

interface StubState {
  outer: { inner: string };
}

describe('StoreService', () => {

  const store: StoreService<StubState> = new StoreService<StubState>();

  const aReducer: Reducer<StubState, string> = (action, oldState) => {
    if (action.type === 'inner') {
      return {...oldState, outer: {...oldState.outer, inner: action.payload}};
    } else {
      return oldState;
    }
  };

  const anEpic: Epic<string, string> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === 'innerAsync'),
      switchMap(action => of({type: 'inner', payload: action.payload}))
    );
  };

  beforeEach(() => {
    store.setup({
      epics: [anEpic],
      reducers: [aReducer],
      initialState: {
        outer: {inner: 'anInitialValue'}
      }
    });
  });

  it('should return initial state', () => {
    const innerValue = store.snapshot<string>(['outer', 'inner']);

    expect(innerValue).toEqual('anInitialValue');
  });

  it('should listen to initial state', async () => {
    const innerValue = await firstValueFrom(store.get<string>(['outer', 'inner']));

    expect(innerValue).toEqual('anInitialValue');
  });

  it('should return new state', () => {
    store.dispatch({type: 'inner', payload: 'aNewValue'});

    const innerValue = store.snapshot<string>(['outer', 'inner']);

    expect(innerValue).toEqual('aNewValue');
  });

  it('should listen to new state', async () => {
    store.dispatch({type: 'inner', payload: 'aNewValue'});

    const innerValue = await firstValueFrom(store.get<string>(['outer', 'inner']));

    expect(innerValue).toEqual('aNewValue');
  });

  it('should listen to new state async', async () => {
    store.dispatch({type: 'innerAsync', payload: 'aNewValueAsync'});

    const innerValue = await firstValueFrom(store.get<string>(['outer', 'inner']));

    expect(innerValue).toEqual('aNewValueAsync');
  });

});