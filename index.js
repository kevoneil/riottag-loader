
var compiler = require('riot-compiler');
var loaderUtils = require('loader-utils');

module.exports = function (source) {

  if(this.cacheable) this.cacheable();

  var opts = loaderUtils.parseQuery(this.query);

  try {
    return compiler.compile(source, opts, this.resourcePath);
  } catch (err) {
    if (!err) return;
    this.emitError()
  }
}
