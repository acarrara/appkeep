import { AppActions } from './app.actions';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Epic } from '../redux/Epic';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import { AppKeep } from './models/AppKeep';

@Injectable()
export class AppEpics {

  constructor(private actions: AppActions, private http: HttpClient) {
  }

  public loadAppKeeps: Epic<any, AppKeep[]> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.LOAD_APPKEEPS),
      mergeMap(() => this.http.get<AppKeep[]>('/api/appkeeps').pipe(first(), map(appKeeps => this.actions.loadAppKeepsSuccess(appKeeps))))
    );
  }

  public addAppKeep: Epic<AppKeep, AppKeep> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.ADD_APPKEEP),
      mergeMap(action => this.http.post<AppKeep>('/api/appkeeps', action.payload).pipe(
        first(),
        map(appKeep => this.actions.addAppKeepSuccess(appKeep))
      ))
    );
  }

  public deleteAppKeep: Epic<AppKeep, AppKeep> = actions$ => {
    return actions$.pipe(
      filter(action => action.type === AppActions.DELETE_APPKEEP),
      mergeMap(action => this.http.delete<AppKeep>('/api/appkeeps/' + action.payload._id).pipe(
        first(),
        map(() => this.actions.deleteAppKeepSuccess(action.payload))
      ))
    );
  }
}
