
var request = require('request');
var consumerkey = '0NDgZM0aBD38ULjtYhhR69mY5';
var consumersecret = '4q3HRBF26DytNmp5qXjt24ETxLDzYbzhZepXGc4WHoSlvi9Pfq';
var accesskey = '3041579079-PRdFSY1JmwHqoZNSqSdzeofFx18Etysj0ZfY6mF';
var accesssecret = '8GCLPcdQiOIL3OH3nQ3KoFO3ltglK1AqJeTBeis4d79Wx';
var enc_secret = new Buffer(consumerkey + ':' + consumersecret).toString('base64');
var bearer_key;

/*
var oauthOptions = {
  url: 'https://api.twitter.com/oauth2/token',
  headers: {'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
  body: 'grant_type=client_credentials'
};

request.post(oauthOptions, function(e, r, body) {
  var obj = JSON.parse(body);
  bearer_key = obj.access_token;
});
*/
var Twitter = require('twitter');
var config = {
    consumer_key: consumerkey,
    consumer_secret: consumersecret,
    access_token_key: accesskey,
    access_token_secret: accesssecret
};

var twitterClient = new Twitter(config);

/*
twitterClient.get('search/tweets', {q: '@gvivek19'}, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
  else {
      console.log(error);
    //   console.log(response)
  }
});
*/

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
