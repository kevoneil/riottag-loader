
var compiler = require('riot-compiler');
var loaderUtils = require('loader-utils');

module.exports = function riot(source) {

  if(this.cacheable) this.cacheable();

  if (loaderUtils.parseQuery().length > 0) {
    var opts = loaderUtils.getLoaderConfig(this, 'riottag-loader');
  }

  try {
    return compiler.compile(source, opts, this.resourcePath);
  } catch (error) {
    if (!error) return;
    this.emitError()
  }
}
