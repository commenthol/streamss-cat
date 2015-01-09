var Through = require('streamss').Through;
var cat = require('../');

var stream1 = new Through();
var stream2 = new Through();

cat(stream1, stream2).pipe(process.stdout);
//cat([stream1, stream2]).pipe(process.stdout); //< alternatively

stream1.end('hello ');
stream2.end('world');
