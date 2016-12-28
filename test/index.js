
const path = require('path')
const wrap = require('co').wrap;
const assert = require('assert')
const fsp = require('fs-promise')
const riot = require('./../index')

describe('riottag-loader', function() {

  const compiledDir =  path.join(__dirname, 'compiled')
  const tagDir =  path.join(__dirname, 'tag')

  function normalize(str) {
    const string = str.trim().replace(/[\n]+/g, '')
    return string.replace(/\\/g, '')
  }

  function compiledFiles(name) {
    return fsp.readFile(path.join(compiledDir, name), 'utf8')
      .then(res => normalize(res))
  }

  function tagFiles(name, opts) {
    return fsp.readFile(path.join(tagDir, name), 'utf8')
      .then(res => riot(res))
      .then(res => normalize(res))
  }

  it('returns the file', wrap(function* () {
    const filename = 'another-ext'
    assert.equal(
      yield compiledFiles(`${filename}.js`),
      yield tagFiles(`${filename}.html`)
    )
  }));
});
