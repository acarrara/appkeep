import { RestResource } from './models/RestResource';
import { Reducer } from '../redux/Reducer';
import { AppKeepState } from './models/AppKeepState';

export class RestReducer<T extends RestResource> {

  constructor(private name: string) {
  }

  public toReducers = (): Reducer<AppKeepState, T | T[]>[] => [this.add, this.load, this.edit, this.delete];

  private load: Reducer<AppKeepState, T[]> = (action, oldState) => {
    switch (action.type) {
      case `LOAD_${this.name.toUpperCase()}S_SUCCESS`: {
        const newState = {...oldState};
        newState[`${this.name}s`] = [...action.payload];
        return newState;
      }
      default: {
        return oldState;
      }
    }
  }

  private add: Reducer<AppKeepState, T> = (action, oldState) => {
    switch (action.type) {
      case `ADD_${this.name.toUpperCase()}`: {
        action.payload._updating = true;
        const newState = {...oldState};
        newState[`${this.name}s`] = [action.payload, ...oldState[`${this.name}s`]];
        return newState;
      }
      case `ADD_${this.name.toUpperCase()}_SUCCESS`: {
        action.payload._updating = false;
        return this.newEditedState(oldState, action.payload, 'date');
      }
      default: {
        return oldState;
      }
    }
  }

  private delete: Reducer<AppKeepState, T> = (action, oldState) => {
    switch (action.type) {
      case `DELETE_${this.name.toUpperCase()}`: {
        action.payload._updating = true;
        return this.newEditedState(oldState, action.payload);
      }
      case `DELETE_${this.name.toUpperCase()}_SUCCESS`: {
        action.payload._updating = false;
        const newState = {...oldState};
        newState[`${this.name}s`] = oldState[`${this.name}s`].filter(current => current._id !== action.payload._id);
        return newState;
      }
      default: {
        return oldState;
      }
    }
  }

  private edit: Reducer<AppKeepState, T> = (action, oldState) => {
    switch (action.type) {
      case `EDIT_${this.name.toUpperCase()}`: {
        action.payload._updating = true;
        return this.newEditedState(oldState, action.payload);
      }
      case `EDIT_${this.name.toUpperCase()}_SUCCESS`: {
        action.payload._updating = false;
        return this.newEditedState(oldState, action.payload);
      }
      default: {
        return oldState;
      }
    }
  }

  private newEditedState(oldState: AppKeepState, resource: RestResource, by: string = '_id') {
    const newState = {...oldState};
    newState[`${this.name}s`] = oldState[`${this.name}s`].map(current => current[by] === resource[by] ? resource : current);
    return newState;
  }
}
