var fs = require('fs');
var request = require('request');
var consumerkey = '0NDgZM0aBD38ULjtYhhR69mY5';
var consumersecret = '4q3HRBF26DytNmp5qXjt24ETxLDzYbzhZepXGc4WHoSlvi9Pfq';
var accesskey = '3041579079-PRdFSY1JmwHqoZNSqSdzeofFx18Etysj0ZfY6mF';
var accesssecret = '8GCLPcdQiOIL3OH3nQ3KoFO3ltglK1AqJeTBeis4d79Wx';
var enc_secret = new Buffer(consumerkey + ':' + consumersecret).toString('base64');
var bearer_key;

var Twitter = require('twitter');
var config = {
    consumer_key: consumerkey,
    consumer_secret: consumersecret,
    access_token_key: accesskey,
    access_token_secret: accesssecret
};

var twitterClient = new Twitter(config);

// MongoDB
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://ashleyyiu:HOYAHaxa16@ds145667.mlab.com:45667/districtdanger';

// Use connect method to connect to the server

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

//Start capturing twitter stream
    twitterClient.stream('statuses/filter', { locations: "-77.130757,38.803819,-76.904082,39.000727" },
        function(stream) {
            stream.on('data', function(event) {
                // This is where we store the feeds into Mongo
                console.log(event && event.text);

                // Insert tweets into our database
                insertDocuments(db, event, function(){
                    // db.close();
                });

            });

            stream.on('error', function(error) {
                console.log(error);
            });
    });

});


var insertDocuments = function(db, tweetText, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  tweet = JSON.parse(tweetText);

  collection.insert([
    {
        "uid": tweet.user.id_str,
        "handle": tweet.screen_name,
        "name": tweet.name,
        "text": tweet.text,
        "time": tweet.created_at,
        "location": tweet.geo.coordinates,
    }
  ], function(err, result) {
    assert.equal(err, null);
    console.log("--inserted a tweet into the database--");
    callback(result);
  });
}
