
const assert = require('assert')
const fsp = require('fs-promise')
const wrap = require('co').wrap;
const path = require('path')
const webpack = require('../index.js')

describe('riottag-loader', function() {

  const expectedDir =  path.join(__dirname, 'compiled')
  const tagDir =  path.join(__dirname, 'tag')

  function normalize(str) {
    const string = str.trim()
    console.log(str);
    // return str.trim().replace(/[/\\n\r]+/g, '')
  }

  function getFile(name) {
    return fsp.readFile(path.join(expectedDir, name), 'utf8')
      .then(res => normalize(res))
  }

  function tagFiles(name) {
    return fsp.readFile(path.join(tagDir, name), 'utf-8')
      .then(res => webpack(normalize(res)))
  }

  it('returns the file', wrap(function* () {
    const filename = 'another-ext.js'
    assert.equal(yield getFile(filename), yield tagFiles(filename))
  }));
});
