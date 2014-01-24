var https = require('https');
var url = require('url');

var settings = {
  googleApiHostUrl: 'www.googleapis.com',
  googleDisoveryApiVersion: 'v1',
  apiKey: null,
  debugMode: false
};

/****************
 * node-google-api
 */

module.exports = function(key) {
	
	if(key){
  
    if(typeof key === 'string'){
      settings.apiKey = key;
    } else if(typeof key === 'object') {
      settings.apiKey = key.apiKey || settings.apiKey;
      settings.debugMode = key.debugMode || settings.debugMode;
      settings.googleApiHostUrl = key.googleApiHostUrl || settings.googleApiHostUrl;
      settings.googleDisoveryApiVersion = key.googleDisoveryApiVersion || settings.googleDisoveryApiVersion;
    } else {
      throw new Error('A parameter of type "' + typeof key + '" is not permitted.');
    }
	} else {
    throw new Error('An API key is required to use this module: https://code.google.com/apis/console');
  }
	
	return {
		build: function(options, callback) {
			if(typeof options == 'function') {
				callback = options;
				options = {};
			}
			listAPIs(options, function(apiList) {
				buildAPI(apiList, function(apiObj) {
					// Removed them, they were confusing to see in the list of API's.
					//apiObj.listAPIs = listAPIs;
					//apiObj.getAPI = getRest;
					//apiObj.request = sendRequest;
					
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
			var hostURL = restAPI.baseUrl;
			apiObj[restAPI.name] = {};
			// For each item in the API...
			for(var resource in restAPI.resources) {

				apiObj[restAPI.name][resource] = {};
				// For each method in the item...
				for(var method in restAPI.resources[resource].methods) {
					
					// Make the method a usable function...
					apiObj[restAPI.name][resource][method] = (function() {
            var thisMethod = method;
            return function (options, cb) {
              if(!options)
                options = {};
              
              if(typeof cb == 'undefined'){
                cb = function(){};
                if(typeof options === 'function') {
                  cb = options;
                  options = {};
                }
							}
              
              var query = '?key='+ settings.apiKey;
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
                if(cb) cb(data);
              });
            }
          })();
					apiObj[restAPI.name][resource][method].vars = restAPI.resources[resource].methods[method];
				}
			}
			
			if(--remaining == 0) {
				callback(apiObj);
			}
		});
	}
}

module.exports.list = listAPIs = function (options, callback) {
	if(typeof options == 'function') {
		callback = options;
		options = {};
	}
	
	var query = '?fields=items(discoveryRestUrl%2Cname%2Cversion)';
	if(options) {
		for(var o in options) {
			if(options[o]) {
				query += '&'+ o + '=' + options[o];
			}
		}
	}

	sendRequest({
		host: settings.googleApiHostUrl,
		path: '/discovery/' + settings.googleDisoveryApiVersion + '/apis'+query,
		method: 'GET'
	}, function(data) {
      if(data.items) {
        callback(data.items);
      }
	});
}

module.exports.getAPI = getRest = function(discoveryItem, callback) {
	// baseUrl, resources/*/methods/*/path, resources/*/methods/*/httpMethod
	var query = '?fields=name%2CbaseUrl%2C+resources%2F*%2Fmethods%2F*%2Fpath%2C+resources%2F*%2Fmethods%2F*%2FhttpMethod';
	var apiURL = url.parse(discoveryItem.discoveryRestUrl + query);
	
	sendRequest({
		host: apiURL.hostname,
		path: apiURL.path,
		port: apiURL.port,
		method: 'GET'
	}, function(data) {
		callback(data);
	});
}

// Make the Request function externally available for easier testing...
module.exports.request = sendRequest = function (options, callback) {                                           
	https.request(options, function(res) {
		res.setEncoding('utf8');
		//console.log(options.host + options.path);
		var result = '';
		res.on('data', function (chunk) {
			result += chunk;
		}).on('end', function () {
			var data = JSON.parse(result);
      
      if(data.error && settings.debugMode){
        throwResponseException(data);
      }
      
      if(callback) callback(data);
		});
	}).end();
}

function throwResponseException(errorResult){
  var errorMessage = errorResult.error.code + ': ' + errorResult.error.message;
  var stackTrace = '';
  for(var e in errorResult.error.errors){
    var error = errorResult.error.errors[e];
    stackTrace += '[' + error.domain + '] ' + error.reason + ' -> ' + error.message + '\n';
  }
  
  throw new Error(errorMessage + '\n' + stackTrace);
}
