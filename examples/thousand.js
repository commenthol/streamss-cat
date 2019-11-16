const fs = require('fs')
const cat = require('../')
const streams = []

function fnStream () {
  return fs.createReadStream(__filename)
}

for (let i = 0; i < 1000; i++) {
  streams.push(fnStream)
}

cat(streams).pipe(process.stdout)

/* run with:
 * node thousand.js | egrep "^let fs" | wc -l
 * #> 1000
 */
