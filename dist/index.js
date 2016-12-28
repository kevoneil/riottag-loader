/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	var compiler = __webpack_require__(1);
	var loaderUtils = __webpack_require__(2);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("riot-compiler");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("loader-utils");

/***/ }
/******/ ]);