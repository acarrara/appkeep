const webPush = require('web-push');
const Subscription = require('./schemas/Subscription');

module.exports = function (app) {

  require('dotenv').config();

  webPush.setVapidDetails('mailto:you@domain.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

  app.post('/api/subscriptions', async (request, response) => {
    try {
      const subscription = new Subscription(request.body);
      const result = await subscription.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.post('/api/notifications', async (request, response) => {
    const notificationPayload = {
      notification: {
        title: request.body.title,
        body: request.body.content,
        icon: 'assets/icons/icon-512x512.png',
        badge: 'assets/badge.png',
        vibrate: [100, 50, 100]
      },
    };

    const subscriptions = await Subscription.find().exec();

    const promise = subscriptions.reduce((promiseChain, subscription) =>
        promiseChain.then(() => triggerPush(subscription, notificationPayload)),
      Promise.resolve());

    promise
      .then(() => response.sendStatus(200))
      .catch(error => response.status(500).send(error));
  });

  function triggerPush(subscription, notificationPayload) {
    return webPush.sendNotification(
      subscription,
      JSON.stringify(notificationPayload)
    ).catch(err => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid: ', subscription, err);
        return Subscription.deleteOne({_id: subscription._id}).exec();
      } else {
        throw err;
      }
    });
  }

};
