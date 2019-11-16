const Through = require('streamss').Through
const cat = require('../')

const stream1 = new Through()
const stream2 = new Through()

cat(stream1, stream2).pipe(process.stdout)
// cat([stream1, stream2]).pipe(process.stdout); //< alternatively

stream1.end('hello ')
stream2.end('world')
