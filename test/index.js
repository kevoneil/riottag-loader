const path = require('path')
const wrap = require('co').wrap;
const assert = require('assert')
const fsp = require('fs-promise')
const loaderFile = require('./../index')
const assign = require('object-assign')

const webpackContext = {
  cacheable: false,
  exec: {},
}

const loader = loaderFile.bind(webpackContext)

describe('riottag-loader', function() {

  const expectDir =  path.join(__dirname, 'compiled')
  const fixturesDir =  path.join(__dirname, 'tag')

  function normalize(str) {
    return str.trim().replace(/[\n\r]+/g, '')
  }

  function expectFiles(name) {
    return fsp.readFile(path.join(expectDir, name), 'utf8')
      .then(res => normalize(res))
  }

  function fixtureFiles(name, opts) {
    return fsp.readFile(path.join(fixturesDir, name), 'utf8')
      .then(s => {
        return loader.call(assign({}, webpackContext), s)
      })
      .then(s => normalize(s))
  }

  it('returns the file', wrap(function* () {
    const filename = 'another-ext'
    const test = yield fixtureFiles(`${filename}.html`)
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.html`)
    )
  }));
});
