# streamss-cat

> Concatenate stream2 streams to one stream

[![NPM version](https://badge.fury.io/js/streamss-cat.svg)](https://www.npmjs.com/package/streamss-cat/)
[![Build Status](https://secure.travis-ci.org/commenthol/streamss-cat.svg?branch=master)](https://travis-ci.org/commenthol/streamss-cat)

Concatenate streams to behave like one [Readable][] Stream. This is a pure Stream2 implementation which respects also a very high number of input streams (>1000).

Works with node v0.8.x and greater.
For node v0.8.x the user-land copy [readable-stream][] is used.
For all other node versions greater v0.8.x the built-in `stream` module is used.

Credits go to [stream-cat][].

### Examples

**Join two streams:**

```js
var Through = require('streamss').Through;
var cat = require('streamss-cat');

var stream1 = new Through();
var stream2 = new Through();

cat(stream1, stream2).pipe(process.stdout);
//cat([stream1, stream2]).pipe(process.stdout); //< alternatively

stream1.end('hello ');
stream2.end('world');

```

**Join thousand fs streams with allocating the resources on runtime:**

```js
var fs = require('fs');
var cat = require('../');
var streams = [];

function fnStream() {
	return fs.createReadStream(__filename);
}

for (var i=0; i<1000; i++) {
	streams.push(fnStream);
}

cat(streams).pipe(process.stdout);
```

## Methods

### cat(streams)

> Concatenate Streams to a readable stream

**Parameters:**

- `{Readable} streams` - Array of Readable Streams or Array of Functions returning Readable Streams

**Return:**

`{Readable}` A readable stream


## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the MIT license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and licence.

### npm scripts

* `npm test`      - Run tests
* `npm run cover` - Run istanbul code coverage (shows code coverage; open `./coverage/lcov-report/index.html` after run)
* `npm run lint`  - Linting the source
* `npm run doc`   - Generate documentation from source (open `./doc/index.html` after run)

## License

Copyright (c) 2015 commenthol (MIT License)

See [LICENSE][] for more info.

[LICENSE]: ./LICENSE
[stream-cat]: https://github.com/micnews/stream-cat
[Readable]: http://nodejs.org/api/stream.html#stream_class_stream_readable
[readable-stream]: https://github.com/isaacs/readable-stream



