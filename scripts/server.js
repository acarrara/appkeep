const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const restApi = require('./api/manifest');
const enforce = require('express-sslify');
const compression = require('compression');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());

restApi(app);

if (process.env.production) {
  app.use(enforce.HTTPS({trustProtoHeader: true}));
}

app.use(express.static(__dirname + '/../dist/appkeep'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/../dist/appkeep/index.html'));
});

app.listen(process.env.PORT || 3000);
