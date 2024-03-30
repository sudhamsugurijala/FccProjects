var express = require('express');
var cors = require('cors');

const multer = require('multer');

require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', multer().single("upfile"),function (req, res) {
  let fileAttributes = {};
  fileAttributes.name = req.file.originalname;
  fileAttributes.type = req.file.mimetype;
  fileAttributes.size = req.file.size;
  res.send(fileAttributes);
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
