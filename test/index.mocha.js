/**
 * @copyright 2015 commenthol
 * @license MIT
 */

'use strict'

var assert = require('assert')
var fs = require('fs')
var path = require('path')
var Through = require('streamss').Through
var ReadBuffer = require('streamss').ReadBuffer
var cat = require('../')

var fixture = path.resolve(__dirname, 'fixtures/abcdef.txt')

/* globals describe, it */

function abc (cnt) {
  return 'abcdefghi' + (cnt === undefined ? '' : cnt) + '\n'
}

describe('#cat', function () {
  it('concatenate one stream', function (done) {
    var stream = new ReadBuffer(abc(0))
    var res = []

    cat(stream)
      .pipe(Through(
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
    var stream1 = new ReadBuffer(abc(1))
    var stream2 = new ReadBuffer(abc(2))
    var stream3 = new ReadBuffer(abc(3))
    var exp = abc(1) + abc(2) + abc(3)
    var res = ''

    cat(stream1, stream2, stream3)
      .pipe(Through(
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
    var streams = []
    var exp = ''
    var res = ''

    for (var i = 0; i < 4; i++) {
      streams.push(new ReadBuffer(abc(i)))
      exp += abc(i)
    }

    cat(streams)
      .pipe(Through(
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
    var streams = []
    var exp = ''
    var res = ''

    // allocate the stream resource only as needed
    function getStream (i) {
      return function () {
        return new ReadBuffer(abc(i))
      }
    }

    for (var i = 0; i < 1000; i++) {
      streams.push(getStream(i))
      exp += abc(i)
    }

    cat(streams)
      .pipe(Through(
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
    var streams = []
    var exp = ''
    var res = ''

    // allocate the stream resource only as needed
    function getStream () {
      return function () {
        return fs.createReadStream(fixture)
      }
    }

    for (var i = 0; i < 1000; i++) {
      streams.push(getStream(i))
      exp += abc()
    }

    cat(streams)
      .pipe(Through(
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
    var stream1 = new ReadBuffer(abc(1))
    var stream2 = new ReadBuffer(abc(2))
    var res = ''
    var exp = abc(1) + abc(2)

    cat(stream1, stream2)
      .pipe(Through(
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
    var stream1 = new ReadBuffer(abc(1))
    var stream2 = new ReadBuffer(abc(2))

    cat(stream1, stream2)
      .on('error', function (err) {
        assert.ok(err instanceof Error)
        done()
      })

    stream1.emit('error', new Error())
  })
  it('quick push streams', function (done) {
    var stream1 = Through()
    var stream2 = Through()
    var res = ''
    var exp = abc(1) + abc(2)

    cat(stream1, stream2)
      .pipe(Through(
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
