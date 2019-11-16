/**
 * @copyright 2015 commenthol
 * @license MIT
 */

'use strict'

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { through, ReadBuffer } = require('streamss')
const cat = require('../')

const fixture = path.resolve(__dirname, 'fixtures/abcdef.txt')

function abc (cnt) {
  return 'abcdefghi' + (cnt === undefined ? '' : cnt) + '\n'
}

describe('#cat', function () {
  it('concatenate one stream', function (done) {
    const stream = new ReadBuffer(abc(0))
    const res = []

    cat(stream)
      .pipe(through(
        function (data) {
          assert.strictEqual(data.toString(), abc(0))
          res.push(data)
        },
        function () {
          assert.strictEqual(res.length, 1)
          done()
        })
      )
  })
  it('concatenate three streams', function (done) {
    const stream1 = new ReadBuffer(abc(1))
    const stream2 = new ReadBuffer(abc(2))
    const stream3 = new ReadBuffer(abc(3))
    const exp = abc(1) + abc(2) + abc(3)
    let res = ''

    cat(stream1, stream2, stream3)
      .pipe(through(
        function (data) {
          res += data
        },
        function () {
          assert.strictEqual(res.toString(), exp)
          done()
        })
      )
  })
  it('concatenate four streams as Array', function (done) {
    const streams = []
    let exp = ''
    let res = ''

    for (let i = 0; i < 4; i++) {
      streams.push(new ReadBuffer(abc(i)))
      exp += abc(i)
    }

    cat(streams)
      .pipe(through(
        function (data) {
          res += data
        },
        function () {
          assert.strictEqual(res, exp)
          done()
        })
      )
  })
  it('concatenate thousand streams as functions', function (done) {
    const streams = []
    let exp = ''
    let res = ''

    // allocate the stream resource only as needed
    function getStream (i) {
      return function () {
        return new ReadBuffer(abc(i))
      }
    }

    for (let i = 0; i < 1000; i++) {
      streams.push(getStream(i))
      exp += abc(i)
    }

    cat(streams)
      .pipe(through(
        function (data) {
          res += data
        },
        function () {
          assert.strictEqual(res, exp)
          done()
        })
      )
  })
  it('concatenate thousand file-streams as functions', function (done) {
    const streams = []
    let exp = ''
    let res = ''

    // allocate the stream resource only as needed
    function getStream () {
      return function () {
        return fs.createReadStream(fixture)
      }
    }

    for (let i = 0; i < 1000; i++) {
      streams.push(getStream(i))
      exp += abc()
    }

    cat(streams)
      .pipe(through(
        function (data) {
          res += data
        },
        function () {
          assert.strictEqual(res, exp)
          done()
        })
      )
  })
  it('early end', function (done) {
    const stream1 = new ReadBuffer(abc(1))
    const stream2 = new ReadBuffer(abc(2))
    let res = ''
    const exp = abc(1) + abc(2)

    cat(stream1, stream2)
      .pipe(through(
        function (data, enc, cb) {
          res += data
          cb()
          this.end()
        },
        function () {
          assert.strictEqual(res, exp.substr(0, res.length))
          done()
        })
      )
  })
  it('resulting stream is read only', function () {
    assert.ok(cat().writable === undefined)
    assert.ok(cat().readable === true)
  })
  it('forward errors', function (done) {
    const stream1 = new ReadBuffer(abc(1))
    const stream2 = new ReadBuffer(abc(2))

    cat(stream1, stream2)
      .on('error', function (err) {
        assert.ok(err instanceof Error)
        done()
      })

    stream1.emit('error', new Error())
  })
  it('quick push streams', function (done) {
    const stream1 = through()
    const stream2 = through()
    let res = ''
    const exp = abc(1) + abc(2)

    cat(stream1, stream2)
      .pipe(through(
        function (data) {
          res += data
        },
        function () {
          assert.strictEqual(res, exp)
          done()
        })
      )
    stream2.write(abc(2))
    stream1.write(abc(1))
    stream1.end()
    stream2.end()
  })
})
