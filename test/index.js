
const assert = require('assert')
const fsp = require('fs-promise')
const wrap = require('co').wrap;
const path = require('path')
const webpack = require('../index.js')

describe('riottag-loader', function() {

  const compiledDir =  path.join(__dirname, 'compiled')
  const tagDir =  path.join(__dirname, 'tag')

  function normalize(str) {
    return str.trim().replace(/[/\\n\r]+/g, '')
  }

  //NOTE: figure out why it won't trim
  function getFile(name) {
    return fsp.readFile(path.join(compiledDir, name), 'utf8')
      .then(res => console.log(res))
  }

  function tagFiles(name) {
    return fsp.readFile(path.join(tagDir, name), {encoding:'utf8'})
      .then(res => webpack(normalize(res)))
  }

  it('returns the file', wrap(function* () {
    const filename = 'another-ext.js'
    assert.equal(yield getFile(filename), yield tagFiles(filename))
  }));
});
