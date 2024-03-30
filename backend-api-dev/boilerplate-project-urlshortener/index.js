require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

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
  let originalUrl = req.body.url;
  dns.lookup(originalUrl, (err) => {
    req.shortUrl = err ? -1 : shortUrl;
    if(!err) {
      urlMap[`${shortUrl}`] = originalUrl;
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
  res.redirect('https://' + originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
