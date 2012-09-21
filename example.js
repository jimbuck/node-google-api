// psuedo-require while testing (not yet in npm...)
var gapi = require('./lib/node-google-api');

gapi.list({name:'calendar'}, function(list) {
	list = JSON.parse(list).items;
	//
	if(list)  {
		switch(list.length) {
			case 0:
				console.log("No APIs found!");
				break;
			case 1:
				gapi.getRest(list[0], function(api) {
					api = JSON.parse(api).resources;
					console.log(api);
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