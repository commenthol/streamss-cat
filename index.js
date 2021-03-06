/**
 * @module streamss-cat
 * @copyright 2015 commenthol
 * @licence MIT
 *
 * Code inspired by [stream-cat](https://github.com/micnews/stream-cat) project. (MIT-licensed)
 */

'use strict'

const { PassThrough } = require('stream')
const readonly = require('streamss-readonly')

/**
 * Concatenate Streams to a readable stream
 *
 * @example <caption>Join two streams:</caption>
 *
 *  const { Through } = require('streamss')
 *  const cat = require('streamss-cat')
 *
 *  const stream1 = new Through()
 *  const stream2 = new Through()
 *
 *  cat(stream1, stream2).pipe(process.stdout)
 *  // cat([stream1, stream2]).pipe(process.stdout) //< alternatively
 *
 *  stream1.end('hello ')
 *  stream2.end('world')
 *
 * @example <caption>Join thousand fs-streams with allocating the resources on runtime</caption>
 *
 *  const fs = require('fs')
 *  const cat = require('streamss-cat')
 *  const streams = []
 *
 *  function fnStream() {
 *    return fs.createReadStream(__filename)
 *  }
 *
 *  for (let i=0; i<1000; i++) {
 *    streams.push(fnStream)
 *  }
 *
 *  cat(streams).pipe(process.stdout)
 *
 * @param {Readable[]} streams - Array of Readable Streams or Array of Functions returning Readable Streams
 * @return {Readable} A readable stream
 */
function cat (streams) {
  const out = PassThrough()

  if (!Array.isArray(streams)) {
    streams = Array.prototype.slice.call(arguments)
  }

  (function next (i) {
    let stream = streams[i]

    if (typeof stream === 'function') {
      stream = stream()
    }

    if (!stream) {
      return out.push(null)
    }
    stream.pipe(out, { end: false })

    stream.on('error', (err) => {
      out.emit('error', err)
    })

    stream.on('end', () => {
      setImmediate(() => {
        next(i + 1)
      })
    })
  })(0)

  return readonly(out)
}

module.exports = cat
