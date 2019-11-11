import { Epic } from '../redux/Epic';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RestResource } from './models/RestResource';

export class RestEpic<T extends RestResource> {

  constructor(private http: HttpClient, private name: string) {
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
        map(item => ({type: `ADD_${this.name.toUpperCase()}_SUCCESS`, payload: item}))
      ))
    );
  }

  private delete: Epic<T, T> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === `DELETE_${this.name.toUpperCase()}`),
      mergeMap(action => this.http.delete<T>(`/api/${this.name}s/` + action.payload._id).pipe(
        first(),
        map(() => ({type: `DELETE_${this.name.toUpperCase()}_SUCCESS`, payload: action.payload}))
      ))
    );
  }

  private edit: Epic<T, T> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === `EDIT_${this.name.toUpperCase()}`),
      mergeMap(action => this.http.put<T>(`/api/${this.name}s/` + action.payload._id, action.payload).pipe(
        first(),
        map(() => ({type: `EDIT_${this.name.toUpperCase()}_SUCCESS`, payload: action.payload}))
      ))
    );
  }

  public toEpics = (): Epic<any, any>[] => [this.add, this.load, this.edit, this.delete];
}
