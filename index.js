/**
 * @module streamss-cat
 * @copyright 2015 commenthol
 * @licence MIT
 *
 * Code inspired by [stream-cat](https://github.com/micnews/stream-cat) project. (MIT-licensed)
 */

'use strict'

var Streams = require('stream')
var PassThrough = Streams.PassThrough
var readonly = require('streamss-readonly')

// / shim setImmediate for node v0.8.x
// istanbul ignore if
if (!global.setImmediate) {
  global.setImmediate = process.nextTick
}

/**
 * Concatenate Streams to a readable stream
 *
 * Example: Join two streams:
 *
 *     var Through = require('streamss').Through;
 *     var cat = require('streamss-cat');
 *
 *     var stream1 = new Through();
 *     var stream2 = new Through();
 *
 *     cat(stream1, stream2).pipe(process.stdout);
 *     //cat([stream1, stream2]).pipe(process.stdout); //< alternatively
 *
 *     stream1.end('hello ');
 *     stream2.end('world');
 *
 * Example: Join thousand fs-streams with allocating the resources on runtime:
 *
 *     var fs = require('fs');
 *     var cat = require('streamss-cat');
 *     var streams = [];
 *
 *     function fnStream() {
 *         return fs.createReadStream(__filename);
 *     }
 *
 *     for (var i=0; i<1000; i++) {
 *         streams.push(fnStream);
 *     }
 *
 *     cat(streams).pipe(process.stdout);
 *
 * @param {Readable} streams - Array of Readable Streams or Array of Functions returning Readable Streams
 * @return {Readable} A readable stream
 */
function cat (streams) {
  var out = PassThrough()

  if (!Array.isArray(streams)) {
    streams = Array.prototype.slice.call(arguments)
  }

  (function next (i) {
    var stream = streams[i]

    if (typeof stream === 'function') {
      stream = stream()
    }

    if (!stream) {
      return out.push(null)
    }
    stream.pipe(out, { end: false })

    stream.on('error', function (err) {
      out.emit('error', err)
    })

    stream.on('end', function () {
      setImmediate(function () {
        next(i + 1)
      })
    })
  })(0)

  return readonly(out)
}

module.exports = cat
