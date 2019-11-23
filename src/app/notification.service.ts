import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import vapid from '../vapid.json';
import { SwPush } from '@angular/service-worker';
import { AppKeep } from './models/AppKeep';
import { AmountPipe } from './amount.pipe';

@Injectable()
export class NotificationService {

  private amountPipe: AmountPipe = new AmountPipe();

  constructor(private swPush: SwPush,
              private http: HttpClient) {
  }

  sendNotification(appKeep: AppKeep) {
    const content = `${appKeep.title} - ${this.amountPipe.transform(appKeep.amount)}`;
    const title = `AppKeep - ${appKeep.category}`;
    this.http.post('/api/notifications', {title, content}).pipe(first()).subscribe(() => {
      console.log('subscription sent');
    });
  }

  handlePushNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush.subscription.subscribe(maybeSubscription => {
        if (maybeSubscription === null) {
          this.swPush.requestSubscription({
            serverPublicKey: vapid.publicKey
          }).then(subscription => {
            this.storeSubscription(subscription);
          }).catch(console.error);
          this.swPush.notificationClicks.subscribe(data => {
            console.log(data);
          });
        }
      });
    }
  }

  private storeSubscription(subscription: PushSubscription) {
    this.http.post('/api/subscriptions', subscription).pipe(first()).subscribe(() => {
      console.log('subscription sent');
    });
  }
}
