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

/* run with:
 * node thousand.js | egrep "^var fs" | wc -l
 * #> 1000
 */
