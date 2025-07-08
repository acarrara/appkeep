import {inject, Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Details} from '../models/Details';
import {StoreService} from '../../redux/store.service';
import {AppKeepState} from '../models/AppKeepState';

@Injectable()
export class OverallResolveGuard implements Resolve<Details> {
  private store = inject<StoreService<AppKeepState>>(StoreService);


  resolve(): Details {
    return this.store.snapshot<Details>(['statistics', 'overall']);
  }
}
