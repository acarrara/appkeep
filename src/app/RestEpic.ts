import { Epic } from '../redux/Epic';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RestResource } from './models/RestResource';
import { StoreService } from '../redux/store.service';
import { AppKeepState } from './models/AppKeepState';
import { AppActions } from './app.actions';

export class RestEpic<T extends RestResource> {

  constructor(private http: HttpClient, private name: string, private store: StoreService<AppKeepState>, private actions: AppActions) {
  }

  private load: Epic<any, T[]> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === `LOAD_${this.name.toUpperCase()}S`),
      mergeMap(() => this.http.get<T[]>(`/api/${this.name}s`).pipe(
        first(),
        map(items => ({type: `LOAD_${this.name.toUpperCase()}S_SUCCESS`, payload: items}))
      ))
    );
  }

  private add: Epic<T, T> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === `ADD_${this.name.toUpperCase()}`),
      mergeMap(action => this.http.post<T>(`/api/${this.name}s`, action.payload).pipe(
        first(),
        map(item => ({type: `ADD_${this.name.toUpperCase()}_SUCCESS`, payload: item})),
        tap(() => this.store.dispatch(this.actions.loadStatistics()))
      ))
    );
  }

  private delete: Epic<T, T> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === `DELETE_${this.name.toUpperCase()}`),
      mergeMap(action => this.http.delete<T>(`/api/${this.name}s/` + action.payload._id).pipe(
        first(),
        map(() => ({type: `DELETE_${this.name.toUpperCase()}_SUCCESS`, payload: action.payload})),
        tap(() => this.store.dispatch(this.actions.loadStatistics()))
      ))
    );
  }

  private edit: Epic<T, T> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === `EDIT_${this.name.toUpperCase()}`),
      mergeMap(action => this.http.put<T>(`/api/${this.name}s/` + action.payload._id, action.payload).pipe(
        first(),
        map(() => ({type: `EDIT_${this.name.toUpperCase()}_SUCCESS`, payload: action.payload})),
        tap(() => this.store.dispatch(this.actions.loadStatistics()))
      ))
    );
  }

  public toEpics = (): Epic<any, any>[] => [this.add, this.load, this.edit, this.delete];
}
