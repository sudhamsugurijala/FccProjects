require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

let INVALID_SHORT_URL_NUMBER = -1;

let urlMap = {};
let shortUrl = 0;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res, next) {
  let originalUrl = "";
  try {
    originalUrl = new URL(req.body.url);
  } catch (e) {
    req.shortUrl = INVALID_SHORT_URL_NUMBER;
    next();
  }
  dns.lookup(originalUrl.hostname, (err) => {
    req.shortUrl = err ? INVALID_SHORT_URL_NUMBER : shortUrl;
    if(!err) {
      urlMap[`${shortUrl}`] = originalUrl.toString();
      shortUrl++;
    }
    next();
  });
}, function(req, res) {
  let response = req.shortUrl >= 0 ? {original_url : req.body.url, short_url : req.shortUrl} : {error: 'invalid url'};
  res.send(response);
});

app.get('/api/shorturl/:shortUrl', function(req, res){
  let reqShortUrl = req.params.shortUrl;
  let originalUrl = urlMap[reqShortUrl];
  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
