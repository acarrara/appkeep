import { Action } from './Action';

export type Reducer<State, Payload> = (action: Action<Payload>, oldState: State) => State;
