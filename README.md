# node-google-api

A Node.js module that simplifies the use of RESTful Google APIs.  API functions are formed through the Google APIs Discovery Service, so they are automagically up to date.

## How to Install

```bash
npm install node-google-api
```



## How to use

Calling `build` will generate either one or all of the APIs, returning one object that contains each API. Then just use the APIs according to their documention!

```js
var google = require('node-google-api')('<<YOUR GOOGLE API KEY>>');

google.build(function(api) {
	api.calendar.events.list({
		calendarId: 'en.usa#holiday@group.v.calendar.google.com'
	}, function(events) {
		for(var e in events.items) {
			console.log(events[e].summary);
		}
	});
}
```

For more thorough examples, check back later! 

## Future Plans
<ul>
	<li>More flexible API loading</li>
	<li>User Authorization support</li>
	<li>Auto-loading of APIs</li>
</ul>

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