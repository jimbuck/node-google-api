
var https = require('https');
var zlib = require('zlib');
var url = require('url');

var googleApiHostUrl = 'www.googleapis.com'

var gzipHeader = {
	"Accept-Encoding": "gzip",
	"User-Agent": "nodejs (gzip)"
}
/****************
 * node-google-api
 */

exports.list = function(options, callback) {
	if(typeof options == 'function') {
		callback = options;
		options = {};
	}
	if(!callback) {
		callback = function(){}
	}
	
	var query = '?fields=items(discoveryRestUrl%2Cid)';//%2Cname
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
	}, callback);
}

exports.getRest = function(discoveryItem, callback) {
	var query = '?fields=resources%2F*%2Fmethods%2F*%2Fid%2C+resources%2F*%2Fmethods%2F*%2Fpath%2C+resources%2F*%2Fmethods%2F*%2Fparameters%2F*%2Frequired%2C+resources%2F*%2Fmethods%2F*%2Fparameters%2F*%2Flocation%2C+resources%2F*%2Fmethods%2F*%2Fparameters%2F*%2Ftype';
	var apiURL = url.parse(discoveryItem.discoveryRestUrl + query);
	
	sendRequest({
		host: apiURL.hostname,
		path: apiURL.path,
		port: apiURL.port,
		method: 'GET'
	}, callback);
}

// Basic request for an API Method call.
var googleRequest = function(apiMethod, callback) {	

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