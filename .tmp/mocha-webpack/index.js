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

	/* WEBPACK VAR INJECTION */(function(__dirname) {
	const assert = __webpack_require__(1)
	const fsp = __webpack_require__(2)
	const wrap = __webpack_require__(3).wrap;
	const path = __webpack_require__(4)
	const riot = __webpack_require__(5)

	describe('riottag-loader', function() {

	  const compiledDir =  path.join(__dirname, 'compiled')
	  const tagDir =  path.join(__dirname, 'tag')

	  function normalize(str) {
	    return str.trim().replace(/[\n\r]+/g, '')
	  }

	  //NOTE: figure out why it won't trim
	  function compiledFiles(name) {
	    return fsp.readFile(path.join(compiledDir, name), 'utf8')
	      .then(res => normalize(res))
	  }

	  function tagFiles(name, opts) {
	    return fsp.readFile(path.join(tagDir, name), 'utf-8')
	      .then(res => riot(res))
	  }

	  it('returns the file', wrap(function* () {
	    const filename = 'another-ext.js'
	    assert.equal(yield compiledFiles(filename), yield tagFiles(filename))
	  }));
	});

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("assert");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("fs-promise");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("co");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

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

		module.exports = __webpack_require__(6);

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		module.exports = __webpack_require__(7);

	/***/ }
	/******/ ]);

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("riot-compiler");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("loader-utils");

/***/ }
/******/ ]);