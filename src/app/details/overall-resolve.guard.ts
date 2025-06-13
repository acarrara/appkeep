import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Details } from '../models/Details';
import { StoreService } from '../../redux/store.service';
import { AppKeepState } from '../models/AppKeepState';

@Injectable()
export class OverallResolveGuard  {

  constructor(private store: StoreService<AppKeepState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Details {
    return this.store.snapshot<Details>(['statistics', 'overall']);
  }
}
