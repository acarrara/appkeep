import { Reducer } from './Reducer';
import { Epic } from './Epic';

export interface StoreSetup<State> {
    reducers: Reducer<State, any>[];
    epics: Epic<any, any>[];
    initialState: State;
}
