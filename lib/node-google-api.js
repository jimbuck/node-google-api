var https = require('https');
var zlib = require('zlib');
var url = require('url');

var googleApiHostUrl = 'www.googleapis.com'
var apiKey = null;

// Currently not working...
var gzipHeader = {
	"Accept-Encoding": "gzip",
	"User-Agent": "nodejs (gzip)"
}

/****************
 * node-google-api
 */

module.exports = function(key) {
	
	if(apiKey) {
		this.apiKey = key;
	}
	
	return {
		build: function(options, callback) {
			if(typeof options == 'function') {
				callback = options;
				options = {};
			}
			listAPIs(function(apiObj) {
				apiObj.listAPIs = listAPIs;
				apiObj.getAPI = getRest;
				apiObj.request = sendRequest;
				
				callback(apiObj);
			});
		}
	};
}
	
var build = 


	
module.exports.list = listAPIs;
function listAPIs(options, callback) {
	if(typeof options == 'function') {
		callback = options;
		options = {};
	}
	
	var query = '?fields=items(discoveryRestUrl%2Cid)';//&key='+apiKey;
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

module.exports.getAPI = getRest
function getRest(discoveryItem, callback) {
	//fields=baseUrl, resources/*/methods/*/id, resources/*/methods/*/path, resources/*/methods/*/parameters/*/required, resources/*/methods/*/parameters/*/location, resources/*/methods/*/parameters/*/type&
	var apiURL = url.parse(discoveryItem.discoveryRestUrl);
	
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
		
// Make the Request function externally available for easier testing...
module.exports.request = sendRequest;
function sendRequest(options, callback) {                                           
	https.request(options, function(res) {
		res.setEncoding('utf8');
		
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		}).on('end', function () {
			if(callback) {
				return callback(data);
			}
		});
	}).end();
}