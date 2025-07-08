import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map } from 'rxjs/operators';
import { SwPush } from '@angular/service-worker';
import { AppKeep } from './models/AppKeep';
import { AmountPipe } from './pipes/amount.pipe';
import { Observable, of } from 'rxjs';

const vapidKey = 'BJhuxRN4FQmXh1OCv9ESDPTzhAzz6wuriWhT_61ZmYsZN4mYSguPJkWoBjRYh6Et2Jet-4aBvMgnbx9HjL_Ifd8';

@Injectable()
export class NotificationService {
  private swPush = inject(SwPush);
  private http = inject(HttpClient);


  private amountPipe: AmountPipe = new AmountPipe();

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
            serverPublicKey: vapidKey
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
