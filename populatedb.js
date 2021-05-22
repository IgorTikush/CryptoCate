#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Coin = require('./models/coin')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var coins = []

function categoryCreate(name, description,cb) {
  categorydetail = {name:name , description: description }

  var category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function coinCreate(name,description, category, cb) {
  var coin = new Coin({ name: name, description: description,category: category });
       
  coin.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New coin: ' + coin);
    coins.push(coin)
    cb(null, coin);
  }   );
}

function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Powerhouse', 'The main cryptocurrencies', callback);
        },
        function(callback) {
            categoryCreate('Memecoin', 'Scumbags drived by stupid people for fast money', callback);
        },
        function(callback) {
            categoryCreate('Potential', 'Coins with big potential of huge growth', callback);
        },
        function(callback) {
            categoryCreate('Solid', 'Reliable coins that have decent part of the market', callback);
        },
        
        ],
        // optional callback
        cb);
}


function createCoins(cb) {
    async.parallel([
        function(callback) {
          coinCreate('Bitcoin','The grandfather of all cryptoes',categories[0], callback);
        },
        function(callback) {
            coinCreate('Etherium','the second main crypto in the world',categories[0], callback);
        },
        function(callback) {
            coinCreate('Dogecoin','stepson of Elon Musk, rised by his tweeter. Much money, wow',categories[1], callback);
        },
        function(callback) {
            coinCreate('Near protocol','Protocol that makes creating of decentalized apps easier',categories[2], callback);
        },
        function(callback) {
            coinCreate('Cardano','New level blockchain',categories[3], callback);
        },
        
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
    createCoins
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
