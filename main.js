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
	
	if(key) {
		apiKey = key;
	}
	
	return {
		build: function(options, callback) {
			if(typeof options == 'function') {
				callback = options;
				options = {};
			}
			listAPIs(options, function(apiList) {
				// var obj = {};
				// for(li in apiList) {
					// obj[apiList[li].name] = {version: apiList[li].version,discoveryRestUrl:apiList[li].discoveryRestUrl};
				// }
				
				// // Add the list and get functions, for custom handling.
			    // obj.listAPIs = listAPIs;
			    // obj.getAPI = getRest;
				// obj.request = sendRequest;
				
				// callback(obj);

				buildAPI(apiList, function(apiObj) {
					// Add the list and get functions, for custom handling.
					apiObj.listAPIs = listAPIs;
					apiObj.getAPI = getRest;
					apiObj.request = sendRequest;
					
					callback(apiObj);
				});
			});
		}
	};
}

// TODO: buildAPI is a big ugly method, I will break this down to organize and improve.
var buildAPI = function(apiList, callback) {
	var remaining = apiList.length;
	var apiObj = {};
	
	for(var api in apiList) {
		getRest(apiList[api], function(restAPI) {
			if(restAPI.name=='calasdfasdfendar') {
				console.log('Building '+restAPI.name+'...');
			}
			var hostURL = restAPI.baseUrl;
			apiObj[restAPI.name] = {};
			// For each item in the API...
			for(var resource in restAPI.resources) {
				//if(restAPI.name=='calasdfasdfendar') {
				//	console.log('  '+resource+':');
				//}
				apiObj[restAPI.name][resource] = {};
				// For each method in the item...
				for(var method in restAPI.resources[resource].methods) {
					//if(restAPI.name=='asdfas') {
					//	console.log('    ' + method+':');
					//}
					
					// Make the method a useable function...
					apiObj[restAPI.name][resource][method] = (function() {
            var thisMethod = method;
            return function (options, cb) {
              //console.log(thisMethod + ' ' + resource + ' from ' + restAPI.name);
              var query = '?key='+ apiKey;
              // Insert the URL variables...
              var path = this[thisMethod].vars.path;
              for(var term in options) {
                if(path.indexOf(term) >= 0) {
                  path = path.replace('{'+term+'}', encodeURIComponent(options[term]));
                } else {
                  query += '&' + term + '=' + encodeURIComponent(options[term]);
                }
              }
              var parsedUrl = url.parse(hostURL + path + query);
              
              sendRequest({
                host: parsedUrl.hostname,
                path: parsedUrl.path,
                port: parsedUrl.port,
                method: this[thisMethod].vars.httpMethod
              }, function(data) {
                var result = JSON.parse(data);
                cb(result);
              });
            }
          })();
					apiObj[restAPI.name][resource][method].vars = restAPI.resources[resource].methods[method];
					//apiObj[restAPI.name][resource][method].query = restAPI.resources[resource].methods[method].parameters;
				}
			}
			
			if(--remaining == 0) {
				callback(apiObj);
			}
		});
	}
}

module.exports.list = listAPIs;
function listAPIs(options, callback) {
	if(typeof options == 'function') {
		callback = options;
		options = {};
	}
	
	var query = '?fields=items(discoveryRestUrl%2Cname%2Cversion)';//&key='+apiKey;
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
	// baseUrl, resources/*/methods/*/path, resources/*/methods/*/httpMethod
	var query = '?fields=name%2CbaseUrl%2C+resources%2F*%2Fmethods%2F*%2Fpath%2C+resources%2F*%2Fmethods%2F*%2FhttpMethod';
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
