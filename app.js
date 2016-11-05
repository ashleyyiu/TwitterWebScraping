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


twitterClient.stream('statuses/filter', { locations: "-77.130757,38.803819,-76.904082,39.000727" },
    function(stream) {
        stream.on('data', function(event) {
            // This is where we store the feeds into Mongo
            console.log(event && event.text);
        });

        stream.on('error', function(error) {
            console.log(error);
        });
});
