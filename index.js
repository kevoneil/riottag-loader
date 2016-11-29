
var compiler = require('riot-compiler');
var loaderUtils = require('loader-utils');

module.exports = function(source) {

  if(this.cacheable) this.cacheable();

  var opts = loaderUtils.getLoaderConfig(this, 'riottag-loader');

  try {
    return compiler.compile(source, opts, this.resourcePath);
  } catch (error) {
    if (!error) return;
    this.emitError()
  }

}
