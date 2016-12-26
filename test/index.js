
var assert = require('assert')
var fsp = require('fs-promise')
var path = require('path')

describe('riottag-loader', function() {

  const compiledDir =  path.join(__dirname, 'compiled')
  const tagDir =  path.join(__dirname, 'tag')

  function normalize(str) {
    return str.trim().replace(/[\n\r]+/g, '')
  }

  function getFile(name) {
    const test = fsp.readFile(compiledDir, 'utf8')
    return test.then(res => res)
  }

  it('returns the file', () => {
    assert.equal(getFile(), 1);
  });
});
