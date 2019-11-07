const fs = require('fs');

require('dotenv').config();

const credentials = {
  clientID: process.env.clientID
};

fs.writeFileSync('./src/credentials.json', JSON.stringify(credentials), 'utf-8');
