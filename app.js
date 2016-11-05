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
                console.log(event);

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


var insertDocuments = function(db, tweet, callback) {
  // Get the documents collection
  var collection = db.collection('documents');

  // Insert some documents
  collection.insert([
    {
        "uid": tweet.user.id_str,
        "handle": tweet.user.screen_name,
        "name": tweet.user.name,
        "text": tweet.text,
        "time": tweet.created_at,
        "location": tweet.coordinates.coordinates
    }
  ], function(err, result) {
    assert.equal(err, null);
    console.log("--inserted a tweet into the database--");
    callback(result);
  });
}

// { created_at: 'Sat Nov 05 17:35:27 +0000 2016',
//   id: 794956305765138400,
//   id_str: '794956305765138434',
//   text: 'Clean https://t.co/jk2OuCXvjK',
//   display_text_range: [ 0, 5 ],
//   source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
//   truncated: false,
//   in_reply_to_status_id: null,
//   in_reply_to_status_id_str: null,
//   in_reply_to_user_id: null,
//   in_reply_to_user_id_str: null,
//   in_reply_to_screen_name: null,
//   user: 
//    { id: 4628052082,
//      id_str: '4628052082',
//      name: 'Cj Craft',
//      screen_name: 'cj_craft77',
//      location: 'medellín',
//      url: null,
//      description: '#HTTR',
//      protected: false,
//      verified: false,
//      followers_count: 156,
//      friends_count: 124,
//      listed_count: 0,
//      favourites_count: 778,
//      statuses_count: 3878,
//      created_at: 'Mon Dec 28 03:03:27 +0000 2015',
//      utc_offset: null,
//      time_zone: null,
//      geo_enabled: true,
//      lang: 'en',
//      contributors_enabled: false,
//      is_translator: false,
//      profile_background_color: 'F5F8FA',
//      profile_background_image_url: '',
//      profile_background_image_url_https: '',
//      profile_background_tile: false,
//      profile_link_color: '1DA1F2',
//      profile_sidebar_border_color: 'C0DEED',
//      profile_sidebar_fill_color: 'DDEEF6',
//      profile_text_color: '333333',
//      profile_use_background_image: true,
//      profile_image_url: 'http://pbs.twimg.com/profile_images/761248097674534912/YLVG1cQp_normal.jpg',
//      profile_image_url_https: 'https://pbs.twimg.com/profile_images/761248097674534912/YLVG1cQp_normal.jpg',
//      profile_banner_url: 'https://pbs.twimg.com/profile_banners/4628052082/1477370097',
//      default_profile: true,
//      default_profile_image: false,
//      following: null,
//      follow_request_sent: null,
//      notifications: null },
//   geo: null,
//   coordinates: null,
//   place: 
//    { id: 'dea1eac2d7ef8878',
//      url: 'https://api.twitter.com/1.1/geo/id/dea1eac2d7ef8878.json',
//      place_type: 'admin',
//      name: 'Maryland',
//      full_name: 'Maryland, USA',
//      country_code: 'US',
//      country: 'United States',
//      bounding_box: { type: 'Polygon', coordinates: [Object] },
//      attributes: {} },
//   contributors: null,
//   is_quote_status: false,
//   retweet_count: 0,
//   favorite_count: 0,
//   entities: 
//    { hashtags: [],
//      urls: [],
//      user_mentions: [],
//      symbols: [],
//      media: [ [Object] ] },
//   extended_entities: { media: [ [Object] ] },
//   favorited: false,
//   retweeted: false,
//   possibly_sensitive: false,
//   filter_level: 'low',
//   lang: 'en',
//   timestamp_ms: '1478367327525' }

