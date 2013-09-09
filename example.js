var google = require('./main.js')('<< YOUR API KEY HERE >>');

/***
 * For more options, use an object as a parameter...
 *
 *        var google = require('./main.js')({
 *          apiKey: '<< YOUR API KEY HERE >>',
 *          debugMode: true
 *        });
 */


google.build(function(api) {
  api.calendar.events.list({
    //access_token: '1/ffbgrdj12g12gd44azqt3zg', // token for the current user (if you're using OAuth)
    calendarid: 'en.usa#holiday@group.v.calendar.google.com'
  }, function(result) {
    if(result.error){
      console.log(result.error);
    } else {
      for(var i in result.items) {
        console.log(result.items[i].summary);
      }
    }
  });
});