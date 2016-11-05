


var twitter = require('twitter');
var config = {
    consumer_key: 'goBgEALwjFShpLj7ULG3mTfEB',
    consumer_secret: 'PZE9uFExwunffVdpbNdayXIkLzUbZaauyFXnE0H209yQmwQam2',
    access_token_key: '3041579079-FWv7W4hjviZGWliohmK1NqkabttRamFWlkttVjs',
    access_token_secret: 'yeFFxBI2toLUqvkfJn3ijYujvXzmP6W7FLLKvd7dN99aw'
}

var twitterClient = new twitter(config);

twitterClient.stream('statuses/filter', {
    locations: {
        38.803819,
        -77.130757,
        39.000727,
        -76.904082
    },
    function(stream) {
        stream.on('data', function(event) {
            // This is where we store the feeds into Mongo
            console.log(event && event.text);
        })

        stream.on('error', fucntion(error) {
            throw error;
        })
    }
);
