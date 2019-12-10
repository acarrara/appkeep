import { AppKeep } from './models/AppKeep';

export const sumAppKeeps: (appKeeps: AppKeep[]) => number =
  appKeeps => appKeeps.reduce((previous, current) => previous + current.amount * (current.income ? 1 : -1), 0);
