
var compiler = require('riot-compiler');

module.exports = function(source) {

  this.cacheable();

  return compiler.compile(source);

}
