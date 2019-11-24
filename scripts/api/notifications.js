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
        vibrate: [100, 50, 100]
      },
    };

    const subscriptions = await Subscription.find().exec();
    const promises = subscriptions.map(subscription =>
      webPush.sendNotification(
        subscription,
        JSON.stringify(notificationPayload)
      ));
    Promise.all(promises)
      .then(() => response.sendStatus(200))
      .catch(error => response.status(500).send(error));
  });
};
