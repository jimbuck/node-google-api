var google = require('./main.js')({apiKey: '<<INSERT YOUR PROJECTS API KEY HERE>>', debugMode: true});

/***
 * For more options, use an object as a parameter...
 *
 *        var google = require('./main.js')({
 *          apiKey: '<< YOUR PRIVATE API KEY >>',
 *          debugMode: true
 *        });
 */


google.build(function(api) {
  
  // Print out each of the supported API's.
  for(var k in api){ 
    console.log(k);
  }
  
  console.log('\n----------\n');
  
  // View this public/private calendar data...
  api.calendar.events.list({
    //access_token: '1/ffbgrdk3gg12gd42ifqt3zg', // token for the current user (if you're using OAuth)
    calendarId: 'en.usa#holiday@group.v.calendar.google.com'
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