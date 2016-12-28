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

  function minify(str) {
    return str.trim().replace(/\s+/g, '')
  }

  function expectFiles(name) {
    return fsp.readFile(path.join(expectDir, name), 'utf8')
      .then(res => minify(res))
  }

  function fixtureFiles(name, opts) {
    return fsp.readFile(path.join(fixturesDir, name), 'utf8')
      .then(s => {
        return loader.call(assign({}, webpackContext), s)
      })
      .then(s => minify(s))
  }

  it('compiles simple tag', wrap(function* () {
    const filename = 'first'
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.tag`)
    )
  }));

  it('compiles html files', wrap(function* () {
    const filename = 'another-ext'
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.html`)
    )
  }));

  it('compiles multiple tags', wrap(function* () {
    const filename = 'multiple'
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.tag`)
    )
  }));
});
