
var compiler = require('riot-compiler');
var loaderUtils = require('loader-utils');

module.exports = function(source) {

  if(this.cacheable) this.cacheable();

  if(Object.prototype.hasOwnProperty.call(this, 'riottag-loader')) {
    var opts = loaderUtils.getLoaderConfig(this, 'riottag-loader');
  }

  try {
    return compiler.compile(source, opts, this.resourcePath);
  } catch (error) {
    if (!error) return;
    if (this && this.emitError) this.emitError()
  }

}
