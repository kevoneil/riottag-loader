const path = require('path');
const wrap = require('co').wrap;
const assert = require('assert');
const fsp = require('fs-promise');
const loaderFile = require('./../index');
const assign = require('assign');

const webpackContext = {
  cacheable: false,
  exec: {},
};

describe('riottag-loader', function() {

  const expectDir =  path.join(__dirname, 'compiled');
  const fixturesDir =  path.join(__dirname, 'tag');

  function minify(str) {
    return str.trim().replace(/\s+/g, '');
  }

  function expectFiles(name) {
    return fsp.readFile(path.join(expectDir, name), 'utf8')
      .then(res => minify(res));
  }

  function fixtureFiles(name, opts = {}) {
    const webpack = Object.assign({ query: opts }, webpackContext);
    const loader = loaderFile.bind(webpack);
    return fsp.readFile(path.join(fixturesDir, name), 'utf8')
      .then(s => loader.call(assign({}, webpack), s))
      .then(s => minify(s));
  }

  it('compiles single tag', wrap(function* () {
    const filename = 'first'
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.tag`)
    );
  }));

  it('compiles html files', wrap(function* () {
    const filename = 'another-ext';
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.html`)
    );
  }));

  it('compiles multiple tags', wrap(function* () {
    const filename = 'multiple';
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.tag`)
    );
  }));

  it('skips css', wrap(function* () {
    const filename = 'multiple';
    const opts = { exclude: ['css'] }
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.tag`, opts)
    );
  }));

  it('works with es6 in tag', wrap(function* () {
    const filename = 'es6-in-tag';
    assert.equal(
      yield expectFiles(`${filename}.js`),
      yield fixtureFiles(`${filename}.tag`)
    );
  }));
});
