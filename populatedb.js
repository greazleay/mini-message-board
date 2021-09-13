#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Message = require('./models/message')

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const messages = []

function messageCreate(user, text, date_added, cb) {

  const message = new Message({
    user: user,
    text: text,
    date_added: date_added
  });

  message.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Message: ' + message);
    messages.push(message)
    cb(null, message)
  });
}

function createMessages(cb) {
  async.series([
    function (callback) {
      messageCreate('Patrick Rothfuss', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec.', new Date(), callback);
    },
    function (callback) {
      messageCreate('Ben Bova', 'sagittis eu volutpat odio facilisis mauris sit amet massa vitae', new Date(), callback);
    },
    function (callback) {
      messageCreate('Isaac Asimov', 'urna porttitor rhoncus dolor purus non enim praesent elementum facilisis', new Date(), callback);
    },
    function (callback) {
      messageCreate('Bob Billings', 'Fusce efficitur elit elit, vulputate elementum risus dignissim nec. Aliquam.', new Date(), callback);
    }
  ],
    // optional callback
    cb);
}

async.series([
  createMessages
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('Messages: ' + messages);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });




