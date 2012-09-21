// psuedo-require while testing (not yet in npm...)
var gapi = require('./lib/node-google-api');
var url = require('url');

gapi.list({name:'calendar'}, function(list) {
	if(list)  {
		switch(list.length) {
			case 0:
				console.log("No APIs found!");
				break;
			case 1:
				gapi.getRest(list[0], function(api) {
					var path = api.resources.events.methods.list.path+'?key=<<YOUR KEY HERE>>';
					path = path.replace('{calendarId}',encodeURIComponent('en.usa#holiday@group.v.calendar.google.com'));
					var eventUrl = url.parse(api.baseUrl + path);
					
					gapi.request({
						host: eventUrl.hostname,
						path: eventUrl.path,
						port: eventUrl.port,
						method: 'GET'
					}, console.log);
				});
				break;
			default:
				console.log(list);
				break;
		}
		if(list.length > 0) {
			
			
		}
	} else {
		console.log("No APIs found!");
	}
	//*/
});


