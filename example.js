
var key = '<<YOUR KEY HERE>>',
var apiLib = require('./lib/node-google-api')(key);
var url = require('url');

var options = {
	apiKey: key,
	calendarId: 'en.usa#holiday@group.v.calendar.google.com'
}

apiLib.build(function(gapi) {
	gapi.listAPIs({name:'calendar'}, function(list) {
		if(list)  {
			switch(list.length) {
				case 0:
					console.log("No APIs found!");
					break;
				case 1:
					gapi.getAPI(list[0], function(api) {
						var path = api.resources.events.methods.list.path+'?key='+options.apiKey;
						path = path.replace('{calendarId}',encodeURIComponent(options.calendarId));
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
		} else {
			console.log("No list was found!");
		}
		//*/
	});
});


