const fs = require('fs');

require('dotenv').config();

const credentials = {
  clientID: process.env.clientID
};

const vapid = {
  publicKey: process.env.VAPID_PUBLIC_KEY
};

fs.writeFileSync('./src/credentials.json', JSON.stringify(credentials), 'utf-8');
fs.writeFileSync('./src/vapid.json', JSON.stringify(vapid), 'utf-8');
