var fs = require('fs');
var jsonfile = require('jsonfile');
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
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL
var url = 'mongodb://phi:1HZTE8VJXSHXh1fQ@upsilon-shard-00-00-qoojs.mongodb.net:27017,upsilon-shard-00-01-qoojs.mongodb.net:27017,upsilon-shard-00-02-qoojs.mongodb.net:27017/DMVTweetFeed?ssl=true&replicaSet=upsilon-shard-0&authSource=admin';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    //Start capturing twitter stream
    twitterClient.stream('statuses/filter', { locations: "-77.130757,38.803819,-76.904082,39.000727" },
        function(stream) {
            stream.on('data', function(event) {
                // This is where we store the feeds into Mongo
                console.log(event);
                var tweet = event;
                db.collection("TweetFeed", function(err, collection) {
                    collection.insert(event);
                });

                if (event.entities.media != null)
                {
                    medJson = {
                        id : event.id_str,
                        media_id : event.entities.media.id_str,
                        media : event.entities.media.media_url,
                        all_data : event.entities.media
                    }
                    db.collection("MediaFeed", function(err, collection) {
                        collection.insert(medJson);
                    })
                }

                db.collection('TweetFeed').count(function (err, count) {
                    if (err) throw err;

                    console.log('Total Rows: ' + count);
                });
                db.collection('MediaFeed').count(function (err, count) {
                    if (err) throw err;

                    console.log('Total Rows: ' + count);
                });
                // Insert tweets into our database
                insertDocuments(event);

            });

            stream.on('error', function(error) {
                console.log(error);
            });
    });
});


function insertDocuments(tweet)
{
    //if (tweet.coordinates != null)
    //{
    // Get the documents collection

    var tweetJson = {
        "uid": tweet.user.id_str,
        "handle": tweet.user.screen_name,
        "name": tweet.user.name,
        "text": tweet.text,
        "time": tweet.created_at,
        "location": tweet.coordinates.coordinates,
        "verified": tweet.user.verified
    }
    var file = 'tweet.json'



    jsonfile.writeFile(file, tweetJson, function (error) {
        console.log(error);
    });
    //}
}
