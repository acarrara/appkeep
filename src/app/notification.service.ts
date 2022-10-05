import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map } from 'rxjs/operators';
import { SwPush } from '@angular/service-worker';
import { AppKeep } from './models/AppKeep';
import { AmountPipe } from './pipes/amount.pipe';
import { Observable, of } from 'rxjs';

import { config } from 'dotenv';

@Injectable()
export class NotificationService {

  private amountPipe: AmountPipe = new AmountPipe();

  constructor(private swPush: SwPush,
              private http: HttpClient) {
    config();
  }

  sendNotification(appKeep: AppKeep) {
    const content = `${appKeep.title} - ${this.amountPipe.transform(appKeep.amount)}`;
    const title = `AppKeep - ${appKeep.category}`;
    this.http.post('/api/notifications', {title, content}).pipe(first()).subscribe(() => {
      console.log('subscription sent');
    });
  }

  subscribeToNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush.subscription.pipe(first()).subscribe(maybeSubscription => {
        if (maybeSubscription === null) {
          this.swPush.requestSubscription({
            serverPublicKey: process.env.VAPID_PUBLIC_KEY
          }).then(subscription => {
            this.storeSubscription(subscription);
          }).catch(console.error);
        }
      });
    }
  }

  unsubscribeFromNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush.subscription.pipe(first()).subscribe(maybeSubscription => {
        if (maybeSubscription !== null) {
          this.swPush.unsubscribe().then(() => {
            console.log('unsubscribed');
          }).catch(console.error);
        }
      });
    }
  }

  isSubscribed(): Observable<boolean> {
    if (this.swPush.isEnabled) {
      return this.swPush.subscription.pipe(first(), map(maybeSubscription => maybeSubscription !== null));
    } else {
      return of(false);
    }
  }

  private storeSubscription(subscription: PushSubscription) {
    this.http.post('/api/subscriptions', subscription).pipe(first()).subscribe(() => {
      console.log('subscription sent');
    });
  }
}
