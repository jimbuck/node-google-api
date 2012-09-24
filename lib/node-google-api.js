var https = require('https');
var zlib = require('zlib');
var url = require('url');

var googleApiHostUrl = 'www.googleapis.com'
var apiKey = '<<YOUR_KEY_HERE>>';

var gzipHeader = {
	"Accept-Encoding": "gzip",
	"User-Agent": "nodejs (gzip)"
}

/****************
 * node-google-api
 */
 
// exports = function(key) {
	// if(key) {
		// apikey = key;
	// }
// }

exports.list = function(options, callback) {
	if(typeof options == 'function') {
		callback = options;
		options = {};
	}
	
	var query = '?fields=items(discoveryRestUrl%2Cid)&key='+apiKey;
	if(options) {
		for(var o in options) {
			if(options[o]) {
				query += '&'+ o + '=' + options[o];
			}
		}
	}

	sendRequest({
		host: googleApiHostUrl,
		path: '/discovery/v1/apis'+query,
		method: 'GET'
	}, function(data) {
		var list = JSON.parse(data).items;
		callback(list);
	});
}

exports.getRest = function(discoveryItem, callback) {
	var query = '?key='+apiKey; //fields=baseUrl, resources/*/methods/*/id, resources/*/methods/*/path, resources/*/methods/*/parameters/*/required, resources/*/methods/*/parameters/*/location, resources/*/methods/*/parameters/*/type&
	var apiURL = url.parse(discoveryItem.discoveryRestUrl + query);
	
	sendRequest({
		host: apiURL.hostname,
		path: apiURL.path,
		port: apiURL.port,
		method: 'GET'
	}, function(data) {
		var obj = JSON.parse(data);
		callback(obj);
	});
}

// Basic request for an API Method call.
var googleRequest = function(apiMethod, callback) {	

}

exports.request = function(options, callback) {
	sendRequest(options, callback);
}
var sendRequest = function(options, callback) {
	https.request(options, function(res) {
		res.setEncoding('utf8');
		
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		}).on('end', function () {
			if(callback) {
				callback(data);
			}
		});
	}).end();
}