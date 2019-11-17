export = cat;
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
 * @param {Readable} streams - Array of Readable Streams or Array of Functions returning Readable Streams
 * @return {Readable} A readable stream
 */
declare function cat(streams: any, ...args: any[]): any;
