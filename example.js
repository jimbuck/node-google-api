
var key = '<<YOUR KEY HERE>>',
var apiLib = require('./lib/node-google-api')(key);
var url = require('url');

apiLib.build(function(gapi) {
	var today = new Date();
	gapi.calendar.events.list({
		calendarId: 'en.usa#holiday@group.v.calendar.google.com'
	}, function(eventList) {
		for(var e in eventList.items) {
			if(new Date(eventList.items[e].start.date) > today)
				console.log(eventList.items[e].summary + ': '+eventList.items[e].start.date);
		}
	});
	
});