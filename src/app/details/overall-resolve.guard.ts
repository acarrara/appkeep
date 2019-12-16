import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Details } from '../models/Details';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';

@Injectable()
export class OverallResolveGuard implements Resolve<Details> {

  constructor(private store: StoreService<AppKeepState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Details {
    return this.store.snapshot<Details>(['statistics', 'overall']);
  }
}
