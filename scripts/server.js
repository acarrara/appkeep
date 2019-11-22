const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const restApi = require('./rest-api');
const notifications = require('./notifications');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

restApi(app);
notifications(app);

// Serve static files....
app.use(express.static(__dirname + '/../dist/appkeep'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/../dist/appkeep/index.html'));
});

app.listen(process.env.PORT || 3000);
