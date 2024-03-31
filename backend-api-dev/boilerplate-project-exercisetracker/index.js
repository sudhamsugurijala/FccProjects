const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

app.use(cors());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}))

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'fcc-projects-db' });

let userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  log: [{
    description: String,
    duration: Number,
    date: {type: Date, default: Date.now}
  }]
}, { collection: 'user-exercise-log' });

let userModel = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.get('/api/users', (req, res, next) => {
    userModel.find({}).then(docs => {
      let users = [];
      docs.forEach(doc => {
        users.push({username: doc.username, _id: doc._id});
      });
      res.send(users);
    });
});

app.post('/api/users', (req, res, next) => {
  let reqUsername = req.body.username;
  let newUser = new userModel({
    username: reqUsername
  });
  newUser.save().then(doc => res.json({
    username: doc.username,
    _id: doc._id
  }));
});

app.get('/api/users/:_id/logs', (req, res, next) => {
  let from = req.query.from;
  let to = req.query.to;
  let limit = Number(req.query.limit);

  let userId = req.params._id;

  userModel.findById(userId).then(user => {
    let logs = user.log;
    let resultLogs = [];
    if(from)
      logs = logs.filter(log => new Date(Date.parse(log.date)).getTime() >= new Date(from));
    if(to)
      logs = logs.filter(log => new Date(Date.parse(log.date)).getTime() <= new Date(to));
    if(limit)
      logs = logs.slice(0, limit);

    for(let log of logs) {
      resultLogs.push({
        description: log.description,
        duration: log.duration,
        date: new Date(log.date).toDateString()
      })
    }

    res.send({
      username: user.username,
      count: resultLogs.length,
      _id: user._id,
      log: resultLogs
    });
  });

});

app.post('/api/users/:_id/exercises', (req, res, next) => {
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();

  let userId = req.params._id;

  userModel.findByIdAndUpdate(userId, {"$push": { "log": {description: description, duration: duration, date: date}}},
      {"new": true, "upsert": false}).then(doc => {
        res.send({
          username: doc.username,
          description: description,
          duration: Number(duration),
          date: date,
          _id: userId
        })
  })
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
