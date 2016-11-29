
var compiler = require('riot-compiler');
var loaderUtils = require('loader-utils');

module.exports = function(source) {

  var opts = loaderUtils.getLoaderConfig(this, "riottag-loader");

  this.cacheable();

  try {
    return compiler.compile(source, opts, this.resourcePath);
  } catch (error) {
    throw new Error(error);
  }

}
