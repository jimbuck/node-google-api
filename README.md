# node-google-api

A Node.js module that simplifies the use of every Google API.  API functions are formed through the Google APIs Discovery Service.

## How to Install

```bash
COMING SOON!
```

## How to use

First, create the googleAPI root with your Google API Console ID and Secret:

```js
var google = require('node-google-api')({
	clientID: myID,
	clientSecret: mysecret,
	
});
```

Finally, enjoy using all of Google's APIs in Node.js:

```js
var calendar = google.calendar();
calendar.Events.list({}, function(events) {
	// Your code here
});
```

For more thorough examples, look at the `examples/` directory.


## License 

(The MIT License)

Copyright (c) 2013 Jim Buck &lt;jim@jimmyboh.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.