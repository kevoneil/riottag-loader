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
	const path = __webpack_require__(1)
	const wrap = __webpack_require__(3).wrap;
	const assert = __webpack_require__(4)
	const fsp = __webpack_require__(8)
	const riot = __webpack_require__(80)

	describe('riottag-loader', function() {

	  const compiledDir =  path.join(__dirname, 'compiled')
	  const tagDir =  path.join(__dirname, 'tag')

	  function normalize(str) {
	    const string = str.trim().replace(/[\n]+/g, '')
	    return string.replace(/\\/g, '')
	  }

	  function compiledFiles(name) {
	    return fsp.readFile(path.join(compiledDir, name), 'utf8')
	      .then(res => normalize(res))
	  }

	  function tagFiles(name, opts) {
	    return fsp.readFile(path.join(tagDir, name), 'utf-8')
	      .then(res => res)
	  }

	  it('returns the file', wrap(function* () {
	    const filename = 'another-ext.js'
	    assert.equal(yield compiledFiles(filename), yield tagFiles(filename))
	  }));
	});

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports) {

	
	/**
	 * slice() reference.
	 */

	var slice = Array.prototype.slice;

	/**
	 * Expose `co`.
	 */

	module.exports = co['default'] = co.co = co;

	/**
	 * Wrap the given generator `fn` into a
	 * function that returns a promise.
	 * This is a separate function so that
	 * every `co()` call doesn't create a new,
	 * unnecessary closure.
	 *
	 * @param {GeneratorFunction} fn
	 * @return {Function}
	 * @api public
	 */

	co.wrap = function (fn) {
	  createPromise.__generatorFunction__ = fn;
	  return createPromise;
	  function createPromise() {
	    return co.call(this, fn.apply(this, arguments));
	  }
	};

	/**
	 * Execute the generator function or a generator
	 * and return a promise.
	 *
	 * @param {Function} fn
	 * @return {Promise}
	 * @api public
	 */

	function co(gen) {
	  var ctx = this;
	  var args = slice.call(arguments, 1)

	  // we wrap everything in a promise to avoid promise chaining,
	  // which leads to memory leak errors.
	  // see https://github.com/tj/co/issues/180
	  return new Promise(function(resolve, reject) {
	    if (typeof gen === 'function') gen = gen.apply(ctx, args);
	    if (!gen || typeof gen.next !== 'function') return resolve(gen);

	    onFulfilled();

	    /**
	     * @param {Mixed} res
	     * @return {Promise}
	     * @api private
	     */

	    function onFulfilled(res) {
	      var ret;
	      try {
	        ret = gen.next(res);
	      } catch (e) {
	        return reject(e);
	      }
	      next(ret);
	    }

	    /**
	     * @param {Error} err
	     * @return {Promise}
	     * @api private
	     */

	    function onRejected(err) {
	      var ret;
	      try {
	        ret = gen.throw(err);
	      } catch (e) {
	        return reject(e);
	      }
	      next(ret);
	    }

	    /**
	     * Get the next value in the generator,
	     * return a promise.
	     *
	     * @param {Object} ret
	     * @return {Promise}
	     * @api private
	     */

	    function next(ret) {
	      if (ret.done) return resolve(ret.value);
	      var value = toPromise.call(ctx, ret.value);
	      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
	      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
	        + 'but the following object was passed: "' + String(ret.value) + '"'));
	    }
	  });
	}

	/**
	 * Convert a `yield`ed value into a promise.
	 *
	 * @param {Mixed} obj
	 * @return {Promise}
	 * @api private
	 */

	function toPromise(obj) {
	  if (!obj) return obj;
	  if (isPromise(obj)) return obj;
	  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
	  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
	  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
	  if (isObject(obj)) return objectToPromise.call(this, obj);
	  return obj;
	}

	/**
	 * Convert a thunk to a promise.
	 *
	 * @param {Function}
	 * @return {Promise}
	 * @api private
	 */

	function thunkToPromise(fn) {
	  var ctx = this;
	  return new Promise(function (resolve, reject) {
	    fn.call(ctx, function (err, res) {
	      if (err) return reject(err);
	      if (arguments.length > 2) res = slice.call(arguments, 1);
	      resolve(res);
	    });
	  });
	}

	/**
	 * Convert an array of "yieldables" to a promise.
	 * Uses `Promise.all()` internally.
	 *
	 * @param {Array} obj
	 * @return {Promise}
	 * @api private
	 */

	function arrayToPromise(obj) {
	  return Promise.all(obj.map(toPromise, this));
	}

	/**
	 * Convert an object of "yieldables" to a promise.
	 * Uses `Promise.all()` internally.
	 *
	 * @param {Object} obj
	 * @return {Promise}
	 * @api private
	 */

	function objectToPromise(obj){
	  var results = new obj.constructor();
	  var keys = Object.keys(obj);
	  var promises = [];
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var promise = toPromise.call(this, obj[key]);
	    if (promise && isPromise(promise)) defer(promise, key);
	    else results[key] = obj[key];
	  }
	  return Promise.all(promises).then(function () {
	    return results;
	  });

	  function defer(promise, key) {
	    // predefine the key in the result
	    results[key] = undefined;
	    promises.push(promise.then(function (res) {
	      results[key] = res;
	    }));
	  }
	}

	/**
	 * Check if `obj` is a promise.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isPromise(obj) {
	  return 'function' == typeof obj.then;
	}

	/**
	 * Check if `obj` is a generator.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isGenerator(obj) {
	  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
	}

	/**
	 * Check if `obj` is a generator function.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */
	function isGeneratorFunction(obj) {
	  var constructor = obj.constructor;
	  if (!constructor) return false;
	  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
	  return isGenerator(constructor.prototype);
	}

	/**
	 * Check for plain object.
	 *
	 * @param {Mixed} val
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(val) {
	  return Object == val.constructor;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
	// original notice:

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	function compare(a, b) {
	  if (a === b) {
	    return 0;
	  }

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break;
	    }
	  }

	  if (x < y) {
	    return -1;
	  }
	  if (y < x) {
	    return 1;
	  }
	  return 0;
	}
	function isBuffer(b) {
	  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
	    return global.Buffer.isBuffer(b);
	  }
	  return !!(b != null && b._isBuffer);
	}

	// based on node assert, original notice:

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	var util = __webpack_require__(5);
	var hasOwn = Object.prototype.hasOwnProperty;
	var pSlice = Array.prototype.slice;
	var functionsHaveNames = (function () {
	  return function foo() {}.name === 'foo';
	}());
	function pToString (obj) {
	  return Object.prototype.toString.call(obj);
	}
	function isView(arrbuf) {
	  if (isBuffer(arrbuf)) {
	    return false;
	  }
	  if (typeof global.ArrayBuffer !== 'function') {
	    return false;
	  }
	  if (typeof ArrayBuffer.isView === 'function') {
	    return ArrayBuffer.isView(arrbuf);
	  }
	  if (!arrbuf) {
	    return false;
	  }
	  if (arrbuf instanceof DataView) {
	    return true;
	  }
	  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
	    return true;
	  }
	  return false;
	}
	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	var regex = /\s*function\s+([^\(\s]*)\s*/;
	// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
	function getName(func) {
	  if (!util.isFunction(func)) {
	    return;
	  }
	  if (functionsHaveNames) {
	    return func.name;
	  }
	  var str = func.toString();
	  var match = str.match(regex);
	  return match && match[1];
	}
	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  } else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;

	      // try to strip useless frames
	      var fn_name = getName(stackStartFunction);
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }

	      this.stack = out;
	    }
	  }
	};

	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);

	function truncate(s, n) {
	  if (typeof s === 'string') {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}
	function inspect(something) {
	  if (functionsHaveNames || !util.isFunction(something)) {
	    return util.inspect(something);
	  }
	  var rawname = getName(something);
	  var name = rawname ? ': ' + rawname : '';
	  return '[Function' +  name + ']';
	}
	function getMessage(self) {
	  return truncate(inspect(self.actual), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(inspect(self.expected), 128);
	}

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};

	assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
	  }
	};

	function _deepEqual(actual, expected, strict, memos) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (isBuffer(actual) && isBuffer(expected)) {
	    return compare(actual, expected) === 0;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if ((actual === null || typeof actual !== 'object') &&
	             (expected === null || typeof expected !== 'object')) {
	    return strict ? actual === expected : actual == expected;

	  // If both values are instances of typed arrays, wrap their underlying
	  // ArrayBuffers in a Buffer each to increase performance
	  // This optimization requires the arrays to have the same type as checked by
	  // Object.prototype.toString (aka pToString). Never perform binary
	  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
	  // bit patterns are not identical.
	  } else if (isView(actual) && isView(expected) &&
	             pToString(actual) === pToString(expected) &&
	             !(actual instanceof Float32Array ||
	               actual instanceof Float64Array)) {
	    return compare(new Uint8Array(actual.buffer),
	                   new Uint8Array(expected.buffer)) === 0;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else if (isBuffer(actual) !== isBuffer(expected)) {
	    return false;
	  } else {
	    memos = memos || {actual: [], expected: []};

	    var actualIndex = memos.actual.indexOf(actual);
	    if (actualIndex !== -1) {
	      if (actualIndex === memos.expected.indexOf(expected)) {
	        return true;
	      }
	    }

	    memos.actual.push(actual);
	    memos.expected.push(expected);

	    return objEquiv(actual, expected, strict, memos);
	  }
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b, strict, actualVisitedObjects) {
	  if (a === null || a === undefined || b === null || b === undefined)
	    return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b))
	    return a === b;
	  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
	    return false;
	  var aIsArgs = isArguments(a);
	  var bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b, strict);
	  }
	  var ka = objectKeys(a);
	  var kb = objectKeys(b);
	  var key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length !== kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] !== kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
	      return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	assert.notDeepStrictEqual = notDeepStrictEqual;
	function notDeepStrictEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
	  }
	}


	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  }

	  try {
	    if (actual instanceof expected) {
	      return true;
	    }
	  } catch (e) {
	    // Ignore.  The instanceof check doesn't work for arrow functions.
	  }

	  if (Error.isPrototypeOf(expected)) {
	    return false;
	  }

	  return expected.call({}, actual) === true;
	}

	function _tryBlock(block) {
	  var error;
	  try {
	    block();
	  } catch (e) {
	    error = e;
	  }
	  return error;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (typeof block !== 'function') {
	    throw new TypeError('"block" argument must be a function');
	  }

	  if (typeof expected === 'string') {
	    message = expected;
	    expected = null;
	  }

	  actual = _tryBlock(block);

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  var userProvidedMessage = typeof message === 'string';
	  var isUnwantedException = !shouldThrow && util.isError(actual);
	  var isUnexpectedException = !shouldThrow && actual && !expected;

	  if ((isUnwantedException &&
	      userProvidedMessage &&
	      expectedException(actual, expected)) ||
	      isUnexpectedException) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws(true, block, error, message);
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
	  _throws(false, block, error, message);
	};

	assert.ifError = function(err) { if (err) throw err; };

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(6);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(7);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var mzfs = __webpack_require__(9)
	var fsExtra = __webpack_require__(46)
	var Promise = __webpack_require__(10)
	var thenifyAll = __webpack_require__(44)
	var slice = Array.prototype.slice

	// thenify-all for all fs-extra that make sense to be promises
	var fsExtraKeys = [
	  'copy',
	  'emptyDir',
	  'ensureFile',
	  'ensureDir',
	  'ensureLink',
	  'ensureSymlink',
	  'mkdirs',
	  'move',
	  'outputFile',
	  'outputJson',
	  'readJson',
	  'remove',
	  'writeJson',
	  // aliases
	  'createFile',
	  'createLink',
	  'createSymlink',
	  'emptydir',
	  'mkdirp',
	  'readJSON',
	  'outputJSON',
	  'writeJSON'
	]
	thenifyAll.withCallback(fsExtra, exports, fsExtraKeys)

	// Delegate all normal fs to mz/fs
	// (this overwrites anything proxies directly above)
	var mzKeys = [
	  'rename',
	  'ftruncate',
	  'chown',
	  'fchown',
	  'lchown',
	  'chmod',
	  'fchmod',
	  'stat',
	  'lstat',
	  'fstat',
	  'link',
	  'symlink',
	  'readlink',
	  'realpath',
	  'unlink',
	  'rmdir',
	  'mkdir',
	  'readdir',
	  'close',
	  'open',
	  'utimes',
	  'futimes',
	  'fsync',
	  'write',
	  'read',
	  'readFile',
	  'writeFile',
	  'appendFile',
	  'access',
	  'exists'
	]
	mzKeys.forEach(function(key){
	  exports[key] = mzfs[key]
	})


	// Resolve fs-extra streams as Promise for array
	var streamKeys = [
	  'walk'
	]

	streamKeys.forEach(function(key){
	  exports[key] = function(){
	    var func = fsExtra[key]
	    var args = slice.call(arguments)

	    return new Promise(function(resolve, reject){
	      var stream = func.apply(fsExtra, args)
	      var items = []

	      stream
	        .on('data', function(item){
	          items.push(item)
	        })
	        .on('end', function(){
	          resolve(items)
	        })
	        .on('error', function(error){
	          reject(error)
	        })
	    })
	  }
	})


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	var Promise = __webpack_require__(10)
	var fs
	try {
	  fs = __webpack_require__(13)
	} catch(err) {
	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	}

	var api = [
	  'rename',
	  'ftruncate',
	  'chown',
	  'fchown',
	  'lchown',
	  'chmod',
	  'fchmod',
	  'stat',
	  'lstat',
	  'fstat',
	  'link',
	  'symlink',
	  'readlink',
	  'realpath',
	  'unlink',
	  'rmdir',
	  'mkdir',
	  'readdir',
	  'close',
	  'open',
	  'utimes',
	  'futimes',
	  'fsync',
	  'fdatasync',
	  'write',
	  'read',
	  'readFile',
	  'writeFile',
	  'appendFile',
	  'truncate',
	]

	typeof fs.access === 'function' && api.push('access')
	typeof fs.mkdtemp === 'function' && api.push('mkdtemp')

	__webpack_require__(44).withCallback(fs, exports, api)

	exports.exists = function (filename, callback) {
	  // callback
	  if (typeof callback === 'function') {
	    return fs.stat(filename, function (err) {
	      callback(null, !err);
	    })
	  }
	  // or promise
	  return new Promise(function (resolve) {
	    fs.stat(filename, function (err) {
	      resolve(!err)
	    })
	  })
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11)().Promise


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	module.exports = __webpack_require__(12)(window, loadImplementation)

	/**
	 * Browser specific loadImplementation.  Always uses `window.Promise`
	 *
	 * To register a custom implementation, must register with `Promise` option.
	 */
	function loadImplementation(){
	  if(typeof window.Promise === 'undefined'){
	    throw new Error("any-promise browser requires a polyfill or explicit registration"+
	      " e.g: require('any-promise/register/bluebird')")
	  }
	  return {
	    Promise: window.Promise,
	    implementation: 'window.Promise'
	  }
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict"
	    // global key for user preferred registration
	var REGISTRATION_KEY = '@@any-promise/REGISTRATION',
	    // Prior registration (preferred or detected)
	    registered = null

	/**
	 * Registers the given implementation.  An implementation must
	 * be registered prior to any call to `require("any-promise")`,
	 * typically on application load.
	 *
	 * If called with no arguments, will return registration in
	 * following priority:
	 *
	 * For Node.js:
	 *
	 * 1. Previous registration
	 * 2. global.Promise if node.js version >= 0.12
	 * 3. Auto detected promise based on first sucessful require of
	 *    known promise libraries. Note this is a last resort, as the
	 *    loaded library is non-deterministic. node.js >= 0.12 will
	 *    always use global.Promise over this priority list.
	 * 4. Throws error.
	 *
	 * For Browser:
	 *
	 * 1. Previous registration
	 * 2. window.Promise
	 * 3. Throws error.
	 *
	 * Options:
	 *
	 * Promise: Desired Promise constructor
	 * global: Boolean - Should the registration be cached in a global variable to
	 * allow cross dependency/bundle registration?  (default true)
	 */
	module.exports = function(root, loadImplementation){
	  return function register(implementation, opts){
	    implementation = implementation || null
	    opts = opts || {}
	    // global registration unless explicitly  {global: false} in options (default true)
	    var registerGlobal = opts.global !== false;

	    // load any previous global registration
	    if(registered === null && registerGlobal){
	      registered = root[REGISTRATION_KEY] || null
	    }

	    if(registered !== null
	        && implementation !== null
	        && registered.implementation !== implementation){
	      // Throw error if attempting to redefine implementation
	      throw new Error('any-promise already defined as "'+registered.implementation+
	        '".  You can only register an implementation before the first '+
	        ' call to require("any-promise") and an implementation cannot be changed')
	    }

	    if(registered === null){
	      // use provided implementation
	      if(implementation !== null && typeof opts.Promise !== 'undefined'){
	        registered = {
	          Promise: opts.Promise,
	          implementation: implementation
	        }
	      } else {
	        // require implementation if implementation is specified but not provided
	        registered = loadImplementation(implementation)
	      }

	      if(registerGlobal){
	        // register preference globally in case multiple installations
	        root[REGISTRATION_KEY] = registered
	      }
	    }

	    return registered
	  }
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	var polyfills = __webpack_require__(14)
	var legacy = __webpack_require__(17)
	var queue = []

	var util = __webpack_require__(5)

	function noop () {}

	var debug = noop
	if (util.debuglog)
	  debug = util.debuglog('gfs4')
	else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
	  debug = function() {
	    var m = util.format.apply(util, arguments)
	    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
	    console.error(m)
	  }

	if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
	  process.on('exit', function() {
	    debug(queue)
	    __webpack_require__(4).equal(queue.length, 0)
	  })
	}

	module.exports = patch(__webpack_require__(15))
	if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {
	  module.exports = patch(fs)
	}

	// Always patch fs.close/closeSync, because we want to
	// retry() whenever a close happens *anywhere* in the program.
	// This is essential when multiple graceful-fs instances are
	// in play at the same time.
	module.exports.close =
	fs.close = (function (fs$close) { return function (fd, cb) {
	  return fs$close.call(fs, fd, function (err) {
	    if (!err)
	      retry()

	    if (typeof cb === 'function')
	      cb.apply(this, arguments)
	  })
	}})(fs.close)

	module.exports.closeSync =
	fs.closeSync = (function (fs$closeSync) { return function (fd) {
	  // Note that graceful-fs also retries when fs.closeSync() fails.
	  // Looks like a bug to me, although it's probably a harmless one.
	  var rval = fs$closeSync.apply(fs, arguments)
	  retry()
	  return rval
	}})(fs.closeSync)

	function patch (fs) {
	  // Everything that references the open() function needs to be in here
	  polyfills(fs)
	  fs.gracefulify = patch
	  fs.FileReadStream = ReadStream;  // Legacy name.
	  fs.FileWriteStream = WriteStream;  // Legacy name.
	  fs.createReadStream = createReadStream
	  fs.createWriteStream = createWriteStream
	  var fs$readFile = fs.readFile
	  fs.readFile = readFile
	  function readFile (path, options, cb) {
	    if (typeof options === 'function')
	      cb = options, options = null

	    return go$readFile(path, options, cb)

	    function go$readFile (path, options, cb) {
	      return fs$readFile(path, options, function (err) {
	        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
	          enqueue([go$readFile, [path, options, cb]])
	        else {
	          if (typeof cb === 'function')
	            cb.apply(this, arguments)
	          retry()
	        }
	      })
	    }
	  }

	  var fs$writeFile = fs.writeFile
	  fs.writeFile = writeFile
	  function writeFile (path, data, options, cb) {
	    if (typeof options === 'function')
	      cb = options, options = null

	    return go$writeFile(path, data, options, cb)

	    function go$writeFile (path, data, options, cb) {
	      return fs$writeFile(path, data, options, function (err) {
	        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
	          enqueue([go$writeFile, [path, data, options, cb]])
	        else {
	          if (typeof cb === 'function')
	            cb.apply(this, arguments)
	          retry()
	        }
	      })
	    }
	  }

	  var fs$appendFile = fs.appendFile
	  if (fs$appendFile)
	    fs.appendFile = appendFile
	  function appendFile (path, data, options, cb) {
	    if (typeof options === 'function')
	      cb = options, options = null

	    return go$appendFile(path, data, options, cb)

	    function go$appendFile (path, data, options, cb) {
	      return fs$appendFile(path, data, options, function (err) {
	        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
	          enqueue([go$appendFile, [path, data, options, cb]])
	        else {
	          if (typeof cb === 'function')
	            cb.apply(this, arguments)
	          retry()
	        }
	      })
	    }
	  }

	  var fs$readdir = fs.readdir
	  fs.readdir = readdir
	  function readdir (path, options, cb) {
	    var args = [path]
	    if (typeof options !== 'function') {
	      args.push(options)
	    } else {
	      cb = options
	    }
	    args.push(go$readdir$cb)

	    return go$readdir(args)

	    function go$readdir$cb (err, files) {
	      if (files && files.sort)
	        files.sort()

	      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
	        enqueue([go$readdir, [args]])
	      else {
	        if (typeof cb === 'function')
	          cb.apply(this, arguments)
	        retry()
	      }
	    }
	  }

	  function go$readdir (args) {
	    return fs$readdir.apply(fs, args)
	  }

	  if (process.version.substr(0, 4) === 'v0.8') {
	    var legStreams = legacy(fs)
	    ReadStream = legStreams.ReadStream
	    WriteStream = legStreams.WriteStream
	  }

	  var fs$ReadStream = fs.ReadStream
	  ReadStream.prototype = Object.create(fs$ReadStream.prototype)
	  ReadStream.prototype.open = ReadStream$open

	  var fs$WriteStream = fs.WriteStream
	  WriteStream.prototype = Object.create(fs$WriteStream.prototype)
	  WriteStream.prototype.open = WriteStream$open

	  fs.ReadStream = ReadStream
	  fs.WriteStream = WriteStream

	  function ReadStream (path, options) {
	    if (this instanceof ReadStream)
	      return fs$ReadStream.apply(this, arguments), this
	    else
	      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
	  }

	  function ReadStream$open () {
	    var that = this
	    open(that.path, that.flags, that.mode, function (err, fd) {
	      if (err) {
	        if (that.autoClose)
	          that.destroy()

	        that.emit('error', err)
	      } else {
	        that.fd = fd
	        that.emit('open', fd)
	        that.read()
	      }
	    })
	  }

	  function WriteStream (path, options) {
	    if (this instanceof WriteStream)
	      return fs$WriteStream.apply(this, arguments), this
	    else
	      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
	  }

	  function WriteStream$open () {
	    var that = this
	    open(that.path, that.flags, that.mode, function (err, fd) {
	      if (err) {
	        that.destroy()
	        that.emit('error', err)
	      } else {
	        that.fd = fd
	        that.emit('open', fd)
	      }
	    })
	  }

	  function createReadStream (path, options) {
	    return new ReadStream(path, options)
	  }

	  function createWriteStream (path, options) {
	    return new WriteStream(path, options)
	  }

	  var fs$open = fs.open
	  fs.open = open
	  function open (path, flags, mode, cb) {
	    if (typeof mode === 'function')
	      cb = mode, mode = null

	    return go$open(path, flags, mode, cb)

	    function go$open (path, flags, mode, cb) {
	      return fs$open(path, flags, mode, function (err, fd) {
	        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
	          enqueue([go$open, [path, flags, mode, cb]])
	        else {
	          if (typeof cb === 'function')
	            cb.apply(this, arguments)
	          retry()
	        }
	      })
	    }
	  }

	  return fs
	}

	function enqueue (elem) {
	  debug('ENQUEUE', elem[0].name, elem[1])
	  queue.push(elem)
	}

	function retry () {
	  var elem = queue.shift()
	  if (elem) {
	    debug('RETRY', elem[0].name, elem[1])
	    elem[0].apply(null, elem[1])
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(15)
	var constants = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"constants\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var origCwd = process.cwd
	var cwd = null

	var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

	process.cwd = function() {
	  if (!cwd)
	    cwd = origCwd.call(process)
	  return cwd
	}
	try {
	  process.cwd()
	} catch (er) {}

	var chdir = process.chdir
	process.chdir = function(d) {
	  cwd = null
	  chdir.call(process, d)
	}

	module.exports = patch

	function patch (fs) {
	  // (re-)implement some things that are known busted or missing.

	  // lchmod, broken prior to 0.6.2
	  // back-port the fix here.
	  if (constants.hasOwnProperty('O_SYMLINK') &&
	      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
	    patchLchmod(fs)
	  }

	  // lutimes implementation, or no-op
	  if (!fs.lutimes) {
	    patchLutimes(fs)
	  }

	  // https://github.com/isaacs/node-graceful-fs/issues/4
	  // Chown should not fail on einval or eperm if non-root.
	  // It should not fail on enosys ever, as this just indicates
	  // that a fs doesn't support the intended operation.

	  fs.chown = chownFix(fs.chown)
	  fs.fchown = chownFix(fs.fchown)
	  fs.lchown = chownFix(fs.lchown)

	  fs.chmod = chmodFix(fs.chmod)
	  fs.fchmod = chmodFix(fs.fchmod)
	  fs.lchmod = chmodFix(fs.lchmod)

	  fs.chownSync = chownFixSync(fs.chownSync)
	  fs.fchownSync = chownFixSync(fs.fchownSync)
	  fs.lchownSync = chownFixSync(fs.lchownSync)

	  fs.chmodSync = chmodFixSync(fs.chmodSync)
	  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
	  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

	  fs.stat = statFix(fs.stat)
	  fs.fstat = statFix(fs.fstat)
	  fs.lstat = statFix(fs.lstat)

	  fs.statSync = statFixSync(fs.statSync)
	  fs.fstatSync = statFixSync(fs.fstatSync)
	  fs.lstatSync = statFixSync(fs.lstatSync)

	  // if lchmod/lchown do not exist, then make them no-ops
	  if (!fs.lchmod) {
	    fs.lchmod = function (path, mode, cb) {
	      if (cb) process.nextTick(cb)
	    }
	    fs.lchmodSync = function () {}
	  }
	  if (!fs.lchown) {
	    fs.lchown = function (path, uid, gid, cb) {
	      if (cb) process.nextTick(cb)
	    }
	    fs.lchownSync = function () {}
	  }

	  // on Windows, A/V software can lock the directory, causing this
	  // to fail with an EACCES or EPERM if the directory contains newly
	  // created files.  Try again on failure, for up to 60 seconds.

	  // Set the timeout this long because some Windows Anti-Virus, such as Parity
	  // bit9, may lock files for up to a minute, causing npm package install
	  // failures. Also, take care to yield the scheduler. Windows scheduling gives
	  // CPU to a busy looping process, which can cause the program causing the lock
	  // contention to be starved of CPU by node, so the contention doesn't resolve.
	  if (platform === "win32") {
	    fs.rename = (function (fs$rename) { return function (from, to, cb) {
	      var start = Date.now()
	      var backoff = 0;
	      fs$rename(from, to, function CB (er) {
	        if (er
	            && (er.code === "EACCES" || er.code === "EPERM")
	            && Date.now() - start < 60000) {
	          setTimeout(function() {
	            fs.stat(to, function (stater, st) {
	              if (stater && stater.code === "ENOENT")
	                fs$rename(from, to, CB);
	              else
	                cb(er)
	            })
	          }, backoff)
	          if (backoff < 100)
	            backoff += 10;
	          return;
	        }
	        if (cb) cb(er)
	      })
	    }})(fs.rename)
	  }

	  // if read() returns EAGAIN, then just try it again.
	  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {
	    var callback
	    if (callback_ && typeof callback_ === 'function') {
	      var eagCounter = 0
	      callback = function (er, _, __) {
	        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
	          eagCounter ++
	          return fs$read.call(fs, fd, buffer, offset, length, position, callback)
	        }
	        callback_.apply(this, arguments)
	      }
	    }
	    return fs$read.call(fs, fd, buffer, offset, length, position, callback)
	  }})(fs.read)

	  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
	    var eagCounter = 0
	    while (true) {
	      try {
	        return fs$readSync.call(fs, fd, buffer, offset, length, position)
	      } catch (er) {
	        if (er.code === 'EAGAIN' && eagCounter < 10) {
	          eagCounter ++
	          continue
	        }
	        throw er
	      }
	    }
	  }})(fs.readSync)
	}

	function patchLchmod (fs) {
	  fs.lchmod = function (path, mode, callback) {
	    fs.open( path
	           , constants.O_WRONLY | constants.O_SYMLINK
	           , mode
	           , function (err, fd) {
	      if (err) {
	        if (callback) callback(err)
	        return
	      }
	      // prefer to return the chmod error, if one occurs,
	      // but still try to close, and report closing errors if they occur.
	      fs.fchmod(fd, mode, function (err) {
	        fs.close(fd, function(err2) {
	          if (callback) callback(err || err2)
	        })
	      })
	    })
	  }

	  fs.lchmodSync = function (path, mode) {
	    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

	    // prefer to return the chmod error, if one occurs,
	    // but still try to close, and report closing errors if they occur.
	    var threw = true
	    var ret
	    try {
	      ret = fs.fchmodSync(fd, mode)
	      threw = false
	    } finally {
	      if (threw) {
	        try {
	          fs.closeSync(fd)
	        } catch (er) {}
	      } else {
	        fs.closeSync(fd)
	      }
	    }
	    return ret
	  }
	}

	function patchLutimes (fs) {
	  if (constants.hasOwnProperty("O_SYMLINK")) {
	    fs.lutimes = function (path, at, mt, cb) {
	      fs.open(path, constants.O_SYMLINK, function (er, fd) {
	        if (er) {
	          if (cb) cb(er)
	          return
	        }
	        fs.futimes(fd, at, mt, function (er) {
	          fs.close(fd, function (er2) {
	            if (cb) cb(er || er2)
	          })
	        })
	      })
	    }

	    fs.lutimesSync = function (path, at, mt) {
	      var fd = fs.openSync(path, constants.O_SYMLINK)
	      var ret
	      var threw = true
	      try {
	        ret = fs.futimesSync(fd, at, mt)
	        threw = false
	      } finally {
	        if (threw) {
	          try {
	            fs.closeSync(fd)
	          } catch (er) {}
	        } else {
	          fs.closeSync(fd)
	        }
	      }
	      return ret
	    }

	  } else {
	    fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
	    fs.lutimesSync = function () {}
	  }
	}

	function chmodFix (orig) {
	  if (!orig) return orig
	  return function (target, mode, cb) {
	    return orig.call(fs, target, mode, function (er) {
	      if (chownErOk(er)) er = null
	      if (cb) cb.apply(this, arguments)
	    })
	  }
	}

	function chmodFixSync (orig) {
	  if (!orig) return orig
	  return function (target, mode) {
	    try {
	      return orig.call(fs, target, mode)
	    } catch (er) {
	      if (!chownErOk(er)) throw er
	    }
	  }
	}


	function chownFix (orig) {
	  if (!orig) return orig
	  return function (target, uid, gid, cb) {
	    return orig.call(fs, target, uid, gid, function (er) {
	      if (chownErOk(er)) er = null
	      if (cb) cb.apply(this, arguments)
	    })
	  }
	}

	function chownFixSync (orig) {
	  if (!orig) return orig
	  return function (target, uid, gid) {
	    try {
	      return orig.call(fs, target, uid, gid)
	    } catch (er) {
	      if (!chownErOk(er)) throw er
	    }
	  }
	}


	function statFix (orig) {
	  if (!orig) return orig
	  // Older versions of Node erroneously returned signed integers for
	  // uid + gid.
	  return function (target, cb) {
	    return orig.call(fs, target, function (er, stats) {
	      if (!stats) return cb.apply(this, arguments)
	      if (stats.uid < 0) stats.uid += 0x100000000
	      if (stats.gid < 0) stats.gid += 0x100000000
	      if (cb) cb.apply(this, arguments)
	    })
	  }
	}

	function statFixSync (orig) {
	  if (!orig) return orig
	  // Older versions of Node erroneously returned signed integers for
	  // uid + gid.
	  return function (target) {
	    var stats = orig.call(fs, target)
	    if (stats.uid < 0) stats.uid += 0x100000000
	    if (stats.gid < 0) stats.gid += 0x100000000
	    return stats;
	  }
	}

	// ENOSYS means that the fs doesn't support the op. Just ignore
	// that, because it doesn't matter.
	//
	// if there's no getuid, or if getuid() is something other
	// than 0, and the error is EINVAL or EPERM, then just ignore
	// it.
	//
	// This specific case is a silent failure in cp, install, tar,
	// and most other unix tools that manage permissions.
	//
	// When running as root, or if other types of errors are
	// encountered, then it's strict.
	function chownErOk (er) {
	  if (!er)
	    return true

	  if (er.code === "ENOSYS")
	    return true

	  var nonroot = !process.getuid || process.getuid() !== 0
	  if (nonroot) {
	    if (er.code === "EINVAL" || er.code === "EPERM")
	      return true
	  }

	  return false
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	module.exports = clone(fs)

	function clone (obj) {
	  if (obj === null || typeof obj !== 'object')
	    return obj

	  if (obj instanceof Object)
	    var copy = { __proto__: obj.__proto__ }
	  else
	    var copy = Object.create(null)

	  Object.getOwnPropertyNames(obj).forEach(function (key) {
	    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
	  })

	  return copy
	}


/***/ },
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var Stream = __webpack_require__(18).Stream

	module.exports = legacy

	function legacy (fs) {
	  return {
	    ReadStream: ReadStream,
	    WriteStream: WriteStream
	  }

	  function ReadStream (path, options) {
	    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

	    Stream.call(this);

	    var self = this;

	    this.path = path;
	    this.fd = null;
	    this.readable = true;
	    this.paused = false;

	    this.flags = 'r';
	    this.mode = 438; /*=0666*/
	    this.bufferSize = 64 * 1024;

	    options = options || {};

	    // Mixin options into this
	    var keys = Object.keys(options);
	    for (var index = 0, length = keys.length; index < length; index++) {
	      var key = keys[index];
	      this[key] = options[key];
	    }

	    if (this.encoding) this.setEncoding(this.encoding);

	    if (this.start !== undefined) {
	      if ('number' !== typeof this.start) {
	        throw TypeError('start must be a Number');
	      }
	      if (this.end === undefined) {
	        this.end = Infinity;
	      } else if ('number' !== typeof this.end) {
	        throw TypeError('end must be a Number');
	      }

	      if (this.start > this.end) {
	        throw new Error('start must be <= end');
	      }

	      this.pos = this.start;
	    }

	    if (this.fd !== null) {
	      process.nextTick(function() {
	        self._read();
	      });
	      return;
	    }

	    fs.open(this.path, this.flags, this.mode, function (err, fd) {
	      if (err) {
	        self.emit('error', err);
	        self.readable = false;
	        return;
	      }

	      self.fd = fd;
	      self.emit('open', fd);
	      self._read();
	    })
	  }

	  function WriteStream (path, options) {
	    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

	    Stream.call(this);

	    this.path = path;
	    this.fd = null;
	    this.writable = true;

	    this.flags = 'w';
	    this.encoding = 'binary';
	    this.mode = 438; /*=0666*/
	    this.bytesWritten = 0;

	    options = options || {};

	    // Mixin options into this
	    var keys = Object.keys(options);
	    for (var index = 0, length = keys.length; index < length; index++) {
	      var key = keys[index];
	      this[key] = options[key];
	    }

	    if (this.start !== undefined) {
	      if ('number' !== typeof this.start) {
	        throw TypeError('start must be a Number');
	      }
	      if (this.start < 0) {
	        throw new Error('start must be >= zero');
	      }

	      this.pos = this.start;
	    }

	    this.busy = false;
	    this._queue = [];

	    if (this.fd === null) {
	      this._open = fs.open;
	      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
	      this.flush();
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	module.exports = Stream;

	var EE = __webpack_require__(19).EventEmitter;
	var inherits = __webpack_require__(20);

	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(21);
	Stream.Writable = __webpack_require__(40);
	Stream.Duplex = __webpack_require__(41);
	Stream.Transform = __webpack_require__(42);
	Stream.PassThrough = __webpack_require__(43);

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;



	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EE.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 20 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var Stream = (function (){
	  try {
	    return __webpack_require__(18); // hack to fix a circular dependency issue when used with browserify
	  } catch(_){}
	}());
	exports = module.exports = __webpack_require__(22);
	exports.Stream = Stream || exports;
	exports.Readable = exports;
	exports.Writable = __webpack_require__(33);
	exports.Duplex = __webpack_require__(32);
	exports.Transform = __webpack_require__(38);
	exports.PassThrough = __webpack_require__(39);

	if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
	  module.exports = Stream;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	module.exports = Readable;

	/*<replacement>*/
	var processNextTick = __webpack_require__(23);
	/*</replacement>*/

	/*<replacement>*/
	var isArray = __webpack_require__(24);
	/*</replacement>*/

	/*<replacement>*/
	var Duplex;
	/*</replacement>*/

	Readable.ReadableState = ReadableState;

	/*<replacement>*/
	var EE = __webpack_require__(19).EventEmitter;

	var EElistenerCount = function (emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	/*<replacement>*/
	var Stream;
	(function () {
	  try {
	    Stream = __webpack_require__(18);
	  } catch (_) {} finally {
	    if (!Stream) Stream = __webpack_require__(19).EventEmitter;
	  }
	})();
	/*</replacement>*/

	var Buffer = __webpack_require__(25).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(28);
	/*</replacement>*/

	/*<replacement>*/
	var util = __webpack_require__(29);
	util.inherits = __webpack_require__(20);
	/*</replacement>*/

	/*<replacement>*/
	var debugUtil = __webpack_require__(30);
	var debug = void 0;
	if (debugUtil && debugUtil.debuglog) {
	  debug = debugUtil.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/

	var BufferList = __webpack_require__(31);
	var StringDecoder;

	util.inherits(Readable, Stream);

	function prependListener(emitter, event, fn) {
	  // Sadly this is not cacheable as some libraries bundle their own
	  // event emitter implementation with them.
	  if (typeof emitter.prependListener === 'function') {
	    return emitter.prependListener(event, fn);
	  } else {
	    // This is a hack to make sure that our error handler is attached before any
	    // userland ones.  NEVER DO THIS. This is here only because this code needs
	    // to continue to work with older versions of Node.js that do not include
	    // the prependListener() method. The goal is to eventually remove this hack.
	    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
	  }
	}

	function ReadableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(32);

	  options = options || {};

	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  // A linked list is used to store data chunks instead of an array because the
	  // linked list can remove elements from the beginning faster than
	  // array.shift()
	  this.buffer = new BufferList();
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	  this.resumeScheduled = false;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder) StringDecoder = __webpack_require__(37).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable(options) {
	  Duplex = Duplex || __webpack_require__(32);

	  if (!(this instanceof Readable)) return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  if (options && typeof options.read === 'function') this._read = options.read;

	  Stream.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;

	  if (!state.objectMode && typeof chunk === 'string') {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = bufferShim.from(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function (chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	Readable.prototype.isPaused = function () {
	  return this._readableState.flowing === false;
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null) {
	    state.reading = false;
	    onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var _e = new Error('stream.unshift() after end event');
	      stream.emit('error', _e);
	    } else {
	      var skipAdd;
	      if (state.decoder && !addToFront && !encoding) {
	        chunk = state.decoder.write(chunk);
	        skipAdd = !state.objectMode && chunk.length === 0;
	      }

	      if (!addToFront) state.reading = false;

	      // Don't add to the buffer if we've decoded to an empty string chunk and
	      // we're not in object mode
	      if (!skipAdd) {
	        // if we want the data now, just emit it.
	        if (state.flowing && state.length === 0 && !state.sync) {
	          stream.emit('data', chunk);
	          stream.read(0);
	        } else {
	          // update the buffer info.
	          state.length += state.objectMode ? 1 : chunk.length;
	          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

	          if (state.needReadable) emitReadable(stream);
	        }
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}

	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  if (!StringDecoder) StringDecoder = __webpack_require__(37).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 8MB
	var MAX_HWM = 0x800000;
	function computeNewHighWaterMark(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2 to prevent increasing hwm excessively in
	    // tiny amounts
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n;
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead(n, state) {
	  if (n <= 0 || state.length === 0 && state.ended) return 0;
	  if (state.objectMode) return 1;
	  if (n !== n) {
	    // Only flow one buffer at a time
	    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
	  }
	  // If we're asking for more than the current hwm, then raise the hwm.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	  if (n <= state.length) return n;
	  // Don't have enough
	  if (!state.ended) {
	    state.needReadable = true;
	    return 0;
	  }
	  return state.length;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug('read', n);
	  n = parseInt(n, 10);
	  var state = this._readableState;
	  var nOrig = n;

	  if (n !== 0) state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  } else if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (!state.reading) n = howMuchToRead(nOrig, state);
	  }

	  var ret;
	  if (n > 0) ret = fromList(n, state);else ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  } else {
	    state.length -= n;
	  }

	  if (state.length === 0) {
	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (!state.ended) state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended) endReadable(this);
	  }

	  if (ret !== null) this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}

	function onEofChunk(stream, state) {
	  if (state.ended) return;
	  if (state.decoder) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}

	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    processNextTick(maybeReadMore_, stream, state);
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  this.emit('error', new Error('_read() is not implemented'));
	};

	Readable.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  var cleanedUp = false;
	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    cleanedUp = true;

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }

	  // If the user pushes more data while we're writing to dest then we'll end up
	  // in ondata again. However, we only want to increase awaitDrain once because
	  // dest will only emit one 'drain' event for the multiple writes.
	  // => Introduce a guard on increasing awaitDrain.
	  var increasedAwaitDrain = false;
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    increasedAwaitDrain = false;
	    var ret = dest.write(chunk);
	    if (false === ret && !increasedAwaitDrain) {
	      // If the user unpiped during `dest.write()`, it is possible
	      // to get stuck in a permanently paused state if that write
	      // also returned false.
	      // => Check whether `dest` is still a piping destination.
	      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
	        debug('false write response, pause', src._readableState.awaitDrain);
	        src._readableState.awaitDrain++;
	        increasedAwaitDrain = true;
	      }
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
	  }

	  // Make sure our error handler is attached before userland ones.
	  prependListener(dest, 'error', onerror);

	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function () {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}

	Readable.prototype.unpipe = function (dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;

	    if (!dest) dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var i = 0; i < len; i++) {
	      dests[i].emit('unpipe', this);
	    }return this;
	  }

	  // try to find the right one.
	  var index = indexOf(state.pipes, dest);
	  if (index === -1) return this;

	  state.pipes.splice(index, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function (ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);

	  if (ev === 'data') {
	    // Start flowing on next tick if stream isn't explicitly paused
	    if (this._readableState.flowing !== false) this.resume();
	  } else if (ev === 'readable') {
	    var state = this._readableState;
	    if (!state.endEmitted && !state.readableListening) {
	      state.readableListening = state.needReadable = true;
	      state.emittedReadable = false;
	      if (!state.reading) {
	        processNextTick(nReadingNextTick, this);
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	function nReadingNextTick(self) {
	  debug('readable nexttick read 0');
	  self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    processNextTick(resume_, stream, state);
	  }
	}

	function resume_(stream, state) {
	  if (!state.reading) {
	    debug('resume read 0');
	    stream.read(0);
	  }

	  state.resumeScheduled = false;
	  state.awaitDrain = 0;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}

	Readable.prototype.pause = function () {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  while (state.flowing && stream.read() !== null) {}
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function () {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function (chunk) {
	    debug('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function (ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};

	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList(n, state) {
	  // nothing buffered
	  if (state.length === 0) return null;

	  var ret;
	  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
	    // read it all, truncate the list
	    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
	    state.buffer.clear();
	  } else {
	    // read part of list
	    ret = fromListPartial(n, state.buffer, state.decoder);
	  }

	  return ret;
	}

	// Extracts only enough buffered data to satisfy the amount requested.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromListPartial(n, list, hasStrings) {
	  var ret;
	  if (n < list.head.data.length) {
	    // slice is the same for buffers and strings
	    ret = list.head.data.slice(0, n);
	    list.head.data = list.head.data.slice(n);
	  } else if (n === list.head.data.length) {
	    // first chunk is a perfect match
	    ret = list.shift();
	  } else {
	    // result spans more than one buffer
	    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
	  }
	  return ret;
	}

	// Copies a specified amount of characters from the list of buffered data
	// chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBufferString(n, list) {
	  var p = list.head;
	  var c = 1;
	  var ret = p.data;
	  n -= ret.length;
	  while (p = p.next) {
	    var str = p.data;
	    var nb = n > str.length ? str.length : n;
	    if (nb === str.length) ret += str;else ret += str.slice(0, n);
	    n -= nb;
	    if (n === 0) {
	      if (nb === str.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = str.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	// Copies a specified amount of bytes from the list of buffered data chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBuffer(n, list) {
	  var ret = bufferShim.allocUnsafe(n);
	  var p = list.head;
	  var c = 1;
	  p.data.copy(ret);
	  n -= p.data.length;
	  while (p = p.next) {
	    var buf = p.data;
	    var nb = n > buf.length ? buf.length : n;
	    buf.copy(ret, ret.length - n, 0, nb);
	    n -= nb;
	    if (n === 0) {
	      if (nb === buf.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = buf.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    processNextTick(endReadableNT, state, stream);
	  }
	}

	function endReadableNT(state, stream) {
	  // Check that we didn't get one last unshift.
	  if (!state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.readable = false;
	    stream.emit('end');
	  }
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	if (!process.version ||
	    process.version.indexOf('v0.') === 0 ||
	    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
	  module.exports = nextTick;
	} else {
	  module.exports = process.nextTick;
	}

	function nextTick(fn, arg1, arg2, arg3) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('"callback" argument must be a function');
	  }
	  var len = arguments.length;
	  var args, i;
	  switch (len) {
	  case 0:
	  case 1:
	    return process.nextTick(fn);
	  case 2:
	    return process.nextTick(function afterTickOne() {
	      fn.call(null, arg1);
	    });
	  case 3:
	    return process.nextTick(function afterTickTwo() {
	      fn.call(null, arg1, arg2);
	    });
	  case 4:
	    return process.nextTick(function afterTickThree() {
	      fn.call(null, arg1, arg2, arg3);
	    });
	  default:
	    args = new Array(len - 1);
	    i = 0;
	    while (i < args.length) {
	      args[i++] = arguments[i];
	    }
	    return process.nextTick(function afterTick() {
	      fn.apply(null, args);
	    });
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 24 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(26)
	var ieee754 = __webpack_require__(27)
	var isArray = __webpack_require__(24)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()

	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192 // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}

	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)

	  var actual = that.write(string, encoding)

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len)
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8'

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true

	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0

	  if (this === target) return 0

	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)

	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }

	  return len
	}

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0

	  if (!val) val = 0

	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }

	  return this
	}

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict'

	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray

	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}

	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63

	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}

	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr(len * 3 / 4 - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }

	  parts.push(output)

	  return parts.join('')
	}


/***/ },
/* 27 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var buffer = __webpack_require__(25);
	var Buffer = buffer.Buffer;
	var SlowBuffer = buffer.SlowBuffer;
	var MAX_LEN = buffer.kMaxLength || 2147483647;
	exports.alloc = function alloc(size, fill, encoding) {
	  if (typeof Buffer.alloc === 'function') {
	    return Buffer.alloc(size, fill, encoding);
	  }
	  if (typeof encoding === 'number') {
	    throw new TypeError('encoding must not be number');
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size > MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  var enc = encoding;
	  var _fill = fill;
	  if (_fill === undefined) {
	    enc = undefined;
	    _fill = 0;
	  }
	  var buf = new Buffer(size);
	  if (typeof _fill === 'string') {
	    var fillBuf = new Buffer(_fill, enc);
	    var flen = fillBuf.length;
	    var i = -1;
	    while (++i < size) {
	      buf[i] = fillBuf[i % flen];
	    }
	  } else {
	    buf.fill(_fill);
	  }
	  return buf;
	}
	exports.allocUnsafe = function allocUnsafe(size) {
	  if (typeof Buffer.allocUnsafe === 'function') {
	    return Buffer.allocUnsafe(size);
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size > MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  return new Buffer(size);
	}
	exports.from = function from(value, encodingOrOffset, length) {
	  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
	    return Buffer.from(value, encodingOrOffset, length);
	  }
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number');
	  }
	  if (typeof value === 'string') {
	    return new Buffer(value, encodingOrOffset);
	  }
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    var offset = encodingOrOffset;
	    if (arguments.length === 1) {
	      return new Buffer(value);
	    }
	    if (typeof offset === 'undefined') {
	      offset = 0;
	    }
	    var len = length;
	    if (typeof len === 'undefined') {
	      len = value.byteLength - offset;
	    }
	    if (offset >= value.byteLength) {
	      throw new RangeError('\'offset\' is out of bounds');
	    }
	    if (len > value.byteLength - offset) {
	      throw new RangeError('\'length\' is out of bounds');
	    }
	    return new Buffer(value.slice(offset, offset + len));
	  }
	  if (Buffer.isBuffer(value)) {
	    var out = new Buffer(value.length);
	    value.copy(out, 0, 0, value.length);
	    return out;
	  }
	  if (value) {
	    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
	      return new Buffer(value);
	    }
	    if (value.type === 'Buffer' && Array.isArray(value.data)) {
	      return new Buffer(value.data);
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
	}
	exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
	  if (typeof Buffer.allocUnsafeSlow === 'function') {
	    return Buffer.allocUnsafeSlow(size);
	  }
	  if (typeof size !== 'number') {
	    throw new TypeError('size must be a number');
	  }
	  if (size >= MAX_LEN) {
	    throw new RangeError('size is too large');
	  }
	  return new SlowBuffer(size);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.

	function isArray(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = Buffer.isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 30 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Buffer = __webpack_require__(25).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(28);
	/*</replacement>*/

	module.exports = BufferList;

	function BufferList() {
	  this.head = null;
	  this.tail = null;
	  this.length = 0;
	}

	BufferList.prototype.push = function (v) {
	  var entry = { data: v, next: null };
	  if (this.length > 0) this.tail.next = entry;else this.head = entry;
	  this.tail = entry;
	  ++this.length;
	};

	BufferList.prototype.unshift = function (v) {
	  var entry = { data: v, next: this.head };
	  if (this.length === 0) this.tail = entry;
	  this.head = entry;
	  ++this.length;
	};

	BufferList.prototype.shift = function () {
	  if (this.length === 0) return;
	  var ret = this.head.data;
	  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
	  --this.length;
	  return ret;
	};

	BufferList.prototype.clear = function () {
	  this.head = this.tail = null;
	  this.length = 0;
	};

	BufferList.prototype.join = function (s) {
	  if (this.length === 0) return '';
	  var p = this.head;
	  var ret = '' + p.data;
	  while (p = p.next) {
	    ret += s + p.data;
	  }return ret;
	};

	BufferList.prototype.concat = function (n) {
	  if (this.length === 0) return bufferShim.alloc(0);
	  if (this.length === 1) return this.head.data;
	  var ret = bufferShim.allocUnsafe(n >>> 0);
	  var p = this.head;
	  var i = 0;
	  while (p) {
	    p.data.copy(ret, i);
	    i += p.data.length;
	    p = p.next;
	  }
	  return ret;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	'use strict';

	/*<replacement>*/

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	};
	/*</replacement>*/

	module.exports = Duplex;

	/*<replacement>*/
	var processNextTick = __webpack_require__(23);
	/*</replacement>*/

	/*<replacement>*/
	var util = __webpack_require__(29);
	util.inherits = __webpack_require__(20);
	/*</replacement>*/

	var Readable = __webpack_require__(22);
	var Writable = __webpack_require__(33);

	util.inherits(Duplex, Readable);

	var keys = objectKeys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
	  var method = keys[v];
	  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	}

	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false) this.readable = false;

	  if (options && options.writable === false) this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  processNextTick(onEndNT, this);
	}

	function onEndNT(self) {
	  self.end();
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// A bit simpler than readable streams.
	// Implement an async ._write(chunk, encoding, cb), and it'll handle all
	// the drain event emission and buffering.

	'use strict';

	module.exports = Writable;

	/*<replacement>*/
	var processNextTick = __webpack_require__(23);
	/*</replacement>*/

	/*<replacement>*/
	var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
	/*</replacement>*/

	/*<replacement>*/
	var Duplex;
	/*</replacement>*/

	Writable.WritableState = WritableState;

	/*<replacement>*/
	var util = __webpack_require__(29);
	util.inherits = __webpack_require__(20);
	/*</replacement>*/

	/*<replacement>*/
	var internalUtil = {
	  deprecate: __webpack_require__(36)
	};
	/*</replacement>*/

	/*<replacement>*/
	var Stream;
	(function () {
	  try {
	    Stream = __webpack_require__(18);
	  } catch (_) {} finally {
	    if (!Stream) Stream = __webpack_require__(19).EventEmitter;
	  }
	})();
	/*</replacement>*/

	var Buffer = __webpack_require__(25).Buffer;
	/*<replacement>*/
	var bufferShim = __webpack_require__(28);
	/*</replacement>*/

	util.inherits(Writable, Stream);

	function nop() {}

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	  this.next = null;
	}

	function WritableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(32);

	  options = options || {};

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  // drain event flag.
	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.bufferedRequest = null;
	  this.lastBufferedRequest = null;

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;

	  // count buffered requests
	  this.bufferedRequestCount = 0;

	  // allocate the first CorkedRequest, there is always
	  // one allocated and free to use, and we maintain at most two
	  this.corkedRequestsFree = new CorkedRequest(this);
	}

	WritableState.prototype.getBuffer = function getBuffer() {
	  var current = this.bufferedRequest;
	  var out = [];
	  while (current) {
	    out.push(current);
	    current = current.next;
	  }
	  return out;
	};

	(function () {
	  try {
	    Object.defineProperty(WritableState.prototype, 'buffer', {
	      get: internalUtil.deprecate(function () {
	        return this.getBuffer();
	      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
	    });
	  } catch (_) {}
	})();

	// Test _writableState for inheritance to account for Duplex streams,
	// whose prototype chain only points to Readable.
	var realHasInstance;
	if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
	  realHasInstance = Function.prototype[Symbol.hasInstance];
	  Object.defineProperty(Writable, Symbol.hasInstance, {
	    value: function (object) {
	      if (realHasInstance.call(this, object)) return true;

	      return object && object._writableState instanceof WritableState;
	    }
	  });
	} else {
	  realHasInstance = function (object) {
	    return object instanceof this;
	  };
	}

	function Writable(options) {
	  Duplex = Duplex || __webpack_require__(32);

	  // Writable ctor is applied to Duplexes, too.
	  // `realHasInstance` is necessary because using plain `instanceof`
	  // would return false, as no `_writableState` property is attached.

	  // Trying to use the custom `instanceof` for Writable here will also break the
	  // Node.js LazyTransform implementation, which has a non-trivial getter for
	  // `_writableState` that would lead to infinite recursion.
	  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
	    return new Writable(options);
	  }

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;

	    if (typeof options.writev === 'function') this._writev = options.writev;
	  }

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe, not readable'));
	};

	function writeAfterEnd(stream, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  processNextTick(cb, er);
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  var er = false;
	  // Always throw error if a null is written
	  // if we are not in object mode then throw
	  // if it is not a buffer, string, or undefined.
	  if (chunk === null) {
	    er = new TypeError('May not write null values to stream');
	  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  if (er) {
	    stream.emit('error', er);
	    processNextTick(cb, er);
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

	  if (typeof cb !== 'function') cb = nop;

	  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function () {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function () {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
	  }
	};

	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
	  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
	  this._writableState.defaultEncoding = encoding;
	  return this;
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
	    chunk = bufferShim.from(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;

	  if (state.writing || state.corked) {
	    var last = state.lastBufferedRequest;
	    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
	    if (last) {
	      last.next = state.lastBufferedRequest;
	    } else {
	      state.bufferedRequest = state.lastBufferedRequest;
	    }
	    state.bufferedRequestCount += 1;
	  } else {
	    doWrite(stream, state, false, len, chunk, encoding, cb);
	  }

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  --state.pendingcb;
	  if (sync) processNextTick(cb, er);else cb(er);

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er) onwriteError(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(state);

	    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      /*<replacement>*/
	      asyncWrite(afterWrite, stream, state, finished, cb);
	      /*</replacement>*/
	    } else {
	        afterWrite(stream, state, finished, cb);
	      }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished) onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}

	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	  var entry = state.bufferedRequest;

	  if (stream._writev && entry && entry.next) {
	    // Fast case, write everything using _writev()
	    var l = state.bufferedRequestCount;
	    var buffer = new Array(l);
	    var holder = state.corkedRequestsFree;
	    holder.entry = entry;

	    var count = 0;
	    while (entry) {
	      buffer[count] = entry;
	      entry = entry.next;
	      count += 1;
	    }

	    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

	    // doWrite is almost always async, defer these to save a bit of time
	    // as the hot path ends with doWrite
	    state.pendingcb++;
	    state.lastBufferedRequest = null;
	    if (holder.next) {
	      state.corkedRequestsFree = holder.next;
	      holder.next = null;
	    } else {
	      state.corkedRequestsFree = new CorkedRequest(state);
	    }
	  } else {
	    // Slow case, write chunks one-by-one
	    while (entry) {
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);
	      entry = entry.next;
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        break;
	      }
	    }

	    if (entry === null) state.lastBufferedRequest = null;
	  }

	  state.bufferedRequestCount = 0;
	  state.bufferedRequest = entry;
	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('_write() is not implemented'));
	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable(this, state, cb);
	};

	function needFinish(state) {
	  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else {
	      prefinish(stream, state);
	    }
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	  stream.writable = false;
	}

	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	  var _this = this;

	  this.next = null;
	  this.entry = null;

	  this.finish = function (err) {
	    var entry = _this.entry;
	    _this.entry = null;
	    while (entry) {
	      var cb = entry.callback;
	      state.pendingcb--;
	      cb(err);
	      entry = entry.next;
	    }
	    if (state.corkedRequestsFree) {
	      state.corkedRequestsFree.next = _this;
	    } else {
	      state.corkedRequestsFree = _this;
	    }
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(34).setImmediate))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(35);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2)))

/***/ },
/* 36 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module exports.
	 */

	module.exports = deprecate;

	/**
	 * Mark that a method should not be used.
	 * Returns a modified function which warns once by default.
	 *
	 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
	 *
	 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
	 * will throw an Error when invoked.
	 *
	 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
	 * will invoke `console.trace()` instead of `console.error()`.
	 *
	 * @param {Function} fn - the function to deprecate
	 * @param {String} msg - the string to print to the console when `fn` is invoked
	 * @returns {Function} a new "deprecated" version of `fn`
	 * @api public
	 */

	function deprecate (fn, msg) {
	  if (config('noDeprecation')) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (config('throwDeprecation')) {
	        throw new Error(msg);
	      } else if (config('traceDeprecation')) {
	        console.trace(msg);
	      } else {
	        console.warn(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}

	/**
	 * Checks `localStorage` for boolean values for the given `name`.
	 *
	 * @param {String} name
	 * @returns {Boolean}
	 * @api private
	 */

	function config (name) {
	  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
	  try {
	    if (!global.localStorage) return false;
	  } catch (_) {
	    return false;
	  }
	  var val = global.localStorage[name];
	  if (null == val) return false;
	  return String(val).toLowerCase() === 'true';
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer = __webpack_require__(25).Buffer;

	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     }


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};


	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	'use strict';

	module.exports = Transform;

	var Duplex = __webpack_require__(32);

	/*<replacement>*/
	var util = __webpack_require__(29);
	util.inherits = __webpack_require__(20);
	/*</replacement>*/

	util.inherits(Transform, Duplex);

	function TransformState(stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	  this.writeencoding = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (data !== null && data !== undefined) stream.push(data);

	  cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}

	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(this);

	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;

	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }

	  // When the writable side finishes, then flush out anything remaining.
	  this.once('prefinish', function () {
	    if (typeof this._flush === 'function') this._flush(function (er, data) {
	      done(stream, er, data);
	    });else done(stream);
	  });
	}

	Transform.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('_transform() is not implemented');
	};

	Transform.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function (n) {
	  var ts = this._transformState;

	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};

	function done(stream, er, data) {
	  if (er) return stream.emit('error', er);

	  if (data !== null && data !== undefined) stream.push(data);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

	  if (ts.transforming) throw new Error('Calling transform done when still transforming');

	  return stream.push(null);
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	'use strict';

	module.exports = PassThrough;

	var Transform = __webpack_require__(38);

	/*<replacement>*/
	var util = __webpack_require__(29);
	util.inherits = __webpack_require__(20);
	/*</replacement>*/

	util.inherits(PassThrough, Transform);

	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(33)


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(32)


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(38)


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(39)


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	
	var thenify = __webpack_require__(45)

	module.exports = thenifyAll
	thenifyAll.withCallback = withCallback
	thenifyAll.thenify = thenify

	/**
	 * Promisifies all the selected functions in an object.
	 *
	 * @param {Object} source the source object for the async functions
	 * @param {Object} [destination] the destination to set all the promisified methods
	 * @param {Array} [methods] an array of method names of `source`
	 * @return {Object}
	 * @api public
	 */

	function thenifyAll(source, destination, methods) {
	  return promisifyAll(source, destination, methods, thenify)
	}

	/**
	 * Promisifies all the selected functions in an object and backward compatible with callback.
	 *
	 * @param {Object} source the source object for the async functions
	 * @param {Object} [destination] the destination to set all the promisified methods
	 * @param {Array} [methods] an array of method names of `source`
	 * @return {Object}
	 * @api public
	 */

	function withCallback(source, destination, methods) {
	  return promisifyAll(source, destination, methods, thenify.withCallback)
	}

	function promisifyAll(source, destination, methods, promisify) {
	  if (!destination) {
	    destination = {};
	    methods = Object.keys(source)
	  }

	  if (Array.isArray(destination)) {
	    methods = destination
	    destination = {}
	  }

	  if (!methods) {
	    methods = Object.keys(source)
	  }

	  if (typeof source === 'function') destination = promisify(source)

	  methods.forEach(function (name) {
	    // promisify only if it's a function
	    if (typeof source[name] === 'function') destination[name] = promisify(source[name])
	  })

	  // proxy the rest
	  Object.keys(source).forEach(function (name) {
	    if (deprecated(source, name)) return
	    if (destination[name]) return
	    destination[name] = source[name]
	  })

	  return destination
	}

	function deprecated(source, name) {
	  var desc = Object.getOwnPropertyDescriptor(source, name)
	  if (!desc || !desc.get) return false
	  if (desc.get.name === 'deprecated') return true
	  return false
	}


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	
	var Promise = __webpack_require__(10)
	var assert = __webpack_require__(4)

	module.exports = thenify

	/**
	 * Turn async functions into promises
	 *
	 * @param {Function} $$__fn__$$
	 * @return {Function}
	 * @api public
	 */

	function thenify($$__fn__$$) {
	  assert(typeof $$__fn__$$ === 'function')
	  return eval(createWrapper($$__fn__$$.name))
	}

	/**
	 * Turn async functions into promises and backward compatible with callback
	 *
	 * @param {Function} $$__fn__$$
	 * @return {Function}
	 * @api public
	 */

	thenify.withCallback = function ($$__fn__$$) {
	  assert(typeof $$__fn__$$ === 'function')
	  return eval(createWrapper($$__fn__$$.name, true))
	}

	function createCallback(resolve, reject) {
	  return function(err, value) {
	    if (err) return reject(err)
	    var length = arguments.length
	    if (length <= 2) return resolve(value)
	    var values = new Array(length - 1)
	    for (var i = 1; i < length; ++i) values[i - 1] = arguments[i]
	    resolve(values)
	  }
	}

	function createWrapper(name, withCallback) {
	  name = (name || '').replace(/\s|bound(?!$)/g, '')
	  withCallback = withCallback ?
	    'var lastType = typeof arguments[len - 1]\n'
	    + 'if (lastType === "function") return $$__fn__$$.apply(self, arguments)\n'
	   : ''

	  return '(function ' + name + '() {\n'
	    + 'var self = this\n'
	    + 'var len = arguments.length\n'
	    + withCallback
	    + 'var args = new Array(len + 1)\n'
	    + 'for (var i = 0; i < len; ++i) args[i] = arguments[i]\n'
	    + 'var lastIndex = i\n'
	    + 'return new Promise(function (resolve, reject) {\n'
	      + 'args[lastIndex] = createCallback(resolve, reject)\n'
	      + '$$__fn__$$.apply(self, args)\n'
	    + '})\n'
	  + '})'
	}


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var assign = __webpack_require__(47)

	var fse = {}
	var gfs = __webpack_require__(13)

	// attach fs methods to fse
	Object.keys(gfs).forEach(function (key) {
	  fse[key] = gfs[key]
	})

	var fs = fse

	assign(fs, __webpack_require__(48))
	assign(fs, __webpack_require__(57))
	assign(fs, __webpack_require__(53))
	assign(fs, __webpack_require__(60))
	assign(fs, __webpack_require__(62))
	assign(fs, __webpack_require__(67))
	assign(fs, __webpack_require__(68))
	assign(fs, __webpack_require__(69))
	assign(fs, __webpack_require__(75))
	assign(fs, __webpack_require__(76))
	assign(fs, __webpack_require__(79))

	module.exports = fs

	// maintain backwards compatibility for awhile
	var jsonfile = {}
	Object.defineProperty(jsonfile, 'spaces', {
	  get: function () {
	    return fs.spaces // found in ./json
	  },
	  set: function (val) {
	    fs.spaces = val
	  }
	})

	module.exports.jsonfile = jsonfile // so users of fs-extra can modify jsonFile.spaces


/***/ },
/* 47 */
/***/ function(module, exports) {

	// simple mutable assign
	function assign () {
	  var args = [].slice.call(arguments).filter(function (i) { return i })
	  var dest = args.shift()
	  args.forEach(function (src) {
	    Object.keys(src).forEach(function (key) {
	      dest[key] = src[key]
	    })
	  })

	  return dest
	}

	module.exports = assign


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  copy: __webpack_require__(49)
	}


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(13)
	var path = __webpack_require__(1)
	var ncp = __webpack_require__(50)
	var mkdir = __webpack_require__(53)

	function copy (src, dest, options, callback) {
	  if (typeof options === 'function' && !callback) {
	    callback = options
	    options = {}
	  } else if (typeof options === 'function' || options instanceof RegExp) {
	    options = {filter: options}
	  }
	  callback = callback || function () {}
	  options = options || {}

	  // Warn about using preserveTimestamps on 32-bit node:
	  if (options.preserveTimestamps && process.arch === 'ia32') {
	    console.warn('fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n' +
	    'see https://github.com/jprichardson/node-fs-extra/issues/269')
	  }

	  // don't allow src and dest to be the same
	  var basePath = process.cwd()
	  var currentPath = path.resolve(basePath, src)
	  var targetPath = path.resolve(basePath, dest)
	  if (currentPath === targetPath) return callback(new Error('Source and destination must not be the same.'))

	  fs.lstat(src, function (err, stats) {
	    if (err) return callback(err)

	    var dir = null
	    if (stats.isDirectory()) {
	      var parts = dest.split(path.sep)
	      parts.pop()
	      dir = parts.join(path.sep)
	    } else {
	      dir = path.dirname(dest)
	    }

	    fs.exists(dir, function (dirExists) {
	      if (dirExists) return ncp(src, dest, options, callback)
	      mkdir.mkdirs(dir, function (err) {
	        if (err) return callback(err)
	        ncp(src, dest, options, callback)
	      })
	    })
	  })
	}

	module.exports = copy

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// imported from ncp (this is temporary, will rewrite)

	var fs = __webpack_require__(13)
	var path = __webpack_require__(1)
	var utimes = __webpack_require__(51)

	function ncp (source, dest, options, callback) {
	  if (!callback) {
	    callback = options
	    options = {}
	  }

	  var basePath = process.cwd()
	  var currentPath = path.resolve(basePath, source)
	  var targetPath = path.resolve(basePath, dest)

	  var filter = options.filter
	  var transform = options.transform
	  var clobber = options.clobber !== false // default true
	  var dereference = options.dereference
	  var preserveTimestamps = options.preserveTimestamps === true

	  var started = 0
	  var finished = 0
	  var running = 0

	  var errored = false

	  startCopy(currentPath)

	  function startCopy (source) {
	    started++
	    if (filter) {
	      if (filter instanceof RegExp) {
	        console.warn('Warning: fs-extra: Passing a RegExp filter is deprecated, use a function')
	        if (!filter.test(source)) {
	          return doneOne(true)
	        }
	      } else if (typeof filter === 'function') {
	        if (!filter(source)) {
	          return doneOne(true)
	        }
	      }
	    }
	    return getStats(source)
	  }

	  function getStats (source) {
	    var stat = dereference ? fs.stat : fs.lstat
	    running++
	    stat(source, function (err, stats) {
	      if (err) return onError(err)

	      // We need to get the mode from the stats object and preserve it.
	      var item = {
	        name: source,
	        mode: stats.mode,
	        mtime: stats.mtime, // modified time
	        atime: stats.atime, // access time
	        stats: stats // temporary
	      }

	      if (stats.isDirectory()) {
	        return onDir(item)
	      } else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice()) {
	        return onFile(item)
	      } else if (stats.isSymbolicLink()) {
	        // Symlinks don't really need to know about the mode.
	        return onLink(source)
	      }
	    })
	  }

	  function onFile (file) {
	    var target = file.name.replace(currentPath, targetPath.replace('$', '$$$$')) // escapes '$' with '$$'
	    isWritable(target, function (writable) {
	      if (writable) {
	        copyFile(file, target)
	      } else {
	        if (clobber) {
	          rmFile(target, function () {
	            copyFile(file, target)
	          })
	        } else {
	          var err = new Error('EEXIST: ' + target + ' already exists.')
	          err.code = 'EEXIST'
	          err.errno = -17
	          err.path = target
	          onError(err)
	        }
	      }
	    })
	  }

	  function copyFile (file, target) {
	    var readStream = fs.createReadStream(file.name)
	    var writeStream = fs.createWriteStream(target, { mode: file.mode })

	    readStream.on('error', onError)
	    writeStream.on('error', onError)

	    if (transform) {
	      transform(readStream, writeStream, file)
	    } else {
	      writeStream.on('open', function () {
	        readStream.pipe(writeStream)
	      })
	    }

	    writeStream.once('finish', function () {
	      fs.chmod(target, file.mode, function (err) {
	        if (err) return onError(err)
	        if (preserveTimestamps) {
	          utimes.utimesMillis(target, file.atime, file.mtime, function (err) {
	            if (err) return onError(err)
	            return doneOne()
	          })
	        } else {
	          doneOne()
	        }
	      })
	    })
	  }

	  function rmFile (file, done) {
	    fs.unlink(file, function (err) {
	      if (err) return onError(err)
	      return done()
	    })
	  }

	  function onDir (dir) {
	    var target = dir.name.replace(currentPath, targetPath.replace('$', '$$$$')) // escapes '$' with '$$'
	    isWritable(target, function (writable) {
	      if (writable) {
	        return mkDir(dir, target)
	      }
	      copyDir(dir.name)
	    })
	  }

	  function mkDir (dir, target) {
	    fs.mkdir(target, dir.mode, function (err) {
	      if (err) return onError(err)
	      // despite setting mode in fs.mkdir, doesn't seem to work
	      // so we set it here.
	      fs.chmod(target, dir.mode, function (err) {
	        if (err) return onError(err)
	        copyDir(dir.name)
	      })
	    })
	  }

	  function copyDir (dir) {
	    fs.readdir(dir, function (err, items) {
	      if (err) return onError(err)
	      items.forEach(function (item) {
	        startCopy(path.join(dir, item))
	      })
	      return doneOne()
	    })
	  }

	  function onLink (link) {
	    var target = link.replace(currentPath, targetPath)
	    fs.readlink(link, function (err, resolvedPath) {
	      if (err) return onError(err)
	      checkLink(resolvedPath, target)
	    })
	  }

	  function checkLink (resolvedPath, target) {
	    if (dereference) {
	      resolvedPath = path.resolve(basePath, resolvedPath)
	    }
	    isWritable(target, function (writable) {
	      if (writable) {
	        return makeLink(resolvedPath, target)
	      }
	      fs.readlink(target, function (err, targetDest) {
	        if (err) return onError(err)

	        if (dereference) {
	          targetDest = path.resolve(basePath, targetDest)
	        }
	        if (targetDest === resolvedPath) {
	          return doneOne()
	        }
	        return rmFile(target, function () {
	          makeLink(resolvedPath, target)
	        })
	      })
	    })
	  }

	  function makeLink (linkPath, target) {
	    fs.symlink(linkPath, target, function (err) {
	      if (err) return onError(err)
	      return doneOne()
	    })
	  }

	  function isWritable (path, done) {
	    fs.lstat(path, function (err) {
	      if (err) {
	        if (err.code === 'ENOENT') return done(true)
	        return done(false)
	      }
	      return done(false)
	    })
	  }

	  function onError (err) {
	    // ensure callback is defined & called only once:
	    if (!errored && callback !== undefined) {
	      errored = true
	      return callback(err)
	    }
	  }

	  function doneOne (skipped) {
	    if (!skipped) running--
	    finished++
	    if ((started === finished) && (running === 0)) {
	      if (callback !== undefined) {
	        return callback(null)
	      }
	    }
	  }
	}

	module.exports = ncp

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(13)
	var path = __webpack_require__(1)
	var os = __webpack_require__(52)

	// HFS, ext{2,3}, FAT do not, Node.js v0.10 does not
	function hasMillisResSync () {
	  var tmpfile = path.join('millis-test-sync' + Date.now().toString() + Math.random().toString().slice(2))
	  tmpfile = path.join(os.tmpdir(), tmpfile)

	  // 550 millis past UNIX epoch
	  var d = new Date(1435410243862)
	  fs.writeFileSync(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141')
	  var fd = fs.openSync(tmpfile, 'r+')
	  fs.futimesSync(fd, d, d)
	  fs.closeSync(fd)
	  return fs.statSync(tmpfile).mtime > 1435410243000
	}

	function hasMillisRes (callback) {
	  var tmpfile = path.join('millis-test' + Date.now().toString() + Math.random().toString().slice(2))
	  tmpfile = path.join(os.tmpdir(), tmpfile)

	  // 550 millis past UNIX epoch
	  var d = new Date(1435410243862)
	  fs.writeFile(tmpfile, 'https://github.com/jprichardson/node-fs-extra/pull/141', function (err) {
	    if (err) return callback(err)
	    fs.open(tmpfile, 'r+', function (err, fd) {
	      if (err) return callback(err)
	      fs.futimes(fd, d, d, function (err) {
	        if (err) return callback(err)
	        fs.close(fd, function (err) {
	          if (err) return callback(err)
	          fs.stat(tmpfile, function (err, stats) {
	            if (err) return callback(err)
	            callback(null, stats.mtime > 1435410243000)
	          })
	        })
	      })
	    })
	  })
	}

	function timeRemoveMillis (timestamp) {
	  if (typeof timestamp === 'number') {
	    return Math.floor(timestamp / 1000) * 1000
	  } else if (timestamp instanceof Date) {
	    return new Date(Math.floor(timestamp.getTime() / 1000) * 1000)
	  } else {
	    throw new Error('fs-extra: timeRemoveMillis() unknown parameter type')
	  }
	}

	function utimesMillis (path, atime, mtime, callback) {
	  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
	  fs.open(path, 'r+', function (err, fd) {
	    if (err) return callback(err)
	    fs.futimes(fd, atime, mtime, function (futimesErr) {
	      fs.close(fd, function (closeErr) {
	        if (callback) callback(futimesErr || closeErr)
	      })
	    })
	  })
	}

	module.exports = {
	  hasMillisRes: hasMillisRes,
	  hasMillisResSync: hasMillisResSync,
	  timeRemoveMillis: timeRemoveMillis,
	  utimesMillis: utimesMillis
	}


/***/ },
/* 52 */
/***/ function(module, exports) {

	exports.endianness = function () { return 'LE' };

	exports.hostname = function () {
	    if (typeof location !== 'undefined') {
	        return location.hostname
	    }
	    else return '';
	};

	exports.loadavg = function () { return [] };

	exports.uptime = function () { return 0 };

	exports.freemem = function () {
	    return Number.MAX_VALUE;
	};

	exports.totalmem = function () {
	    return Number.MAX_VALUE;
	};

	exports.cpus = function () { return [] };

	exports.type = function () { return 'Browser' };

	exports.release = function () {
	    if (typeof navigator !== 'undefined') {
	        return navigator.appVersion;
	    }
	    return '';
	};

	exports.networkInterfaces
	= exports.getNetworkInterfaces
	= function () { return {} };

	exports.arch = function () { return 'javascript' };

	exports.platform = function () { return 'browser' };

	exports.tmpdir = exports.tmpDir = function () {
	    return '/tmp';
	};

	exports.EOL = '\n';


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  mkdirs: __webpack_require__(54),
	  mkdirsSync: __webpack_require__(56),
	  // alias
	  mkdirp: __webpack_require__(54),
	  mkdirpSync: __webpack_require__(56),
	  ensureDir: __webpack_require__(54),
	  ensureDirSync: __webpack_require__(56)
	}


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(13)
	var path = __webpack_require__(1)
	var invalidWin32Path = __webpack_require__(55).invalidWin32Path

	var o777 = parseInt('0777', 8)

	function mkdirs (p, opts, callback, made) {
	  if (typeof opts === 'function') {
	    callback = opts
	    opts = {}
	  } else if (!opts || typeof opts !== 'object') {
	    opts = { mode: opts }
	  }

	  if (process.platform === 'win32' && invalidWin32Path(p)) {
	    var errInval = new Error(p + ' contains invalid WIN32 path characters.')
	    errInval.code = 'EINVAL'
	    return callback(errInval)
	  }

	  var mode = opts.mode
	  var xfs = opts.fs || fs

	  if (mode === undefined) {
	    mode = o777 & (~process.umask())
	  }
	  if (!made) made = null

	  callback = callback || function () {}
	  p = path.resolve(p)

	  xfs.mkdir(p, mode, function (er) {
	    if (!er) {
	      made = made || p
	      return callback(null, made)
	    }
	    switch (er.code) {
	      case 'ENOENT':
	        if (path.dirname(p) === p) return callback(er)
	        mkdirs(path.dirname(p), opts, function (er, made) {
	          if (er) callback(er, made)
	          else mkdirs(p, opts, callback, made)
	        })
	        break

	      // In the case of any other error, just see if there's a dir
	      // there already.  If so, then hooray!  If not, then something
	      // is borked.
	      default:
	        xfs.stat(p, function (er2, stat) {
	          // if the stat fails, then that's super weird.
	          // let the original error be the failure reason.
	          if (er2 || !stat.isDirectory()) callback(er, made)
	          else callback(null, made)
	        })
	        break
	    }
	  })
	}

	module.exports = mkdirs

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	var path = __webpack_require__(1)

	// get drive on windows
	function getRootPath (p) {
	  p = path.normalize(path.resolve(p)).split(path.sep)
	  if (p.length > 0) return p[0]
	  else return null
	}

	// http://stackoverflow.com/a/62888/10333 contains more accurate
	// TODO: expand to include the rest
	var INVALID_PATH_CHARS = /[<>:"|?*]/

	function invalidWin32Path (p) {
	  var rp = getRootPath(p)
	  p = p.replace(rp, '')
	  return INVALID_PATH_CHARS.test(p)
	}

	module.exports = {
	  getRootPath: getRootPath,
	  invalidWin32Path: invalidWin32Path
	}


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(13)
	var path = __webpack_require__(1)
	var invalidWin32Path = __webpack_require__(55).invalidWin32Path

	var o777 = parseInt('0777', 8)

	function mkdirsSync (p, opts, made) {
	  if (!opts || typeof opts !== 'object') {
	    opts = { mode: opts }
	  }

	  var mode = opts.mode
	  var xfs = opts.fs || fs

	  if (process.platform === 'win32' && invalidWin32Path(p)) {
	    var errInval = new Error(p + ' contains invalid WIN32 path characters.')
	    errInval.code = 'EINVAL'
	    throw errInval
	  }

	  if (mode === undefined) {
	    mode = o777 & (~process.umask())
	  }
	  if (!made) made = null

	  p = path.resolve(p)

	  try {
	    xfs.mkdirSync(p, mode)
	    made = made || p
	  } catch (err0) {
	    switch (err0.code) {
	      case 'ENOENT':
	        if (path.dirname(p) === p) throw err0
	        made = mkdirsSync(path.dirname(p), opts, made)
	        mkdirsSync(p, opts, made)
	        break

	      // In the case of any other error, just see if there's a dir
	      // there already.  If so, then hooray!  If not, then something
	      // is borked.
	      default:
	        var stat
	        try {
	          stat = xfs.statSync(p)
	        } catch (err1) {
	          throw err0
	        }
	        if (!stat.isDirectory()) throw err0
	        break
	    }
	  }

	  return made
	}

	module.exports = mkdirsSync

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  copySync: __webpack_require__(58)
	}


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(13)
	var path = __webpack_require__(1)
	var copyFileSync = __webpack_require__(59)
	var mkdir = __webpack_require__(53)

	function copySync (src, dest, options) {
	  if (typeof options === 'function' || options instanceof RegExp) {
	    options = {filter: options}
	  }

	  options = options || {}
	  options.recursive = !!options.recursive

	  // default to true for now
	  options.clobber = 'clobber' in options ? !!options.clobber : true
	  options.dereference = 'dereference' in options ? !!options.dereference : false
	  options.preserveTimestamps = 'preserveTimestamps' in options ? !!options.preserveTimestamps : false

	  options.filter = options.filter || function () { return true }

	  // Warn about using preserveTimestamps on 32-bit node:
	  if (options.preserveTimestamps && process.arch === 'ia32') {
	    console.warn('fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n' +
	    'see https://github.com/jprichardson/node-fs-extra/issues/269')
	  }

	  var stats = (options.recursive && !options.dereference) ? fs.lstatSync(src) : fs.statSync(src)
	  var destFolder = path.dirname(dest)
	  var destFolderExists = fs.existsSync(destFolder)
	  var performCopy = false

	  if (stats.isFile()) {
	    if (options.filter instanceof RegExp) {
	      console.warn('Warning: fs-extra: Passing a RegExp filter is deprecated, use a function')
	      performCopy = options.filter.test(src)
	    } else if (typeof options.filter === 'function') performCopy = options.filter(src)

	    if (performCopy) {
	      if (!destFolderExists) mkdir.mkdirsSync(destFolder)
	      copyFileSync(src, dest, {clobber: options.clobber, preserveTimestamps: options.preserveTimestamps})
	    }
	  } else if (stats.isDirectory()) {
	    if (!fs.existsSync(dest)) mkdir.mkdirsSync(dest)
	    var contents = fs.readdirSync(src)
	    contents.forEach(function (content) {
	      var opts = options
	      opts.recursive = true
	      copySync(path.join(src, content), path.join(dest, content), opts)
	    })
	  } else if (options.recursive && stats.isSymbolicLink()) {
	    var srcPath = fs.readlinkSync(src)
	    fs.symlinkSync(srcPath, dest)
	  }
	}

	module.exports = copySync

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var fs = __webpack_require__(13)

	var BUF_LENGTH = 64 * 1024
	var _buff = new Buffer(BUF_LENGTH)

	function copyFileSync (srcFile, destFile, options) {
	  var clobber = options.clobber
	  var preserveTimestamps = options.preserveTimestamps

	  if (fs.existsSync(destFile)) {
	    if (clobber) {
	      fs.unlinkSync(destFile)
	    } else {
	      var err = new Error('EEXIST: ' + destFile + ' already exists.')
	      err.code = 'EEXIST'
	      err.errno = -17
	      err.path = destFile
	      throw err
	    }
	  }

	  var fdr = fs.openSync(srcFile, 'r')
	  var stat = fs.fstatSync(fdr)
	  var fdw = fs.openSync(destFile, 'w', stat.mode)
	  var bytesRead = 1
	  var pos = 0

	  while (bytesRead > 0) {
	    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
	    fs.writeSync(fdw, _buff, 0, bytesRead)
	    pos += bytesRead
	  }

	  if (preserveTimestamps) {
	    fs.futimesSync(fdw, stat.atime, stat.mtime)
	  }

	  fs.closeSync(fdr)
	  fs.closeSync(fdw)
	}

	module.exports = copyFileSync

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var rimraf = __webpack_require__(61)

	function removeSync (dir) {
	  return rimraf.sync(dir, {disableGlob: true})
	}

	function remove (dir, callback) {
	  var options = {disableGlob: true}
	  return callback ? rimraf(dir, options, callback) : rimraf(dir, options, function () {})
	}

	module.exports = {
	  remove: remove,
	  removeSync: removeSync
	}


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {module.exports = rimraf
	rimraf.sync = rimrafSync

	var assert = __webpack_require__(4)
	var path = __webpack_require__(1)
	var fs = __webpack_require__(13)

	var isWindows = (process.platform === 'win32')

	function defaults (options) {
	  var methods = [
	    'unlink',
	    'chmod',
	    'stat',
	    'lstat',
	    'rmdir',
	    'readdir'
	  ]
	  methods.forEach(function (m) {
	    options[m] = options[m] || fs[m]
	    m = m + 'Sync'
	    options[m] = options[m] || fs[m]
	  })

	  options.maxBusyTries = options.maxBusyTries || 3
	}

	function rimraf (p, options, cb) {
	  if (typeof options === 'function') {
	    cb = options
	    options = {}
	  }

	  assert(p, 'rimraf: missing path')
	  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
	  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
	  assert(options, 'rimraf: invalid options argument provided')
	  assert.equal(typeof options, 'object', 'rimraf: options should be object')

	  defaults(options)

	  var busyTries = 0

	  rimraf_(p, options, function CB (er) {
	    if (er) {
	      if (isWindows && (er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
	          busyTries < options.maxBusyTries) {
	        busyTries++
	        var time = busyTries * 100
	        // try again, with the same exact callback as this one.
	        return setTimeout(function () {
	          rimraf_(p, options, CB)
	        }, time)
	      }

	      // already gone
	      if (er.code === 'ENOENT') er = null
	    }

	    cb(er)
	  })
	}

	// Two possible strategies.
	// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
	// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
	//
	// Both result in an extra syscall when you guess wrong.  However, there
	// are likely far more normal files in the world than directories.  This
	// is based on the assumption that a the average number of files per
	// directory is >= 1.
	//
	// If anyone ever complains about this, then I guess the strategy could
	// be made configurable somehow.  But until then, YAGNI.
	function rimraf_ (p, options, cb) {
	  assert(p)
	  assert(options)
	  assert(typeof cb === 'function')

	  // sunos lets the root user unlink directories, which is... weird.
	  // so we have to lstat here and make sure it's not a dir.
	  options.lstat(p, function (er, st) {
	    if (er && er.code === 'ENOENT') {
	      return cb(null)
	    }

	    // Windows can EPERM on stat.  Life is suffering.
	    if (er && er.code === 'EPERM' && isWindows) {
	      fixWinEPERM(p, options, er, cb)
	    }

	    if (st && st.isDirectory()) {
	      return rmdir(p, options, er, cb)
	    }

	    options.unlink(p, function (er) {
	      if (er) {
	        if (er.code === 'ENOENT') {
	          return cb(null)
	        }
	        if (er.code === 'EPERM') {
	          return (isWindows)
	            ? fixWinEPERM(p, options, er, cb)
	            : rmdir(p, options, er, cb)
	        }
	        if (er.code === 'EISDIR') {
	          return rmdir(p, options, er, cb)
	        }
	      }
	      return cb(er)
	    })
	  })
	}

	function fixWinEPERM (p, options, er, cb) {
	  assert(p)
	  assert(options)
	  assert(typeof cb === 'function')
	  if (er) {
	    assert(er instanceof Error)
	  }

	  options.chmod(p, 666, function (er2) {
	    if (er2) {
	      cb(er2.code === 'ENOENT' ? null : er)
	    } else {
	      options.stat(p, function (er3, stats) {
	        if (er3) {
	          cb(er3.code === 'ENOENT' ? null : er)
	        } else if (stats.isDirectory()) {
	          rmdir(p, options, er, cb)
	        } else {
	          options.unlink(p, cb)
	        }
	      })
	    }
	  })
	}

	function fixWinEPERMSync (p, options, er) {
	  assert(p)
	  assert(options)
	  if (er) {
	    assert(er instanceof Error)
	  }

	  try {
	    options.chmodSync(p, 666)
	  } catch (er2) {
	    if (er2.code === 'ENOENT') {
	      return
	    } else {
	      throw er
	    }
	  }

	  try {
	    var stats = options.statSync(p)
	  } catch (er3) {
	    if (er3.code === 'ENOENT') {
	      return
	    } else {
	      throw er
	    }
	  }

	  if (stats.isDirectory()) {
	    rmdirSync(p, options, er)
	  } else {
	    options.unlinkSync(p)
	  }
	}

	function rmdir (p, options, originalEr, cb) {
	  assert(p)
	  assert(options)
	  if (originalEr) {
	    assert(originalEr instanceof Error)
	  }
	  assert(typeof cb === 'function')

	  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
	  // if we guessed wrong, and it's not a directory, then
	  // raise the original error.
	  options.rmdir(p, function (er) {
	    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
	      rmkids(p, options, cb)
	    } else if (er && er.code === 'ENOTDIR') {
	      cb(originalEr)
	    } else {
	      cb(er)
	    }
	  })
	}

	function rmkids (p, options, cb) {
	  assert(p)
	  assert(options)
	  assert(typeof cb === 'function')

	  options.readdir(p, function (er, files) {
	    if (er) {
	      return cb(er)
	    }
	    var n = files.length
	    if (n === 0) {
	      return options.rmdir(p, cb)
	    }
	    var errState
	    files.forEach(function (f) {
	      rimraf(path.join(p, f), options, function (er) {
	        if (errState) {
	          return
	        }
	        if (er) {
	          return cb(errState = er)
	        }
	        if (--n === 0) {
	          options.rmdir(p, cb)
	        }
	      })
	    })
	  })
	}

	// this looks simpler, and is strictly *faster*, but will
	// tie up the JavaScript thread and fail on excessively
	// deep directory trees.
	function rimrafSync (p, options) {
	  options = options || {}
	  defaults(options)

	  assert(p, 'rimraf: missing path')
	  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
	  assert(options, 'rimraf: missing options')
	  assert.equal(typeof options, 'object', 'rimraf: options should be object')

	  try {
	    var st = options.lstatSync(p)
	  } catch (er) {
	    if (er.code === 'ENOENT') {
	      return
	    }

	    // Windows can EPERM on stat.  Life is suffering.
	    if (er.code === 'EPERM' && isWindows) {
	      fixWinEPERMSync(p, options, er)
	    }
	  }

	  try {
	    // sunos lets the root user unlink directories, which is... weird.
	    if (st && st.isDirectory()) {
	      rmdirSync(p, options, null)
	    } else {
	      options.unlinkSync(p)
	    }
	  } catch (er) {
	    if (er.code === 'ENOENT') {
	      return
	    }
	    if (er.code === 'EPERM') {
	      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
	    }
	    if (er.code !== 'EISDIR') {
	      throw er
	    }
	    rmdirSync(p, options, er)
	  }
	}

	function rmdirSync (p, options, originalEr) {
	  assert(p)
	  assert(options)
	  if (originalEr) {
	    assert(originalEr instanceof Error)
	  }

	  try {
	    options.rmdirSync(p)
	  } catch (er) {
	    if (er.code === 'ENOENT') {
	      return
	    }
	    if (er.code === 'ENOTDIR') {
	      throw originalEr
	    }
	    if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
	      rmkidsSync(p, options)
	    }
	  }
	}

	function rmkidsSync (p, options) {
	  assert(p)
	  assert(options)
	  options.readdirSync(p).forEach(function (f) {
	    rimrafSync(path.join(p, f), options)
	  })
	  options.rmdirSync(p, options)
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var jsonFile = __webpack_require__(63)

	jsonFile.outputJsonSync = __webpack_require__(65)
	jsonFile.outputJson = __webpack_require__(66)
	// aliases
	jsonFile.outputJSONSync = __webpack_require__(65)
	jsonFile.outputJSON = __webpack_require__(66)

	module.exports = jsonFile


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var jsonFile = __webpack_require__(64)

	module.exports = {
	  // jsonfile exports
	  readJson: jsonFile.readFile,
	  readJSON: jsonFile.readFile,
	  readJsonSync: jsonFile.readFileSync,
	  readJSONSync: jsonFile.readFileSync,
	  writeJson: jsonFile.writeFile,
	  writeJSON: jsonFile.writeFile,
	  writeJsonSync: jsonFile.writeFileSync,
	  writeJSONSync: jsonFile.writeFileSync,
	  spaces: 2 // default in fs-extra
	}


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var _fs
	try {
	  _fs = __webpack_require__(13)
	} catch (_) {
	  _fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	}

	function readFile (file, options, callback) {
	  if (callback == null) {
	    callback = options
	    options = {}
	  }

	  if (typeof options === 'string') {
	    options = {encoding: options}
	  }

	  options = options || {}
	  var fs = options.fs || _fs

	  var shouldThrow = true
	  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
	  if ('passParsingErrors' in options) {
	    shouldThrow = options.passParsingErrors
	  } else if ('throws' in options) {
	    shouldThrow = options.throws
	  }

	  fs.readFile(file, options, function (err, data) {
	    if (err) return callback(err)

	    data = stripBom(data)

	    var obj
	    try {
	      obj = JSON.parse(data, options ? options.reviver : null)
	    } catch (err2) {
	      if (shouldThrow) {
	        err2.message = file + ': ' + err2.message
	        return callback(err2)
	      } else {
	        return callback(null, null)
	      }
	    }

	    callback(null, obj)
	  })
	}

	function readFileSync (file, options) {
	  options = options || {}
	  if (typeof options === 'string') {
	    options = {encoding: options}
	  }

	  var fs = options.fs || _fs

	  var shouldThrow = true
	  // DO NOT USE 'passParsingErrors' THE NAME WILL CHANGE!!!, use 'throws' instead
	  if ('passParsingErrors' in options) {
	    shouldThrow = options.passParsingErrors
	  } else if ('throws' in options) {
	    shouldThrow = options.throws
	  }

	  var content = fs.readFileSync(file, options)
	  content = stripBom(content)

	  try {
	    return JSON.parse(content, options.reviver)
	  } catch (err) {
	    if (shouldThrow) {
	      err.message = file + ': ' + err.message
	      throw err
	    } else {
	      return null
	    }
	  }
	}

	function writeFile (file, obj, options, callback) {
	  if (callback == null) {
	    callback = options
	    options = {}
	  }
	  options = options || {}
	  var fs = options.fs || _fs

	  var spaces = typeof options === 'object' && options !== null
	    ? 'spaces' in options
	    ? options.spaces : this.spaces
	    : this.spaces

	  var str = ''
	  try {
	    str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n'
	  } catch (err) {
	    if (callback) return callback(err, null)
	  }

	  fs.writeFile(file, str, options, callback)
	}

	function writeFileSync (file, obj, options) {
	  options = options || {}
	  var fs = options.fs || _fs

	  var spaces = typeof options === 'object' && options !== null
	    ? 'spaces' in options
	    ? options.spaces : this.spaces
	    : this.spaces

	  var str = JSON.stringify(obj, options.replacer, spaces) + '\n'
	  // not sure if fs.writeFileSync returns anything, but just in case
	  return fs.writeFileSync(file, str, options)
	}

	function stripBom (content) {
	  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
	  if (Buffer.isBuffer(content)) content = content.toString('utf8')
	  content = content.replace(/^\uFEFF/, '')
	  return content
	}

	var jsonfile = {
	  spaces: null,
	  readFile: readFile,
	  readFileSync: readFileSync,
	  writeFile: writeFile,
	  writeFileSync: writeFileSync
	}

	module.exports = jsonfile

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(13)
	var path = __webpack_require__(1)
	var jsonFile = __webpack_require__(63)
	var mkdir = __webpack_require__(53)

	function outputJsonSync (file, data, options) {
	  var dir = path.dirname(file)

	  if (!fs.existsSync(dir)) {
	    mkdir.mkdirsSync(dir)
	  }

	  jsonFile.writeJsonSync(file, data, options)
	}

	module.exports = outputJsonSync


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(13)
	var path = __webpack_require__(1)
	var jsonFile = __webpack_require__(63)
	var mkdir = __webpack_require__(53)

	function outputJson (file, data, options, callback) {
	  if (typeof options === 'function') {
	    callback = options
	    options = {}
	  }

	  var dir = path.dirname(file)

	  fs.exists(dir, function (itDoes) {
	    if (itDoes) return jsonFile.writeJson(file, data, options, callback)

	    mkdir.mkdirs(dir, function (err) {
	      if (err) return callback(err)
	      jsonFile.writeJson(file, data, options, callback)
	    })
	  })
	}

	module.exports = outputJson


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// most of this code was written by Andrew Kelley
	// licensed under the BSD license: see
	// https://github.com/andrewrk/node-mv/blob/master/package.json

	// this needs a cleanup

	var fs = __webpack_require__(13)
	var ncp = __webpack_require__(50)
	var path = __webpack_require__(1)
	var remove = __webpack_require__(60).remove
	var mkdirp = __webpack_require__(53).mkdirs

	function mv (source, dest, options, callback) {
	  if (typeof options === 'function') {
	    callback = options
	    options = {}
	  }

	  var shouldMkdirp = ('mkdirp' in options) ? options.mkdirp : true
	  var clobber = ('clobber' in options) ? options.clobber : false

	  var limit = options.limit || 16

	  if (shouldMkdirp) {
	    mkdirs()
	  } else {
	    doRename()
	  }

	  function mkdirs () {
	    mkdirp(path.dirname(dest), function (err) {
	      if (err) return callback(err)
	      doRename()
	    })
	  }

	  function doRename () {
	    if (clobber) {
	      fs.rename(source, dest, function (err) {
	        if (!err) return callback()

	        if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST') {
	          remove(dest, function (err) {
	            if (err) return callback(err)
	            options.clobber = false // just clobbered it, no need to do it again
	            mv(source, dest, options, callback)
	          })
	          return
	        }

	        // weird Windows shit
	        if (err.code === 'EPERM') {
	          setTimeout(function () {
	            remove(dest, function (err) {
	              if (err) return callback(err)
	              options.clobber = false
	              mv(source, dest, options, callback)
	            })
	          }, 200)
	          return
	        }

	        if (err.code !== 'EXDEV') return callback(err)
	        moveAcrossDevice(source, dest, clobber, limit, callback)
	      })
	    } else {
	      fs.link(source, dest, function (err) {
	        if (err) {
	          if (err.code === 'EXDEV' || err.code === 'EISDIR' || err.code === 'EPERM') {
	            moveAcrossDevice(source, dest, clobber, limit, callback)
	            return
	          }
	          callback(err)
	          return
	        }
	        fs.unlink(source, callback)
	      })
	    }
	  }
	}

	function moveAcrossDevice (source, dest, clobber, limit, callback) {
	  fs.stat(source, function (err, stat) {
	    if (err) {
	      callback(err)
	      return
	    }

	    if (stat.isDirectory()) {
	      moveDirAcrossDevice(source, dest, clobber, limit, callback)
	    } else {
	      moveFileAcrossDevice(source, dest, clobber, limit, callback)
	    }
	  })
	}

	function moveFileAcrossDevice (source, dest, clobber, limit, callback) {
	  var outFlags = clobber ? 'w' : 'wx'
	  var ins = fs.createReadStream(source)
	  var outs = fs.createWriteStream(dest, {flags: outFlags})

	  ins.on('error', function (err) {
	    ins.destroy()
	    outs.destroy()
	    outs.removeListener('close', onClose)

	    // may want to create a directory but `out` line above
	    // creates an empty file for us: See #108
	    // don't care about error here
	    fs.unlink(dest, function () {
	      // note: `err` here is from the input stream errror
	      if (err.code === 'EISDIR' || err.code === 'EPERM') {
	        moveDirAcrossDevice(source, dest, clobber, limit, callback)
	      } else {
	        callback(err)
	      }
	    })
	  })

	  outs.on('error', function (err) {
	    ins.destroy()
	    outs.destroy()
	    outs.removeListener('close', onClose)
	    callback(err)
	  })

	  outs.once('close', onClose)
	  ins.pipe(outs)

	  function onClose () {
	    fs.unlink(source, callback)
	  }
	}

	function moveDirAcrossDevice (source, dest, clobber, limit, callback) {
	  var options = {
	    stopOnErr: true,
	    clobber: false,
	    limit: limit
	  }

	  function startNcp () {
	    ncp(source, dest, options, function (errList) {
	      if (errList) return callback(errList[0])
	      remove(source, callback)
	    })
	  }

	  if (clobber) {
	    remove(dest, function (err) {
	      if (err) return callback(err)
	      startNcp()
	    })
	  } else {
	    startNcp()
	  }
	}

	module.exports = {
	  move: mv
	}


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	var path = __webpack_require__(1)
	var mkdir = __webpack_require__(53)
	var remove = __webpack_require__(60)

	function emptyDir (dir, callback) {
	  callback = callback || function () {}
	  fs.readdir(dir, function (err, items) {
	    if (err) return mkdir.mkdirs(dir, callback)

	    items = items.map(function (item) {
	      return path.join(dir, item)
	    })

	    deleteItem()

	    function deleteItem () {
	      var item = items.pop()
	      if (!item) return callback()
	      remove.remove(item, function (err) {
	        if (err) return callback(err)
	        deleteItem()
	      })
	    }
	  })
	}

	function emptyDirSync (dir) {
	  var items
	  try {
	    items = fs.readdirSync(dir)
	  } catch (err) {
	    return mkdir.mkdirsSync(dir)
	  }

	  items.forEach(function (item) {
	    item = path.join(dir, item)
	    remove.removeSync(item)
	  })
	}

	module.exports = {
	  emptyDirSync: emptyDirSync,
	  emptydirSync: emptyDirSync,
	  emptyDir: emptyDir,
	  emptydir: emptyDir
	}


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var file = __webpack_require__(70)
	var link = __webpack_require__(71)
	var symlink = __webpack_require__(72)

	module.exports = {
	  // file
	  createFile: file.createFile,
	  createFileSync: file.createFileSync,
	  ensureFile: file.createFile,
	  ensureFileSync: file.createFileSync,
	  // link
	  createLink: link.createLink,
	  createLinkSync: link.createLinkSync,
	  ensureLink: link.createLink,
	  ensureLinkSync: link.createLinkSync,
	  // symlink
	  createSymlink: symlink.createSymlink,
	  createSymlinkSync: symlink.createSymlinkSync,
	  ensureSymlink: symlink.createSymlink,
	  ensureSymlinkSync: symlink.createSymlinkSync
	}


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(1)
	var fs = __webpack_require__(13)
	var mkdir = __webpack_require__(53)

	function createFile (file, callback) {
	  function makeFile () {
	    fs.writeFile(file, '', function (err) {
	      if (err) return callback(err)
	      callback()
	    })
	  }

	  fs.exists(file, function (fileExists) {
	    if (fileExists) return callback()
	    var dir = path.dirname(file)
	    fs.exists(dir, function (dirExists) {
	      if (dirExists) return makeFile()
	      mkdir.mkdirs(dir, function (err) {
	        if (err) return callback(err)
	        makeFile()
	      })
	    })
	  })
	}

	function createFileSync (file) {
	  if (fs.existsSync(file)) return

	  var dir = path.dirname(file)
	  if (!fs.existsSync(dir)) {
	    mkdir.mkdirsSync(dir)
	  }

	  fs.writeFileSync(file, '')
	}

	module.exports = {
	  createFile: createFile,
	  createFileSync: createFileSync,
	  // alias
	  ensureFile: createFile,
	  ensureFileSync: createFileSync
	}


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(1)
	var fs = __webpack_require__(13)
	var mkdir = __webpack_require__(53)

	function createLink (srcpath, dstpath, callback) {
	  function makeLink (srcpath, dstpath) {
	    fs.link(srcpath, dstpath, function (err) {
	      if (err) return callback(err)
	      callback(null)
	    })
	  }

	  fs.exists(dstpath, function (destinationExists) {
	    if (destinationExists) return callback(null)
	    fs.lstat(srcpath, function (err, stat) {
	      if (err) {
	        err.message = err.message.replace('lstat', 'ensureLink')
	        return callback(err)
	      }

	      var dir = path.dirname(dstpath)
	      fs.exists(dir, function (dirExists) {
	        if (dirExists) return makeLink(srcpath, dstpath)
	        mkdir.mkdirs(dir, function (err) {
	          if (err) return callback(err)
	          makeLink(srcpath, dstpath)
	        })
	      })
	    })
	  })
	}

	function createLinkSync (srcpath, dstpath, callback) {
	  var destinationExists = fs.existsSync(dstpath)
	  if (destinationExists) return undefined

	  try {
	    fs.lstatSync(srcpath)
	  } catch (err) {
	    err.message = err.message.replace('lstat', 'ensureLink')
	    throw err
	  }

	  var dir = path.dirname(dstpath)
	  var dirExists = fs.existsSync(dir)
	  if (dirExists) return fs.linkSync(srcpath, dstpath)
	  mkdir.mkdirsSync(dir)

	  return fs.linkSync(srcpath, dstpath)
	}

	module.exports = {
	  createLink: createLink,
	  createLinkSync: createLinkSync,
	  // alias
	  ensureLink: createLink,
	  ensureLinkSync: createLinkSync
	}


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(1)
	var fs = __webpack_require__(13)
	var _mkdirs = __webpack_require__(53)
	var mkdirs = _mkdirs.mkdirs
	var mkdirsSync = _mkdirs.mkdirsSync

	var _symlinkPaths = __webpack_require__(73)
	var symlinkPaths = _symlinkPaths.symlinkPaths
	var symlinkPathsSync = _symlinkPaths.symlinkPathsSync

	var _symlinkType = __webpack_require__(74)
	var symlinkType = _symlinkType.symlinkType
	var symlinkTypeSync = _symlinkType.symlinkTypeSync

	function createSymlink (srcpath, dstpath, type, callback) {
	  callback = (typeof type === 'function') ? type : callback
	  type = (typeof type === 'function') ? false : type

	  fs.exists(dstpath, function (destinationExists) {
	    if (destinationExists) return callback(null)
	    symlinkPaths(srcpath, dstpath, function (err, relative) {
	      if (err) return callback(err)
	      srcpath = relative.toDst
	      symlinkType(relative.toCwd, type, function (err, type) {
	        if (err) return callback(err)
	        var dir = path.dirname(dstpath)
	        fs.exists(dir, function (dirExists) {
	          if (dirExists) return fs.symlink(srcpath, dstpath, type, callback)
	          mkdirs(dir, function (err) {
	            if (err) return callback(err)
	            fs.symlink(srcpath, dstpath, type, callback)
	          })
	        })
	      })
	    })
	  })
	}

	function createSymlinkSync (srcpath, dstpath, type, callback) {
	  callback = (typeof type === 'function') ? type : callback
	  type = (typeof type === 'function') ? false : type

	  var destinationExists = fs.existsSync(dstpath)
	  if (destinationExists) return undefined

	  var relative = symlinkPathsSync(srcpath, dstpath)
	  srcpath = relative.toDst
	  type = symlinkTypeSync(relative.toCwd, type)
	  var dir = path.dirname(dstpath)
	  var exists = fs.existsSync(dir)
	  if (exists) return fs.symlinkSync(srcpath, dstpath, type)
	  mkdirsSync(dir)
	  return fs.symlinkSync(srcpath, dstpath, type)
	}

	module.exports = {
	  createSymlink: createSymlink,
	  createSymlinkSync: createSymlinkSync,
	  // alias
	  ensureSymlink: createSymlink,
	  ensureSymlinkSync: createSymlinkSync
	}


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(1)
	// path.isAbsolute shim for Node.js 0.10 support
	var fs = __webpack_require__(13)

	/**
	 * Function that returns two types of paths, one relative to symlink, and one
	 * relative to the current working directory. Checks if path is absolute or
	 * relative. If the path is relative, this function checks if the path is
	 * relative to symlink or relative to current working directory. This is an
	 * initiative to find a smarter `srcpath` to supply when building symlinks.
	 * This allows you to determine which path to use out of one of three possible
	 * types of source paths. The first is an absolute path. This is detected by
	 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
	 * see if it exists. If it does it's used, if not an error is returned
	 * (callback)/ thrown (sync). The other two options for `srcpath` are a
	 * relative url. By default Node's `fs.symlink` works by creating a symlink
	 * using `dstpath` and expects the `srcpath` to be relative to the newly
	 * created symlink. If you provide a `srcpath` that does not exist on the file
	 * system it results in a broken symlink. To minimize this, the function
	 * checks to see if the 'relative to symlink' source file exists, and if it
	 * does it will use it. If it does not, it checks if there's a file that
	 * exists that is relative to the current working directory, if does its used.
	 * This preserves the expectations of the original fs.symlink spec and adds
	 * the ability to pass in `relative to current working direcotry` paths.
	 */

	function symlinkPaths (srcpath, dstpath, callback) {
	  if (path.isAbsolute(srcpath)) {
	    return fs.lstat(srcpath, function (err, stat) {
	      if (err) {
	        err.message = err.message.replace('lstat', 'ensureSymlink')
	        return callback(err)
	      }
	      return callback(null, {
	        'toCwd': srcpath,
	        'toDst': srcpath
	      })
	    })
	  } else {
	    var dstdir = path.dirname(dstpath)
	    var relativeToDst = path.join(dstdir, srcpath)
	    return fs.exists(relativeToDst, function (exists) {
	      if (exists) {
	        return callback(null, {
	          'toCwd': relativeToDst,
	          'toDst': srcpath
	        })
	      } else {
	        return fs.lstat(srcpath, function (err, stat) {
	          if (err) {
	            err.message = err.message.replace('lstat', 'ensureSymlink')
	            return callback(err)
	          }
	          return callback(null, {
	            'toCwd': srcpath,
	            'toDst': path.relative(dstdir, srcpath)
	          })
	        })
	      }
	    })
	  }
	}

	function symlinkPathsSync (srcpath, dstpath) {
	  var exists
	  if (path.isAbsolute(srcpath)) {
	    exists = fs.existsSync(srcpath)
	    if (!exists) throw new Error('absolute srcpath does not exist')
	    return {
	      'toCwd': srcpath,
	      'toDst': srcpath
	    }
	  } else {
	    var dstdir = path.dirname(dstpath)
	    var relativeToDst = path.join(dstdir, srcpath)
	    exists = fs.existsSync(relativeToDst)
	    if (exists) {
	      return {
	        'toCwd': relativeToDst,
	        'toDst': srcpath
	      }
	    } else {
	      exists = fs.existsSync(srcpath)
	      if (!exists) throw new Error('relative srcpath does not exist')
	      return {
	        'toCwd': srcpath,
	        'toDst': path.relative(dstdir, srcpath)
	      }
	    }
	  }
	}

	module.exports = {
	  'symlinkPaths': symlinkPaths,
	  'symlinkPathsSync': symlinkPathsSync
	}


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(13)

	function symlinkType (srcpath, type, callback) {
	  callback = (typeof type === 'function') ? type : callback
	  type = (typeof type === 'function') ? false : type
	  if (type) return callback(null, type)
	  fs.lstat(srcpath, function (err, stats) {
	    if (err) return callback(null, 'file')
	    type = (stats && stats.isDirectory()) ? 'dir' : 'file'
	    callback(null, type)
	  })
	}

	function symlinkTypeSync (srcpath, type) {
	  if (type) return type
	  try {
	    var stats = fs.lstatSync(srcpath)
	  } catch (e) {
	    return 'file'
	  }
	  return (stats && stats.isDirectory()) ? 'dir' : 'file'
	}

	module.exports = {
	  symlinkType: symlinkType,
	  symlinkTypeSync: symlinkTypeSync
	}


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(1)
	var fs = __webpack_require__(13)
	var mkdir = __webpack_require__(53)

	function outputFile (file, data, encoding, callback) {
	  if (typeof encoding === 'function') {
	    callback = encoding
	    encoding = 'utf8'
	  }

	  var dir = path.dirname(file)
	  fs.exists(dir, function (itDoes) {
	    if (itDoes) return fs.writeFile(file, data, encoding, callback)

	    mkdir.mkdirs(dir, function (err) {
	      if (err) return callback(err)

	      fs.writeFile(file, data, encoding, callback)
	    })
	  })
	}

	function outputFileSync (file, data, encoding) {
	  var dir = path.dirname(file)
	  if (fs.existsSync(dir)) {
	    return fs.writeFileSync.apply(fs, arguments)
	  }
	  mkdir.mkdirsSync(dir)
	  fs.writeFileSync.apply(fs, arguments)
	}

	module.exports = {
	  outputFile: outputFile,
	  outputFileSync: outputFileSync
	}


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var klaw = __webpack_require__(77)

	module.exports = {
	  walk: klaw
	}


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(4)
	var fs
	try {
	  fs = __webpack_require__(13)
	} catch (e) {
	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	}
	var path = __webpack_require__(1)
	var Readable = __webpack_require__(18).Readable
	var util = __webpack_require__(5)
	var assign = __webpack_require__(78)

	function Walker (dir, options) {
	  assert.strictEqual(typeof dir, 'string', '`dir` parameter should be of type string. Got type: ' + typeof dir)
	  var defaultStreamOptions = { objectMode: true }
	  var defaultOpts = { queueMethod: 'shift', pathSorter: undefined, filter: undefined }
	  options = assign(defaultOpts, options, defaultStreamOptions)

	  Readable.call(this, options)
	  this.root = path.resolve(dir)
	  this.paths = [this.root]
	  this.options = options
	  this.fs = options.fs || fs // mock-fs
	}
	util.inherits(Walker, Readable)

	Walker.prototype._read = function () {
	  if (this.paths.length === 0) return this.push(null)
	  var self = this
	  var pathItem = this.paths[this.options.queueMethod]()

	  self.fs.lstat(pathItem, function (err, stats) {
	    var item = { path: pathItem, stats: stats }
	    if (err) return self.emit('error', err, item)
	    if (!stats.isDirectory()) return self.push(item)

	    self.fs.readdir(pathItem, function (err, pathItems) {
	      if (err) {
	        self.push(item)
	        return self.emit('error', err, item)
	      }

	      pathItems = pathItems.map(function (part) { return path.join(pathItem, part) })
	      if (self.options.filter) pathItems = pathItems.filter(self.options.filter)
	      if (self.options.pathSorter) pathItems.sort(self.options.pathSorter)
	      pathItems.forEach(function (pi) { self.paths.push(pi) })

	      self.push(item)
	    })
	  })
	}

	function walk (root, options) {
	  return new Walker(root, options)
	}

	module.exports = walk


/***/ },
/* 78 */
/***/ function(module, exports) {

	// simple mutable assign (extracted from fs-extra)
	// I really like object-assign package, but I wanted a lean package with zero deps
	function _assign () {
	  var args = [].slice.call(arguments).filter(function (i) { return i })
	  var dest = args.shift()
	  args.forEach(function (src) {
	    Object.keys(src).forEach(function (key) {
	      dest[key] = src[key]
	    })
	  })

	  return dest
	}

	// thank you baby Jesus for Node v4 and Object.assign
	module.exports = Object.assign || _assign


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(13)
	var path = __webpack_require__(1)

	var walkSync = function (dir, filelist) {
	  var files = fs.readdirSync(dir)
	  filelist = filelist || []
	  files.forEach(function (file) {
	    var nestedPath = path.join(dir, file)
	    if (fs.lstatSync(nestedPath).isDirectory()) {
	      filelist = walkSync(nestedPath, filelist)
	    } else {
	      filelist.push(nestedPath)
	    }
	  })
	  return filelist
	}

	module.exports = {
	  walkSync: walkSync
	}


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	
	var compiler = __webpack_require__(81);
	var loaderUtils = __webpack_require__(99);

	module.exports = function riot(source) {

	  if(this.cacheable) this.cacheable();

	  if (loaderUtils.parseQuery().length > 0) {
	    var opts = loaderUtils.getLoaderConfig(this, 'riottag-loader');
	  }

	  try {
	    console.log('source', source)
	    return compiler.compile(source, opts, this.resourcePath);
	  } catch (error) {
	    if (!error) return;
	    this.emitError()
	  }
	}


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * The riot-compiler v3.0.0
	 *
	 * @module compiler
	 * @version v3.0.0
	 * @license MIT
	 * @copyright Muut Inc. + contributors
	 */
	'use strict'

	var brackets  = __webpack_require__(82)
	var parsers   = __webpack_require__(84)
	var safeRegex = __webpack_require__(83)
	var path      = __webpack_require__(1)

	var extend = __webpack_require__(86).mixobj
	/* eslint-enable */

	/**
	 * Source for creating regexes matching valid quoted, single-line JavaScript strings.
	 * It recognizes escape characters, including nested quotes and line continuation.
	 * @const {string}
	 */
	var S_LINESTR = /"[^"\n\\]*(?:\\[\S\s][^"\n\\]*)*"|'[^'\n\\]*(?:\\[\S\s][^'\n\\]*)*'/.source

	/**
	 * Source of {@link module:brackets.S_QBLOCKS|brackets.S_QBLOCKS} for creating regexes
	 * matching multiline HTML strings and/or skip literal strings inside expressions.
	 * @const {string}
	 * @todo Bad thing. It recognizes escaped quotes (incorrect for HTML strings) and multiline
	 *  strings without line continuation `'\'` (incorrect for expressions). Needs to be fixed
	 *  ASAP but the current logic requires it to parse expressions inside attribute values :[
	 */
	var S_STRINGS = brackets.R_STRINGS.source

	/**
	 * Matches pairs attribute=value, both quoted and unquoted.
	 * Names can contain almost all iso-8859-1 character set.
	 * Used by {@link module:compiler~parseAttribs|parseAttribs}, assume hidden
	 * expressions and compact spaces (no EOLs).
	 * @const {RegExp}
	 */
	var HTML_ATTRS = / *([-\w:\xA0-\xFF]+) ?(?:= ?('[^']*'|"[^"]*"|\S+))?/g

	/**
	 * Matches valid HTML comments (to remove) and JS strings/regexes (to skip).
	 * Used by [cleanSource]{@link module:compiler~cleanSource}.
	 * @const {RegExp}
	 */
	var HTML_COMMS = RegExp(/<!--(?!>)[\S\s]*?-->/.source + '|' + S_LINESTR, 'g')

	/**
	 * HTML_TAGS matches opening and self-closing tags, not the content.
	 * Used by {@link module:compiler~_compileHTML|_compileHTML} after hidding
	 * the expressions.
	 *
	 * 2016-01-18: exclude `'\s'` from attr capture to avoid unnecessary call to
	 *  {@link module:compiler~parseAttribs|parseAttribs}
	 * @const {RegExp}
	 */
	var HTML_TAGS = /<(-?[A-Za-z][-\w\xA0-\xFF]*)(?:\s+([^"'\/>]*(?:(?:"[^"]*"|'[^']*'|\/[^>])[^'"\/>]*)*)|\s*)(\/?)>/g

	/**
	 * Matches spaces and tabs between HTML tags
	 * Used by the `compact` option.
	 * @const RegExp
	 */
	var HTML_PACK = />[ \t]+<(-?[A-Za-z]|\/[-A-Za-z])/g

	/**
	 * These attributes give error when parsed on browsers with an expression in its value.
	 * Ex: `<img src={ exrp_value }>`.
	 * Used by {@link module:compiler~parseAttribs|parseAttribs} with lowercase names only.
	 * @const {Array}
	 * @see [attributes.md](https://github.com/riot/compiler/blob/dev/doc/attributes.md)
	 */
	var RIOT_ATTRS = ['style', 'src', 'd', 'value']

	/**
	 * HTML5 void elements that cannot be auto-closed.
	 * @const {RegExp}
	 * @see   {@link http://www.w3.org/TR/html-markup/syntax.html#syntax-elements}
	 * @see   {@link http://www.w3.org/TR/html5/syntax.html#void-elements}
	 */
	var VOID_TAGS = /^(?:input|img|br|wbr|hr|area|base|col|embed|keygen|link|meta|param|source|track)$/

	/**
	 * Matches `<pre>` elements to hide its content ($1) from whitespace compactation.
	 * Used by {@link module:compiler~_compileHTML|_compileHTML} after processing the
	 * attributes and the self-closing tags.
	 * @const {RegExp}
	 */
	var PRE_TAGS = /<pre(?:\s+(?:[^">]*|"[^"]*")*)?>([\S\s]+?)<\/pre\s*>/gi

	/**
	 * Matches values of the property 'type' of input elements which cause issues with
	 * invalid values in some browsers. These are compiled with an invalid type (an
	 * expression) so the browser defaults to `type="text"`. At runtime, the type is reset
	 * _after_ its value is replaced with the evaluated expression or an empty value.
	 * @const {RegExp}
	 */
	var SPEC_TYPES = /^"(?:number|date(?:time)?|time|month|email|color)\b/i

	/**
	 * Matches the 'import' statement
	 * @const {RegExp}
	 */
	var IMPORT_STATEMENT = /^\s*import(?:(?:\s|[^\s'"])*)['|"].*\n?/gm

	/**
	 * Matches trailing spaces and tabs by line.
	 * @const {RegExp}
	 */
	var TRIM_TRAIL = /[ \t]+$/gm

	var
	  RE_HASEXPR = safeRegex(/@#\d/, 'x01'),
	  RE_REPEXPR = safeRegex(/@#(\d+)/g, 'x01'),
	  CH_IDEXPR  = '\x01#',
	  CH_DQCODE  = '\u2057',
	  DQ = '"',
	  SQ = "'"

	/**
	 * Normalizes eols and removes HTML comments without touching the strings,
	 * avoiding unnecesary replacements.
	 * Skip the strings is less expansive than replacing with itself.
	 *
	 * @param   {string} src - The HTML source with comments
	 * @returns {string} HTML without comments
	 * @since v2.3.22
	 */
	function cleanSource (src) {
	  var
	    mm,
	    re = HTML_COMMS

	  if (~src.indexOf('\r')) {
	    src = src.replace(/\r\n?/g, '\n')
	  }

	  re.lastIndex = 0
	  while ((mm = re.exec(src))) {
	    if (mm[0][0] === '<') {
	      src = RegExp.leftContext + RegExp.rightContext
	      re.lastIndex = mm[3] + 1
	    }
	  }
	  return src
	}

	/**
	 * Parses attributes. Force names to lowercase, enclose the values in double quotes,
	 * and compact spaces.
	 * Take care about issues in some HTML5 input elements with expressions in its value.
	 *
	 * @param   {string} str  - Attributes, with expressions replaced by their hash
	 * @param   {Array}  pcex - Has a `_bp` property with info about brackets
	 * @returns {string} Formated attributes
	 */
	function parseAttribs (str, pcex) {
	  var
	    list = [],
	    match,
	    type, vexp

	  HTML_ATTRS.lastIndex = 0

	  str = str.replace(/\s+/g, ' ')

	  while ((match = HTML_ATTRS.exec(str))) {
	    var
	      k = match[1].toLowerCase(),
	      v = match[2]

	    if (!v) {
	      list.push(k)
	    } else {

	      if (v[0] !== DQ) {
	        v = DQ + (v[0] === SQ ? v.slice(1, -1) : v) + DQ
	      }

	      if (k === 'type' && SPEC_TYPES.test(v)) {
	        type = v
	      } else {
	        if (RE_HASEXPR.test(v)) {

	          if (k === 'value') vexp = 1
	          if (~RIOT_ATTRS.indexOf(k)) k = 'riot-' + k
	        }

	        list.push(k + '=' + v)
	      }
	    }
	  }

	  if (type) {
	    if (vexp) type = DQ + pcex._bp[0] + SQ + type.slice(1, -1) + SQ + pcex._bp[1] + DQ
	    list.push('type=' + type)
	  }
	  return list.join(' ')
	}

	/**
	 * Replaces expressions with a marker and runs expressions through the parser,
	 * if any, except those beginning with `"{^"` (hack for riot#1014 and riot#1090).
	 *
	 * @param   {string} html - Raw html without comments
	 * @param   {object} opts - The options, as passed to the compiler
	 * @param   {Array}  pcex - To store the extracted expressions
	 * @returns {string} html with its expressions replaced with markers
	 *
	 * @see {@link module:brackets.split|brackets.split}
	 */
	function splitHtml (html, opts, pcex) {
	  var _bp = pcex._bp

	  if (html && _bp[4].test(html)) {
	    var
	      jsfn = opts.expr && (opts.parser || opts.type) ? _compileJS : 0,
	      list = brackets.split(html, 0, _bp),
	      expr

	    for (var i = 1; i < list.length; i += 2) {
	      expr = list[i]
	      if (expr[0] === '^') {
	        expr = expr.slice(1)
	      } else if (jsfn) {
	        expr = jsfn(expr, opts).trim()
	        if (expr.slice(-1) === ';') expr = expr.slice(0, -1)
	      }
	      list[i] = CH_IDEXPR + (pcex.push(expr) - 1) + _bp[1]
	    }
	    html = list.join('')
	  }
	  return html
	}

	/**
	 * Cleans and restores hidden expressions encoding double quotes to prevent issues
	 * with browsers (breaks attributes) and encode `"<>"` for expressions with raw HTML.
	 *
	 * @param   {string} html - The HTML source with hidden expresions
	 * @param   {Array}  pcex - Array with unformatted expressions
	 * @returns {string} HTML with clean expressions in its place.
	 */
	function restoreExpr (html, pcex) {
	  if (pcex.length) {
	    html = html.replace(RE_REPEXPR, function (_, d) {

	      return pcex._bp[0] + pcex[d].trim().replace(/[\r\n]+/g, ' ').replace(/"/g, CH_DQCODE)
	    })
	  }
	  return html
	}

	/**
	 * The internal HTML compiler.
	 *
	 * @param   {string} html - Raw HTML string
	 * @param   {object} opts - Compilation options received by compile or compileHTML
	 * @param   {Array}  pcex - To store extracted expressions, must include `_bp`
	 * @returns {string} Parsed HTML code which can be used by `riot.tag2`.
	 *
	 * @see {@link http://www.w3.org/TR/html5/syntax.html}
	 */
	function _compileHTML (html, opts, pcex) {
	  if (!/\S/.test(html)) return ''

	  html = splitHtml(html, opts, pcex)
	    .replace(HTML_TAGS, function (_, name, attr, ends) {

	      name = name.toLowerCase()

	      ends = ends && !VOID_TAGS.test(name) ? '></' + name : ''

	      if (attr) name += ' ' + parseAttribs(attr, pcex)

	      return '<' + name + ends + '>'
	    })

	  if (!opts.whitespace) {
	    var p = []

	    if (/<pre[\s>]/.test(html)) {
	      html = html.replace(PRE_TAGS, function (q) {
	        p.push(q)
	        return '\u0002'
	      })
	    }

	    html = html.trim().replace(/\s+/g, ' ')

	    if (p.length) html = html.replace(/\u0002/g, function () { return p.shift() })
	  }

	  if (opts.compact) html = html.replace(HTML_PACK, '><$1')

	  return restoreExpr(html, pcex).replace(TRIM_TRAIL, '')
	}

	/**
	 * Public interface to the internal HTML compiler, parses and formats the HTML part.
	 *
	 * - Runs each expression through the parser and replace it with a marker
	 * - Removes trailing tab and spaces
	 * - Normalizes and formats the attribute-value pairs
	 * - Closes self-closing tags
	 * - Normalizes and restores the expressions
	 *
	 * @param   {string} html   - Can contain embedded HTML comments and literal whitespace
	 * @param   {Object} [opts] - User options.
	 * @param   {Array}  [pcex] - To store precompiled expressions
	 * @returns {string} The parsed HTML markup, which can be used by `riot.tag2`
	 * @static
	 */
	function compileHTML (html, opts, pcex) {

	  if (Array.isArray(opts)) {
	    pcex = opts
	    opts = {}
	  } else {
	    if (!pcex) pcex = []
	    if (!opts) opts = {}
	  }

	  pcex._bp = brackets.array(opts.brackets)

	  return _compileHTML(cleanSource(html), opts, pcex)
	}

	/**
	 * Matches ES6 methods across multiple lines up to its first curly brace.
	 * Used by the {@link module:compiler~riotjs|riotjs} parser.
	 *
	 * 2016-01-18: rewritten to capture only the method name (performant)
	 * @const {RegExp}
	 */
	var JS_ES6SIGN = /^[ \t]*([$_A-Za-z][$\w]*)\s*\([^()]*\)\s*{/m

	/**
	 * Regex for remotion of multiline and single-line JavaScript comments, merged with
	 * {@link module:brackets.S_QBLOCKS|brackets.S_QBLOCKS} to skip literal string and regexes.
	 * Used by the {@link module:compiler~riotjs|riotjs} parser.
	 *
	 * 2016-01-18: rewritten to not capture the brackets (reduces 9 steps)
	 * @const {RegExp}
	 */
	var JS_ES6END = RegExp('[{}]|' + brackets.S_QBLOCKS, 'g')

	/**
	 * Regex for remotion of multiline and single-line JavaScript comments, merged with
	 * {@link module:brackets.S_QBLOCKS|brackets.S_QBLOCKS} to skip literal string and regexes.
	 * @const {RegExp}
	 */
	var JS_COMMS = RegExp(brackets.R_MLCOMMS.source + '|//[^\r\n]*|' + brackets.S_QBLOCKS, 'g')

	/**
	 * Default parser for JavaScript, supports ES6-like method syntax
	 *
	 * @param   {string} js - Raw JavaScript code
	 * @returns {string} Code with ES6 methods converted to ES5, comments removed.
	 */
	function riotjs (js) {
	  var
	    parts = [],
	    match,
	    toes5,
	    pos,
	    name,
	    RE = RegExp

	  if (~js.indexOf('/')) js = rmComms(js, JS_COMMS)

	  while ((match = js.match(JS_ES6SIGN))) {

	    parts.push(RE.leftContext)
	    js  = RE.rightContext
	    pos = skipBody(js, JS_ES6END)

	    name  = match[1]
	    toes5 = !/^(?:if|while|for|switch|catch|function)$/.test(name)
	    name  = toes5 ? match[0].replace(name, 'this.' + name + ' = function') : match[0]
	    parts.push(name, js.slice(0, pos))
	    js = js.slice(pos)

	    if (toes5 && !/^\s*.\s*bind\b/.test(js)) parts.push('.bind(this)')
	  }

	  return parts.length ? parts.join('') + js : js

	  function rmComms (s, r, m) {
	    r.lastIndex = 0
	    while ((m = r.exec(s))) {
	      if (m[0][0] === '/' && !m[1] && !m[2]) {
	        s = RE.leftContext + ' ' + RE.rightContext
	        r.lastIndex = m[3] + 1
	      }
	    }
	    return s
	  }

	  function skipBody (s, r) {
	    var m, i = 1

	    r.lastIndex = 0
	    while (i && (m = r.exec(s))) {
	      if (m[0] === '{') ++i
	      else if (m[0] === '}') --i
	    }
	    return i ? s.length : r.lastIndex
	  }
	}

	/**
	 * Internal JavaScript compilation.
	 *
	 * @param   {string} js   - Raw JavaScript code
	 * @param   {object} opts - Compiler options
	 * @param   {string} type - Parser name, one of {@link module:parsers.js|parsers.js}
	 * @param   {object} parserOpts - User options passed to the parser
	 * @param   {string} url  - Of the file being compiled, passed to the parser
	 * @returns {string} Compiled code, eols normalized, trailing spaces removed
	 *
	 * @throws  Will throw "JS parser not found" if the JS parser cannot be loaded.
	 * @see     {@link module:compiler.compileJS|compileJS}
	 */
	function _compileJS (js, opts, type, parserOpts, url) {
	  if (!/\S/.test(js)) return ''
	  if (!type) type = opts.type

	  var parser = opts.parser || type && parsers._req('js.' + type, true) || riotjs

	  return parser(js, parserOpts, url).replace(/\r\n?/g, '\n').replace(TRIM_TRAIL, '')
	}

	/**
	 * Public interface to the internal JavaScript compiler, runs the parser with
	 * the JavaScript code, defaults to `riotjs`.
	 *
	 * - If the given code is empty or whitespaces only, returns an empty string
	 * - Determines the parser to use, by default the internal riotjs function
	 * - Call the parser, the default {@link module:compiler~riotjs|riotjs} removes comments,
	 *   converts ES6 method signatures to ES5 and bind to `this` if neccesary
	 * - Normalizes line-endings and trims trailing spaces before return the result
	 *
	 * @param  {string} js     - Buffer with the javascript code
	 * @param  {Object} [opts] - Compiler options (DEPRECATED parameter, don't use it)
	 * @param  {string} [type=riotjs] - Parser name, one of {@link module:parsers.js|parsers.js}
	 * @param  {Object} [userOpts={}] - User options
	 * @param  {string} [userOpts.url=process.cwd] - Url of the .tag file (passed to the parser)
	 * @param  {object} [userOpts.parserOpts={}]   - User options (passed to the parser)
	 * @returns {string} Parsed JavaScript, eols normalized, trailing spaces removed
	 * @static
	 *
	 * @see {@link module:compiler~_compileJS|_compileJS}
	 */
	function compileJS (js, opts, type, userOpts) {
	  if (typeof opts === 'string') {
	    userOpts = type
	    type = opts
	    opts = {}
	  }
	  if (type && typeof type === 'object') {
	    userOpts = type
	    type = ''
	  }
	  if (!userOpts) userOpts = {}

	  return _compileJS(js, opts || {}, type, userOpts.parserOptions, userOpts.url)
	}

	var CSS_SELECTOR = RegExp('([{}]|^)[ ;]*([^@ ;{}][^{}]*)(?={)|' + S_LINESTR, 'g')

	/**
	 * Parses styles enclosed in a "scoped" tag (`scoped` was removed from HTML5).
	 * The "css" string is received without comments or surrounding spaces.
	 *
	 * @param   {string} tag - Tag name of the root element
	 * @param   {string} css - The CSS code
	 * @returns {string} CSS with the styles scoped to the root element
	 */
	function scopedCSS (tag, css) {
	  var scope = ':scope'

	  return css.replace(CSS_SELECTOR, function (m, p1, p2) {

	    if (!p2) return m

	    p2 = p2.replace(/[^,]+/g, function (sel) {
	      var s = sel.trim()

	      if (s.indexOf(tag) === 0) {
	        return sel
	      }

	      if (!s || s === 'from' || s === 'to' || s.slice(-1) === '%') {
	        return sel
	      }

	      if (s.indexOf(scope) < 0) {
	        s = tag + ' ' + s + ',[data-is="' + tag + '"] ' + s
	      } else {
	        s = s.replace(scope, tag) + ',' +
	            s.replace(scope, '[data-is="' + tag + '"]')
	      }
	      return s
	    })

	    return p1 ? p1 + ' ' + p2 : p2
	  })
	}

	/**
	 * Internal CSS compilation.
	 * Runs any parser for style blocks and calls scopedCSS if required.
	 *
	 * @param   {string} css  - Raw CSS
	 * @param   {string} tag  - Tag name to which the style belongs to
	 * @param   {string} [type=css] - Parser name to run
	 * @param   {object} [opts={}]  - User options
	 * @returns {string} The compiled style, whitespace compacted and trimmed
	 *
	 * @throws  Will throw "CSS parser not found" if the CSS parser cannot be loaded.
	 * @throws  Using the _scoped_ option with no tagName will throw an error.
	 * @see {@link module:compiler.compileCSS|compileCSS}
	 */
	function _compileCSS (css, tag, type, opts) {
	  opts = opts || {}

	  if (type) {
	    if (type !== 'css') {

	      var parser = parsers._req('css.' + type, true)
	      css = parser(tag, css, opts.parserOpts || {}, opts.url)
	    }
	  }

	  css = css.replace(brackets.R_MLCOMMS, '').replace(/\s+/g, ' ').trim()
	  if (tag) css = scopedCSS(tag, css)

	  return css
	}

	/**
	 * Public API, wrapper of the internal {@link module:compiler~_compileCSS|_compileCSS}
	 * function, rearranges its parameters and makes these can be omitted.
	 *
	 * - If the given code is empty or whitespaces only, returns an empty string
	 * - Determines the parser to use, none by default
	 * - Call the parser, if any
	 * - Normalizes line-endings and trims trailing spaces
	 * - Call the {@link module:compiler~scopedCSS|scopedCSS} function if required by the
	 *   parameter _opts_
	 *
	 * @param   {string}  css    - Raw style block
	 * @param   {string}  [type] - Parser name, one of {@link module:parsers.css|parsers.css}
	 * @param   {object}  [opts] - User options
	 * @param   {boolean} [opts.scoped]  - Convert to Scoped CSS (requires _tagName_)
	 * @param   {string}  [opts.tagName] - Name of the root tag owner of the styles
	 * @param   {string}  [opts.url=process.cwd] - Url of the .tag file
	 * @param   {object}  [opts.parserOpts={}]   - Options for the parser
	 * @returns {string} The processed style block
	 * @static
	 *
	 * @see {@link module:compiler~_compileCSS|_compileCSS}
	 */
	function compileCSS (css, type, opts) {
	  if (type && typeof type === 'object') {
	    opts = type
	    type = ''
	  } else if (!opts) opts = {}

	  return _compileCSS(css, opts.tagName, type, opts)
	}

	/**
	 * The "defer" attribute is used to ignore `script` elements (useful for SSR).
	 *
	 * This regex is used by {@link module:compiler~getCode|getCode} to check and by
	 * {@link module:compiler.compile|compile} to remove the keyword `defer` from
	 * `<script>` tags.
	 * @const {RegExp}
	 */
	var DEFER_ATTR = /\sdefer(?=\s|>|$)/i

	/**
	 * Matches attributes 'type=value', for `<script>` and `<style>` tags.
	 * This regex does not expect expressions nor escaped quotes.
	 * @const {RegExp}
	 */
	var TYPE_ATTR = /\stype\s*=\s*(?:(['"])(.+?)\1|(\S+))/i

	/**
	 * Source string for creating generic regexes matching pairs of `attribute=value`. Used
	 * by {@link module:compiler~getAttrib|getAttrib} for the `option`, `src`, and `charset`
	 * attributes, handles escaped quotes and unquoted JSON objects with no nested brackets.
	 * @const {string}
	 */
	var MISC_ATTR = '\\s*=\\s*(' + S_STRINGS + '|{[^}]+}|\\S+)'

	/**
	 * Matches the last HTML tag ending a line. This can be one of:
	 * - self-closing tag
	 * - closing tag
	 * - tag without attributes
	 * - void tag with (optional) attributes
	 *
	 * Be aware that this regex still can be fooled by strange code like:
	 * ```js
	 * x <y -y>
	 *  z
	 * ```
	 * @const {RegExp}
	 */
	var END_TAGS = /\/>\n|^<(?:\/?-?[A-Za-z][-\w\xA0-\xFF]*\s*|-?[A-Za-z][-\w\xA0-\xFF]*\s+[-\w:\xA0-\xFF][\S\s]*?)>\n/

	/**
	 * Encloses the given string in single quotes.
	 *
	 * 2016-01-18: we must escape single quotes and backslashes before quoting the
	 * string, but there's no need to care about line-endings unless is required,
	 * as each submodule normalizes the lines.
	 *
	 * @param   {string} s - The unquoted, source string
	 * @param   {number} r - If 1, escape embeded EOLs in the source
	 * @returns {string} Quoted string, with escaped single-quotes and backslashes.
	 */
	function _q (s, r) {
	  if (!s) return "''"
	  s = SQ + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + SQ
	  return r && ~s.indexOf('\n') ? s.replace(/\n/g, '\\n') : s
	}

	/**
	 * Generates code to call the `riot.tag2` function with the processed parts.
	 *
	 * @param   {string} name - The tag name
	 * @param   {string} html - HTML (can contain embeded eols)
	 * @param   {string} css  - Styles
	 * @param   {string} attr - Root attributes
	 * @param   {string} js   - JavaScript "constructor"
	 * @param   {string} imports - Code containing 'import' statements
	 * @param   {object} opts - Compiler options
	 * @returns {string} Code to call `riot.tag2`
	 */
	function mktag (name, html, css, attr, js, imports, opts) {
	  var
	    c = opts.debug ? ',\n  ' : ', ',
	    s = '});'

	  if (js && js.slice(-1) !== '\n') s = '\n' + s

	  return imports + 'riot.tag2(\'' + name + SQ +
	    c + _q(html, 1) +
	    c + _q(css) +
	    c + _q(attr) + ', function(opts) {\n' + js + s
	}

	/**
	 * Used by the main {@link module:compiler.compile|compile} function, separates the
	 * HTML and JS parts of the tag. The last HTML element (can be a `<script>` block) must
	 * terminate a line.
	 *
	 * @param   {string} str - Tag content, normalized, without attributes
	 * @returns {Array} Parts: `[HTML, JavaScript]`
	 */
	function splitBlocks (str) {
	  if (/<[-\w]/.test(str)) {
	    var
	      m,
	      k = str.lastIndexOf('<'),
	      n = str.length

	    while (~k) {
	      m = str.slice(k, n).match(END_TAGS)
	      if (m) {
	        k += m.index + m[0].length
	        m = str.slice(0, k)
	        if (m.slice(-5) === '<-/>\n') m = m.slice(0, -5)
	        return [m, str.slice(k)]
	      }
	      n = k
	      k = str.lastIndexOf('<', k - 1)
	    }
	  }
	  return ['', str]
	}

	/**
	 * Returns the value of the 'type' attribute, with the prefix "text/" removed.
	 *
	 * @param   {string} attribs - The attributes list
	 * @returns {string} Attribute value, defaults to empty string
	 */
	function getType (attribs) {
	  if (attribs) {
	    var match = attribs.match(TYPE_ATTR)

	    match = match && (match[2] || match[3])
	    if (match) {
	      return match.replace('text/', '')
	    }
	  }
	  return ''
	}

	/**
	 * Returns the value of any attribute, or the empty string for missing attribute.
	 *
	 * @param   {string}  attribs - The attribute list
	 * @param   {string}  name    - Attribute name
	 * @returns {string} Attribute value, defaults to empty string
	 */
	function getAttrib (attribs, name) {
	  if (attribs) {
	    var match = attribs.match(RegExp('\\s' + name + MISC_ATTR, 'i'))

	    match = match && match[1]
	    if (match) {
	      return (/^['"]/).test(match) ? match.slice(1, -1) : match
	    }
	  }
	  return ''
	}

	/**
	 * Unescape any html string
	 * @param   {string} str escaped html string
	 * @returns {string} unescaped html string
	 */
	function unescapeHTML (str) {
	  return str
	          .replace(/&amp;/g, '&')
	          .replace(/&lt;/g, '<')
	          .replace(/&gt;/g, '>')
	          .replace(/&quot;/g, '"')
	          .replace(/&#039;/g, '\'')
	}

	/**
	 * Gets the parser options from the "options" attribute.
	 *
	 * @param   {string} attribs - The attribute list
	 * @returns {object} Parsed options, or null if no options
	 */
	function getParserOptions (attribs) {
	  var opts = unescapeHTML(getAttrib(attribs, 'options'))

	  return opts ? JSON.parse(opts) : null
	}

	/**
	 * Gets the parsed code for the received JavaScript code.
	 * The node version can read the code from the file system. The filename is
	 * specified through the _src_ attribute and can be absolute or relative to _base_.
	 *
	 * @param   {string} code    - The unprocessed JavaScript code
	 * @param   {object} opts    - Compiler options
	 * @param   {string} attribs - Attribute list
	 * @param   {string} base    - Full filename or path of the file being processed
	 * @returns {string} Parsed code
	 */
	function getCode (code, opts, attribs, base) {
	  var
	    type = getType(attribs),
	    src  = getAttrib(attribs, 'src'),
	    jsParserOptions = extend({}, opts.parserOptions.js)

	  if (src) {
	    if (DEFER_ATTR.test(attribs)) return false

	    var charset = getAttrib(attribs, 'charset'),
	      file = path.resolve(path.dirname(base), src)

	    code = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(file, charset || 'utf8')
	  }

	  return _compileJS(
	          code,
	          opts,
	          type,
	          extend(jsParserOptions, getParserOptions(attribs)),
	          base
	        )
	}

	/**
	 * Gets the parsed styles for the received CSS code.
	 *
	 * @param   {string} code    - Unprocessed CSS
	 * @param   {object} opts    - Compiler options
	 * @param   {string} attribs - Attribute list
	 * @param   {string} url     - Of the file being processed
	 * @param   {string} tag     - Tag name of the root element
	 * @returns {string} Parsed styles
	 */
	function cssCode (code, opts, attribs, url, tag) {
	  var
	    parserStyleOptions = extend({}, opts.parserOptions.style),
	    extraOpts = {
	      parserOpts: extend(parserStyleOptions, getParserOptions(attribs)),
	      url: url
	    }

	  return _compileCSS(code, tag, getType(attribs) || opts.style, extraOpts)
	}

	/**
	 * Runs the external HTML parser for the entire tag file
	 *
	 * @param   {string} html - Entire, untouched html received for the compiler
	 * @param   {string} url  - The source url or file name
	 * @param   {string} lang - Parser's name, one of {@link module:parsers.html|parsers.html}
	 * @param   {object} opts - Extra option passed to the parser
	 * @returns {string} parsed html
	 *
	 * @throws  Will throw "Template parser not found" if the HTML parser cannot be loaded.
	 */
	function compileTemplate (html, url, lang, opts) {

	  var parser = parsers._req('html.' + lang, true)
	  return parser(html, opts, url)
	}

	var
	  /**
	   * Matches HTML elements. The opening and closing tags of multiline elements must have
	   * the same indentation (size and type).
	   *
	   * `CUST_TAG` recognizes escaped quotes, allowing its insertion into JS strings inside
	   * unquoted expressions, but disallows the character '>' within unquoted attribute values.
	   * @const {RegExp}
	   */
	  CUST_TAG = RegExp(/^([ \t]*)<(-?[A-Za-z][-\w\xA0-\xFF]*)(?:\s+([^'"\/>]+(?:(?:@|\/[^>])[^'"\/>]*)*)|\s*)?(?:\/>|>[ \t]*\n?([\S\s]*)^\1<\/\2\s*>|>(.*)<\/\2\s*>)/
	    .source.replace('@', S_STRINGS), 'gim'),
	  /**
	   * Matches `script` elements, capturing its attributes in $1 and its content in $2.
	   * Disallows the character '>' inside quoted or unquoted attribute values.
	   * @const {RegExp}
	   */
	  SCRIPTS = /<script(\s+[^>]*)?>\n?([\S\s]*?)<\/script\s*>/gi,
	  /**
	   * Matches `style` elements, capturing its attributes in $1 and its content in $2.
	   * Disallows the character '>' inside quoted or unquoted attribute values.
	   * @const {RegExp}
	   */
	  STYLES = /<style(\s+[^>]*)?>\n?([\S\s]*?)<\/style\s*>/gi

	 /**
	  * The main compiler processes all custom tags, one by one.
	  *
	  * - Sends the received source to the html parser, if any is specified
	  * - Normalizes eols, removes HTML comments and trim trailing spaces
	  * - Searches the HTML elements and extract: tag name, root attributes, and content
	  * - Parses the root attributes. Found expressions are stored in `pcex[]`
	  * - Removes _HTML_ comments and trims trailing whitespace from the content
	  * - For one-line tags, process all the content as HTML
	  * - For multiline tags, separates the HTML from any untagged JS block and, from
	  *   the html, extract and process the `style` and `script` elements
	  * - Parses the remaining html, found expressions are added to `pcex[]`
	  * - Parses the untagged JavaScript block, if any
	  * - If the `entities` option was received, returns an object with the parts,
	  *   if not, returns the code neccesary to call the `riot.tag2` function to
	  *   create a Tag instance at runtime.
	  *
	  * In .tag files, a custom tag can span multiple lines, but there should be no other
	  * elements at the start of the line (comments inclusive). Custom tags in html files
	  * don't have this restriction.
	  *
	  * @param   {string} src       - String with zero or more custom riot tags
	  * @param   {Object} [opts={}] - User options
	  * @param   {string} [url=./.] - Filename or url of the file being processed
	  * @returns {string} JavaScript code to build a Tag by the `riot.tag2` function
	  * @static
	  */
	function compile (src, opts, url) {
	  var
	    parts = [],
	    included,
	    defaultParserptions = {

	      template: {},
	      js: {},
	      style: {}
	    }

	  if (!opts) opts = {}

	  opts.parserOptions = extend(defaultParserptions, opts.parserOptions || {})

	  included = opts.exclude
	    ? function (s) { return opts.exclude.indexOf(s) < 0 } : function () { return 1 }

	  if (!url) url = process.cwd() + '/.'

	  var _bp = brackets.array(opts.brackets)

	  if (opts.template) {
	    src = compileTemplate(src, url, opts.template, opts.parserOptions.template)
	  }

	  src = cleanSource(src)
	    .replace(CUST_TAG, function (_, indent, tagName, attribs, body, body2) {
	      var
	        jscode = '',
	        styles = '',
	        html = '',
	        imports = '',
	        pcex = []

	      pcex._bp = _bp

	      tagName = tagName.toLowerCase()

	      attribs = attribs && included('attribs')
	        ? restoreExpr(
	            parseAttribs(
	              splitHtml(attribs, opts, pcex),
	            pcex),
	          pcex) : ''

	      if ((body || (body = body2)) && /\S/.test(body)) {

	        if (body2) {

	          if (included('html')) html = _compileHTML(body2, opts, pcex)
	        } else {

	          body = body.replace(RegExp('^' + indent, 'gm'), '')

	          body = body.replace(STYLES, function (_m, _attrs, _style) {
	            if (included('css')) {
	              styles += (styles ? ' ' : '') + cssCode(_style, opts, _attrs, url, tagName)
	            }
	            return ''
	          })

	          body = body.replace(SCRIPTS, function (_m, _attrs, _script) {
	            if (included('js')) {
	              var code = getCode(_script, opts, _attrs, url)

	              if (code === false) return _m.replace(DEFER_ATTR, '')
	              if (code) jscode += (jscode ? '\n' : '') + code
	            }
	            return ''
	          })

	          var blocks = splitBlocks(body.replace(TRIM_TRAIL, ''))

	          if (included('html')) {
	            html = _compileHTML(blocks[0], opts, pcex)
	          }

	          if (included('js')) {
	            body = _compileJS(blocks[1], opts, null, null, url)
	            if (body) jscode += (jscode ? '\n' : '') + body
	            jscode = jscode.replace(IMPORT_STATEMENT, function (s) {
	              imports += s.trim() + '\n'
	              return ''
	            })
	          }
	        }
	      }

	      jscode = /\S/.test(jscode) ? jscode.replace(/\n{3,}/g, '\n\n') : ''

	      if (opts.entities) {
	        parts.push({
	          tagName: tagName,
	          html: html,
	          css: styles,
	          attribs: attribs,
	          js: jscode,
	          imports: imports
	        })
	        return ''
	      }

	      return mktag(tagName, html, styles, attribs, jscode, imports, opts)
	    })

	  if (opts.entities) return parts

	  if (opts.debug && url.slice(-2) !== '/.') {
	    if (/^[\\/]/.test(url)) url = path.relative('.', url)
	    src = '//src: ' + url.replace(/\\/g, '/') + '\n' + src
	  }
	  return src
	}

	module.exports = {
	  compile: compile,
	  html: compileHTML,
	  style: _compileCSS,
	  css: compileCSS,
	  js: compileJS,
	  parsers: parsers,
	  version: 'v3.0.0'
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	/**
	 * Brackets support for the node.js version of the riot-compiler
	 * @module
	 */
	var safeRegex = __webpack_require__(83)

	/**
	 * Matches valid, multiline JavaScript comments in almost all its forms.
	 * @const {RegExp}
	 * @static
	 */
	var R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g

	/**
	 * Matches single and double quoted strings. Don't care about inner EOLs, so it
	 * can be used to match HTML strings, but skips escaped quotes as JavaScript does.
	 * Useful to skip strings in values with expressions, e.g. `name={ 'John\'s' }`.
	 * @const {RegExp}
	 * @static
	 */
	var R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g

	/**
	 * The {@link module:brackets.R_STRINGS|R_STRINGS} source combined with sources of
	 * regexes matching division operators and literal regexes, for use with the RegExp
	 * constructor. The resulting regex captures in `$1` and `$2` a single slash, depending
	 * if it matches a division operator ($1) or a literal regex ($2).
	 * @const {string}
	 * @static
	 */
	var S_QBLOCKS = R_STRINGS.source + '|' +
	  /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	  /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source

	/**
	 * Hash of regexes for matching JavaScript brackets out of quoted strings and literal
	 * regexes. Used by {@link module:brackets.split|split}, these are heavy, but their
	 * performance is acceptable.
	 * @const {object}
	 */
	var FINDBRACES = {
	  '(': RegExp('([()])|'   + S_QBLOCKS, 'g'),
	  '[': RegExp('([[\\]])|' + S_QBLOCKS, 'g'),
	  '{': RegExp('([{}])|'   + S_QBLOCKS, 'g')
	}

	/**
	 * The predefined riot brackets
	 * @const {string}
	 * @default
	 */
	var DEFAULT = '{ }'

	// Pre-made string and regexes for the default brackets
	var _pairs = [
	  '{', '}',
	  '{', '}',
	  /{[^}]*}/,
	  /\\([{}])/g,
	  /\\({)|{/g,
	  RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, 'g'),
	  DEFAULT
	]

	// Pre-made string and regexes for the last bracket pair
	var _cache = []

	/*
	  Private functions
	  ---------------------------------------------------------------------------
	*/

	/**
	 * Rewrite a regex with the default brackets replaced with the custom ones.
	 *
	 * @param   {RegExp} re - RegExp with the default riot brackets
	 * @returns {RegExp} The new regex with the default brackets replaced.
	 */
	function _rewrite (re) {
	  return RegExp(
	    re.source.replace(/{/g, _cache[2]).replace(/}/g, _cache[3]), re.global ? 'g' : ''
	  )
	}

	/*
	  Exported methods and properties
	  ---------------------------------------------------------------------------
	*/

	module.exports = {
	  R_STRINGS: R_STRINGS,
	  R_MLCOMMS: R_MLCOMMS,
	  S_QBLOCKS: S_QBLOCKS
	}

	/**
	 * Splits the received string in its template text and expression parts using
	 * balanced brackets detection to avoid require escaped brackets from the users.
	 *
	 * _For internal use by the riot-compiler._
	 *
	 * @param   {string} str - Template source to split, can be one expression
	 * @param   {number} _   - unused
	 * @param   {Array}  _bp - Info of custom brackets to use
	 * @returns {Array} Array of alternating template text and expressions.
	 *   If _str_ has one unique expression, returns two elements: `["", expression]`.
	 */
	module.exports.split = function split (str, _, _bp) {
	  /*
	    Template text is easy: closing brackets are ignored, all we have to do is find
	    the first unescaped bracket. The real work is with the expressions...

	    Expressions are not so easy. We can already ignore opening brackets, but finding
	    the correct closing bracket is tricky.
	    Strings and regexes can contain almost any combination of characters and we
	    can't deal with these complexity with our regexes, so let's hide and ignore
	    these. From there, all we need is to detect the bracketed parts and skip
	    them, as they contains most of the common characters used by riot brackets.
	    With that, we have a 90% reliability in the detection, although (hope few) some
	    custom brackets still requires to be escaped.
	  */
	  var
	    parts = [],        // holds the resulting parts
	    match,             // reused by both outer and nested searches
	    isexpr,            // we are in ttext (0) or expression (1)
	    start,             // start position of current template or expression
	    pos,               // current position (exec() result)
	    re = _bp[6]        // start with *updated* regex for opening bracket

	  isexpr = start = re.lastIndex = 0       // re is reused, we must reset lastIndex

	  while ((match = re.exec(str))) {

	    pos = match.index

	    if (isexpr) {
	      /*
	        $1: optional escape character,
	        $2: opening js bracket `{[(`,
	        $3: closing riot bracket,
	        $4 & $5: qblocks
	      */
	      if (match[2]) {                     // if have a javascript opening bracket,
	        re.lastIndex = skipBraces(str, match[2], re.lastIndex)
	        continue                          // skip the bracketed block and loop
	      }
	      if (!match[3]) {                    // if don't have a closing bracket
	        continue                          // search again
	      }
	    }

	    /*
	      At this point, we expect an _unescaped_ openning bracket in $2 for text,
	      or a closing bracket in $3 for expression. $1 may be an backslash.
	    */
	    if (!match[1]) {                      // ignore it if have an escape char
	      unescapeStr(str.slice(start, pos))  // push part, even if empty
	      start = re.lastIndex                // next position is the new start
	      re = _bp[6 + (isexpr ^= 1)] // switch mode and swap regexp
	      re.lastIndex = start                // update the regex pointer
	    }
	  }

	  if (str && start < str.length) {        // push remaining part, if we have one
	    unescapeStr(str.slice(start))
	  }

	  return parts

	  /*
	    Inner Helpers for _split()
	  */

	  /**
	   * Stores the processed string in the array `parts`.
	   * Unescape escaped brackets from expressions.
	   *
	   * @param {string} s - can be template text or an expression
	   */
	  function unescapeStr (s) {
	    if (isexpr) {
	      parts.push(s && s.replace(_bp[5], '$1'))
	    } else {
	      parts.push(s)
	    }
	  }

	  /**
	   * Find the closing JS bracket for the current block in the given string.
	   * Skips strings, regexes, and other inner blocks.
	   *
	   * @param   {string} s  - The searched buffer
	   * @param   {string} ch - Opening bracket character
	   * @param   {number} ix - Position inside `str` following the opening bracket
	   * @returns {number} Position following the closing bracket.
	   *
	   * @throws Will throw "Unbalanced brackets in ..." if the closing bracket is not found.
	   */
	  function skipBraces (s, ch, ix) {
	    var
	      mm,
	      rr = FINDBRACES[ch]

	    rr.lastIndex = ix
	    ix = 1
	    while ((mm = rr.exec(s))) {
	      if (mm[1] &&
	        !(mm[1] === ch ? ++ix : --ix)) break
	    }

	    if (ix) {
	      throw new Error('Unbalanced brackets in ...`' + s.slice(start) + '`?')
	    }
	    return rr.lastIndex
	  }
	}

	var INVALIDCH = safeRegex(/[@-@<>a-zA-Z0-9'",;\\]/, 'x00', 'x1F')   // invalid characters for brackets
	var ESCAPEDCH = /(?=[[\]()*+?.^$|])/g                               // this characters must be escaped

	/**
	 * Returns an array with information for the given brackets using a cache for the
	 * last custom brackets pair required by the caller.
	 *
	 * _For internal use by the riot-compiler._
	 *
	 * @param   {string} [pair=DEFAULT] - If used, take this pair as base
	 * @returns {Array} Information about the given brackets, in internal format.
	 *
	 * @throws Will throw "Unsupported brackets ..." if _pair_ contains invalid characters
	 *  or is not separated by one space.
	 */
	module.exports.array = function array (pair) {
	  if (!pair || pair === DEFAULT) return _pairs

	  if (_cache[8] !== pair) {
	    _cache = pair.split(' ')

	    if (_cache.length !== 2 || INVALIDCH.test(pair)) {
	      throw new Error('Unsupported brackets "' + pair + '"')
	    }
	    _cache = _cache.concat(pair.replace(ESCAPEDCH, '\\').split(' '))

	    _cache[4] = _rewrite(_cache[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4])
	    _cache[5] = _rewrite(/\\({|})/g)
	    _cache[6] = _rewrite(_pairs[6])     // for _split()
	    _cache[7] = RegExp('\\\\(' + _cache[3] + ')|([[({])|(' + _cache[3] + ')|' + S_QBLOCKS, 'g')
	    _cache[8] = pair
	  }

	  return _cache
	}


/***/ },
/* 83 */
/***/ function(module, exports) {

	
	'use strict'

	// istanbul ignore next
	function safeRegex (re) {
	  var src = re.source
	  var opt = re.global ? 'g' : ''

	  if (re.ignoreCase) opt += 'i'
	  if (re.multiline)  opt += 'm'

	  for (var i = 1; i < arguments.length; i++) {
	    src = src.replace('@', '\\' + arguments[i])
	  }

	  return new RegExp(src, opt)
	}

	module.exports = safeRegex


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The compiler.parsers object holds the compiler's predefined parsers
	 * @module
	 */
	'use strict'

	var REQPATH = './parsers/'
	var TRUE    = true
	var NULL    = null

	// Passtrough for the internal `none` and `javascript` parsers
	function _none (src) {
	  return src
	}

	// This is the main parsers object holding the html, js, and css keys
	// initialized with the parsers that cannot be required.
	//
	var _parsers = {
	  html: {},
	  css: {},
	  js: { none: _none, javascript: _none }
	}

	// Native riot parsers go here, having false if already required.
	var _loaders = {
	  html: { jade: TRUE, pug: TRUE },
	  css: { sass: TRUE, scss: TRUE, less: TRUE, stylus: TRUE },
	  js: { es6: TRUE, buble: TRUE, coffee: TRUE, livescript: TRUE, typescript: TRUE }
	}

	_loaders.js.coffeescript = TRUE // 4 the nostalgics

	/**
	 * Loads a "native" riot parser.
	 *
	 * It set the flag in the _loaders object to false for the required parser.
	 * Try to load the parser and save the module to the _parsers object.
	 * On error, throws a custom exception (adds 'riot' notice to the original).
	 * On success returns the loaded module.
	 *
	 * @param   {string} branch - The branch name inside _parsers/loaders
	 * @param   {string} parser - The parser's name
	 * @returns {Function}      Loaded module.
	 */
	function _load (branch, parser) {
	  var req = REQPATH + (parser === 'coffeescript' ? 'coffee' : parser)
	  var mod

	  _loaders[branch][parser] = false  // try once
	  _parsers[branch][parser] = null
	  try {
	    mod = _parsers[branch][parser] = __webpack_require__(85)(req)
	  } catch (e) {
	    // istanbul ignore next
	    var err = 'Can\'t load the ' + branch + '.' + parser +
	              ' riot parser: ' + ('' + e).replace(/^Error:\s/, '')
	    // istanbul ignore next
	    throw new Error(err)
	  }
	  return mod
	}

	/**
	 * Returns the branch where the parser resides, or NULL if the parser not found.
	 * If the parameter 'branch' is empty, the precedence order is js, css, html.
	 *
	 * @param   {string} branch - The name of the branch to search, can be empty
	 * @param   {string} name   - The parser's name
	 * @returns {string} Name of the parser branch.
	 */
	function _find (branch, name) {
	  return branch ? _parsers[branch][name] && branch
	    : _parsers.js[name]   ? 'js'
	    : _parsers.css[name]  ? 'css'
	    : _parsers.html[name] ? 'html' : NULL
	}

	/**
	 * Returns a parser instance by its name, requiring the module without generating error.
	 * Parsers name can include the branch (ej. 'js.es6').
	 * If branch is not included, the precedence order for searching is 'js', 'css', 'html'
	 *
	 * Public through the `parsers._req` function.
	 *
	 * @param   {string}   name  - The parser's name, as registered in the parsers object
	 * @param   {boolean}  [req] - true if required (throws on error)
	 * @returns {Function} The parser instance, null if the parser is not found.
	 */
	function _req (name, req) {
	  var
	    err,
	    mod,
	    branch,
	    parser = name.split('.')

	  if (parser.length > 1) {
	    branch = parser[0]
	    parser = parser[1]
	  } else {
	    branch = NULL
	    parser = name
	  }

	  // is the parser registered?
	  branch = _find(branch, parser)
	  if (!branch) {
	    if (req) {
	      err = 'Riot parser "' + name + '" is not registered.'
	      throw new Error(err)
	    }
	    return NULL
	  }

	  // parser registered, needs load?
	  if (_loaders[branch][parser]) {
	    if (req) {
	      mod = _load(branch, parser)
	    } else {
	      try {
	        mod = _load(branch, parser)
	      } catch (_) {
	        // istanbul ignore next
	        mod = NULL
	      }
	    }
	  } else {
	    mod = _parsers[branch][parser]
	  }

	  return mod
	}

	/**
	 * Fill the parsers object with loaders for each parser.
	 *
	 * @param   {Object} _p - The `parsers` object
	 * @returns {Object}      The received object.
	 * @private
	 */
	function _setLoaders (_p) {

	  // loads the module at first use and returns the parsed result
	  function mkloader (branch, parser) {
	    return function _loadParser (p1, p2, p3, p4) {
	      var fn = _load(branch, parser)
	      return fn(p1, p2, p3, p4)
	    }
	  }

	  for (var branch in _loaders) {
	    // istanbul ignore else
	    if (_loaders.hasOwnProperty(branch)) {
	      var names = Object.keys(_loaders[branch])

	      names.forEach(function (name) {
	        _p[branch][name] = mkloader(branch, name)
	      })
	    }
	  }
	  return _p
	}

	_setLoaders(_parsers)._req = _req

	module.exports = _parsers


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./brackets": 82,
		"./brackets.js": 82,
		"./compiler": 81,
		"./compiler.js": 81,
		"./parsers": 84,
		"./parsers.js": 84,
		"./parsers/_utils": 86,
		"./parsers/_utils.js": 86,
		"./parsers/buble": 88,
		"./parsers/buble.js": 88,
		"./parsers/coffee": 89,
		"./parsers/coffee.js": 89,
		"./parsers/es6": 90,
		"./parsers/es6.js": 90,
		"./parsers/jade": 91,
		"./parsers/jade.js": 91,
		"./parsers/less": 92,
		"./parsers/less.js": 92,
		"./parsers/livescript": 93,
		"./parsers/livescript.js": 93,
		"./parsers/pug": 94,
		"./parsers/pug.js": 94,
		"./parsers/sass": 95,
		"./parsers/sass.js": 95,
		"./parsers/scss": 96,
		"./parsers/scss.js": 96,
		"./parsers/stylus": 97,
		"./parsers/stylus.js": 97,
		"./parsers/typescript": 98,
		"./parsers/typescript.js": 98,
		"./safe-regex": 83,
		"./safe-regex.js": 83
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 85;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Utility functions
	*/
	var hasOwnProp = Object.prototype.hasOwnProperty

	/**
	 * Returns an new object with all of the properties from each received object.
	 * When there are identical properties, the right-most property takes precedence.
	 *
	 * @returns {object} A new object containing all the properties.
	 */
	function _mixobj () {
	  var target = {}

	  for (var i = 0; i < arguments.length; i++) {
	    var source = arguments[i]

	    if (source) {
	      for (var key in source) {
	        // istanbul ignore else
	        if (hasOwnProp.call(source, key)) {
	          target[key] = source[key]
	        }
	      }
	    }
	  }
	  return target
	}

	/**
	 * Loads and returns a module instance without generating error.
	 *
	 * @param {string} name - The name of the module to require
	 * @returns {Function}    Module instance, or null if error.
	 */
	function _tryreq (name) {
	  var mod = null

	  try { mod = __webpack_require__(87)(name) } catch (e) {/**/}

	  return mod
	}

	module.exports = {
	  mixobj: _mixobj,
	  tryreq: _tryreq
	}


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./_utils": 86,
		"./_utils.js": 86,
		"./buble": 88,
		"./buble.js": 88,
		"./coffee": 89,
		"./coffee.js": 89,
		"./es6": 90,
		"./es6.js": 90,
		"./jade": 91,
		"./jade.js": 91,
		"./less": 92,
		"./less.js": 92,
		"./livescript": 93,
		"./livescript.js": 93,
		"./pug": 94,
		"./pug.js": 94,
		"./sass": 95,
		"./sass.js": 95,
		"./scss": 96,
		"./scss.js": 96,
		"./stylus": 97,
		"./stylus.js": 97,
		"./typescript": 98,
		"./typescript.js": 98
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 87;


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  bublé 0.13.x JS plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-08-26: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"buble\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	module.exports = function _buble (js, opts, url) {

	  opts = mixobj({ source: url, modules: false }, opts)

	  return parser.transform(js, opts).code
	}


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  CoffeeScript JS plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"coffee-script\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var defopts = {
	  bare: true
	}

	module.exports = function _coffee (js, opts) {
	  return parser.compile(js, mixobj(defopts, opts))
	}


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  babel-core 6.x JS plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"babel-core\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	module.exports = function _babel (js, opts, url) {

	  opts = mixobj({ filename: url }, opts)

	  return parser.transform(js, opts).code
	}


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Jade HTML plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"jade\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var defopts = {
	  pretty: true,
	  doctype: 'html'
	}

	/* eslint-disable */
	console.log('DEPRECATION WARNING: jade was renamed "pug" - the jade parser will be removed in riot@3.0.0!')
	/* eslint-enable */

	module.exports = function _jade (html, opts, url) {

	  opts = mixobj(defopts, { filename: url }, opts)

	  return parser.render(html, opts)
	}


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Less CSS plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"less\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var defopts = {
	  sync: true,
	  syncImport: true,
	  compress: true
	}

	module.exports = function _less (tag, css, opts, url) {
	  var ret

	  opts = mixobj(defopts, { filename: url }, opts)

	  parser.render(css, opts, function (err, result) {
	    // istanbul ignore next
	    if (err) throw err
	    ret = result.css
	  })

	  return ret
	}


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  LiveScript JS plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"livescript\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var defopts = {
	  bare: true,
	  header: false
	}

	module.exports = function _livescript (js, opts) {
	  return parser.compile(js, mixobj(defopts, opts))
	}


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Jade HTML plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"pug\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var defopts = {
	  pretty: true,
	  doctype: 'html'
	}

	module.exports = function _pug (html, opts, url) {

	  opts = mixobj(defopts, { filename: url }, opts)

	  return parser.render(html, opts)
	}


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Sass CSS plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	  2016-08-30: Fixed issues with indentation
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  getdir = __webpack_require__(1).dirname,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"node-sass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var defopts = {
	  indentedSyntax: true,
	  omitSourceMapUrl: true,
	  outputStyle: 'compact'
	}

	module.exports = function _sass (tag, css, opts, url) {
	  var spc = css.match(/^\s+/)

	  if (spc) {
	    css = css.replace(RegExp('^' + spc[0], 'gm'), '')
	    if (/^\t/gm.test(css)) {
	      opts.indentType = 'tab'
	    }
	  }

	  opts = mixobj(defopts, { data: css, includePaths: [getdir(url)] }, opts)

	  return parser.renderSync(opts).css + ''
	}


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Scss CSS plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  getdir = __webpack_require__(1).dirname,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"node-sass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var defopts = {
	  indentedSyntax: false,
	  omitSourceMapUrl: true,
	  outputStyle: 'compact'
	}

	module.exports = function _scss (tag, css, opts, url) {

	  opts = mixobj(defopts, { data: css, includePaths: [getdir(url)] }, opts)

	  return parser.renderSync(opts).css + ''
	}


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Stylus CSS plugin, with optional nib support.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	var
	  mixobj = __webpack_require__(86).mixobj,
	  tryreq = __webpack_require__(86).tryreq,
	  parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"stylus\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	// Optional nib support
	var nib = tryreq('nib')

	// istanbul ignore next: can't run both
	module.exports = nib
	  ? function _stylus (tag, css, opts, url) {
	    opts = mixobj({ filename: url }, opts)
	    return parser(css, opts).use(nib()).import('nib').render()
	  }
	  : function _stylus (tag, css, opts, url) {
	    opts = mixobj({ filename: url }, opts)
	    return parser.render(css, opts)
	  }


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  TypeScript JS plugin.
	  Part of the riot-compiler, license MIT

	  History
	  -------
	  2016-03-09: Initital release
	*/
	module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"typescript-simple\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var JSON5 = __webpack_require__(100);
	var path = __webpack_require__(1);
	var assign = __webpack_require__(101);
	var emojiRegex = /[\uD800-\uDFFF]./;
	var emojiList = __webpack_require__(102).filter(function(emoji) {
		return emojiRegex.test(emoji)
	});

	var baseEncodeTables = {
		26: "abcdefghijklmnopqrstuvwxyz",
		32: "123456789abcdefghjkmnpqrstuvwxyz", // no 0lio
		36: "0123456789abcdefghijklmnopqrstuvwxyz",
		49: "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ", // no lIO
		52: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
		58: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ", // no 0lIO
		62: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
		64: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
	};
	var emojiCache = {};

	function encodeStringToEmoji(content, length) {
		if (emojiCache[content]) return emojiCache[content];
		length = length || 1;
		var emojis = [];
		do {
			var index = Math.floor(Math.random() * emojiList.length);
			emojis.push(emojiList[index]);
			emojiList.splice(index, 1);
		} while (--length > 0);
		var emojiEncoding = emojis.join('');
		emojiCache[content] = emojiEncoding;
		return emojiEncoding;
	}

	function encodeBufferToBase(buffer, base) {
		var encodeTable = baseEncodeTables[base];
		if (!encodeTable) throw new Error("Unknown encoding base" + base);

		var readLength = buffer.length;

		var Big = __webpack_require__(103);
		Big.RM = Big.DP = 0;
		var b = new Big(0);
		for (var i = readLength - 1; i >= 0; i--) {
			b = b.times(256).plus(buffer[i]);
		}

		var output = "";
		while (b.gt(0)) {
			output = encodeTable[b.mod(base)] + output;
			b = b.div(base);
		}

		Big.DP = 20;
		Big.RM = 1;

		return output;
	}

	exports.parseQuery = function parseQuery(query) {
		var specialValues = {
			'null': null,
			'true': true,
			'false': false
		};
		if(!query) return {};
		if(typeof query !== "string")
			return query;
		if(query.substr(0, 1) !== "?")
			throw new Error("a valid query string passed to parseQuery should begin with '?'");
		query = query.substr(1);
		var queryLength = query.length;
		if(query.substr(0, 1) === "{" && query.substr(-1) === "}") {
			return JSON5.parse(query);
		}
		var queryArgs = query.split(/[,\&]/g);
		var result = {};
		queryArgs.forEach(function(arg) {
			var idx = arg.indexOf("=");
			if(idx >= 0) {
				var name = arg.substr(0, idx);
				var value = decodeURIComponent(arg.substr(idx+1));
				if (specialValues.hasOwnProperty(value)) {
					value = specialValues[value];
				}
				if(name.substr(-2) === "[]") {
					name = decodeURIComponent(name.substr(0, name.length-2));
					if(!Array.isArray(result[name]))
						result[name] = [];
					result[name].push(value);
				} else {
					name = decodeURIComponent(name);
					result[name] = value;
				}
			} else {
				if(arg.substr(0, 1) === "-") {
					result[decodeURIComponent(arg.substr(1))] = false;
				} else if(arg.substr(0, 1) === "+") {
					result[decodeURIComponent(arg.substr(1))] = true;
				} else {
					result[decodeURIComponent(arg)] = true;
				}
			}
		});
		return result;
	};

	exports.getLoaderConfig = function(loaderContext, defaultConfigKey) {
		var query = exports.parseQuery(loaderContext.query);
		var configKey = query.config || defaultConfigKey;
		if (configKey) {
			var config = loaderContext.options[configKey] || {};
			delete query.config;
			return assign({}, config, query);
		}

		return query;
	};

	exports.stringifyRequest = function(loaderContext, request) {
		var splitted = request.split("!");
		var context = loaderContext.context || (loaderContext.options && loaderContext.options.context);
		return JSON.stringify(splitted.map(function(part) {
			if(/^\/|^[A-Z]:/i.test(part) && context) {
				part = path.relative(context, part);
				if(/^[A-Z]:/i.test(part)) {
					return part;
				} else {
					return "./" + part.replace(/\\/g, "/");
				}
			}
			return part;
		}).join("!"));
	};

	function dotRequest(obj) {
		return obj.request;
	}

	exports.getRemainingRequest = function(loaderContext) {
		if(loaderContext.remainingRequest)
			return loaderContext.remainingRequest;
		var request = loaderContext.loaders.slice(loaderContext.loaderIndex+1).map(dotRequest).concat([loaderContext.resource]);
		return request.join("!");
	};

	exports.getCurrentRequest = function(loaderContext) {
		if(loaderContext.currentRequest)
			return loaderContext.currentRequest;
		var request = loaderContext.loaders.slice(loaderContext.loaderIndex).map(dotRequest).concat([loaderContext.resource]);
		return request.join("!");
	};

	exports.isUrlRequest = function(url, root) {
		// An URL is not an request if
		// 1. it's a Data Url
		// 2. it's an absolute url or and protocol-relative
		// 3. it's some kind of url for a template
		if(/^data:|^chrome-extension:|^(https?:)?\/\/|^[\{\}\[\]#*;,'§\$%&\(=?`´\^°<>]/.test(url)) return false;
		// 4. It's also not an request if root isn't set and it's a root-relative url
		if((root === undefined || root === false) && /^\//.test(url)) return false;
		return true;
	};

	exports.urlToRequest = function(url, root) {
		var moduleRequestRegex = /^[^?]*~/;
		var request;

		if(/^[a-zA-Z]:\\|^\\\\/.test(url)) {
			// absolute windows path, keep it
			request = url;
		} else if(root !== undefined && root !== false && /^\//.test(url)) {
			// if root is set and the url is root-relative
			switch(typeof root) {
				// 1. root is a string: root is prefixed to the url
				case "string":
					// special case: `~` roots convert to module request
					if (moduleRequestRegex.test(root)) {
						request = root.replace(/([^~\/])$/, "$1/") + url.slice(1);
					} else {
						request = root + url;
					}
					break;
				// 2. root is `true`: absolute paths are allowed
				//    *nix only, windows-style absolute paths are always allowed as they doesn't start with a `/`
				case "boolean":
					request = url;
					break;
				default:
					throw new Error("Unexpected parameters to loader-utils 'urlToRequest': url = " + url + ", root = " + root + ".");
			}
		} else if(/^\.\.?\//.test(url)) {
			// A relative url stays
			request = url;
		} else {
			// every other url is threaded like a relative url
			request = "./" + url;
		}

		// A `~` makes the url an module
		if (moduleRequestRegex.test(request)) {
			request = request.replace(moduleRequestRegex, "");
		}

		return request;
	};

	exports.parseString = function parseString(str) {
		try {
			if(str[0] === '"') return JSON.parse(str);
			if(str[0] === "'" && str.substr(str.length - 1) === "'") {
				return parseString(str.replace(/\\.|"/g, function(x) {
					if(x === '"') return '\\"';
					return x;
				}).replace(/^'|'$/g, '"'));
			}
			return JSON.parse('"' + str + '"');
		} catch(e) {
			return str;
		}
	};

	exports.getHashDigest = function getHashDigest(buffer, hashType, digestType, maxLength) {
		hashType = hashType || "md5";
		maxLength = maxLength || 9999;
		var hash = __webpack_require__(104).createHash(hashType);
		hash.update(buffer);
		if (digestType === "base26" || digestType === "base32" || digestType === "base36" ||
		    digestType === "base49" || digestType === "base52" || digestType === "base58" ||
		    digestType === "base62" || digestType === "base64") {
			return encodeBufferToBase(hash.digest(), digestType.substr(4)).substr(0, maxLength);
		} else {
			return hash.digest(digestType || "hex").substr(0, maxLength);
		}
	};

	exports.interpolateName = function interpolateName(loaderContext, name, options) {
		var filename = name || "[hash].[ext]";
		var context = options.context;
		var content = options.content;
		var regExp = options.regExp;
		var ext = "bin";
		var basename = "file";
		var directory = "";
		var folder = "";
		if(loaderContext.resourcePath) {
			var resourcePath = loaderContext.resourcePath;
			var idx = resourcePath.lastIndexOf(".");
			var i = resourcePath.lastIndexOf("\\");
			var j = resourcePath.lastIndexOf("/");
			var p = i < 0 ? j : j < 0 ? i : i < j ? i : j;
			if(idx >= 0) {
				ext = resourcePath.substr(idx+1);
				resourcePath = resourcePath.substr(0, idx);
			}
			if(p >= 0) {
				basename = resourcePath.substr(p+1);
				resourcePath = resourcePath.substr(0, p+1);
			}
			if (typeof context !== 'undefined') {
				directory = path.relative(context, resourcePath + "_").replace(/\\/g, "/").replace(/\.\.(\/)?/g, "_$1");
				directory = directory.substr(0, directory.length-1);
			}
			else {
				directory = resourcePath.replace(/\\/g, "/").replace(/\.\.(\/)?/g, "_$1");
			}
			if (directory.length === 1) {
				directory = "";
			} else if (directory.length > 1) {
				folder = path.basename(directory);
			}
		}
		var url = filename;
		if(content) {
			// Match hash template
			url = url.replace(/\[(?:(\w+):)?hash(?::([a-z]+\d*))?(?::(\d+))?\]/ig, function() {
				return exports.getHashDigest(content, arguments[1], arguments[2], parseInt(arguments[3], 10));
			}).replace(/\[emoji(?::(\d+))?\]/ig, function() {
				return encodeStringToEmoji(content, arguments[1]);
			});
		}
		url = url.replace(/\[ext\]/ig, function() {
			return ext;
		}).replace(/\[name\]/ig, function() {
			return basename;
		}).replace(/\[path\]/ig, function() {
			return directory;
		}).replace(/\[folder\]/ig, function() {
			return folder;
		});
		if(regExp && loaderContext.resourcePath) {
			var re = new RegExp(regExp);
			var match = loaderContext.resourcePath.match(re);
			if(match) {
				for (var i = 0; i < match.length; i++) {
					var re = new RegExp("\\[" + i + "\\]", "ig");
					url = url.replace(re, match[i]);
				}
			}
		}
		if(typeof loaderContext.options === "object" && typeof loaderContext.options.customInterpolateName === "function") {
			url = loaderContext.options.customInterpolateName.call(loaderContext, url, name, options);
		}
		return url;
	};


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	// json5.js
	// Modern JSON. See README.md for details.
	//
	// This file is based directly off of Douglas Crockford's json_parse.js:
	// https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js

	var JSON5 = ( true ? exports : {});

	JSON5.parse = (function () {
	    "use strict";

	// This is a function that can parse a JSON5 text, producing a JavaScript
	// data structure. It is a simple, recursive descent parser. It does not use
	// eval or regular expressions, so it can be used as a model for implementing
	// a JSON5 parser in other languages.

	// We are defining the function inside of another function to avoid creating
	// global variables.

	    var at,           // The index of the current character
	        lineNumber,   // The current line number
	        columnNumber, // The current column number
	        ch,           // The current character
	        escapee = {
	            "'":  "'",
	            '"':  '"',
	            '\\': '\\',
	            '/':  '/',
	            '\n': '',       // Replace escaped newlines in strings w/ empty string
	            b:    '\b',
	            f:    '\f',
	            n:    '\n',
	            r:    '\r',
	            t:    '\t'
	        },
	        ws = [
	            ' ',
	            '\t',
	            '\r',
	            '\n',
	            '\v',
	            '\f',
	            '\xA0',
	            '\uFEFF'
	        ],
	        text,

	        renderChar = function (chr) {
	            return chr === '' ? 'EOF' : "'" + chr + "'";
	        },

	        error = function (m) {

	// Call error when something is wrong.

	            var error = new SyntaxError();
	            // beginning of message suffix to agree with that provided by Gecko - see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
	            error.message = m + " at line " + lineNumber + " column " + columnNumber + " of the JSON5 data. Still to read: " + JSON.stringify(text.substring(at - 1, at + 19));
	            error.at = at;
	            // These two property names have been chosen to agree with the ones in Gecko, the only popular
	            // environment which seems to supply this info on JSON.parse
	            error.lineNumber = lineNumber;
	            error.columnNumber = columnNumber;
	            throw error;
	        },

	        next = function (c) {

	// If a c parameter is provided, verify that it matches the current character.

	            if (c && c !== ch) {
	                error("Expected " + renderChar(c) + " instead of " + renderChar(ch));
	            }

	// Get the next character. When there are no more characters,
	// return the empty string.

	            ch = text.charAt(at);
	            at++;
	            columnNumber++;
	            if (ch === '\n' || ch === '\r' && peek() !== '\n') {
	                lineNumber++;
	                columnNumber = 0;
	            }
	            return ch;
	        },

	        peek = function () {

	// Get the next character without consuming it or
	// assigning it to the ch varaible.

	            return text.charAt(at);
	        },

	        identifier = function () {

	// Parse an identifier. Normally, reserved words are disallowed here, but we
	// only use this for unquoted object keys, where reserved words are allowed,
	// so we don't check for those here. References:
	// - http://es5.github.com/#x7.6
	// - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
	// - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
	// TODO Identifiers can have Unicode "letters" in them; add support for those.

	            var key = ch;

	            // Identifiers must start with a letter, _ or $.
	            if ((ch !== '_' && ch !== '$') &&
	                    (ch < 'a' || ch > 'z') &&
	                    (ch < 'A' || ch > 'Z')) {
	                error("Bad identifier as unquoted key");
	            }

	            // Subsequent characters can contain digits.
	            while (next() && (
	                    ch === '_' || ch === '$' ||
	                    (ch >= 'a' && ch <= 'z') ||
	                    (ch >= 'A' && ch <= 'Z') ||
	                    (ch >= '0' && ch <= '9'))) {
	                key += ch;
	            }

	            return key;
	        },

	        number = function () {

	// Parse a number value.

	            var number,
	                sign = '',
	                string = '',
	                base = 10;

	            if (ch === '-' || ch === '+') {
	                sign = ch;
	                next(ch);
	            }

	            // support for Infinity (could tweak to allow other words):
	            if (ch === 'I') {
	                number = word();
	                if (typeof number !== 'number' || isNaN(number)) {
	                    error('Unexpected word for number');
	                }
	                return (sign === '-') ? -number : number;
	            }

	            // support for NaN
	            if (ch === 'N' ) {
	              number = word();
	              if (!isNaN(number)) {
	                error('expected word to be NaN');
	              }
	              // ignore sign as -NaN also is NaN
	              return number;
	            }

	            if (ch === '0') {
	                string += ch;
	                next();
	                if (ch === 'x' || ch === 'X') {
	                    string += ch;
	                    next();
	                    base = 16;
	                } else if (ch >= '0' && ch <= '9') {
	                    error('Octal literal');
	                }
	            }

	            switch (base) {
	            case 10:
	                while (ch >= '0' && ch <= '9' ) {
	                    string += ch;
	                    next();
	                }
	                if (ch === '.') {
	                    string += '.';
	                    while (next() && ch >= '0' && ch <= '9') {
	                        string += ch;
	                    }
	                }
	                if (ch === 'e' || ch === 'E') {
	                    string += ch;
	                    next();
	                    if (ch === '-' || ch === '+') {
	                        string += ch;
	                        next();
	                    }
	                    while (ch >= '0' && ch <= '9') {
	                        string += ch;
	                        next();
	                    }
	                }
	                break;
	            case 16:
	                while (ch >= '0' && ch <= '9' || ch >= 'A' && ch <= 'F' || ch >= 'a' && ch <= 'f') {
	                    string += ch;
	                    next();
	                }
	                break;
	            }

	            if(sign === '-') {
	                number = -string;
	            } else {
	                number = +string;
	            }

	            if (!isFinite(number)) {
	                error("Bad number");
	            } else {
	                return number;
	            }
	        },

	        string = function () {

	// Parse a string value.

	            var hex,
	                i,
	                string = '',
	                delim,      // double quote or single quote
	                uffff;

	// When parsing for string values, we must look for ' or " and \ characters.

	            if (ch === '"' || ch === "'") {
	                delim = ch;
	                while (next()) {
	                    if (ch === delim) {
	                        next();
	                        return string;
	                    } else if (ch === '\\') {
	                        next();
	                        if (ch === 'u') {
	                            uffff = 0;
	                            for (i = 0; i < 4; i += 1) {
	                                hex = parseInt(next(), 16);
	                                if (!isFinite(hex)) {
	                                    break;
	                                }
	                                uffff = uffff * 16 + hex;
	                            }
	                            string += String.fromCharCode(uffff);
	                        } else if (ch === '\r') {
	                            if (peek() === '\n') {
	                                next();
	                            }
	                        } else if (typeof escapee[ch] === 'string') {
	                            string += escapee[ch];
	                        } else {
	                            break;
	                        }
	                    } else if (ch === '\n') {
	                        // unescaped newlines are invalid; see:
	                        // https://github.com/aseemk/json5/issues/24
	                        // TODO this feels special-cased; are there other
	                        // invalid unescaped chars?
	                        break;
	                    } else {
	                        string += ch;
	                    }
	                }
	            }
	            error("Bad string");
	        },

	        inlineComment = function () {

	// Skip an inline comment, assuming this is one. The current character should
	// be the second / character in the // pair that begins this inline comment.
	// To finish the inline comment, we look for a newline or the end of the text.

	            if (ch !== '/') {
	                error("Not an inline comment");
	            }

	            do {
	                next();
	                if (ch === '\n' || ch === '\r') {
	                    next();
	                    return;
	                }
	            } while (ch);
	        },

	        blockComment = function () {

	// Skip a block comment, assuming this is one. The current character should be
	// the * character in the /* pair that begins this block comment.
	// To finish the block comment, we look for an ending */ pair of characters,
	// but we also watch for the end of text before the comment is terminated.

	            if (ch !== '*') {
	                error("Not a block comment");
	            }

	            do {
	                next();
	                while (ch === '*') {
	                    next('*');
	                    if (ch === '/') {
	                        next('/');
	                        return;
	                    }
	                }
	            } while (ch);

	            error("Unterminated block comment");
	        },

	        comment = function () {

	// Skip a comment, whether inline or block-level, assuming this is one.
	// Comments always begin with a / character.

	            if (ch !== '/') {
	                error("Not a comment");
	            }

	            next('/');

	            if (ch === '/') {
	                inlineComment();
	            } else if (ch === '*') {
	                blockComment();
	            } else {
	                error("Unrecognized comment");
	            }
	        },

	        white = function () {

	// Skip whitespace and comments.
	// Note that we're detecting comments by only a single / character.
	// This works since regular expressions are not valid JSON(5), but this will
	// break if there are other valid values that begin with a / character!

	            while (ch) {
	                if (ch === '/') {
	                    comment();
	                } else if (ws.indexOf(ch) >= 0) {
	                    next();
	                } else {
	                    return;
	                }
	            }
	        },

	        word = function () {

	// true, false, or null.

	            switch (ch) {
	            case 't':
	                next('t');
	                next('r');
	                next('u');
	                next('e');
	                return true;
	            case 'f':
	                next('f');
	                next('a');
	                next('l');
	                next('s');
	                next('e');
	                return false;
	            case 'n':
	                next('n');
	                next('u');
	                next('l');
	                next('l');
	                return null;
	            case 'I':
	                next('I');
	                next('n');
	                next('f');
	                next('i');
	                next('n');
	                next('i');
	                next('t');
	                next('y');
	                return Infinity;
	            case 'N':
	              next( 'N' );
	              next( 'a' );
	              next( 'N' );
	              return NaN;
	            }
	            error("Unexpected " + renderChar(ch));
	        },

	        value,  // Place holder for the value function.

	        array = function () {

	// Parse an array value.

	            var array = [];

	            if (ch === '[') {
	                next('[');
	                white();
	                while (ch) {
	                    if (ch === ']') {
	                        next(']');
	                        return array;   // Potentially empty array
	                    }
	                    // ES5 allows omitting elements in arrays, e.g. [,] and
	                    // [,null]. We don't allow this in JSON5.
	                    if (ch === ',') {
	                        error("Missing array element");
	                    } else {
	                        array.push(value());
	                    }
	                    white();
	                    // If there's no comma after this value, this needs to
	                    // be the end of the array.
	                    if (ch !== ',') {
	                        next(']');
	                        return array;
	                    }
	                    next(',');
	                    white();
	                }
	            }
	            error("Bad array");
	        },

	        object = function () {

	// Parse an object value.

	            var key,
	                object = {};

	            if (ch === '{') {
	                next('{');
	                white();
	                while (ch) {
	                    if (ch === '}') {
	                        next('}');
	                        return object;   // Potentially empty object
	                    }

	                    // Keys can be unquoted. If they are, they need to be
	                    // valid JS identifiers.
	                    if (ch === '"' || ch === "'") {
	                        key = string();
	                    } else {
	                        key = identifier();
	                    }

	                    white();
	                    next(':');
	                    object[key] = value();
	                    white();
	                    // If there's no comma after this pair, this needs to be
	                    // the end of the object.
	                    if (ch !== ',') {
	                        next('}');
	                        return object;
	                    }
	                    next(',');
	                    white();
	                }
	            }
	            error("Bad object");
	        };

	    value = function () {

	// Parse a JSON value. It could be an object, an array, a string, a number,
	// or a word.

	        white();
	        switch (ch) {
	        case '{':
	            return object();
	        case '[':
	            return array();
	        case '"':
	        case "'":
	            return string();
	        case '-':
	        case '+':
	        case '.':
	            return number();
	        default:
	            return ch >= '0' && ch <= '9' ? number() : word();
	        }
	    };

	// Return the json_parse function. It will have access to all of the above
	// functions and variables.

	    return function (source, reviver) {
	        var result;

	        text = String(source);
	        at = 0;
	        lineNumber = 1;
	        columnNumber = 1;
	        ch = ' ';
	        result = value();
	        white();
	        if (ch) {
	            error("Syntax error");
	        }

	// If there is a reviver function, we recursively walk the new structure,
	// passing each name/value pair to the reviver function for possible
	// transformation, starting with a temporary root object that holds the result
	// in an empty key. If there is not a reviver function, we simply return the
	// result.

	        return typeof reviver === 'function' ? (function walk(holder, key) {
	            var k, v, value = holder[key];
	            if (value && typeof value === 'object') {
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = walk(value, k);
	                        if (v !== undefined) {
	                            value[k] = v;
	                        } else {
	                            delete value[k];
	                        }
	                    }
	                }
	            }
	            return reviver.call(holder, key, value);
	        }({'': result}, '')) : result;
	    };
	}());

	// JSON5 stringify will not quote keys where appropriate
	JSON5.stringify = function (obj, replacer, space) {
	    if (replacer && (typeof(replacer) !== "function" && !isArray(replacer))) {
	        throw new Error('Replacer must be a function or an array');
	    }
	    var getReplacedValueOrUndefined = function(holder, key, isTopLevel) {
	        var value = holder[key];

	        // Replace the value with its toJSON value first, if possible
	        if (value && value.toJSON && typeof value.toJSON === "function") {
	            value = value.toJSON();
	        }

	        // If the user-supplied replacer if a function, call it. If it's an array, check objects' string keys for
	        // presence in the array (removing the key/value pair from the resulting JSON if the key is missing).
	        if (typeof(replacer) === "function") {
	            return replacer.call(holder, key, value);
	        } else if(replacer) {
	            if (isTopLevel || isArray(holder) || replacer.indexOf(key) >= 0) {
	                return value;
	            } else {
	                return undefined;
	            }
	        } else {
	            return value;
	        }
	    };

	    function isWordChar(c) {
	        return (c >= 'a' && c <= 'z') ||
	            (c >= 'A' && c <= 'Z') ||
	            (c >= '0' && c <= '9') ||
	            c === '_' || c === '$';
	    }

	    function isWordStart(c) {
	        return (c >= 'a' && c <= 'z') ||
	            (c >= 'A' && c <= 'Z') ||
	            c === '_' || c === '$';
	    }

	    function isWord(key) {
	        if (typeof key !== 'string') {
	            return false;
	        }
	        if (!isWordStart(key[0])) {
	            return false;
	        }
	        var i = 1, length = key.length;
	        while (i < length) {
	            if (!isWordChar(key[i])) {
	                return false;
	            }
	            i++;
	        }
	        return true;
	    }

	    // export for use in tests
	    JSON5.isWord = isWord;

	    // polyfills
	    function isArray(obj) {
	        if (Array.isArray) {
	            return Array.isArray(obj);
	        } else {
	            return Object.prototype.toString.call(obj) === '[object Array]';
	        }
	    }

	    function isDate(obj) {
	        return Object.prototype.toString.call(obj) === '[object Date]';
	    }

	    var objStack = [];
	    function checkForCircular(obj) {
	        for (var i = 0; i < objStack.length; i++) {
	            if (objStack[i] === obj) {
	                throw new TypeError("Converting circular structure to JSON");
	            }
	        }
	    }

	    function makeIndent(str, num, noNewLine) {
	        if (!str) {
	            return "";
	        }
	        // indentation no more than 10 chars
	        if (str.length > 10) {
	            str = str.substring(0, 10);
	        }

	        var indent = noNewLine ? "" : "\n";
	        for (var i = 0; i < num; i++) {
	            indent += str;
	        }

	        return indent;
	    }

	    var indentStr;
	    if (space) {
	        if (typeof space === "string") {
	            indentStr = space;
	        } else if (typeof space === "number" && space >= 0) {
	            indentStr = makeIndent(" ", space, true);
	        } else {
	            // ignore space parameter
	        }
	    }

	    // Copied from Crokford's implementation of JSON
	    // See https://github.com/douglascrockford/JSON-js/blob/e39db4b7e6249f04a195e7dd0840e610cc9e941e/json2.js#L195
	    // Begin
	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        meta = { // table of character substitutions
	        '\b': '\\b',
	        '\t': '\\t',
	        '\n': '\\n',
	        '\f': '\\f',
	        '\r': '\\r',
	        '"' : '\\"',
	        '\\': '\\\\'
	    };
	    function escapeString(string) {

	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string' ?
	                c :
	                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }
	    // End

	    function internalStringify(holder, key, isTopLevel) {
	        var buffer, res;

	        // Replace the value, if necessary
	        var obj_part = getReplacedValueOrUndefined(holder, key, isTopLevel);

	        if (obj_part && !isDate(obj_part)) {
	            // unbox objects
	            // don't unbox dates, since will turn it into number
	            obj_part = obj_part.valueOf();
	        }
	        switch(typeof obj_part) {
	            case "boolean":
	                return obj_part.toString();

	            case "number":
	                if (isNaN(obj_part) || !isFinite(obj_part)) {
	                    return "null";
	                }
	                return obj_part.toString();

	            case "string":
	                return escapeString(obj_part.toString());

	            case "object":
	                if (obj_part === null) {
	                    return "null";
	                } else if (isArray(obj_part)) {
	                    checkForCircular(obj_part);
	                    buffer = "[";
	                    objStack.push(obj_part);

	                    for (var i = 0; i < obj_part.length; i++) {
	                        res = internalStringify(obj_part, i, false);
	                        buffer += makeIndent(indentStr, objStack.length);
	                        if (res === null || typeof res === "undefined") {
	                            buffer += "null";
	                        } else {
	                            buffer += res;
	                        }
	                        if (i < obj_part.length-1) {
	                            buffer += ",";
	                        } else if (indentStr) {
	                            buffer += "\n";
	                        }
	                    }
	                    objStack.pop();
	                    if (obj_part.length) {
	                        buffer += makeIndent(indentStr, objStack.length, true)
	                    }
	                    buffer += "]";
	                } else {
	                    checkForCircular(obj_part);
	                    buffer = "{";
	                    var nonEmpty = false;
	                    objStack.push(obj_part);
	                    for (var prop in obj_part) {
	                        if (obj_part.hasOwnProperty(prop)) {
	                            var value = internalStringify(obj_part, prop, false);
	                            isTopLevel = false;
	                            if (typeof value !== "undefined" && value !== null) {
	                                buffer += makeIndent(indentStr, objStack.length);
	                                nonEmpty = true;
	                                key = isWord(prop) ? prop : escapeString(prop);
	                                buffer += key + ":" + (indentStr ? ' ' : '') + value + ",";
	                            }
	                        }
	                    }
	                    objStack.pop();
	                    if (nonEmpty) {
	                        buffer = buffer.substring(0, buffer.length-1) + makeIndent(indentStr, objStack.length) + "}";
	                    } else {
	                        buffer = '{}';
	                    }
	                }
	                return buffer;
	            default:
	                // functions and undefined should be ignored
	                return undefined;
	        }
	    }

	    // special case...when undefined is used inside of
	    // a compound object/array, return null.
	    // but when top-level, return undefined
	    var topLevelHolder = {"":obj};
	    if (obj === undefined) {
	        return getReplacedValueOrUndefined(topLevelHolder, '', true);
	    }
	    return internalStringify(topLevelHolder, '', true);
	};


/***/ },
/* 101 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = [
	  "🀄",
	  "🃏",
	  "🅰",
	  "🅱",
	  "🅾",
	  "🅿",
	  "🆎",
	  "🆑",
	  "🆒",
	  "🆓",
	  "🆔",
	  "🆕",
	  "🆖",
	  "🆗",
	  "🆘",
	  "🆙",
	  "🆚",
	  "🇦🇨",
	  "🇦🇩",
	  "🇦🇪",
	  "🇦🇫",
	  "🇦🇬",
	  "🇦🇮",
	  "🇦🇱",
	  "🇦🇲",
	  "🇦🇴",
	  "🇦🇶",
	  "🇦🇷",
	  "🇦🇸",
	  "🇦🇹",
	  "🇦🇺",
	  "🇦🇼",
	  "🇦🇽",
	  "🇦🇿",
	  "🇦",
	  "🇧🇦",
	  "🇧🇧",
	  "🇧🇩",
	  "🇧🇪",
	  "🇧🇫",
	  "🇧🇬",
	  "🇧🇭",
	  "🇧🇮",
	  "🇧🇯",
	  "🇧🇱",
	  "🇧🇲",
	  "🇧🇳",
	  "🇧🇴",
	  "🇧🇶",
	  "🇧🇷",
	  "🇧🇸",
	  "🇧🇹",
	  "🇧🇻",
	  "🇧🇼",
	  "🇧🇾",
	  "🇧🇿",
	  "🇧",
	  "🇨🇦",
	  "🇨🇨",
	  "🇨🇩",
	  "🇨🇫",
	  "🇨🇬",
	  "🇨🇭",
	  "🇨🇮",
	  "🇨🇰",
	  "🇨🇱",
	  "🇨🇲",
	  "🇨🇳",
	  "🇨🇴",
	  "🇨🇵",
	  "🇨🇷",
	  "🇨🇺",
	  "🇨🇻",
	  "🇨🇼",
	  "🇨🇽",
	  "🇨🇾",
	  "🇨🇿",
	  "🇨",
	  "🇩🇪",
	  "🇩🇬",
	  "🇩🇯",
	  "🇩🇰",
	  "🇩🇲",
	  "🇩🇴",
	  "🇩🇿",
	  "🇩",
	  "🇪🇦",
	  "🇪🇨",
	  "🇪🇪",
	  "🇪🇬",
	  "🇪🇭",
	  "🇪🇷",
	  "🇪🇸",
	  "🇪🇹",
	  "🇪🇺",
	  "🇪",
	  "🇫🇮",
	  "🇫🇯",
	  "🇫🇰",
	  "🇫🇲",
	  "🇫🇴",
	  "🇫🇷",
	  "🇫",
	  "🇬🇦",
	  "🇬🇧",
	  "🇬🇩",
	  "🇬🇪",
	  "🇬🇫",
	  "🇬🇬",
	  "🇬🇭",
	  "🇬🇮",
	  "🇬🇱",
	  "🇬🇲",
	  "🇬🇳",
	  "🇬🇵",
	  "🇬🇶",
	  "🇬🇷",
	  "🇬🇸",
	  "🇬🇹",
	  "🇬🇺",
	  "🇬🇼",
	  "🇬🇾",
	  "🇬",
	  "🇭🇰",
	  "🇭🇲",
	  "🇭🇳",
	  "🇭🇷",
	  "🇭🇹",
	  "🇭🇺",
	  "🇭",
	  "🇮🇨",
	  "🇮🇩",
	  "🇮🇪",
	  "🇮🇱",
	  "🇮🇲",
	  "🇮🇳",
	  "🇮🇴",
	  "🇮🇶",
	  "🇮🇷",
	  "🇮🇸",
	  "🇮🇹",
	  "🇮",
	  "🇯🇪",
	  "🇯🇲",
	  "🇯🇴",
	  "🇯🇵",
	  "🇯",
	  "🇰🇪",
	  "🇰🇬",
	  "🇰🇭",
	  "🇰🇮",
	  "🇰🇲",
	  "🇰🇳",
	  "🇰🇵",
	  "🇰🇷",
	  "🇰🇼",
	  "🇰🇾",
	  "🇰🇿",
	  "🇰",
	  "🇱🇦",
	  "🇱🇧",
	  "🇱🇨",
	  "🇱🇮",
	  "🇱🇰",
	  "🇱🇷",
	  "🇱🇸",
	  "🇱🇹",
	  "🇱🇺",
	  "🇱🇻",
	  "🇱🇾",
	  "🇱",
	  "🇲🇦",
	  "🇲🇨",
	  "🇲🇩",
	  "🇲🇪",
	  "🇲🇫",
	  "🇲🇬",
	  "🇲🇭",
	  "🇲🇰",
	  "🇲🇱",
	  "🇲🇲",
	  "🇲🇳",
	  "🇲🇴",
	  "🇲🇵",
	  "🇲🇶",
	  "🇲🇷",
	  "🇲🇸",
	  "🇲🇹",
	  "🇲🇺",
	  "🇲🇻",
	  "🇲🇼",
	  "🇲🇽",
	  "🇲🇾",
	  "🇲🇿",
	  "🇲",
	  "🇳🇦",
	  "🇳🇨",
	  "🇳🇪",
	  "🇳🇫",
	  "🇳🇬",
	  "🇳🇮",
	  "🇳🇱",
	  "🇳🇴",
	  "🇳🇵",
	  "🇳🇷",
	  "🇳🇺",
	  "🇳🇿",
	  "🇳",
	  "🇴🇲",
	  "🇴",
	  "🇵🇦",
	  "🇵🇪",
	  "🇵🇫",
	  "🇵🇬",
	  "🇵🇭",
	  "🇵🇰",
	  "🇵🇱",
	  "🇵🇲",
	  "🇵🇳",
	  "🇵🇷",
	  "🇵🇸",
	  "🇵🇹",
	  "🇵🇼",
	  "🇵🇾",
	  "🇵",
	  "🇶🇦",
	  "🇶",
	  "🇷🇪",
	  "🇷🇴",
	  "🇷🇸",
	  "🇷🇺",
	  "🇷🇼",
	  "🇷",
	  "🇸🇦",
	  "🇸🇧",
	  "🇸🇨",
	  "🇸🇩",
	  "🇸🇪",
	  "🇸🇬",
	  "🇸🇭",
	  "🇸🇮",
	  "🇸🇯",
	  "🇸🇰",
	  "🇸🇱",
	  "🇸🇲",
	  "🇸🇳",
	  "🇸🇴",
	  "🇸🇷",
	  "🇸🇸",
	  "🇸🇹",
	  "🇸🇻",
	  "🇸🇽",
	  "🇸🇾",
	  "🇸🇿",
	  "🇸",
	  "🇹🇦",
	  "🇹🇨",
	  "🇹🇩",
	  "🇹🇫",
	  "🇹🇬",
	  "🇹🇭",
	  "🇹🇯",
	  "🇹🇰",
	  "🇹🇱",
	  "🇹🇲",
	  "🇹🇳",
	  "🇹🇴",
	  "🇹🇷",
	  "🇹🇹",
	  "🇹🇻",
	  "🇹🇼",
	  "🇹🇿",
	  "🇹",
	  "🇺🇦",
	  "🇺🇬",
	  "🇺🇲",
	  "🇺🇳",
	  "🇺🇸",
	  "🇺🇾",
	  "🇺🇿",
	  "🇺",
	  "🇻🇦",
	  "🇻🇨",
	  "🇻🇪",
	  "🇻🇬",
	  "🇻🇮",
	  "🇻🇳",
	  "🇻🇺",
	  "🇻",
	  "🇼🇫",
	  "🇼🇸",
	  "🇼",
	  "🇽🇰",
	  "🇽",
	  "🇾🇪",
	  "🇾🇹",
	  "🇾",
	  "🇿🇦",
	  "🇿🇲",
	  "🇿🇼",
	  "🇿",
	  "🈁",
	  "🈂",
	  "🈚",
	  "🈯",
	  "🈲",
	  "🈳",
	  "🈴",
	  "🈵",
	  "🈶",
	  "🈷",
	  "🈸",
	  "🈹",
	  "🈺",
	  "🉐",
	  "🉑",
	  "🌀",
	  "🌁",
	  "🌂",
	  "🌃",
	  "🌄",
	  "🌅",
	  "🌆",
	  "🌇",
	  "🌈",
	  "🌉",
	  "🌊",
	  "🌋",
	  "🌌",
	  "🌍",
	  "🌎",
	  "🌏",
	  "🌐",
	  "🌑",
	  "🌒",
	  "🌓",
	  "🌔",
	  "🌕",
	  "🌖",
	  "🌗",
	  "🌘",
	  "🌙",
	  "🌚",
	  "🌛",
	  "🌜",
	  "🌝",
	  "🌞",
	  "🌟",
	  "🌠",
	  "🌡",
	  "🌤",
	  "🌥",
	  "🌦",
	  "🌧",
	  "🌨",
	  "🌩",
	  "🌪",
	  "🌫",
	  "🌬",
	  "🌭",
	  "🌮",
	  "🌯",
	  "🌰",
	  "🌱",
	  "🌲",
	  "🌳",
	  "🌴",
	  "🌵",
	  "🌶",
	  "🌷",
	  "🌸",
	  "🌹",
	  "🌺",
	  "🌻",
	  "🌼",
	  "🌽",
	  "🌾",
	  "🌿",
	  "🍀",
	  "🍁",
	  "🍂",
	  "🍃",
	  "🍄",
	  "🍅",
	  "🍆",
	  "🍇",
	  "🍈",
	  "🍉",
	  "🍊",
	  "🍋",
	  "🍌",
	  "🍍",
	  "🍎",
	  "🍏",
	  "🍐",
	  "🍑",
	  "🍒",
	  "🍓",
	  "🍔",
	  "🍕",
	  "🍖",
	  "🍗",
	  "🍘",
	  "🍙",
	  "🍚",
	  "🍛",
	  "🍜",
	  "🍝",
	  "🍞",
	  "🍟",
	  "🍠",
	  "🍡",
	  "🍢",
	  "🍣",
	  "🍤",
	  "🍥",
	  "🍦",
	  "🍧",
	  "🍨",
	  "🍩",
	  "🍪",
	  "🍫",
	  "🍬",
	  "🍭",
	  "🍮",
	  "🍯",
	  "🍰",
	  "🍱",
	  "🍲",
	  "🍳",
	  "🍴",
	  "🍵",
	  "🍶",
	  "🍷",
	  "🍸",
	  "🍹",
	  "🍺",
	  "🍻",
	  "🍼",
	  "🍽",
	  "🍾",
	  "🍿",
	  "🎀",
	  "🎁",
	  "🎂",
	  "🎃",
	  "🎄",
	  "🎅🏻",
	  "🎅🏼",
	  "🎅🏽",
	  "🎅🏾",
	  "🎅🏿",
	  "🎅",
	  "🎆",
	  "🎇",
	  "🎈",
	  "🎉",
	  "🎊",
	  "🎋",
	  "🎌",
	  "🎍",
	  "🎎",
	  "🎏",
	  "🎐",
	  "🎑",
	  "🎒",
	  "🎓",
	  "🎖",
	  "🎗",
	  "🎙",
	  "🎚",
	  "🎛",
	  "🎞",
	  "🎟",
	  "🎠",
	  "🎡",
	  "🎢",
	  "🎣",
	  "🎤",
	  "🎥",
	  "🎦",
	  "🎧",
	  "🎨",
	  "🎩",
	  "🎪",
	  "🎫",
	  "🎬",
	  "🎭",
	  "🎮",
	  "🎯",
	  "🎰",
	  "🎱",
	  "🎲",
	  "🎳",
	  "🎴",
	  "🎵",
	  "🎶",
	  "🎷",
	  "🎸",
	  "🎹",
	  "🎺",
	  "🎻",
	  "🎼",
	  "🎽",
	  "🎾",
	  "🎿",
	  "🏀",
	  "🏁",
	  "🏂🏻",
	  "🏂🏼",
	  "🏂🏽",
	  "🏂🏾",
	  "🏂🏿",
	  "🏂",
	  "🏃🏻‍♀️",
	  "🏃🏻‍♂️",
	  "🏃🏻",
	  "🏃🏼‍♀️",
	  "🏃🏼‍♂️",
	  "🏃🏼",
	  "🏃🏽‍♀️",
	  "🏃🏽‍♂️",
	  "🏃🏽",
	  "🏃🏾‍♀️",
	  "🏃🏾‍♂️",
	  "🏃🏾",
	  "🏃🏿‍♀️",
	  "🏃🏿‍♂️",
	  "🏃🏿",
	  "🏃‍♀️",
	  "🏃‍♂️",
	  "🏃",
	  "🏄🏻‍♀️",
	  "🏄🏻‍♂️",
	  "🏄🏻",
	  "🏄🏼‍♀️",
	  "🏄🏼‍♂️",
	  "🏄🏼",
	  "🏄🏽‍♀️",
	  "🏄🏽‍♂️",
	  "🏄🏽",
	  "🏄🏾‍♀️",
	  "🏄🏾‍♂️",
	  "🏄🏾",
	  "🏄🏿‍♀️",
	  "🏄🏿‍♂️",
	  "🏄🏿",
	  "🏄‍♀️",
	  "🏄‍♂️",
	  "🏄",
	  "🏅",
	  "🏆",
	  "🏇🏻",
	  "🏇🏼",
	  "🏇🏽",
	  "🏇🏾",
	  "🏇🏿",
	  "🏇",
	  "🏈",
	  "🏉",
	  "🏊🏻‍♀️",
	  "🏊🏻‍♂️",
	  "🏊🏻",
	  "🏊🏼‍♀️",
	  "🏊🏼‍♂️",
	  "🏊🏼",
	  "🏊🏽‍♀️",
	  "🏊🏽‍♂️",
	  "🏊🏽",
	  "🏊🏾‍♀️",
	  "🏊🏾‍♂️",
	  "🏊🏾",
	  "🏊🏿‍♀️",
	  "🏊🏿‍♂️",
	  "🏊🏿",
	  "🏊‍♀️",
	  "🏊‍♂️",
	  "🏊",
	  "🏋🏻‍♀️",
	  "🏋🏻‍♂️",
	  "🏋🏻",
	  "🏋🏼‍♀️",
	  "🏋🏼‍♂️",
	  "🏋🏼",
	  "🏋🏽‍♀️",
	  "🏋🏽‍♂️",
	  "🏋🏽",
	  "🏋🏾‍♀️",
	  "🏋🏾‍♂️",
	  "🏋🏾",
	  "🏋🏿‍♀️",
	  "🏋🏿‍♂️",
	  "🏋🏿",
	  "🏋️‍♀️",
	  "🏋️‍♂️",
	  "🏋",
	  "🏌🏻‍♀️",
	  "🏌🏻‍♂️",
	  "🏌🏻",
	  "🏌🏼‍♀️",
	  "🏌🏼‍♂️",
	  "🏌🏼",
	  "🏌🏽‍♀️",
	  "🏌🏽‍♂️",
	  "🏌🏽",
	  "🏌🏾‍♀️",
	  "🏌🏾‍♂️",
	  "🏌🏾",
	  "🏌🏿‍♀️",
	  "🏌🏿‍♂️",
	  "🏌🏿",
	  "🏌️‍♀️",
	  "🏌️‍♂️",
	  "🏌",
	  "🏍",
	  "🏎",
	  "🏏",
	  "🏐",
	  "🏑",
	  "🏒",
	  "🏓",
	  "🏔",
	  "🏕",
	  "🏖",
	  "🏗",
	  "🏘",
	  "🏙",
	  "🏚",
	  "🏛",
	  "🏜",
	  "🏝",
	  "🏞",
	  "🏟",
	  "🏠",
	  "🏡",
	  "🏢",
	  "🏣",
	  "🏤",
	  "🏥",
	  "🏦",
	  "🏧",
	  "🏨",
	  "🏩",
	  "🏪",
	  "🏫",
	  "🏬",
	  "🏭",
	  "🏮",
	  "🏯",
	  "🏰",
	  "🏳️‍🌈",
	  "🏳",
	  "🏴‍☠️",
	  "🏴",
	  "🏵",
	  "🏷",
	  "🏸",
	  "🏹",
	  "🏺",
	  "🏻",
	  "🏼",
	  "🏽",
	  "🏾",
	  "🏿",
	  "🐀",
	  "🐁",
	  "🐂",
	  "🐃",
	  "🐄",
	  "🐅",
	  "🐆",
	  "🐇",
	  "🐈",
	  "🐉",
	  "🐊",
	  "🐋",
	  "🐌",
	  "🐍",
	  "🐎",
	  "🐏",
	  "🐐",
	  "🐑",
	  "🐒",
	  "🐓",
	  "🐔",
	  "🐕",
	  "🐖",
	  "🐗",
	  "🐘",
	  "🐙",
	  "🐚",
	  "🐛",
	  "🐜",
	  "🐝",
	  "🐞",
	  "🐟",
	  "🐠",
	  "🐡",
	  "🐢",
	  "🐣",
	  "🐤",
	  "🐥",
	  "🐦",
	  "🐧",
	  "🐨",
	  "🐩",
	  "🐪",
	  "🐫",
	  "🐬",
	  "🐭",
	  "🐮",
	  "🐯",
	  "🐰",
	  "🐱",
	  "🐲",
	  "🐳",
	  "🐴",
	  "🐵",
	  "🐶",
	  "🐷",
	  "🐸",
	  "🐹",
	  "🐺",
	  "🐻",
	  "🐼",
	  "🐽",
	  "🐾",
	  "🐿",
	  "👀",
	  "👁‍🗨",
	  "👁",
	  "👂🏻",
	  "👂🏼",
	  "👂🏽",
	  "👂🏾",
	  "👂🏿",
	  "👂",
	  "👃🏻",
	  "👃🏼",
	  "👃🏽",
	  "👃🏾",
	  "👃🏿",
	  "👃",
	  "👄",
	  "👅",
	  "👆🏻",
	  "👆🏼",
	  "👆🏽",
	  "👆🏾",
	  "👆🏿",
	  "👆",
	  "👇🏻",
	  "👇🏼",
	  "👇🏽",
	  "👇🏾",
	  "👇🏿",
	  "👇",
	  "👈🏻",
	  "👈🏼",
	  "👈🏽",
	  "👈🏾",
	  "👈🏿",
	  "👈",
	  "👉🏻",
	  "👉🏼",
	  "👉🏽",
	  "👉🏾",
	  "👉🏿",
	  "👉",
	  "👊🏻",
	  "👊🏼",
	  "👊🏽",
	  "👊🏾",
	  "👊🏿",
	  "👊",
	  "👋🏻",
	  "👋🏼",
	  "👋🏽",
	  "👋🏾",
	  "👋🏿",
	  "👋",
	  "👌🏻",
	  "👌🏼",
	  "👌🏽",
	  "👌🏾",
	  "👌🏿",
	  "👌",
	  "👍🏻",
	  "👍🏼",
	  "👍🏽",
	  "👍🏾",
	  "👍🏿",
	  "👍",
	  "👎🏻",
	  "👎🏼",
	  "👎🏽",
	  "👎🏾",
	  "👎🏿",
	  "👎",
	  "👏🏻",
	  "👏🏼",
	  "👏🏽",
	  "👏🏾",
	  "👏🏿",
	  "👏",
	  "👐🏻",
	  "👐🏼",
	  "👐🏽",
	  "👐🏾",
	  "👐🏿",
	  "👐",
	  "👑",
	  "👒",
	  "👓",
	  "👔",
	  "👕",
	  "👖",
	  "👗",
	  "👘",
	  "👙",
	  "👚",
	  "👛",
	  "👜",
	  "👝",
	  "👞",
	  "👟",
	  "👠",
	  "👡",
	  "👢",
	  "👣",
	  "👤",
	  "👥",
	  "👦🏻",
	  "👦🏼",
	  "👦🏽",
	  "👦🏾",
	  "👦🏿",
	  "👦",
	  "👧🏻",
	  "👧🏼",
	  "👧🏽",
	  "👧🏾",
	  "👧🏿",
	  "👧",
	  "👨🏻‍🌾",
	  "👨🏻‍🍳",
	  "👨🏻‍🎓",
	  "👨🏻‍🎤",
	  "👨🏻‍🎨",
	  "👨🏻‍🏫",
	  "👨🏻‍🏭",
	  "👨🏻‍💻",
	  "👨🏻‍💼",
	  "👨🏻‍🔧",
	  "👨🏻‍🔬",
	  "👨🏻‍🚀",
	  "👨🏻‍🚒",
	  "👨🏻‍⚕️",
	  "👨🏻‍⚖️",
	  "👨🏻‍✈️",
	  "👨🏻",
	  "👨🏼‍🌾",
	  "👨🏼‍🍳",
	  "👨🏼‍🎓",
	  "👨🏼‍🎤",
	  "👨🏼‍🎨",
	  "👨🏼‍🏫",
	  "👨🏼‍🏭",
	  "👨🏼‍💻",
	  "👨🏼‍💼",
	  "👨🏼‍🔧",
	  "👨🏼‍🔬",
	  "👨🏼‍🚀",
	  "👨🏼‍🚒",
	  "👨🏼‍⚕️",
	  "👨🏼‍⚖️",
	  "👨🏼‍✈️",
	  "👨🏼",
	  "👨🏽‍🌾",
	  "👨🏽‍🍳",
	  "👨🏽‍🎓",
	  "👨🏽‍🎤",
	  "👨🏽‍🎨",
	  "👨🏽‍🏫",
	  "👨🏽‍🏭",
	  "👨🏽‍💻",
	  "👨🏽‍💼",
	  "👨🏽‍🔧",
	  "👨🏽‍🔬",
	  "👨🏽‍🚀",
	  "👨🏽‍🚒",
	  "👨🏽‍⚕️",
	  "👨🏽‍⚖️",
	  "👨🏽‍✈️",
	  "👨🏽",
	  "👨🏾‍🌾",
	  "👨🏾‍🍳",
	  "👨🏾‍🎓",
	  "👨🏾‍🎤",
	  "👨🏾‍🎨",
	  "👨🏾‍🏫",
	  "👨🏾‍🏭",
	  "👨🏾‍💻",
	  "👨🏾‍💼",
	  "👨🏾‍🔧",
	  "👨🏾‍🔬",
	  "👨🏾‍🚀",
	  "👨🏾‍🚒",
	  "👨🏾‍⚕️",
	  "👨🏾‍⚖️",
	  "👨🏾‍✈️",
	  "👨🏾",
	  "👨🏿‍🌾",
	  "👨🏿‍🍳",
	  "👨🏿‍🎓",
	  "👨🏿‍🎤",
	  "👨🏿‍🎨",
	  "👨🏿‍🏫",
	  "👨🏿‍🏭",
	  "👨🏿‍💻",
	  "👨🏿‍💼",
	  "👨🏿‍🔧",
	  "👨🏿‍🔬",
	  "👨🏿‍🚀",
	  "👨🏿‍🚒",
	  "👨🏿‍⚕️",
	  "👨🏿‍⚖️",
	  "👨🏿‍✈️",
	  "👨🏿",
	  "👨‍🌾",
	  "👨‍🍳",
	  "👨‍🎓",
	  "👨‍🎤",
	  "👨‍🎨",
	  "👨‍🏫",
	  "👨‍🏭",
	  "👨‍👦‍👦",
	  "👨‍👦",
	  "👨‍👧‍👦",
	  "👨‍👧‍👧",
	  "👨‍👧",
	  "👨‍👨‍👦‍👦",
	  "👨‍👨‍👦",
	  "👨‍👨‍👧‍👦",
	  "👨‍👨‍👧‍👧",
	  "👨‍👨‍👧",
	  "👨‍👩‍👦‍👦",
	  "👨‍👩‍👦",
	  "👨‍👩‍👧‍👦",
	  "👨‍👩‍👧‍👧",
	  "👨‍👩‍👧",
	  "👨‍💻",
	  "👨‍💼",
	  "👨‍🔧",
	  "👨‍🔬",
	  "👨‍🚀",
	  "👨‍🚒",
	  "👨‍⚕️",
	  "👨‍⚖️",
	  "👨‍✈️",
	  "👨‍❤️‍👨",
	  "👨‍❤️‍💋‍👨",
	  "👨",
	  "👩🏻‍🌾",
	  "👩🏻‍🍳",
	  "👩🏻‍🎓",
	  "👩🏻‍🎤",
	  "👩🏻‍🎨",
	  "👩🏻‍🏫",
	  "👩🏻‍🏭",
	  "👩🏻‍💻",
	  "👩🏻‍💼",
	  "👩🏻‍🔧",
	  "👩🏻‍🔬",
	  "👩🏻‍🚀",
	  "👩🏻‍🚒",
	  "👩🏻‍⚕️",
	  "👩🏻‍⚖️",
	  "👩🏻‍✈️",
	  "👩🏻",
	  "👩🏼‍🌾",
	  "👩🏼‍🍳",
	  "👩🏼‍🎓",
	  "👩🏼‍🎤",
	  "👩🏼‍🎨",
	  "👩🏼‍🏫",
	  "👩🏼‍🏭",
	  "👩🏼‍💻",
	  "👩🏼‍💼",
	  "👩🏼‍🔧",
	  "👩🏼‍🔬",
	  "👩🏼‍🚀",
	  "👩🏼‍🚒",
	  "👩🏼‍⚕️",
	  "👩🏼‍⚖️",
	  "👩🏼‍✈️",
	  "👩🏼",
	  "👩🏽‍🌾",
	  "👩🏽‍🍳",
	  "👩🏽‍🎓",
	  "👩🏽‍🎤",
	  "👩🏽‍🎨",
	  "👩🏽‍🏫",
	  "👩🏽‍🏭",
	  "👩🏽‍💻",
	  "👩🏽‍💼",
	  "👩🏽‍🔧",
	  "👩🏽‍🔬",
	  "👩🏽‍🚀",
	  "👩🏽‍🚒",
	  "👩🏽‍⚕️",
	  "👩🏽‍⚖️",
	  "👩🏽‍✈️",
	  "👩🏽",
	  "👩🏾‍🌾",
	  "👩🏾‍🍳",
	  "👩🏾‍🎓",
	  "👩🏾‍🎤",
	  "👩🏾‍🎨",
	  "👩🏾‍🏫",
	  "👩🏾‍🏭",
	  "👩🏾‍💻",
	  "👩🏾‍💼",
	  "👩🏾‍🔧",
	  "👩🏾‍🔬",
	  "👩🏾‍🚀",
	  "👩🏾‍🚒",
	  "👩🏾‍⚕️",
	  "👩🏾‍⚖️",
	  "👩🏾‍✈️",
	  "👩🏾",
	  "👩🏿‍🌾",
	  "👩🏿‍🍳",
	  "👩🏿‍🎓",
	  "👩🏿‍🎤",
	  "👩🏿‍🎨",
	  "👩🏿‍🏫",
	  "👩🏿‍🏭",
	  "👩🏿‍💻",
	  "👩🏿‍💼",
	  "👩🏿‍🔧",
	  "👩🏿‍🔬",
	  "👩🏿‍🚀",
	  "👩🏿‍🚒",
	  "👩🏿‍⚕️",
	  "👩🏿‍⚖️",
	  "👩🏿‍✈️",
	  "👩🏿",
	  "👩‍🌾",
	  "👩‍🍳",
	  "👩‍🎓",
	  "👩‍🎤",
	  "👩‍🎨",
	  "👩‍🏫",
	  "👩‍🏭",
	  "👩‍👦‍👦",
	  "👩‍👦",
	  "👩‍👧‍👦",
	  "👩‍👧‍👧",
	  "👩‍👧",
	  "👩‍👩‍👦‍👦",
	  "👩‍👩‍👦",
	  "👩‍👩‍👧‍👦",
	  "👩‍👩‍👧‍👧",
	  "👩‍👩‍👧",
	  "👩‍💻",
	  "👩‍💼",
	  "👩‍🔧",
	  "👩‍🔬",
	  "👩‍🚀",
	  "👩‍🚒",
	  "👩‍⚕️",
	  "👩‍⚖️",
	  "👩‍✈️",
	  "👩‍❤️‍👨",
	  "👩‍❤️‍👩",
	  "👩‍❤️‍💋‍👨",
	  "👩‍❤️‍💋‍👩",
	  "👩",
	  "👪🏻",
	  "👪🏼",
	  "👪🏽",
	  "👪🏾",
	  "👪🏿",
	  "👪",
	  "👫🏻",
	  "👫🏼",
	  "👫🏽",
	  "👫🏾",
	  "👫🏿",
	  "👫",
	  "👬🏻",
	  "👬🏼",
	  "👬🏽",
	  "👬🏾",
	  "👬🏿",
	  "👬",
	  "👭🏻",
	  "👭🏼",
	  "👭🏽",
	  "👭🏾",
	  "👭🏿",
	  "👭",
	  "👮🏻‍♀️",
	  "👮🏻‍♂️",
	  "👮🏻",
	  "👮🏼‍♀️",
	  "👮🏼‍♂️",
	  "👮🏼",
	  "👮🏽‍♀️",
	  "👮🏽‍♂️",
	  "👮🏽",
	  "👮🏾‍♀️",
	  "👮🏾‍♂️",
	  "👮🏾",
	  "👮🏿‍♀️",
	  "👮🏿‍♂️",
	  "👮🏿",
	  "👮‍♀️",
	  "👮‍♂️",
	  "👮",
	  "👯🏻‍♀️",
	  "👯🏻‍♂️",
	  "👯🏻",
	  "👯🏼‍♀️",
	  "👯🏼‍♂️",
	  "👯🏼",
	  "👯🏽‍♀️",
	  "👯🏽‍♂️",
	  "👯🏽",
	  "👯🏾‍♀️",
	  "👯🏾‍♂️",
	  "👯🏾",
	  "👯🏿‍♀️",
	  "👯🏿‍♂️",
	  "👯🏿",
	  "👯‍♀️",
	  "👯‍♂️",
	  "👯",
	  "👰🏻",
	  "👰🏼",
	  "👰🏽",
	  "👰🏾",
	  "👰🏿",
	  "👰",
	  "👱🏻‍♀️",
	  "👱🏻‍♂️",
	  "👱🏻",
	  "👱🏼‍♀️",
	  "👱🏼‍♂️",
	  "👱🏼",
	  "👱🏽‍♀️",
	  "👱🏽‍♂️",
	  "👱🏽",
	  "👱🏾‍♀️",
	  "👱🏾‍♂️",
	  "👱🏾",
	  "👱🏿‍♀️",
	  "👱🏿‍♂️",
	  "👱🏿",
	  "👱‍♀️",
	  "👱‍♂️",
	  "👱",
	  "👲🏻",
	  "👲🏼",
	  "👲🏽",
	  "👲🏾",
	  "👲🏿",
	  "👲",
	  "👳🏻‍♀️",
	  "👳🏻‍♂️",
	  "👳🏻",
	  "👳🏼‍♀️",
	  "👳🏼‍♂️",
	  "👳🏼",
	  "👳🏽‍♀️",
	  "👳🏽‍♂️",
	  "👳🏽",
	  "👳🏾‍♀️",
	  "👳🏾‍♂️",
	  "👳🏾",
	  "👳🏿‍♀️",
	  "👳🏿‍♂️",
	  "👳🏿",
	  "👳‍♀️",
	  "👳‍♂️",
	  "👳",
	  "👴🏻",
	  "👴🏼",
	  "👴🏽",
	  "👴🏾",
	  "👴🏿",
	  "👴",
	  "👵🏻",
	  "👵🏼",
	  "👵🏽",
	  "👵🏾",
	  "👵🏿",
	  "👵",
	  "👶🏻",
	  "👶🏼",
	  "👶🏽",
	  "👶🏾",
	  "👶🏿",
	  "👶",
	  "👷🏻‍♀️",
	  "👷🏻‍♂️",
	  "👷🏻",
	  "👷🏼‍♀️",
	  "👷🏼‍♂️",
	  "👷🏼",
	  "👷🏽‍♀️",
	  "👷🏽‍♂️",
	  "👷🏽",
	  "👷🏾‍♀️",
	  "👷🏾‍♂️",
	  "👷🏾",
	  "👷🏿‍♀️",
	  "👷🏿‍♂️",
	  "👷🏿",
	  "👷‍♀️",
	  "👷‍♂️",
	  "👷",
	  "👸🏻",
	  "👸🏼",
	  "👸🏽",
	  "👸🏾",
	  "👸🏿",
	  "👸",
	  "👹",
	  "👺",
	  "👻",
	  "👼🏻",
	  "👼🏼",
	  "👼🏽",
	  "👼🏾",
	  "👼🏿",
	  "👼",
	  "👽",
	  "👾",
	  "👿",
	  "💀",
	  "💁🏻‍♀️",
	  "💁🏻‍♂️",
	  "💁🏻",
	  "💁🏼‍♀️",
	  "💁🏼‍♂️",
	  "💁🏼",
	  "💁🏽‍♀️",
	  "💁🏽‍♂️",
	  "💁🏽",
	  "💁🏾‍♀️",
	  "💁🏾‍♂️",
	  "💁🏾",
	  "💁🏿‍♀️",
	  "💁🏿‍♂️",
	  "💁🏿",
	  "💁‍♀️",
	  "💁‍♂️",
	  "💁",
	  "💂🏻‍♀️",
	  "💂🏻‍♂️",
	  "💂🏻",
	  "💂🏼‍♀️",
	  "💂🏼‍♂️",
	  "💂🏼",
	  "💂🏽‍♀️",
	  "💂🏽‍♂️",
	  "💂🏽",
	  "💂🏾‍♀️",
	  "💂🏾‍♂️",
	  "💂🏾",
	  "💂🏿‍♀️",
	  "💂🏿‍♂️",
	  "💂🏿",
	  "💂‍♀️",
	  "💂‍♂️",
	  "💂",
	  "💃🏻",
	  "💃🏼",
	  "💃🏽",
	  "💃🏾",
	  "💃🏿",
	  "💃",
	  "💄",
	  "💅🏻",
	  "💅🏼",
	  "💅🏽",
	  "💅🏾",
	  "💅🏿",
	  "💅",
	  "💆🏻‍♀️",
	  "💆🏻‍♂️",
	  "💆🏻",
	  "💆🏼‍♀️",
	  "💆🏼‍♂️",
	  "💆🏼",
	  "💆🏽‍♀️",
	  "💆🏽‍♂️",
	  "💆🏽",
	  "💆🏾‍♀️",
	  "💆🏾‍♂️",
	  "💆🏾",
	  "💆🏿‍♀️",
	  "💆🏿‍♂️",
	  "💆🏿",
	  "💆‍♀️",
	  "💆‍♂️",
	  "💆",
	  "💇🏻‍♀️",
	  "💇🏻‍♂️",
	  "💇🏻",
	  "💇🏼‍♀️",
	  "💇🏼‍♂️",
	  "💇🏼",
	  "💇🏽‍♀️",
	  "💇🏽‍♂️",
	  "💇🏽",
	  "💇🏾‍♀️",
	  "💇🏾‍♂️",
	  "💇🏾",
	  "💇🏿‍♀️",
	  "💇🏿‍♂️",
	  "💇🏿",
	  "💇‍♀️",
	  "💇‍♂️",
	  "💇",
	  "💈",
	  "💉",
	  "💊",
	  "💋",
	  "💌",
	  "💍",
	  "💎",
	  "💏",
	  "💐",
	  "💑",
	  "💒",
	  "💓",
	  "💔",
	  "💕",
	  "💖",
	  "💗",
	  "💘",
	  "💙",
	  "💚",
	  "💛",
	  "💜",
	  "💝",
	  "💞",
	  "💟",
	  "💠",
	  "💡",
	  "💢",
	  "💣",
	  "💤",
	  "💥",
	  "💦",
	  "💧",
	  "💨",
	  "💩",
	  "💪🏻",
	  "💪🏼",
	  "💪🏽",
	  "💪🏾",
	  "💪🏿",
	  "💪",
	  "💫",
	  "💬",
	  "💭",
	  "💮",
	  "💯",
	  "💰",
	  "💱",
	  "💲",
	  "💳",
	  "💴",
	  "💵",
	  "💶",
	  "💷",
	  "💸",
	  "💹",
	  "💺",
	  "💻",
	  "💼",
	  "💽",
	  "💾",
	  "💿",
	  "📀",
	  "📁",
	  "📂",
	  "📃",
	  "📄",
	  "📅",
	  "📆",
	  "📇",
	  "📈",
	  "📉",
	  "📊",
	  "📋",
	  "📌",
	  "📍",
	  "📎",
	  "📏",
	  "📐",
	  "📑",
	  "📒",
	  "📓",
	  "📔",
	  "📕",
	  "📖",
	  "📗",
	  "📘",
	  "📙",
	  "📚",
	  "📛",
	  "📜",
	  "📝",
	  "📞",
	  "📟",
	  "📠",
	  "📡",
	  "📢",
	  "📣",
	  "📤",
	  "📥",
	  "📦",
	  "📧",
	  "📨",
	  "📩",
	  "📪",
	  "📫",
	  "📬",
	  "📭",
	  "📮",
	  "📯",
	  "📰",
	  "📱",
	  "📲",
	  "📳",
	  "📴",
	  "📵",
	  "📶",
	  "📷",
	  "📸",
	  "📹",
	  "📺",
	  "📻",
	  "📼",
	  "📽",
	  "📿",
	  "🔀",
	  "🔁",
	  "🔂",
	  "🔃",
	  "🔄",
	  "🔅",
	  "🔆",
	  "🔇",
	  "🔈",
	  "🔉",
	  "🔊",
	  "🔋",
	  "🔌",
	  "🔍",
	  "🔎",
	  "🔏",
	  "🔐",
	  "🔑",
	  "🔒",
	  "🔓",
	  "🔔",
	  "🔕",
	  "🔖",
	  "🔗",
	  "🔘",
	  "🔙",
	  "🔚",
	  "🔛",
	  "🔜",
	  "🔝",
	  "🔞",
	  "🔟",
	  "🔠",
	  "🔡",
	  "🔢",
	  "🔣",
	  "🔤",
	  "🔥",
	  "🔦",
	  "🔧",
	  "🔨",
	  "🔩",
	  "🔪",
	  "🔫",
	  "🔬",
	  "🔭",
	  "🔮",
	  "🔯",
	  "🔰",
	  "🔱",
	  "🔲",
	  "🔳",
	  "🔴",
	  "🔵",
	  "🔶",
	  "🔷",
	  "🔸",
	  "🔹",
	  "🔺",
	  "🔻",
	  "🔼",
	  "🔽",
	  "🕉",
	  "🕊",
	  "🕋",
	  "🕌",
	  "🕍",
	  "🕎",
	  "🕐",
	  "🕑",
	  "🕒",
	  "🕓",
	  "🕔",
	  "🕕",
	  "🕖",
	  "🕗",
	  "🕘",
	  "🕙",
	  "🕚",
	  "🕛",
	  "🕜",
	  "🕝",
	  "🕞",
	  "🕟",
	  "🕠",
	  "🕡",
	  "🕢",
	  "🕣",
	  "🕤",
	  "🕥",
	  "🕦",
	  "🕧",
	  "🕯",
	  "🕰",
	  "🕳",
	  "🕴🏻",
	  "🕴🏼",
	  "🕴🏽",
	  "🕴🏾",
	  "🕴🏿",
	  "🕴",
	  "🕵🏻‍♀️",
	  "🕵🏻‍♂️",
	  "🕵🏻",
	  "🕵🏼‍♀️",
	  "🕵🏼‍♂️",
	  "🕵🏼",
	  "🕵🏽‍♀️",
	  "🕵🏽‍♂️",
	  "🕵🏽",
	  "🕵🏾‍♀️",
	  "🕵🏾‍♂️",
	  "🕵🏾",
	  "🕵🏿‍♀️",
	  "🕵🏿‍♂️",
	  "🕵🏿",
	  "🕵️‍♀️",
	  "🕵️‍♂️",
	  "🕵",
	  "🕶",
	  "🕷",
	  "🕸",
	  "🕹",
	  "🕺🏻",
	  "🕺🏼",
	  "🕺🏽",
	  "🕺🏾",
	  "🕺🏿",
	  "🕺",
	  "🖇",
	  "🖊",
	  "🖋",
	  "🖌",
	  "🖍",
	  "🖐🏻",
	  "🖐🏼",
	  "🖐🏽",
	  "🖐🏾",
	  "🖐🏿",
	  "🖐",
	  "🖕🏻",
	  "🖕🏼",
	  "🖕🏽",
	  "🖕🏾",
	  "🖕🏿",
	  "🖕",
	  "🖖🏻",
	  "🖖🏼",
	  "🖖🏽",
	  "🖖🏾",
	  "🖖🏿",
	  "🖖",
	  "🖤",
	  "🖥",
	  "🖨",
	  "🖱",
	  "🖲",
	  "🖼",
	  "🗂",
	  "🗃",
	  "🗄",
	  "🗑",
	  "🗒",
	  "🗓",
	  "🗜",
	  "🗝",
	  "🗞",
	  "🗡",
	  "🗣",
	  "🗨",
	  "🗯",
	  "🗳",
	  "🗺",
	  "🗻",
	  "🗼",
	  "🗽",
	  "🗾",
	  "🗿",
	  "😀",
	  "😁",
	  "😂",
	  "😃",
	  "😄",
	  "😅",
	  "😆",
	  "😇",
	  "😈",
	  "😉",
	  "😊",
	  "😋",
	  "😌",
	  "😍",
	  "😎",
	  "😏",
	  "😐",
	  "😑",
	  "😒",
	  "😓",
	  "😔",
	  "😕",
	  "😖",
	  "😗",
	  "😘",
	  "😙",
	  "😚",
	  "😛",
	  "😜",
	  "😝",
	  "😞",
	  "😟",
	  "😠",
	  "😡",
	  "😢",
	  "😣",
	  "😤",
	  "😥",
	  "😦",
	  "😧",
	  "😨",
	  "😩",
	  "😪",
	  "😫",
	  "😬",
	  "😭",
	  "😮",
	  "😯",
	  "😰",
	  "😱",
	  "😲",
	  "😳",
	  "😴",
	  "😵",
	  "😶",
	  "😷",
	  "😸",
	  "😹",
	  "😺",
	  "😻",
	  "😼",
	  "😽",
	  "😾",
	  "😿",
	  "🙀",
	  "🙁",
	  "🙂",
	  "🙃",
	  "🙄",
	  "🙅🏻‍♀️",
	  "🙅🏻‍♂️",
	  "🙅🏻",
	  "🙅🏼‍♀️",
	  "🙅🏼‍♂️",
	  "🙅🏼",
	  "🙅🏽‍♀️",
	  "🙅🏽‍♂️",
	  "🙅🏽",
	  "🙅🏾‍♀️",
	  "🙅🏾‍♂️",
	  "🙅🏾",
	  "🙅🏿‍♀️",
	  "🙅🏿‍♂️",
	  "🙅🏿",
	  "🙅‍♀️",
	  "🙅‍♂️",
	  "🙅",
	  "🙆🏻‍♀️",
	  "🙆🏻‍♂️",
	  "🙆🏻",
	  "🙆🏼‍♀️",
	  "🙆🏼‍♂️",
	  "🙆🏼",
	  "🙆🏽‍♀️",
	  "🙆🏽‍♂️",
	  "🙆🏽",
	  "🙆🏾‍♀️",
	  "🙆🏾‍♂️",
	  "🙆🏾",
	  "🙆🏿‍♀️",
	  "🙆🏿‍♂️",
	  "🙆🏿",
	  "🙆‍♀️",
	  "🙆‍♂️",
	  "🙆",
	  "🙇🏻‍♀️",
	  "🙇🏻‍♂️",
	  "🙇🏻",
	  "🙇🏼‍♀️",
	  "🙇🏼‍♂️",
	  "🙇🏼",
	  "🙇🏽‍♀️",
	  "🙇🏽‍♂️",
	  "🙇🏽",
	  "🙇🏾‍♀️",
	  "🙇🏾‍♂️",
	  "🙇🏾",
	  "🙇🏿‍♀️",
	  "🙇🏿‍♂️",
	  "🙇🏿",
	  "🙇‍♀️",
	  "🙇‍♂️",
	  "🙇",
	  "🙈",
	  "🙉",
	  "🙊",
	  "🙋🏻‍♀️",
	  "🙋🏻‍♂️",
	  "🙋🏻",
	  "🙋🏼‍♀️",
	  "🙋🏼‍♂️",
	  "🙋🏼",
	  "🙋🏽‍♀️",
	  "🙋🏽‍♂️",
	  "🙋🏽",
	  "🙋🏾‍♀️",
	  "🙋🏾‍♂️",
	  "🙋🏾",
	  "🙋🏿‍♀️",
	  "🙋🏿‍♂️",
	  "🙋🏿",
	  "🙋‍♀️",
	  "🙋‍♂️",
	  "🙋",
	  "🙌🏻",
	  "🙌🏼",
	  "🙌🏽",
	  "🙌🏾",
	  "🙌🏿",
	  "🙌",
	  "🙍🏻‍♀️",
	  "🙍🏻‍♂️",
	  "🙍🏻",
	  "🙍🏼‍♀️",
	  "🙍🏼‍♂️",
	  "🙍🏼",
	  "🙍🏽‍♀️",
	  "🙍🏽‍♂️",
	  "🙍🏽",
	  "🙍🏾‍♀️",
	  "🙍🏾‍♂️",
	  "🙍🏾",
	  "🙍🏿‍♀️",
	  "🙍🏿‍♂️",
	  "🙍🏿",
	  "🙍‍♀️",
	  "🙍‍♂️",
	  "🙍",
	  "🙎🏻‍♀️",
	  "🙎🏻‍♂️",
	  "🙎🏻",
	  "🙎🏼‍♀️",
	  "🙎🏼‍♂️",
	  "🙎🏼",
	  "🙎🏽‍♀️",
	  "🙎🏽‍♂️",
	  "🙎🏽",
	  "🙎🏾‍♀️",
	  "🙎🏾‍♂️",
	  "🙎🏾",
	  "🙎🏿‍♀️",
	  "🙎🏿‍♂️",
	  "🙎🏿",
	  "🙎‍♀️",
	  "🙎‍♂️",
	  "🙎",
	  "🙏🏻",
	  "🙏🏼",
	  "🙏🏽",
	  "🙏🏾",
	  "🙏🏿",
	  "🙏",
	  "🚀",
	  "🚁",
	  "🚂",
	  "🚃",
	  "🚄",
	  "🚅",
	  "🚆",
	  "🚇",
	  "🚈",
	  "🚉",
	  "🚊",
	  "🚋",
	  "🚌",
	  "🚍",
	  "🚎",
	  "🚏",
	  "🚐",
	  "🚑",
	  "🚒",
	  "🚓",
	  "🚔",
	  "🚕",
	  "🚖",
	  "🚗",
	  "🚘",
	  "🚙",
	  "🚚",
	  "🚛",
	  "🚜",
	  "🚝",
	  "🚞",
	  "🚟",
	  "🚠",
	  "🚡",
	  "🚢",
	  "🚣🏻‍♀️",
	  "🚣🏻‍♂️",
	  "🚣🏻",
	  "🚣🏼‍♀️",
	  "🚣🏼‍♂️",
	  "🚣🏼",
	  "🚣🏽‍♀️",
	  "🚣🏽‍♂️",
	  "🚣🏽",
	  "🚣🏾‍♀️",
	  "🚣🏾‍♂️",
	  "🚣🏾",
	  "🚣🏿‍♀️",
	  "🚣🏿‍♂️",
	  "🚣🏿",
	  "🚣‍♀️",
	  "🚣‍♂️",
	  "🚣",
	  "🚤",
	  "🚥",
	  "🚦",
	  "🚧",
	  "🚨",
	  "🚩",
	  "🚪",
	  "🚫",
	  "🚬",
	  "🚭",
	  "🚮",
	  "🚯",
	  "🚰",
	  "🚱",
	  "🚲",
	  "🚳",
	  "🚴🏻‍♀️",
	  "🚴🏻‍♂️",
	  "🚴🏻",
	  "🚴🏼‍♀️",
	  "🚴🏼‍♂️",
	  "🚴🏼",
	  "🚴🏽‍♀️",
	  "🚴🏽‍♂️",
	  "🚴🏽",
	  "🚴🏾‍♀️",
	  "🚴🏾‍♂️",
	  "🚴🏾",
	  "🚴🏿‍♀️",
	  "🚴🏿‍♂️",
	  "🚴🏿",
	  "🚴‍♀️",
	  "🚴‍♂️",
	  "🚴",
	  "🚵🏻‍♀️",
	  "🚵🏻‍♂️",
	  "🚵🏻",
	  "🚵🏼‍♀️",
	  "🚵🏼‍♂️",
	  "🚵🏼",
	  "🚵🏽‍♀️",
	  "🚵🏽‍♂️",
	  "🚵🏽",
	  "🚵🏾‍♀️",
	  "🚵🏾‍♂️",
	  "🚵🏾",
	  "🚵🏿‍♀️",
	  "🚵🏿‍♂️",
	  "🚵🏿",
	  "🚵‍♀️",
	  "🚵‍♂️",
	  "🚵",
	  "🚶🏻‍♀️",
	  "🚶🏻‍♂️",
	  "🚶🏻",
	  "🚶🏼‍♀️",
	  "🚶🏼‍♂️",
	  "🚶🏼",
	  "🚶🏽‍♀️",
	  "🚶🏽‍♂️",
	  "🚶🏽",
	  "🚶🏾‍♀️",
	  "🚶🏾‍♂️",
	  "🚶🏾",
	  "🚶🏿‍♀️",
	  "🚶🏿‍♂️",
	  "🚶🏿",
	  "🚶‍♀️",
	  "🚶‍♂️",
	  "🚶",
	  "🚷",
	  "🚸",
	  "🚹",
	  "🚺",
	  "🚻",
	  "🚼",
	  "🚽",
	  "🚾",
	  "🚿",
	  "🛀🏻",
	  "🛀🏼",
	  "🛀🏽",
	  "🛀🏾",
	  "🛀🏿",
	  "🛀",
	  "🛁",
	  "🛂",
	  "🛃",
	  "🛄",
	  "🛅",
	  "🛋",
	  "🛌🏻",
	  "🛌🏼",
	  "🛌🏽",
	  "🛌🏾",
	  "🛌🏿",
	  "🛌",
	  "🛍",
	  "🛎",
	  "🛏",
	  "🛐",
	  "🛑",
	  "🛒",
	  "🛠",
	  "🛡",
	  "🛢",
	  "🛣",
	  "🛤",
	  "🛥",
	  "🛩",
	  "🛫",
	  "🛬",
	  "🛰",
	  "🛳",
	  "🛴",
	  "🛵",
	  "🛶",
	  "🤐",
	  "🤑",
	  "🤒",
	  "🤓",
	  "🤔",
	  "🤕",
	  "🤖",
	  "🤗",
	  "🤘🏻",
	  "🤘🏼",
	  "🤘🏽",
	  "🤘🏾",
	  "🤘🏿",
	  "🤘",
	  "🤙🏻",
	  "🤙🏼",
	  "🤙🏽",
	  "🤙🏾",
	  "🤙🏿",
	  "🤙",
	  "🤚🏻",
	  "🤚🏼",
	  "🤚🏽",
	  "🤚🏾",
	  "🤚🏿",
	  "🤚",
	  "🤛🏻",
	  "🤛🏼",
	  "🤛🏽",
	  "🤛🏾",
	  "🤛🏿",
	  "🤛",
	  "🤜🏻",
	  "🤜🏼",
	  "🤜🏽",
	  "🤜🏾",
	  "🤜🏿",
	  "🤜",
	  "🤝🏻",
	  "🤝🏼",
	  "🤝🏽",
	  "🤝🏾",
	  "🤝🏿",
	  "🤝",
	  "🤞🏻",
	  "🤞🏼",
	  "🤞🏽",
	  "🤞🏾",
	  "🤞🏿",
	  "🤞",
	  "🤠",
	  "🤡",
	  "🤢",
	  "🤣",
	  "🤤",
	  "🤥",
	  "🤦🏻‍♀️",
	  "🤦🏻‍♂️",
	  "🤦🏻",
	  "🤦🏼‍♀️",
	  "🤦🏼‍♂️",
	  "🤦🏼",
	  "🤦🏽‍♀️",
	  "🤦🏽‍♂️",
	  "🤦🏽",
	  "🤦🏾‍♀️",
	  "🤦🏾‍♂️",
	  "🤦🏾",
	  "🤦🏿‍♀️",
	  "🤦🏿‍♂️",
	  "🤦🏿",
	  "🤦‍♀️",
	  "🤦‍♂️",
	  "🤦",
	  "🤧",
	  "🤰🏻",
	  "🤰🏼",
	  "🤰🏽",
	  "🤰🏾",
	  "🤰🏿",
	  "🤰",
	  "🤳🏻",
	  "🤳🏼",
	  "🤳🏽",
	  "🤳🏾",
	  "🤳🏿",
	  "🤳",
	  "🤴🏻",
	  "🤴🏼",
	  "🤴🏽",
	  "🤴🏾",
	  "🤴🏿",
	  "🤴",
	  "🤵🏻",
	  "🤵🏼",
	  "🤵🏽",
	  "🤵🏾",
	  "🤵🏿",
	  "🤵",
	  "🤶🏻",
	  "🤶🏼",
	  "🤶🏽",
	  "🤶🏾",
	  "🤶🏿",
	  "🤶",
	  "🤷🏻‍♀️",
	  "🤷🏻‍♂️",
	  "🤷🏻",
	  "🤷🏼‍♀️",
	  "🤷🏼‍♂️",
	  "🤷🏼",
	  "🤷🏽‍♀️",
	  "🤷🏽‍♂️",
	  "🤷🏽",
	  "🤷🏾‍♀️",
	  "🤷🏾‍♂️",
	  "🤷🏾",
	  "🤷🏿‍♀️",
	  "🤷🏿‍♂️",
	  "🤷🏿",
	  "🤷‍♀️",
	  "🤷‍♂️",
	  "🤷",
	  "🤸🏻‍♀️",
	  "🤸🏻‍♂️",
	  "🤸🏻",
	  "🤸🏼‍♀️",
	  "🤸🏼‍♂️",
	  "🤸🏼",
	  "🤸🏽‍♀️",
	  "🤸🏽‍♂️",
	  "🤸🏽",
	  "🤸🏾‍♀️",
	  "🤸🏾‍♂️",
	  "🤸🏾",
	  "🤸🏿‍♀️",
	  "🤸🏿‍♂️",
	  "🤸🏿",
	  "🤸‍♀️",
	  "🤸‍♂️",
	  "🤸",
	  "🤹🏻‍♀️",
	  "🤹🏻‍♂️",
	  "🤹🏻",
	  "🤹🏼‍♀️",
	  "🤹🏼‍♂️",
	  "🤹🏼",
	  "🤹🏽‍♀️",
	  "🤹🏽‍♂️",
	  "🤹🏽",
	  "🤹🏾‍♀️",
	  "🤹🏾‍♂️",
	  "🤹🏾",
	  "🤹🏿‍♀️",
	  "🤹🏿‍♂️",
	  "🤹🏿",
	  "🤹‍♀️",
	  "🤹‍♂️",
	  "🤹",
	  "🤺",
	  "🤼🏻‍♀️",
	  "🤼🏻‍♂️",
	  "🤼🏻",
	  "🤼🏼‍♀️",
	  "🤼🏼‍♂️",
	  "🤼🏼",
	  "🤼🏽‍♀️",
	  "🤼🏽‍♂️",
	  "🤼🏽",
	  "🤼🏾‍♀️",
	  "🤼🏾‍♂️",
	  "🤼🏾",
	  "🤼🏿‍♀️",
	  "🤼🏿‍♂️",
	  "🤼🏿",
	  "🤼‍♀️",
	  "🤼‍♂️",
	  "🤼",
	  "🤽🏻‍♀️",
	  "🤽🏻‍♂️",
	  "🤽🏻",
	  "🤽🏼‍♀️",
	  "🤽🏼‍♂️",
	  "🤽🏼",
	  "🤽🏽‍♀️",
	  "🤽🏽‍♂️",
	  "🤽🏽",
	  "🤽🏾‍♀️",
	  "🤽🏾‍♂️",
	  "🤽🏾",
	  "🤽🏿‍♀️",
	  "🤽🏿‍♂️",
	  "🤽🏿",
	  "🤽‍♀️",
	  "🤽‍♂️",
	  "🤽",
	  "🤾🏻‍♀️",
	  "🤾🏻‍♂️",
	  "🤾🏻",
	  "🤾🏼‍♀️",
	  "🤾🏼‍♂️",
	  "🤾🏼",
	  "🤾🏽‍♀️",
	  "🤾🏽‍♂️",
	  "🤾🏽",
	  "🤾🏾‍♀️",
	  "🤾🏾‍♂️",
	  "🤾🏾",
	  "🤾🏿‍♀️",
	  "🤾🏿‍♂️",
	  "🤾🏿",
	  "🤾‍♀️",
	  "🤾‍♂️",
	  "🤾",
	  "🥀",
	  "🥁",
	  "🥂",
	  "🥃",
	  "🥄",
	  "🥅",
	  "🥇",
	  "🥈",
	  "🥉",
	  "🥊",
	  "🥋",
	  "🥐",
	  "🥑",
	  "🥒",
	  "🥓",
	  "🥔",
	  "🥕",
	  "🥖",
	  "🥗",
	  "🥘",
	  "🥙",
	  "🥚",
	  "🥛",
	  "🥜",
	  "🥝",
	  "🥞",
	  "🦀",
	  "🦁",
	  "🦂",
	  "🦃",
	  "🦄",
	  "🦅",
	  "🦆",
	  "🦇",
	  "🦈",
	  "🦉",
	  "🦊",
	  "🦋",
	  "🦌",
	  "🦍",
	  "🦎",
	  "🦏",
	  "🦐",
	  "🦑",
	  "🧀",
	  "‼",
	  "⁉",
	  "™",
	  "ℹ",
	  "↔",
	  "↕",
	  "↖",
	  "↗",
	  "↘",
	  "↙",
	  "↩",
	  "↪",
	  "#⃣",
	  "⌚",
	  "⌛",
	  "⌨",
	  "⏏",
	  "⏩",
	  "⏪",
	  "⏫",
	  "⏬",
	  "⏭",
	  "⏮",
	  "⏯",
	  "⏰",
	  "⏱",
	  "⏲",
	  "⏳",
	  "⏸",
	  "⏹",
	  "⏺",
	  "Ⓜ",
	  "▪",
	  "▫",
	  "▶",
	  "◀",
	  "◻",
	  "◼",
	  "◽",
	  "◾",
	  "☀",
	  "☁",
	  "☂",
	  "☃",
	  "☄",
	  "☎",
	  "☑",
	  "☔",
	  "☕",
	  "☘",
	  "☝🏻",
	  "☝🏼",
	  "☝🏽",
	  "☝🏾",
	  "☝🏿",
	  "☝",
	  "☠",
	  "☢",
	  "☣",
	  "☦",
	  "☪",
	  "☮",
	  "☯",
	  "☸",
	  "☹",
	  "☺",
	  "♀",
	  "♂",
	  "♈",
	  "♉",
	  "♊",
	  "♋",
	  "♌",
	  "♍",
	  "♎",
	  "♏",
	  "♐",
	  "♑",
	  "♒",
	  "♓",
	  "♠",
	  "♣",
	  "♥",
	  "♦",
	  "♨",
	  "♻",
	  "♿",
	  "⚒",
	  "⚓",
	  "⚔",
	  "⚕",
	  "⚖",
	  "⚗",
	  "⚙",
	  "⚛",
	  "⚜",
	  "⚠",
	  "⚡",
	  "⚪",
	  "⚫",
	  "⚰",
	  "⚱",
	  "⚽",
	  "⚾",
	  "⛄",
	  "⛅",
	  "⛈",
	  "⛎",
	  "⛏",
	  "⛑",
	  "⛓",
	  "⛔",
	  "⛩",
	  "⛪",
	  "⛰",
	  "⛱",
	  "⛲",
	  "⛳",
	  "⛴",
	  "⛵",
	  "⛷🏻",
	  "⛷🏼",
	  "⛷🏽",
	  "⛷🏾",
	  "⛷🏿",
	  "⛷",
	  "⛸",
	  "⛹🏻‍♀️",
	  "⛹🏻‍♂️",
	  "⛹🏻",
	  "⛹🏼‍♀️",
	  "⛹🏼‍♂️",
	  "⛹🏼",
	  "⛹🏽‍♀️",
	  "⛹🏽‍♂️",
	  "⛹🏽",
	  "⛹🏾‍♀️",
	  "⛹🏾‍♂️",
	  "⛹🏾",
	  "⛹🏿‍♀️",
	  "⛹🏿‍♂️",
	  "⛹🏿",
	  "⛹️‍♀️",
	  "⛹️‍♂️",
	  "⛹",
	  "⛺",
	  "⛽",
	  "✂",
	  "✅",
	  "✈",
	  "✉",
	  "✊🏻",
	  "✊🏼",
	  "✊🏽",
	  "✊🏾",
	  "✊🏿",
	  "✊",
	  "✋🏻",
	  "✋🏼",
	  "✋🏽",
	  "✋🏾",
	  "✋🏿",
	  "✋",
	  "✌🏻",
	  "✌🏼",
	  "✌🏽",
	  "✌🏾",
	  "✌🏿",
	  "✌",
	  "✍🏻",
	  "✍🏼",
	  "✍🏽",
	  "✍🏾",
	  "✍🏿",
	  "✍",
	  "✏",
	  "✒",
	  "✔",
	  "✖",
	  "✝",
	  "✡",
	  "✨",
	  "✳",
	  "✴",
	  "❄",
	  "❇",
	  "❌",
	  "❎",
	  "❓",
	  "❔",
	  "❕",
	  "❗",
	  "❣",
	  "❤",
	  "➕",
	  "➖",
	  "➗",
	  "➡",
	  "➰",
	  "➿",
	  "⤴",
	  "⤵",
	  "*⃣",
	  "⬅",
	  "⬆",
	  "⬇",
	  "⬛",
	  "⬜",
	  "⭐",
	  "⭕",
	  "0⃣",
	  "〰",
	  "〽",
	  "1⃣",
	  "2⃣",
	  "㊗",
	  "㊙",
	  "3⃣",
	  "4⃣",
	  "5⃣",
	  "6⃣",
	  "7⃣",
	  "8⃣",
	  "9⃣",
	  "©",
	  "®",
	  ""
	]

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* big.js v3.1.3 https://github.com/MikeMcl/big.js/LICENCE */
	;(function (global) {
	    'use strict';

	/*
	  big.js v3.1.3
	  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
	  https://github.com/MikeMcl/big.js/
	  Copyright (c) 2014 Michael Mclaughlin <M8ch88l@gmail.com>
	  MIT Expat Licence
	*/

	/***************************** EDITABLE DEFAULTS ******************************/

	    // The default values below must be integers within the stated ranges.

	    /*
	     * The maximum number of decimal places of the results of operations
	     * involving division: div and sqrt, and pow with negative exponents.
	     */
	    var DP = 20,                           // 0 to MAX_DP

	        /*
	         * The rounding mode used when rounding to the above decimal places.
	         *
	         * 0 Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
	         * 1 To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
	         * 2 To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
	         * 3 Away from zero.                                  (ROUND_UP)
	         */
	        RM = 1,                            // 0, 1, 2 or 3

	        // The maximum value of DP and Big.DP.
	        MAX_DP = 1E6,                      // 0 to 1000000

	        // The maximum magnitude of the exponent argument to the pow method.
	        MAX_POWER = 1E6,                   // 1 to 1000000

	        /*
	         * The exponent value at and beneath which toString returns exponential
	         * notation.
	         * JavaScript's Number type: -7
	         * -1000000 is the minimum recommended exponent value of a Big.
	         */
	        E_NEG = -7,                   // 0 to -1000000

	        /*
	         * The exponent value at and above which toString returns exponential
	         * notation.
	         * JavaScript's Number type: 21
	         * 1000000 is the maximum recommended exponent value of a Big.
	         * (This limit is not enforced or checked.)
	         */
	        E_POS = 21,                   // 0 to 1000000

	/******************************************************************************/

	        // The shared prototype object.
	        P = {},
	        isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
	        Big;


	    /*
	     * Create and return a Big constructor.
	     *
	     */
	    function bigFactory() {

	        /*
	         * The Big constructor and exported function.
	         * Create and return a new instance of a Big number object.
	         *
	         * n {number|string|Big} A numeric value.
	         */
	        function Big(n) {
	            var x = this;

	            // Enable constructor usage without new.
	            if (!(x instanceof Big)) {
	                return n === void 0 ? bigFactory() : new Big(n);
	            }

	            // Duplicate.
	            if (n instanceof Big) {
	                x.s = n.s;
	                x.e = n.e;
	                x.c = n.c.slice();
	            } else {
	                parse(x, n);
	            }

	            /*
	             * Retain a reference to this Big constructor, and shadow
	             * Big.prototype.constructor which points to Object.
	             */
	            x.constructor = Big;
	        }

	        Big.prototype = P;
	        Big.DP = DP;
	        Big.RM = RM;
	        Big.E_NEG = E_NEG;
	        Big.E_POS = E_POS;

	        return Big;
	    }


	    // Private functions


	    /*
	     * Return a string representing the value of Big x in normal or exponential
	     * notation to dp fixed decimal places or significant digits.
	     *
	     * x {Big} The Big to format.
	     * dp {number} Integer, 0 to MAX_DP inclusive.
	     * toE {number} 1 (toExponential), 2 (toPrecision) or undefined (toFixed).
	     */
	    function format(x, dp, toE) {
	        var Big = x.constructor,

	            // The index (normal notation) of the digit that may be rounded up.
	            i = dp - (x = new Big(x)).e,
	            c = x.c;

	        // Round?
	        if (c.length > ++dp) {
	            rnd(x, i, Big.RM);
	        }

	        if (!c[0]) {
	            ++i;
	        } else if (toE) {
	            i = dp;

	        // toFixed
	        } else {
	            c = x.c;

	            // Recalculate i as x.e may have changed if value rounded up.
	            i = x.e + i + 1;
	        }

	        // Append zeros?
	        for (; c.length < i; c.push(0)) {
	        }
	        i = x.e;

	        /*
	         * toPrecision returns exponential notation if the number of
	         * significant digits specified is less than the number of digits
	         * necessary to represent the integer part of the value in normal
	         * notation.
	         */
	        return toE === 1 || toE && (dp <= i || i <= Big.E_NEG) ?

	          // Exponential notation.
	          (x.s < 0 && c[0] ? '-' : '') +
	            (c.length > 1 ? c[0] + '.' + c.join('').slice(1) : c[0]) +
	              (i < 0 ? 'e' : 'e+') + i

	          // Normal notation.
	          : x.toString();
	    }


	    /*
	     * Parse the number or string value passed to a Big constructor.
	     *
	     * x {Big} A Big number instance.
	     * n {number|string} A numeric value.
	     */
	    function parse(x, n) {
	        var e, i, nL;

	        // Minus zero?
	        if (n === 0 && 1 / n < 0) {
	            n = '-0';

	        // Ensure n is string and check validity.
	        } else if (!isValid.test(n += '')) {
	            throwErr(NaN);
	        }

	        // Determine sign.
	        x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

	        // Decimal point?
	        if ((e = n.indexOf('.')) > -1) {
	            n = n.replace('.', '');
	        }

	        // Exponential form?
	        if ((i = n.search(/e/i)) > 0) {

	            // Determine exponent.
	            if (e < 0) {
	                e = i;
	            }
	            e += +n.slice(i + 1);
	            n = n.substring(0, i);

	        } else if (e < 0) {

	            // Integer.
	            e = n.length;
	        }

	        // Determine leading zeros.
	        for (i = 0; n.charAt(i) == '0'; i++) {
	        }

	        if (i == (nL = n.length)) {

	            // Zero.
	            x.c = [ x.e = 0 ];
	        } else {

	            // Determine trailing zeros.
	            for (; n.charAt(--nL) == '0';) {
	            }

	            x.e = e - i - 1;
	            x.c = [];

	            // Convert string to array of digits without leading/trailing zeros.
	            for (e = 0; i <= nL; x.c[e++] = +n.charAt(i++)) {
	            }
	        }

	        return x;
	    }


	    /*
	     * Round Big x to a maximum of dp decimal places using rounding mode rm.
	     * Called by div, sqrt and round.
	     *
	     * x {Big} The Big to round.
	     * dp {number} Integer, 0 to MAX_DP inclusive.
	     * rm {number} 0, 1, 2 or 3 (DOWN, HALF_UP, HALF_EVEN, UP)
	     * [more] {boolean} Whether the result of division was truncated.
	     */
	    function rnd(x, dp, rm, more) {
	        var u,
	            xc = x.c,
	            i = x.e + dp + 1;

	        if (rm === 1) {

	            // xc[i] is the digit after the digit that may be rounded up.
	            more = xc[i] >= 5;
	        } else if (rm === 2) {
	            more = xc[i] > 5 || xc[i] == 5 &&
	              (more || i < 0 || xc[i + 1] !== u || xc[i - 1] & 1);
	        } else if (rm === 3) {
	            more = more || xc[i] !== u || i < 0;
	        } else {
	            more = false;

	            if (rm !== 0) {
	                throwErr('!Big.RM!');
	            }
	        }

	        if (i < 1 || !xc[0]) {

	            if (more) {

	                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
	                x.e = -dp;
	                x.c = [1];
	            } else {

	                // Zero.
	                x.c = [x.e = 0];
	            }
	        } else {

	            // Remove any digits after the required decimal places.
	            xc.length = i--;

	            // Round up?
	            if (more) {

	                // Rounding up may mean the previous digit has to be rounded up.
	                for (; ++xc[i] > 9;) {
	                    xc[i] = 0;

	                    if (!i--) {
	                        ++x.e;
	                        xc.unshift(1);
	                    }
	                }
	            }

	            // Remove trailing zeros.
	            for (i = xc.length; !xc[--i]; xc.pop()) {
	            }
	        }

	        return x;
	    }


	    /*
	     * Throw a BigError.
	     *
	     * message {string} The error message.
	     */
	    function throwErr(message) {
	        var err = new Error(message);
	        err.name = 'BigError';

	        throw err;
	    }


	    // Prototype/instance methods


	    /*
	     * Return a new Big whose value is the absolute value of this Big.
	     */
	    P.abs = function () {
	        var x = new this.constructor(this);
	        x.s = 1;

	        return x;
	    };


	    /*
	     * Return
	     * 1 if the value of this Big is greater than the value of Big y,
	     * -1 if the value of this Big is less than the value of Big y, or
	     * 0 if they have the same value.
	    */
	    P.cmp = function (y) {
	        var xNeg,
	            x = this,
	            xc = x.c,
	            yc = (y = new x.constructor(y)).c,
	            i = x.s,
	            j = y.s,
	            k = x.e,
	            l = y.e;

	        // Either zero?
	        if (!xc[0] || !yc[0]) {
	            return !xc[0] ? !yc[0] ? 0 : -j : i;
	        }

	        // Signs differ?
	        if (i != j) {
	            return i;
	        }
	        xNeg = i < 0;

	        // Compare exponents.
	        if (k != l) {
	            return k > l ^ xNeg ? 1 : -1;
	        }

	        i = -1;
	        j = (k = xc.length) < (l = yc.length) ? k : l;

	        // Compare digit by digit.
	        for (; ++i < j;) {

	            if (xc[i] != yc[i]) {
	                return xc[i] > yc[i] ^ xNeg ? 1 : -1;
	            }
	        }

	        // Compare lengths.
	        return k == l ? 0 : k > l ^ xNeg ? 1 : -1;
	    };


	    /*
	     * Return a new Big whose value is the value of this Big divided by the
	     * value of Big y, rounded, if necessary, to a maximum of Big.DP decimal
	     * places using rounding mode Big.RM.
	     */
	    P.div = function (y) {
	        var x = this,
	            Big = x.constructor,
	            // dividend
	            dvd = x.c,
	            //divisor
	            dvs = (y = new Big(y)).c,
	            s = x.s == y.s ? 1 : -1,
	            dp = Big.DP;

	        if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
	            throwErr('!Big.DP!');
	        }

	        // Either 0?
	        if (!dvd[0] || !dvs[0]) {

	            // If both are 0, throw NaN
	            if (dvd[0] == dvs[0]) {
	                throwErr(NaN);
	            }

	            // If dvs is 0, throw +-Infinity.
	            if (!dvs[0]) {
	                throwErr(s / 0);
	            }

	            // dvd is 0, return +-0.
	            return new Big(s * 0);
	        }

	        var dvsL, dvsT, next, cmp, remI, u,
	            dvsZ = dvs.slice(),
	            dvdI = dvsL = dvs.length,
	            dvdL = dvd.length,
	            // remainder
	            rem = dvd.slice(0, dvsL),
	            remL = rem.length,
	            // quotient
	            q = y,
	            qc = q.c = [],
	            qi = 0,
	            digits = dp + (q.e = x.e - y.e) + 1;

	        q.s = s;
	        s = digits < 0 ? 0 : digits;

	        // Create version of divisor with leading zero.
	        dvsZ.unshift(0);

	        // Add zeros to make remainder as long as divisor.
	        for (; remL++ < dvsL; rem.push(0)) {
	        }

	        do {

	            // 'next' is how many times the divisor goes into current remainder.
	            for (next = 0; next < 10; next++) {

	                // Compare divisor and remainder.
	                if (dvsL != (remL = rem.length)) {
	                    cmp = dvsL > remL ? 1 : -1;
	                } else {

	                    for (remI = -1, cmp = 0; ++remI < dvsL;) {

	                        if (dvs[remI] != rem[remI]) {
	                            cmp = dvs[remI] > rem[remI] ? 1 : -1;
	                            break;
	                        }
	                    }
	                }

	                // If divisor < remainder, subtract divisor from remainder.
	                if (cmp < 0) {

	                    // Remainder can't be more than 1 digit longer than divisor.
	                    // Equalise lengths using divisor with extra leading zero?
	                    for (dvsT = remL == dvsL ? dvs : dvsZ; remL;) {

	                        if (rem[--remL] < dvsT[remL]) {
	                            remI = remL;

	                            for (; remI && !rem[--remI]; rem[remI] = 9) {
	                            }
	                            --rem[remI];
	                            rem[remL] += 10;
	                        }
	                        rem[remL] -= dvsT[remL];
	                    }
	                    for (; !rem[0]; rem.shift()) {
	                    }
	                } else {
	                    break;
	                }
	            }

	            // Add the 'next' digit to the result array.
	            qc[qi++] = cmp ? next : ++next;

	            // Update the remainder.
	            if (rem[0] && cmp) {
	                rem[remL] = dvd[dvdI] || 0;
	            } else {
	                rem = [ dvd[dvdI] ];
	            }

	        } while ((dvdI++ < dvdL || rem[0] !== u) && s--);

	        // Leading zero? Do not remove if result is simply zero (qi == 1).
	        if (!qc[0] && qi != 1) {

	            // There can't be more than one zero.
	            qc.shift();
	            q.e--;
	        }

	        // Round?
	        if (qi > digits) {
	            rnd(q, dp, Big.RM, rem[0] !== u);
	        }

	        return q;
	    };


	    /*
	     * Return true if the value of this Big is equal to the value of Big y,
	     * otherwise returns false.
	     */
	    P.eq = function (y) {
	        return !this.cmp(y);
	    };


	    /*
	     * Return true if the value of this Big is greater than the value of Big y,
	     * otherwise returns false.
	     */
	    P.gt = function (y) {
	        return this.cmp(y) > 0;
	    };


	    /*
	     * Return true if the value of this Big is greater than or equal to the
	     * value of Big y, otherwise returns false.
	     */
	    P.gte = function (y) {
	        return this.cmp(y) > -1;
	    };


	    /*
	     * Return true if the value of this Big is less than the value of Big y,
	     * otherwise returns false.
	     */
	    P.lt = function (y) {
	        return this.cmp(y) < 0;
	    };


	    /*
	     * Return true if the value of this Big is less than or equal to the value
	     * of Big y, otherwise returns false.
	     */
	    P.lte = function (y) {
	         return this.cmp(y) < 1;
	    };


	    /*
	     * Return a new Big whose value is the value of this Big minus the value
	     * of Big y.
	     */
	    P.sub = P.minus = function (y) {
	        var i, j, t, xLTy,
	            x = this,
	            Big = x.constructor,
	            a = x.s,
	            b = (y = new Big(y)).s;

	        // Signs differ?
	        if (a != b) {
	            y.s = -b;
	            return x.plus(y);
	        }

	        var xc = x.c.slice(),
	            xe = x.e,
	            yc = y.c,
	            ye = y.e;

	        // Either zero?
	        if (!xc[0] || !yc[0]) {

	            // y is non-zero? x is non-zero? Or both are zero.
	            return yc[0] ? (y.s = -b, y) : new Big(xc[0] ? x : 0);
	        }

	        // Determine which is the bigger number.
	        // Prepend zeros to equalise exponents.
	        if (a = xe - ye) {

	            if (xLTy = a < 0) {
	                a = -a;
	                t = xc;
	            } else {
	                ye = xe;
	                t = yc;
	            }

	            t.reverse();
	            for (b = a; b--; t.push(0)) {
	            }
	            t.reverse();
	        } else {

	            // Exponents equal. Check digit by digit.
	            j = ((xLTy = xc.length < yc.length) ? xc : yc).length;

	            for (a = b = 0; b < j; b++) {

	                if (xc[b] != yc[b]) {
	                    xLTy = xc[b] < yc[b];
	                    break;
	                }
	            }
	        }

	        // x < y? Point xc to the array of the bigger number.
	        if (xLTy) {
	            t = xc;
	            xc = yc;
	            yc = t;
	            y.s = -y.s;
	        }

	        /*
	         * Append zeros to xc if shorter. No need to add zeros to yc if shorter
	         * as subtraction only needs to start at yc.length.
	         */
	        if (( b = (j = yc.length) - (i = xc.length) ) > 0) {

	            for (; b--; xc[i++] = 0) {
	            }
	        }

	        // Subtract yc from xc.
	        for (b = i; j > a;){

	            if (xc[--j] < yc[j]) {

	                for (i = j; i && !xc[--i]; xc[i] = 9) {
	                }
	                --xc[i];
	                xc[j] += 10;
	            }
	            xc[j] -= yc[j];
	        }

	        // Remove trailing zeros.
	        for (; xc[--b] === 0; xc.pop()) {
	        }

	        // Remove leading zeros and adjust exponent accordingly.
	        for (; xc[0] === 0;) {
	            xc.shift();
	            --ye;
	        }

	        if (!xc[0]) {

	            // n - n = +0
	            y.s = 1;

	            // Result must be zero.
	            xc = [ye = 0];
	        }

	        y.c = xc;
	        y.e = ye;

	        return y;
	    };


	    /*
	     * Return a new Big whose value is the value of this Big modulo the
	     * value of Big y.
	     */
	    P.mod = function (y) {
	        var yGTx,
	            x = this,
	            Big = x.constructor,
	            a = x.s,
	            b = (y = new Big(y)).s;

	        if (!y.c[0]) {
	            throwErr(NaN);
	        }

	        x.s = y.s = 1;
	        yGTx = y.cmp(x) == 1;
	        x.s = a;
	        y.s = b;

	        if (yGTx) {
	            return new Big(x);
	        }

	        a = Big.DP;
	        b = Big.RM;
	        Big.DP = Big.RM = 0;
	        x = x.div(y);
	        Big.DP = a;
	        Big.RM = b;

	        return this.minus( x.times(y) );
	    };


	    /*
	     * Return a new Big whose value is the value of this Big plus the value
	     * of Big y.
	     */
	    P.add = P.plus = function (y) {
	        var t,
	            x = this,
	            Big = x.constructor,
	            a = x.s,
	            b = (y = new Big(y)).s;

	        // Signs differ?
	        if (a != b) {
	            y.s = -b;
	            return x.minus(y);
	        }

	        var xe = x.e,
	            xc = x.c,
	            ye = y.e,
	            yc = y.c;

	        // Either zero?
	        if (!xc[0] || !yc[0]) {

	            // y is non-zero? x is non-zero? Or both are zero.
	            return yc[0] ? y : new Big(xc[0] ? x : a * 0);
	        }
	        xc = xc.slice();

	        // Prepend zeros to equalise exponents.
	        // Note: Faster to use reverse then do unshifts.
	        if (a = xe - ye) {

	            if (a > 0) {
	                ye = xe;
	                t = yc;
	            } else {
	                a = -a;
	                t = xc;
	            }

	            t.reverse();
	            for (; a--; t.push(0)) {
	            }
	            t.reverse();
	        }

	        // Point xc to the longer array.
	        if (xc.length - yc.length < 0) {
	            t = yc;
	            yc = xc;
	            xc = t;
	        }
	        a = yc.length;

	        /*
	         * Only start adding at yc.length - 1 as the further digits of xc can be
	         * left as they are.
	         */
	        for (b = 0; a;) {
	            b = (xc[--a] = xc[a] + yc[a] + b) / 10 | 0;
	            xc[a] %= 10;
	        }

	        // No need to check for zero, as +x + +y != 0 && -x + -y != 0

	        if (b) {
	            xc.unshift(b);
	            ++ye;
	        }

	         // Remove trailing zeros.
	        for (a = xc.length; xc[--a] === 0; xc.pop()) {
	        }

	        y.c = xc;
	        y.e = ye;

	        return y;
	    };


	    /*
	     * Return a Big whose value is the value of this Big raised to the power n.
	     * If n is negative, round, if necessary, to a maximum of Big.DP decimal
	     * places using rounding mode Big.RM.
	     *
	     * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
	     */
	    P.pow = function (n) {
	        var x = this,
	            one = new x.constructor(1),
	            y = one,
	            isNeg = n < 0;

	        if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
	            throwErr('!pow!');
	        }

	        n = isNeg ? -n : n;

	        for (;;) {

	            if (n & 1) {
	                y = y.times(x);
	            }
	            n >>= 1;

	            if (!n) {
	                break;
	            }
	            x = x.times(x);
	        }

	        return isNeg ? one.div(y) : y;
	    };


	    /*
	     * Return a new Big whose value is the value of this Big rounded to a
	     * maximum of dp decimal places using rounding mode rm.
	     * If dp is not specified, round to 0 decimal places.
	     * If rm is not specified, use Big.RM.
	     *
	     * [dp] {number} Integer, 0 to MAX_DP inclusive.
	     * [rm] 0, 1, 2 or 3 (ROUND_DOWN, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_UP)
	     */
	    P.round = function (dp, rm) {
	        var x = this,
	            Big = x.constructor;

	        if (dp == null) {
	            dp = 0;
	        } else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
	            throwErr('!round!');
	        }
	        rnd(x = new Big(x), dp, rm == null ? Big.RM : rm);

	        return x;
	    };


	    /*
	     * Return a new Big whose value is the square root of the value of this Big,
	     * rounded, if necessary, to a maximum of Big.DP decimal places using
	     * rounding mode Big.RM.
	     */
	    P.sqrt = function () {
	        var estimate, r, approx,
	            x = this,
	            Big = x.constructor,
	            xc = x.c,
	            i = x.s,
	            e = x.e,
	            half = new Big('0.5');

	        // Zero?
	        if (!xc[0]) {
	            return new Big(x);
	        }

	        // If negative, throw NaN.
	        if (i < 0) {
	            throwErr(NaN);
	        }

	        // Estimate.
	        i = Math.sqrt(x.toString());

	        // Math.sqrt underflow/overflow?
	        // Pass x to Math.sqrt as integer, then adjust the result exponent.
	        if (i === 0 || i === 1 / 0) {
	            estimate = xc.join('');

	            if (!(estimate.length + e & 1)) {
	                estimate += '0';
	            }

	            r = new Big( Math.sqrt(estimate).toString() );
	            r.e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
	        } else {
	            r = new Big(i.toString());
	        }

	        i = r.e + (Big.DP += 4);

	        // Newton-Raphson iteration.
	        do {
	            approx = r;
	            r = half.times( approx.plus( x.div(approx) ) );
	        } while ( approx.c.slice(0, i).join('') !==
	                       r.c.slice(0, i).join('') );

	        rnd(r, Big.DP -= 4, Big.RM);

	        return r;
	    };


	    /*
	     * Return a new Big whose value is the value of this Big times the value of
	     * Big y.
	     */
	    P.mul = P.times = function (y) {
	        var c,
	            x = this,
	            Big = x.constructor,
	            xc = x.c,
	            yc = (y = new Big(y)).c,
	            a = xc.length,
	            b = yc.length,
	            i = x.e,
	            j = y.e;

	        // Determine sign of result.
	        y.s = x.s == y.s ? 1 : -1;

	        // Return signed 0 if either 0.
	        if (!xc[0] || !yc[0]) {
	            return new Big(y.s * 0);
	        }

	        // Initialise exponent of result as x.e + y.e.
	        y.e = i + j;

	        // If array xc has fewer digits than yc, swap xc and yc, and lengths.
	        if (a < b) {
	            c = xc;
	            xc = yc;
	            yc = c;
	            j = a;
	            a = b;
	            b = j;
	        }

	        // Initialise coefficient array of result with zeros.
	        for (c = new Array(j = a + b); j--; c[j] = 0) {
	        }

	        // Multiply.

	        // i is initially xc.length.
	        for (i = b; i--;) {
	            b = 0;

	            // a is yc.length.
	            for (j = a + i; j > i;) {

	                // Current sum of products at this digit position, plus carry.
	                b = c[j] + yc[i] * xc[j - i - 1] + b;
	                c[j--] = b % 10;

	                // carry
	                b = b / 10 | 0;
	            }
	            c[j] = (c[j] + b) % 10;
	        }

	        // Increment result exponent if there is a final carry.
	        if (b) {
	            ++y.e;
	        }

	        // Remove any leading zero.
	        if (!c[0]) {
	            c.shift();
	        }

	        // Remove trailing zeros.
	        for (i = c.length; !c[--i]; c.pop()) {
	        }
	        y.c = c;

	        return y;
	    };


	    /*
	     * Return a string representing the value of this Big.
	     * Return exponential notation if this Big has a positive exponent equal to
	     * or greater than Big.E_POS, or a negative exponent equal to or less than
	     * Big.E_NEG.
	     */
	    P.toString = P.valueOf = P.toJSON = function () {
	        var x = this,
	            Big = x.constructor,
	            e = x.e,
	            str = x.c.join(''),
	            strL = str.length;

	        // Exponential notation?
	        if (e <= Big.E_NEG || e >= Big.E_POS) {
	            str = str.charAt(0) + (strL > 1 ? '.' + str.slice(1) : '') +
	              (e < 0 ? 'e' : 'e+') + e;

	        // Negative exponent?
	        } else if (e < 0) {

	            // Prepend zeros.
	            for (; ++e; str = '0' + str) {
	            }
	            str = '0.' + str;

	        // Positive exponent?
	        } else if (e > 0) {

	            if (++e > strL) {

	                // Append zeros.
	                for (e -= strL; e-- ; str += '0') {
	                }
	            } else if (e < strL) {
	                str = str.slice(0, e) + '.' + str.slice(e);
	            }

	        // Exponent zero.
	        } else if (strL > 1) {
	            str = str.charAt(0) + '.' + str.slice(1);
	        }

	        // Avoid '-0'
	        return x.s < 0 && x.c[0] ? '-' + str : str;
	    };


	    /*
	     ***************************************************************************
	     * If toExponential, toFixed, toPrecision and format are not required they
	     * can safely be commented-out or deleted. No redundant code will be left.
	     * format is used only by toExponential, toFixed and toPrecision.
	     ***************************************************************************
	     */


	    /*
	     * Return a string representing the value of this Big in exponential
	     * notation to dp fixed decimal places and rounded, if necessary, using
	     * Big.RM.
	     *
	     * [dp] {number} Integer, 0 to MAX_DP inclusive.
	     */
	    P.toExponential = function (dp) {

	        if (dp == null) {
	            dp = this.c.length - 1;
	        } else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
	            throwErr('!toExp!');
	        }

	        return format(this, dp, 1);
	    };


	    /*
	     * Return a string representing the value of this Big in normal notation
	     * to dp fixed decimal places and rounded, if necessary, using Big.RM.
	     *
	     * [dp] {number} Integer, 0 to MAX_DP inclusive.
	     */
	    P.toFixed = function (dp) {
	        var str,
	            x = this,
	            Big = x.constructor,
	            neg = Big.E_NEG,
	            pos = Big.E_POS;

	        // Prevent the possibility of exponential notation.
	        Big.E_NEG = -(Big.E_POS = 1 / 0);

	        if (dp == null) {
	            str = x.toString();
	        } else if (dp === ~~dp && dp >= 0 && dp <= MAX_DP) {
	            str = format(x, x.e + dp);

	            // (-0).toFixed() is '0', but (-0.1).toFixed() is '-0'.
	            // (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
	            if (x.s < 0 && x.c[0] && str.indexOf('-') < 0) {
	        //E.g. -0.5 if rounded to -0 will cause toString to omit the minus sign.
	                str = '-' + str;
	            }
	        }
	        Big.E_NEG = neg;
	        Big.E_POS = pos;

	        if (!str) {
	            throwErr('!toFix!');
	        }

	        return str;
	    };


	    /*
	     * Return a string representing the value of this Big rounded to sd
	     * significant digits using Big.RM. Use exponential notation if sd is less
	     * than the number of digits necessary to represent the integer part of the
	     * value in normal notation.
	     *
	     * sd {number} Integer, 1 to MAX_DP inclusive.
	     */
	    P.toPrecision = function (sd) {

	        if (sd == null) {
	            return this.toString();
	        } else if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
	            throwErr('!toPre!');
	        }

	        return format(this, sd - 1, 2);
	    };


	    // Export


	    Big = bigFactory();

	    //AMD.
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Big;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	    // Node and other CommonJS-like environments that support module.exports.
	    } else if (typeof module !== 'undefined' && module.exports) {
	        module.exports = Big;

	    //Browser.
	    } else {
	        global.Big = Big;
	    }
	})(this);


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var rng = __webpack_require__(105)

	function error () {
	  var m = [].slice.call(arguments).join(' ')
	  throw new Error([
	    m,
	    'we accept pull requests',
	    'http://github.com/dominictarr/crypto-browserify'
	    ].join('\n'))
	}

	exports.createHash = __webpack_require__(107)

	exports.createHmac = __webpack_require__(119)

	exports.randomBytes = function(size, callback) {
	  if (callback && callback.call) {
	    try {
	      callback.call(this, undefined, new Buffer(rng(size)))
	    } catch (err) { callback(err) }
	  } else {
	    return new Buffer(rng(size))
	  }
	}

	function each(a, f) {
	  for(var i in a)
	    f(a[i], i)
	}

	exports.getHashes = function () {
	  return ['sha1', 'sha256', 'sha512', 'md5', 'rmd160']
	}

	var p = __webpack_require__(120)(exports)
	exports.pbkdf2 = p.pbkdf2
	exports.pbkdf2Sync = p.pbkdf2Sync
	__webpack_require__(122)(exports, module.exports);

	// the least I can do is make error messages for the rest of the node.js/crypto api.
	each(['createCredentials'
	, 'createSign'
	, 'createVerify'
	, 'createDiffieHellman'
	], function (name) {
	  exports[name] = function () {
	    error('sorry,', name, 'is not implemented yet')
	  }
	})

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, Buffer) {(function() {
	  var g = ('undefined' === typeof window ? global : window) || {}
	  _crypto = (
	    g.crypto || g.msCrypto || __webpack_require__(106)
	  )
	  module.exports = function(size) {
	    // Modern Browsers
	    if(_crypto.getRandomValues) {
	      var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
	      /* This will not work in older browsers.
	       * See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
	       */
	    
	      _crypto.getRandomValues(bytes);
	      return bytes;
	    }
	    else if (_crypto.randomBytes) {
	      return _crypto.randomBytes(size)
	    }
	    else
	      throw new Error(
	        'secure random number generation not supported by this browser\n'+
	        'use chrome, FireFox or Internet Explorer 11'
	      )
	  }
	}())

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(25).Buffer))

/***/ },
/* 106 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(108)

	var md5 = toConstructor(__webpack_require__(116))
	var rmd160 = toConstructor(__webpack_require__(118))

	function toConstructor (fn) {
	  return function () {
	    var buffers = []
	    var m= {
	      update: function (data, enc) {
	        if(!Buffer.isBuffer(data)) data = new Buffer(data, enc)
	        buffers.push(data)
	        return this
	      },
	      digest: function (enc) {
	        var buf = Buffer.concat(buffers)
	        var r = fn(buf)
	        buffers = null
	        return enc ? r.toString(enc) : r
	      }
	    }
	    return m
	  }
	}

	module.exports = function (alg) {
	  if('md5' === alg) return new md5()
	  if('rmd160' === alg) return new rmd160()
	  return createHash(alg)
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var exports = module.exports = function (alg) {
	  var Alg = exports[alg]
	  if(!Alg) throw new Error(alg + ' is not supported (we accept pull requests)')
	  return new Alg()
	}

	var Buffer = __webpack_require__(25).Buffer
	var Hash   = __webpack_require__(109)(Buffer)

	exports.sha1 = __webpack_require__(110)(Buffer, Hash)
	exports.sha256 = __webpack_require__(114)(Buffer, Hash)
	exports.sha512 = __webpack_require__(115)(Buffer, Hash)


/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = function (Buffer) {

	  //prototype class for hash functions
	  function Hash (blockSize, finalSize) {
	    this._block = new Buffer(blockSize) //new Uint32Array(blockSize/4)
	    this._finalSize = finalSize
	    this._blockSize = blockSize
	    this._len = 0
	    this._s = 0
	  }

	  Hash.prototype.init = function () {
	    this._s = 0
	    this._len = 0
	  }

	  Hash.prototype.update = function (data, enc) {
	    if ("string" === typeof data) {
	      enc = enc || "utf8"
	      data = new Buffer(data, enc)
	    }

	    var l = this._len += data.length
	    var s = this._s = (this._s || 0)
	    var f = 0
	    var buffer = this._block

	    while (s < l) {
	      var t = Math.min(data.length, f + this._blockSize - (s % this._blockSize))
	      var ch = (t - f)

	      for (var i = 0; i < ch; i++) {
	        buffer[(s % this._blockSize) + i] = data[i + f]
	      }

	      s += ch
	      f += ch

	      if ((s % this._blockSize) === 0) {
	        this._update(buffer)
	      }
	    }
	    this._s = s

	    return this
	  }

	  Hash.prototype.digest = function (enc) {
	    // Suppose the length of the message M, in bits, is l
	    var l = this._len * 8

	    // Append the bit 1 to the end of the message
	    this._block[this._len % this._blockSize] = 0x80

	    // and then k zero bits, where k is the smallest non-negative solution to the equation (l + 1 + k) === finalSize mod blockSize
	    this._block.fill(0, this._len % this._blockSize + 1)

	    if (l % (this._blockSize * 8) >= this._finalSize * 8) {
	      this._update(this._block)
	      this._block.fill(0)
	    }

	    // to this append the block which is equal to the number l written in binary
	    // TODO: handle case where l is > Math.pow(2, 29)
	    this._block.writeInt32BE(l, this._blockSize - 4)

	    var hash = this._update(this._block) || this._hash()

	    return enc ? hash.toString(enc) : hash
	  }

	  Hash.prototype._update = function () {
	    throw new Error('_update must be implemented by subclass')
	  }

	  return Hash
	}


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */

	var inherits = __webpack_require__(111).inherits

	module.exports = function (Buffer, Hash) {

	  var A = 0|0
	  var B = 4|0
	  var C = 8|0
	  var D = 12|0
	  var E = 16|0

	  var W = new (typeof Int32Array === 'undefined' ? Array : Int32Array)(80)

	  var POOL = []

	  function Sha1 () {
	    if(POOL.length)
	      return POOL.pop().init()

	    if(!(this instanceof Sha1)) return new Sha1()
	    this._w = W
	    Hash.call(this, 16*4, 14*4)

	    this._h = null
	    this.init()
	  }

	  inherits(Sha1, Hash)

	  Sha1.prototype.init = function () {
	    this._a = 0x67452301
	    this._b = 0xefcdab89
	    this._c = 0x98badcfe
	    this._d = 0x10325476
	    this._e = 0xc3d2e1f0

	    Hash.prototype.init.call(this)
	    return this
	  }

	  Sha1.prototype._POOL = POOL
	  Sha1.prototype._update = function (X) {

	    var a, b, c, d, e, _a, _b, _c, _d, _e

	    a = _a = this._a
	    b = _b = this._b
	    c = _c = this._c
	    d = _d = this._d
	    e = _e = this._e

	    var w = this._w

	    for(var j = 0; j < 80; j++) {
	      var W = w[j] = j < 16 ? X.readInt32BE(j*4)
	        : rol(w[j - 3] ^ w[j -  8] ^ w[j - 14] ^ w[j - 16], 1)

	      var t = add(
	        add(rol(a, 5), sha1_ft(j, b, c, d)),
	        add(add(e, W), sha1_kt(j))
	      )

	      e = d
	      d = c
	      c = rol(b, 30)
	      b = a
	      a = t
	    }

	    this._a = add(a, _a)
	    this._b = add(b, _b)
	    this._c = add(c, _c)
	    this._d = add(d, _d)
	    this._e = add(e, _e)
	  }

	  Sha1.prototype._hash = function () {
	    if(POOL.length < 100) POOL.push(this)
	    var H = new Buffer(20)
	    //console.log(this._a|0, this._b|0, this._c|0, this._d|0, this._e|0)
	    H.writeInt32BE(this._a|0, A)
	    H.writeInt32BE(this._b|0, B)
	    H.writeInt32BE(this._c|0, C)
	    H.writeInt32BE(this._d|0, D)
	    H.writeInt32BE(this._e|0, E)
	    return H
	  }

	  /*
	   * Perform the appropriate triplet combination function for the current
	   * iteration
	   */
	  function sha1_ft(t, b, c, d) {
	    if(t < 20) return (b & c) | ((~b) & d);
	    if(t < 40) return b ^ c ^ d;
	    if(t < 60) return (b & c) | (b & d) | (c & d);
	    return b ^ c ^ d;
	  }

	  /*
	   * Determine the appropriate additive constant for the current iteration
	   */
	  function sha1_kt(t) {
	    return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
	           (t < 60) ? -1894007588 : -899497514;
	  }

	  /*
	   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	   * to work around bugs in some JS interpreters.
	   * //dominictarr: this is 10 years old, so maybe this can be dropped?)
	   *
	   */
	  function add(x, y) {
	    return (x + y ) | 0
	  //lets see how this goes on testling.
	  //  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  //  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  //  return (msw << 16) | (lsw & 0xFFFF);
	  }

	  /*
	   * Bitwise rotate a 32-bit number to the left.
	   */
	  function rol(num, cnt) {
	    return (num << cnt) | (num >>> (32 - cnt));
	  }

	  return Sha1
	}


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(112);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(113);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2)))

/***/ },
/* 112 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 113 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */

	var inherits = __webpack_require__(111).inherits

	module.exports = function (Buffer, Hash) {

	  var K = [
	      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
	      0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
	      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	      0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
	      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
	      0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
	      0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
	      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	      0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
	      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
	      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
	      0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
	      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	      0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
	    ]

	  var W = new Array(64)

	  function Sha256() {
	    this.init()

	    this._w = W //new Array(64)

	    Hash.call(this, 16*4, 14*4)
	  }

	  inherits(Sha256, Hash)

	  Sha256.prototype.init = function () {

	    this._a = 0x6a09e667|0
	    this._b = 0xbb67ae85|0
	    this._c = 0x3c6ef372|0
	    this._d = 0xa54ff53a|0
	    this._e = 0x510e527f|0
	    this._f = 0x9b05688c|0
	    this._g = 0x1f83d9ab|0
	    this._h = 0x5be0cd19|0

	    this._len = this._s = 0

	    return this
	  }

	  function S (X, n) {
	    return (X >>> n) | (X << (32 - n));
	  }

	  function R (X, n) {
	    return (X >>> n);
	  }

	  function Ch (x, y, z) {
	    return ((x & y) ^ ((~x) & z));
	  }

	  function Maj (x, y, z) {
	    return ((x & y) ^ (x & z) ^ (y & z));
	  }

	  function Sigma0256 (x) {
	    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
	  }

	  function Sigma1256 (x) {
	    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
	  }

	  function Gamma0256 (x) {
	    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
	  }

	  function Gamma1256 (x) {
	    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
	  }

	  Sha256.prototype._update = function(M) {

	    var W = this._w
	    var a, b, c, d, e, f, g, h
	    var T1, T2

	    a = this._a | 0
	    b = this._b | 0
	    c = this._c | 0
	    d = this._d | 0
	    e = this._e | 0
	    f = this._f | 0
	    g = this._g | 0
	    h = this._h | 0

	    for (var j = 0; j < 64; j++) {
	      var w = W[j] = j < 16
	        ? M.readInt32BE(j * 4)
	        : Gamma1256(W[j - 2]) + W[j - 7] + Gamma0256(W[j - 15]) + W[j - 16]

	      T1 = h + Sigma1256(e) + Ch(e, f, g) + K[j] + w

	      T2 = Sigma0256(a) + Maj(a, b, c);
	      h = g; g = f; f = e; e = d + T1; d = c; c = b; b = a; a = T1 + T2;
	    }

	    this._a = (a + this._a) | 0
	    this._b = (b + this._b) | 0
	    this._c = (c + this._c) | 0
	    this._d = (d + this._d) | 0
	    this._e = (e + this._e) | 0
	    this._f = (f + this._f) | 0
	    this._g = (g + this._g) | 0
	    this._h = (h + this._h) | 0

	  };

	  Sha256.prototype._hash = function () {
	    var H = new Buffer(32)

	    H.writeInt32BE(this._a,  0)
	    H.writeInt32BE(this._b,  4)
	    H.writeInt32BE(this._c,  8)
	    H.writeInt32BE(this._d, 12)
	    H.writeInt32BE(this._e, 16)
	    H.writeInt32BE(this._f, 20)
	    H.writeInt32BE(this._g, 24)
	    H.writeInt32BE(this._h, 28)

	    return H
	  }

	  return Sha256

	}


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(111).inherits

	module.exports = function (Buffer, Hash) {
	  var K = [
	    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	  ]

	  var W = new Array(160)

	  function Sha512() {
	    this.init()
	    this._w = W

	    Hash.call(this, 128, 112)
	  }

	  inherits(Sha512, Hash)

	  Sha512.prototype.init = function () {

	    this._a = 0x6a09e667|0
	    this._b = 0xbb67ae85|0
	    this._c = 0x3c6ef372|0
	    this._d = 0xa54ff53a|0
	    this._e = 0x510e527f|0
	    this._f = 0x9b05688c|0
	    this._g = 0x1f83d9ab|0
	    this._h = 0x5be0cd19|0

	    this._al = 0xf3bcc908|0
	    this._bl = 0x84caa73b|0
	    this._cl = 0xfe94f82b|0
	    this._dl = 0x5f1d36f1|0
	    this._el = 0xade682d1|0
	    this._fl = 0x2b3e6c1f|0
	    this._gl = 0xfb41bd6b|0
	    this._hl = 0x137e2179|0

	    this._len = this._s = 0

	    return this
	  }

	  function S (X, Xl, n) {
	    return (X >>> n) | (Xl << (32 - n))
	  }

	  function Ch (x, y, z) {
	    return ((x & y) ^ ((~x) & z));
	  }

	  function Maj (x, y, z) {
	    return ((x & y) ^ (x & z) ^ (y & z));
	  }

	  Sha512.prototype._update = function(M) {

	    var W = this._w
	    var a, b, c, d, e, f, g, h
	    var al, bl, cl, dl, el, fl, gl, hl

	    a = this._a | 0
	    b = this._b | 0
	    c = this._c | 0
	    d = this._d | 0
	    e = this._e | 0
	    f = this._f | 0
	    g = this._g | 0
	    h = this._h | 0

	    al = this._al | 0
	    bl = this._bl | 0
	    cl = this._cl | 0
	    dl = this._dl | 0
	    el = this._el | 0
	    fl = this._fl | 0
	    gl = this._gl | 0
	    hl = this._hl | 0

	    for (var i = 0; i < 80; i++) {
	      var j = i * 2

	      var Wi, Wil

	      if (i < 16) {
	        Wi = W[j] = M.readInt32BE(j * 4)
	        Wil = W[j + 1] = M.readInt32BE(j * 4 + 4)

	      } else {
	        var x  = W[j - 15*2]
	        var xl = W[j - 15*2 + 1]
	        var gamma0  = S(x, xl, 1) ^ S(x, xl, 8) ^ (x >>> 7)
	        var gamma0l = S(xl, x, 1) ^ S(xl, x, 8) ^ S(xl, x, 7)

	        x  = W[j - 2*2]
	        xl = W[j - 2*2 + 1]
	        var gamma1  = S(x, xl, 19) ^ S(xl, x, 29) ^ (x >>> 6)
	        var gamma1l = S(xl, x, 19) ^ S(x, xl, 29) ^ S(xl, x, 6)

	        // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	        var Wi7  = W[j - 7*2]
	        var Wi7l = W[j - 7*2 + 1]

	        var Wi16  = W[j - 16*2]
	        var Wi16l = W[j - 16*2 + 1]

	        Wil = gamma0l + Wi7l
	        Wi  = gamma0  + Wi7 + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0)
	        Wil = Wil + gamma1l
	        Wi  = Wi  + gamma1  + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0)
	        Wil = Wil + Wi16l
	        Wi  = Wi  + Wi16 + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0)

	        W[j] = Wi
	        W[j + 1] = Wil
	      }

	      var maj = Maj(a, b, c)
	      var majl = Maj(al, bl, cl)

	      var sigma0h = S(a, al, 28) ^ S(al, a, 2) ^ S(al, a, 7)
	      var sigma0l = S(al, a, 28) ^ S(a, al, 2) ^ S(a, al, 7)
	      var sigma1h = S(e, el, 14) ^ S(e, el, 18) ^ S(el, e, 9)
	      var sigma1l = S(el, e, 14) ^ S(el, e, 18) ^ S(e, el, 9)

	      // t1 = h + sigma1 + ch + K[i] + W[i]
	      var Ki = K[j]
	      var Kil = K[j + 1]

	      var ch = Ch(e, f, g)
	      var chl = Ch(el, fl, gl)

	      var t1l = hl + sigma1l
	      var t1 = h + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0)
	      t1l = t1l + chl
	      t1 = t1 + ch + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0)
	      t1l = t1l + Kil
	      t1 = t1 + Ki + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0)
	      t1l = t1l + Wil
	      t1 = t1 + Wi + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0)

	      // t2 = sigma0 + maj
	      var t2l = sigma0l + majl
	      var t2 = sigma0h + maj + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0)

	      h  = g
	      hl = gl
	      g  = f
	      gl = fl
	      f  = e
	      fl = el
	      el = (dl + t1l) | 0
	      e  = (d + t1 + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
	      d  = c
	      dl = cl
	      c  = b
	      cl = bl
	      b  = a
	      bl = al
	      al = (t1l + t2l) | 0
	      a  = (t1 + t2 + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0
	    }

	    this._al = (this._al + al) | 0
	    this._bl = (this._bl + bl) | 0
	    this._cl = (this._cl + cl) | 0
	    this._dl = (this._dl + dl) | 0
	    this._el = (this._el + el) | 0
	    this._fl = (this._fl + fl) | 0
	    this._gl = (this._gl + gl) | 0
	    this._hl = (this._hl + hl) | 0

	    this._a = (this._a + a + ((this._al >>> 0) < (al >>> 0) ? 1 : 0)) | 0
	    this._b = (this._b + b + ((this._bl >>> 0) < (bl >>> 0) ? 1 : 0)) | 0
	    this._c = (this._c + c + ((this._cl >>> 0) < (cl >>> 0) ? 1 : 0)) | 0
	    this._d = (this._d + d + ((this._dl >>> 0) < (dl >>> 0) ? 1 : 0)) | 0
	    this._e = (this._e + e + ((this._el >>> 0) < (el >>> 0) ? 1 : 0)) | 0
	    this._f = (this._f + f + ((this._fl >>> 0) < (fl >>> 0) ? 1 : 0)) | 0
	    this._g = (this._g + g + ((this._gl >>> 0) < (gl >>> 0) ? 1 : 0)) | 0
	    this._h = (this._h + h + ((this._hl >>> 0) < (hl >>> 0) ? 1 : 0)) | 0
	  }

	  Sha512.prototype._hash = function () {
	    var H = new Buffer(64)

	    function writeInt64BE(h, l, offset) {
	      H.writeInt32BE(h, offset)
	      H.writeInt32BE(l, offset + 4)
	    }

	    writeInt64BE(this._a, this._al, 0)
	    writeInt64BE(this._b, this._bl, 8)
	    writeInt64BE(this._c, this._cl, 16)
	    writeInt64BE(this._d, this._dl, 24)
	    writeInt64BE(this._e, this._el, 32)
	    writeInt64BE(this._f, this._fl, 40)
	    writeInt64BE(this._g, this._gl, 48)
	    writeInt64BE(this._h, this._hl, 56)

	    return H
	  }

	  return Sha512

	}


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	var helpers = __webpack_require__(117);

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	function core_md5(x, len)
	{
	  /* append padding */
	  x[len >> 5] |= 0x80 << ((len) % 32);
	  x[(((len + 64) >>> 9) << 4) + 14] = len;

	  var a =  1732584193;
	  var b = -271733879;
	  var c = -1732584194;
	  var d =  271733878;

	  for(var i = 0; i < x.length; i += 16)
	  {
	    var olda = a;
	    var oldb = b;
	    var oldc = c;
	    var oldd = d;

	    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
	    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
	    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
	    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
	    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
	    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
	    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
	    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
	    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
	    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
	    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

	    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
	    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
	    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
	    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
	    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
	    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
	    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
	    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
	    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
	    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
	    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
	    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

	    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
	    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
	    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
	    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
	    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
	    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
	    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
	    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
	    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
	    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
	    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
	    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
	    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

	    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
	    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
	    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
	    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
	    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
	    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
	    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
	    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
	    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
	    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
	    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

	    a = safe_add(a, olda);
	    b = safe_add(b, oldb);
	    c = safe_add(c, oldc);
	    d = safe_add(d, oldd);
	  }
	  return Array(a, b, c, d);

	}

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	function md5_cmn(q, a, b, x, s, t)
	{
	  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t)
	{
	  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t)
	{
	  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t)
	{
	  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function bit_rol(num, cnt)
	{
	  return (num << cnt) | (num >>> (32 - cnt));
	}

	module.exports = function md5(buf) {
	  return helpers.hash(buf, core_md5, 16);
	};


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var intSize = 4;
	var zeroBuffer = new Buffer(intSize); zeroBuffer.fill(0);
	var chrsz = 8;

	function toArray(buf, bigEndian) {
	  if ((buf.length % intSize) !== 0) {
	    var len = buf.length + (intSize - (buf.length % intSize));
	    buf = Buffer.concat([buf, zeroBuffer], len);
	  }

	  var arr = [];
	  var fn = bigEndian ? buf.readInt32BE : buf.readInt32LE;
	  for (var i = 0; i < buf.length; i += intSize) {
	    arr.push(fn.call(buf, i));
	  }
	  return arr;
	}

	function toBuffer(arr, size, bigEndian) {
	  var buf = new Buffer(size);
	  var fn = bigEndian ? buf.writeInt32BE : buf.writeInt32LE;
	  for (var i = 0; i < arr.length; i++) {
	    fn.call(buf, arr[i], i * 4, true);
	  }
	  return buf;
	}

	function hash(buf, fn, hashSize, bigEndian) {
	  if (!Buffer.isBuffer(buf)) buf = new Buffer(buf);
	  var arr = fn(toArray(buf, bigEndian), buf.length * chrsz);
	  return toBuffer(arr, hashSize, bigEndian);
	}

	module.exports = { hash: hash };

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	module.exports = ripemd160



	/*
	CryptoJS v3.1.2
	code.google.com/p/crypto-js
	(c) 2009-2013 by Jeff Mott. All rights reserved.
	code.google.com/p/crypto-js/wiki/License
	*/
	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	// Constants table
	var zl = [
	    0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	    7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	    3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	    1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	    4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13];
	var zr = [
	    5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	    6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	    15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	    8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	    12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11];
	var sl = [
	     11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	    7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	    11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	      11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	    9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ];
	var sr = [
	    8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	    9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	    9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	    15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	    8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ];

	var hl =  [ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
	var hr =  [ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];

	var bytesToWords = function (bytes) {
	  var words = [];
	  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
	    words[b >>> 5] |= bytes[i] << (24 - b % 32);
	  }
	  return words;
	};

	var wordsToBytes = function (words) {
	  var bytes = [];
	  for (var b = 0; b < words.length * 32; b += 8) {
	    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	  }
	  return bytes;
	};

	var processBlock = function (H, M, offset) {

	  // Swap endian
	  for (var i = 0; i < 16; i++) {
	    var offset_i = offset + i;
	    var M_offset_i = M[offset_i];

	    // Swap
	    M[offset_i] = (
	        (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	        (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	    );
	  }

	  // Working variables
	  var al, bl, cl, dl, el;
	  var ar, br, cr, dr, er;

	  ar = al = H[0];
	  br = bl = H[1];
	  cr = cl = H[2];
	  dr = dl = H[3];
	  er = el = H[4];
	  // Computation
	  var t;
	  for (var i = 0; i < 80; i += 1) {
	    t = (al +  M[offset+zl[i]])|0;
	    if (i<16){
	        t +=  f1(bl,cl,dl) + hl[0];
	    } else if (i<32) {
	        t +=  f2(bl,cl,dl) + hl[1];
	    } else if (i<48) {
	        t +=  f3(bl,cl,dl) + hl[2];
	    } else if (i<64) {
	        t +=  f4(bl,cl,dl) + hl[3];
	    } else {// if (i<80) {
	        t +=  f5(bl,cl,dl) + hl[4];
	    }
	    t = t|0;
	    t =  rotl(t,sl[i]);
	    t = (t+el)|0;
	    al = el;
	    el = dl;
	    dl = rotl(cl, 10);
	    cl = bl;
	    bl = t;

	    t = (ar + M[offset+zr[i]])|0;
	    if (i<16){
	        t +=  f5(br,cr,dr) + hr[0];
	    } else if (i<32) {
	        t +=  f4(br,cr,dr) + hr[1];
	    } else if (i<48) {
	        t +=  f3(br,cr,dr) + hr[2];
	    } else if (i<64) {
	        t +=  f2(br,cr,dr) + hr[3];
	    } else {// if (i<80) {
	        t +=  f1(br,cr,dr) + hr[4];
	    }
	    t = t|0;
	    t =  rotl(t,sr[i]) ;
	    t = (t+er)|0;
	    ar = er;
	    er = dr;
	    dr = rotl(cr, 10);
	    cr = br;
	    br = t;
	  }
	  // Intermediate hash value
	  t    = (H[1] + cl + dr)|0;
	  H[1] = (H[2] + dl + er)|0;
	  H[2] = (H[3] + el + ar)|0;
	  H[3] = (H[4] + al + br)|0;
	  H[4] = (H[0] + bl + cr)|0;
	  H[0] =  t;
	};

	function f1(x, y, z) {
	  return ((x) ^ (y) ^ (z));
	}

	function f2(x, y, z) {
	  return (((x)&(y)) | ((~x)&(z)));
	}

	function f3(x, y, z) {
	  return (((x) | (~(y))) ^ (z));
	}

	function f4(x, y, z) {
	  return (((x) & (z)) | ((y)&(~(z))));
	}

	function f5(x, y, z) {
	  return ((x) ^ ((y) |(~(z))));
	}

	function rotl(x,n) {
	  return (x<<n) | (x>>>(32-n));
	}

	function ripemd160(message) {
	  var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

	  if (typeof message == 'string')
	    message = new Buffer(message, 'utf8');

	  var m = bytesToWords(message);

	  var nBitsLeft = message.length * 8;
	  var nBitsTotal = message.length * 8;

	  // Add padding
	  m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	  m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	      (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
	      (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
	  );

	  for (var i=0 ; i<m.length; i += 16) {
	    processBlock(H, m, i);
	  }

	  // Swap endian
	  for (var i = 0; i < 5; i++) {
	      // Shortcut
	    var H_i = H[i];

	    // Swap
	    H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	          (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	  }

	  var digestbytes = wordsToBytes(H);
	  return new Buffer(digestbytes);
	}



	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var createHash = __webpack_require__(107)

	var zeroBuffer = new Buffer(128)
	zeroBuffer.fill(0)

	module.exports = Hmac

	function Hmac (alg, key) {
	  if(!(this instanceof Hmac)) return new Hmac(alg, key)
	  this._opad = opad
	  this._alg = alg

	  var blocksize = (alg === 'sha512') ? 128 : 64

	  key = this._key = !Buffer.isBuffer(key) ? new Buffer(key) : key

	  if(key.length > blocksize) {
	    key = createHash(alg).update(key).digest()
	  } else if(key.length < blocksize) {
	    key = Buffer.concat([key, zeroBuffer], blocksize)
	  }

	  var ipad = this._ipad = new Buffer(blocksize)
	  var opad = this._opad = new Buffer(blocksize)

	  for(var i = 0; i < blocksize; i++) {
	    ipad[i] = key[i] ^ 0x36
	    opad[i] = key[i] ^ 0x5C
	  }

	  this._hash = createHash(alg).update(ipad)
	}

	Hmac.prototype.update = function (data, enc) {
	  this._hash.update(data, enc)
	  return this
	}

	Hmac.prototype.digest = function (enc) {
	  var h = this._hash.digest()
	  return createHash(this._alg).update(this._opad).update(h).digest(enc)
	}


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	var pbkdf2Export = __webpack_require__(121)

	module.exports = function (crypto, exports) {
	  exports = exports || {}

	  var exported = pbkdf2Export(crypto)

	  exports.pbkdf2 = exported.pbkdf2
	  exports.pbkdf2Sync = exported.pbkdf2Sync

	  return exports
	}


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = function(crypto) {
	  function pbkdf2(password, salt, iterations, keylen, digest, callback) {
	    if ('function' === typeof digest) {
	      callback = digest
	      digest = undefined
	    }

	    if ('function' !== typeof callback)
	      throw new Error('No callback provided to pbkdf2')

	    setTimeout(function() {
	      var result

	      try {
	        result = pbkdf2Sync(password, salt, iterations, keylen, digest)
	      } catch (e) {
	        return callback(e)
	      }

	      callback(undefined, result)
	    })
	  }

	  function pbkdf2Sync(password, salt, iterations, keylen, digest) {
	    if ('number' !== typeof iterations)
	      throw new TypeError('Iterations not a number')

	    if (iterations < 0)
	      throw new TypeError('Bad iterations')

	    if ('number' !== typeof keylen)
	      throw new TypeError('Key length not a number')

	    if (keylen < 0)
	      throw new TypeError('Bad key length')

	    digest = digest || 'sha1'

	    if (!Buffer.isBuffer(password)) password = new Buffer(password)
	    if (!Buffer.isBuffer(salt)) salt = new Buffer(salt)

	    var hLen, l = 1, r, T
	    var DK = new Buffer(keylen)
	    var block1 = new Buffer(salt.length + 4)
	    salt.copy(block1, 0, 0, salt.length)

	    for (var i = 1; i <= l; i++) {
	      block1.writeUInt32BE(i, salt.length)

	      var U = crypto.createHmac(digest, password).update(block1).digest()

	      if (!hLen) {
	        hLen = U.length
	        T = new Buffer(hLen)
	        l = Math.ceil(keylen / hLen)
	        r = keylen - (l - 1) * hLen

	        if (keylen > (Math.pow(2, 32) - 1) * hLen)
	          throw new TypeError('keylen exceeds maximum length')
	      }

	      U.copy(T, 0, 0, hLen)

	      for (var j = 1; j < iterations; j++) {
	        U = crypto.createHmac(digest, password).update(U).digest()

	        for (var k = 0; k < hLen; k++) {
	          T[k] ^= U[k]
	        }
	      }

	      var destPos = (i - 1) * hLen
	      var len = (i == l ? r : hLen)
	      T.copy(DK, destPos, 0, len)
	    }

	    return DK
	  }

	  return {
	    pbkdf2: pbkdf2,
	    pbkdf2Sync: pbkdf2Sync
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (crypto, exports) {
	  exports = exports || {};
	  var ciphers = __webpack_require__(123)(crypto);
	  exports.createCipher = ciphers.createCipher;
	  exports.createCipheriv = ciphers.createCipheriv;
	  var deciphers = __webpack_require__(135)(crypto);
	  exports.createDecipher = deciphers.createDecipher;
	  exports.createDecipheriv = deciphers.createDecipheriv;
	  var modes = __webpack_require__(126);
	  function listCiphers () {
	    return Object.keys(modes);
	  }
	  exports.listCiphers = listCiphers;
	};



/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var aes = __webpack_require__(124);
	var Transform = __webpack_require__(125);
	var inherits = __webpack_require__(20);
	var modes = __webpack_require__(126);
	var ebtk = __webpack_require__(127);
	var StreamCipher = __webpack_require__(128);
	inherits(Cipher, Transform);
	function Cipher(mode, key, iv) {
	  if (!(this instanceof Cipher)) {
	    return new Cipher(mode, key, iv);
	  }
	  Transform.call(this);
	  this._cache = new Splitter();
	  this._cipher = new aes.AES(key);
	  this._prev = new Buffer(iv.length);
	  iv.copy(this._prev);
	  this._mode = mode;
	}
	Cipher.prototype._transform = function (data, _, next) {
	  this._cache.add(data);
	  var chunk;
	  var thing;
	  while ((chunk = this._cache.get())) {
	    thing = this._mode.encrypt(this, chunk);
	    this.push(thing);
	  }
	  next();
	};
	Cipher.prototype._flush = function (next) {
	  var chunk = this._cache.flush();
	  this.push(this._mode.encrypt(this, chunk));
	  this._cipher.scrub();
	  next();
	};


	function Splitter() {
	   if (!(this instanceof Splitter)) {
	    return new Splitter();
	  }
	  this.cache = new Buffer('');
	}
	Splitter.prototype.add = function (data) {
	  this.cache = Buffer.concat([this.cache, data]);
	};

	Splitter.prototype.get = function () {
	  if (this.cache.length > 15) {
	    var out = this.cache.slice(0, 16);
	    this.cache = this.cache.slice(16);
	    return out;
	  }
	  return null;
	};
	Splitter.prototype.flush = function () {
	  var len = 16 - this.cache.length;
	  var padBuff = new Buffer(len);

	  var i = -1;
	  while (++i < len) {
	    padBuff.writeUInt8(len, i);
	  }
	  var out = Buffer.concat([this.cache, padBuff]);
	  return out;
	};
	var modelist = {
	  ECB: __webpack_require__(129),
	  CBC: __webpack_require__(130),
	  CFB: __webpack_require__(132),
	  OFB: __webpack_require__(133),
	  CTR: __webpack_require__(134)
	};
	module.exports = function (crypto) {
	  function createCipheriv(suite, password, iv) {
	    var config = modes[suite];
	    if (!config) {
	      throw new TypeError('invalid suite type');
	    }
	    if (typeof iv === 'string') {
	      iv = new Buffer(iv);
	    }
	    if (typeof password === 'string') {
	      password = new Buffer(password);
	    }
	    if (password.length !== config.key/8) {
	      throw new TypeError('invalid key length ' + password.length);
	    }
	    if (iv.length !== config.iv) {
	      throw new TypeError('invalid iv length ' + iv.length);
	    }
	    if (config.type === 'stream') {
	      return new StreamCipher(modelist[config.mode], password, iv);
	    }
	    return new Cipher(modelist[config.mode], password, iv);
	  }
	  function createCipher (suite, password) {
	    var config = modes[suite];
	    if (!config) {
	      throw new TypeError('invalid suite type');
	    }
	    var keys = ebtk(crypto, password, config.key, config.iv);
	    return createCipheriv(suite, keys.key, keys.iv);
	  }
	  return {
	    createCipher: createCipher,
	    createCipheriv: createCipheriv
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var uint_max = Math.pow(2, 32);
	function fixup_uint32(x) {
	    var ret, x_pos;
	    ret = x > uint_max || x < 0 ? (x_pos = Math.abs(x) % uint_max, x < 0 ? uint_max - x_pos : x_pos) : x;
	    return ret;
	}
	function scrub_vec(v) {
	  var i, _i, _ref;
	  for (i = _i = 0, _ref = v.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
	    v[i] = 0;
	  }
	  return false;
	}

	function Global() {
	  var i;
	  this.SBOX = [];
	  this.INV_SBOX = [];
	  this.SUB_MIX = (function() {
	    var _i, _results;
	    _results = [];
	    for (i = _i = 0; _i < 4; i = ++_i) {
	      _results.push([]);
	    }
	    return _results;
	  })();
	  this.INV_SUB_MIX = (function() {
	    var _i, _results;
	    _results = [];
	    for (i = _i = 0; _i < 4; i = ++_i) {
	      _results.push([]);
	    }
	    return _results;
	  })();
	  this.init();
	  this.RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
	}

	Global.prototype.init = function() {
	  var d, i, sx, t, x, x2, x4, x8, xi, _i;
	  d = (function() {
	    var _i, _results;
	    _results = [];
	    for (i = _i = 0; _i < 256; i = ++_i) {
	      if (i < 128) {
	        _results.push(i << 1);
	      } else {
	        _results.push((i << 1) ^ 0x11b);
	      }
	    }
	    return _results;
	  })();
	  x = 0;
	  xi = 0;
	  for (i = _i = 0; _i < 256; i = ++_i) {
	    sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
	    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
	    this.SBOX[x] = sx;
	    this.INV_SBOX[sx] = x;
	    x2 = d[x];
	    x4 = d[x2];
	    x8 = d[x4];
	    t = (d[sx] * 0x101) ^ (sx * 0x1010100);
	    this.SUB_MIX[0][x] = (t << 24) | (t >>> 8);
	    this.SUB_MIX[1][x] = (t << 16) | (t >>> 16);
	    this.SUB_MIX[2][x] = (t << 8) | (t >>> 24);
	    this.SUB_MIX[3][x] = t;
	    t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
	    this.INV_SUB_MIX[0][sx] = (t << 24) | (t >>> 8);
	    this.INV_SUB_MIX[1][sx] = (t << 16) | (t >>> 16);
	    this.INV_SUB_MIX[2][sx] = (t << 8) | (t >>> 24);
	    this.INV_SUB_MIX[3][sx] = t;
	    if (x === 0) {
	      x = xi = 1;
	    } else {
	      x = x2 ^ d[d[d[x8 ^ x2]]];
	      xi ^= d[d[xi]];
	    }
	  }
	  return true;
	};

	var G = new Global();


	AES.blockSize = 4 * 4;

	AES.prototype.blockSize = AES.blockSize;

	AES.keySize = 256 / 8;

	AES.prototype.keySize = AES.keySize;

	AES.ivSize = AES.blockSize;

	AES.prototype.ivSize = AES.ivSize;

	 function bufferToArray(buf) {
	  var len = buf.length/4;
	  var out = new Array(len);
	  var i = -1;
	  while (++i < len) {
	    out[i] = buf.readUInt32BE(i * 4);
	  }
	  return out;
	 }
	function AES(key) {
	  this._key = bufferToArray(key);
	  this._doReset();
	}

	AES.prototype._doReset = function() {
	  var invKsRow, keySize, keyWords, ksRow, ksRows, t, _i, _j;
	  keyWords = this._key;
	  keySize = keyWords.length;
	  this._nRounds = keySize + 6;
	  ksRows = (this._nRounds + 1) * 4;
	  this._keySchedule = [];
	  for (ksRow = _i = 0; 0 <= ksRows ? _i < ksRows : _i > ksRows; ksRow = 0 <= ksRows ? ++_i : --_i) {
	    this._keySchedule[ksRow] = ksRow < keySize ? keyWords[ksRow] : (t = this._keySchedule[ksRow - 1], (ksRow % keySize) === 0 ? (t = (t << 8) | (t >>> 24), t = (G.SBOX[t >>> 24] << 24) | (G.SBOX[(t >>> 16) & 0xff] << 16) | (G.SBOX[(t >>> 8) & 0xff] << 8) | G.SBOX[t & 0xff], t ^= G.RCON[(ksRow / keySize) | 0] << 24) : keySize > 6 && ksRow % keySize === 4 ? t = (G.SBOX[t >>> 24] << 24) | (G.SBOX[(t >>> 16) & 0xff] << 16) | (G.SBOX[(t >>> 8) & 0xff] << 8) | G.SBOX[t & 0xff] : void 0, this._keySchedule[ksRow - keySize] ^ t);
	  }
	  this._invKeySchedule = [];
	  for (invKsRow = _j = 0; 0 <= ksRows ? _j < ksRows : _j > ksRows; invKsRow = 0 <= ksRows ? ++_j : --_j) {
	    ksRow = ksRows - invKsRow;
	    t = this._keySchedule[ksRow - (invKsRow % 4 ? 0 : 4)];
	    this._invKeySchedule[invKsRow] = invKsRow < 4 || ksRow <= 4 ? t : G.INV_SUB_MIX[0][G.SBOX[t >>> 24]] ^ G.INV_SUB_MIX[1][G.SBOX[(t >>> 16) & 0xff]] ^ G.INV_SUB_MIX[2][G.SBOX[(t >>> 8) & 0xff]] ^ G.INV_SUB_MIX[3][G.SBOX[t & 0xff]];
	  }
	  return true;
	};

	AES.prototype.encryptBlock = function(M) {
	  M = bufferToArray(new Buffer(M));
	  var out = this._doCryptBlock(M, this._keySchedule, G.SUB_MIX, G.SBOX);
	  var buf = new Buffer(16);
	  buf.writeUInt32BE(out[0], 0);
	  buf.writeUInt32BE(out[1], 4);
	  buf.writeUInt32BE(out[2], 8);
	  buf.writeUInt32BE(out[3], 12);
	  return buf;
	};

	AES.prototype.decryptBlock = function(M) {
	  M = bufferToArray(new Buffer(M));
	  var temp = [M[3], M[1]];
	  M[1] = temp[0];
	  M[3] = temp[1];
	  var out = this._doCryptBlock(M, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX);
	  var buf = new Buffer(16);
	  buf.writeUInt32BE(out[0], 0);
	  buf.writeUInt32BE(out[3], 4);
	  buf.writeUInt32BE(out[2], 8);
	  buf.writeUInt32BE(out[1], 12);
	  return buf;
	};

	AES.prototype.scrub = function() {
	  scrub_vec(this._keySchedule);
	  scrub_vec(this._invKeySchedule);
	  scrub_vec(this._key);
	};

	AES.prototype._doCryptBlock = function(M, keySchedule, SUB_MIX, SBOX) {
	  var ksRow, round, s0, s1, s2, s3, t0, t1, t2, t3, _i, _ref;

	  s0 = M[0] ^ keySchedule[0];
	  s1 = M[1] ^ keySchedule[1];
	  s2 = M[2] ^ keySchedule[2];
	  s3 = M[3] ^ keySchedule[3];
	  ksRow = 4;
	  for (round = _i = 1, _ref = this._nRounds; 1 <= _ref ? _i < _ref : _i > _ref; round = 1 <= _ref ? ++_i : --_i) {
	    t0 = SUB_MIX[0][s0 >>> 24] ^ SUB_MIX[1][(s1 >>> 16) & 0xff] ^ SUB_MIX[2][(s2 >>> 8) & 0xff] ^ SUB_MIX[3][s3 & 0xff] ^ keySchedule[ksRow++];
	    t1 = SUB_MIX[0][s1 >>> 24] ^ SUB_MIX[1][(s2 >>> 16) & 0xff] ^ SUB_MIX[2][(s3 >>> 8) & 0xff] ^ SUB_MIX[3][s0 & 0xff] ^ keySchedule[ksRow++];
	    t2 = SUB_MIX[0][s2 >>> 24] ^ SUB_MIX[1][(s3 >>> 16) & 0xff] ^ SUB_MIX[2][(s0 >>> 8) & 0xff] ^ SUB_MIX[3][s1 & 0xff] ^ keySchedule[ksRow++];
	    t3 = SUB_MIX[0][s3 >>> 24] ^ SUB_MIX[1][(s0 >>> 16) & 0xff] ^ SUB_MIX[2][(s1 >>> 8) & 0xff] ^ SUB_MIX[3][s2 & 0xff] ^ keySchedule[ksRow++];
	    s0 = t0;
	    s1 = t1;
	    s2 = t2;
	    s3 = t3;
	  }
	  t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
	  t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
	  t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
	  t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];
	  return [
	    fixup_uint32(t0),
	    fixup_uint32(t1),
	    fixup_uint32(t2),
	    fixup_uint32(t3)
	  ];

	};




	  exports.AES = AES;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var Transform = __webpack_require__(18).Transform;
	var inherits = __webpack_require__(20);

	module.exports = CipherBase;
	inherits(CipherBase, Transform);
	function CipherBase() {
	  Transform.call(this);
	}
	CipherBase.prototype.update = function (data, inputEnd, outputEnc) {
	  this.write(data, inputEnd);
	  var outData = new Buffer('');
	  var chunk;
	  while ((chunk = this.read())) {
	    outData = Buffer.concat([outData, chunk]);
	  }
	  if (outputEnc) {
	    outData = outData.toString(outputEnc);
	  }
	  return outData;
	};
	CipherBase.prototype.final = function (outputEnc) {
	  this.end();
	  var outData = new Buffer('');
	  var chunk;
	  while ((chunk = this.read())) {
	    outData = Buffer.concat([outData, chunk]);
	  }
	  if (outputEnc) {
	    outData = outData.toString(outputEnc);
	  }
	  return outData;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 126 */
/***/ function(module, exports) {

	exports['aes-128-ecb'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 0,
	  mode: 'ECB',
	  type: 'block'
	};
	exports['aes-192-ecb'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 0,
	  mode: 'ECB',
	  type: 'block'
	};
	exports['aes-256-ecb'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 0,
	  mode: 'ECB',
	  type: 'block'
	};
	exports['aes-128-cbc'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 16,
	  mode: 'CBC',
	  type: 'block'
	};
	exports['aes-192-cbc'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 16,
	  mode: 'CBC',
	  type: 'block'
	};
	exports['aes-256-cbc'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 16,
	  mode: 'CBC',
	  type: 'block'
	};
	exports['aes128'] = exports['aes-128-cbc'];
	exports['aes192'] = exports['aes-192-cbc'];
	exports['aes256'] = exports['aes-256-cbc'];
	exports['aes-128-cfb'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 16,
	  mode: 'CFB',
	  type: 'stream'
	};
	exports['aes-192-cfb'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 16,
	  mode: 'CFB',
	  type: 'stream'
	};
	exports['aes-256-cfb'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 16,
	  mode: 'CFB',
	  type: 'stream'
	};
	exports['aes-128-ofb'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 16,
	  mode: 'OFB',
	  type: 'stream'
	};
	exports['aes-192-ofb'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 16,
	  mode: 'OFB',
	  type: 'stream'
	};
	exports['aes-256-ofb'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 16,
	  mode: 'OFB',
	  type: 'stream'
	};
	exports['aes-128-ctr'] = {
	  cipher: 'AES',
	  key: 128,
	  iv: 16,
	  mode: 'CTR',
	  type: 'stream'
	};
	exports['aes-192-ctr'] = {
	  cipher: 'AES',
	  key: 192,
	  iv: 16,
	  mode: 'CTR',
	  type: 'stream'
	};
	exports['aes-256-ctr'] = {
	  cipher: 'AES',
	  key: 256,
	  iv: 16,
	  mode: 'CTR',
	  type: 'stream'
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {
	module.exports = function (crypto, password, keyLen, ivLen) {
	  keyLen = keyLen/8;
	  ivLen = ivLen || 0;
	  var ki = 0;
	  var ii = 0;
	  var key = new Buffer(keyLen);
	  var iv = new Buffer(ivLen);
	  var addmd = 0;
	  var md, md_buf;
	  var i;
	  while (true) {
	    md = crypto.createHash('md5');
	    if(addmd++ > 0) {
	       md.update(md_buf);
	    }
	    md.update(password);
	    md_buf = md.digest();
	    i = 0;
	    if(keyLen > 0) {
	      while(true) {
	        if(keyLen === 0) {
	          break;
	        }
	        if(i === md_buf.length) {
	          break;
	        }
	        key[ki++] = md_buf[i];
	        keyLen--;
	        i++;
	       }
	    }
	    if(ivLen > 0 && i !== md_buf.length) {
	      while(true) {
	        if(ivLen === 0) {
	          break;
	        }
	        if(i === md_buf.length) {
	          break;
	        }
	       iv[ii++] = md_buf[i];
	       ivLen--;
	       i++;
	     }
	   }
	   if(keyLen === 0 && ivLen === 0) {
	      break;
	    }
	  }
	  for(i=0;i<md_buf.length;i++) {
	    md_buf[i] = 0;
	  }
	  return {
	    key: key,
	    iv: iv
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var aes = __webpack_require__(124);
	var Transform = __webpack_require__(125);
	var inherits = __webpack_require__(20);

	inherits(StreamCipher, Transform);
	module.exports = StreamCipher;
	function StreamCipher(mode, key, iv, decrypt) {
	  if (!(this instanceof StreamCipher)) {
	    return new StreamCipher(mode, key, iv);
	  }
	  Transform.call(this);
	  this._cipher = new aes.AES(key);
	  this._prev = new Buffer(iv.length);
	  this._cache = new Buffer('');
	  this._secCache = new Buffer('');
	  this._decrypt = decrypt;
	  iv.copy(this._prev);
	  this._mode = mode;
	}
	StreamCipher.prototype._transform = function (chunk, _, next) {
	  next(null, this._mode.encrypt(this, chunk, this._decrypt));
	};
	StreamCipher.prototype._flush = function (next) {
	  this._cipher.scrub();
	  next();
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 129 */
/***/ function(module, exports) {

	exports.encrypt = function (self, block) {
	  return self._cipher.encryptBlock(block);
	};
	exports.decrypt = function (self, block) {
	  return self._cipher.decryptBlock(block);
	};

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	var xor = __webpack_require__(131);
	exports.encrypt = function (self, block) {
	  var data = xor(block, self._prev);
	  self._prev = self._cipher.encryptBlock(data);
	  return self._prev;
	};
	exports.decrypt = function (self, block) {
	  var pad = self._prev;
	  self._prev = block;
	  var out = self._cipher.decryptBlock(block);
	  return xor(out, pad);
	};

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {module.exports = xor;
	function xor(a, b) {
	  var len = Math.min(a.length, b.length);
	  var out = new Buffer(len);
	  var i = -1;
	  while (++i < len) {
	    out.writeUInt8(a[i] ^ b[i], i);
	  }
	  return out;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var xor = __webpack_require__(131);
	exports.encrypt = function (self, data, decrypt) {
	  var out = new Buffer('');
	  var len;
	  while (data.length) {
	    if (self._cache.length === 0) {
	      self._cache = self._cipher.encryptBlock(self._prev);
	      self._prev = new Buffer('');
	    }
	    if (self._cache.length <= data.length) {
	      len = self._cache.length;
	      out = Buffer.concat([out, encryptStart(self, data.slice(0, len), decrypt)]);
	      data = data.slice(len);
	    } else {
	      out = Buffer.concat([out, encryptStart(self, data, decrypt)]);
	      break;
	    }
	  }
	  return out;
	};
	function encryptStart(self, data, decrypt) {
	  var len = data.length;
	  var out = xor(data, self._cache);
	  self._cache = self._cache.slice(len);
	  self._prev = Buffer.concat([self._prev, decrypt?data:out]);
	  return out;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var xor = __webpack_require__(131);
	function getBlock(self) {
	  self._prev = self._cipher.encryptBlock(self._prev);
	  return self._prev;
	}
	exports.encrypt = function (self, chunk) {
	  while (self._cache.length < chunk.length) {
	    self._cache = Buffer.concat([self._cache, getBlock(self)]);
	  }
	  var pad = self._cache.slice(0, chunk.length);
	  self._cache = self._cache.slice(chunk.length);
	  return xor(chunk, pad);
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var xor = __webpack_require__(131);
	function getBlock(self) {
	  var out = self._cipher.encryptBlock(self._prev);
	  incr32(self._prev);
	  return out;
	}
	exports.encrypt = function (self, chunk) {
	  while (self._cache.length < chunk.length) {
	    self._cache = Buffer.concat([self._cache, getBlock(self)]);
	  }
	  var pad = self._cache.slice(0, chunk.length);
	  self._cache = self._cache.slice(chunk.length);
	  return xor(chunk, pad);
	};
	function incr32(iv) {
	  var len = iv.length;
	  var item;
	  while (len--) {
	    item = iv.readUInt8(len);
	    if (item === 255) {
	      iv.writeUInt8(0, len);
	    } else {
	      item++;
	      iv.writeUInt8(item, len);
	      break;
	    }
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var aes = __webpack_require__(124);
	var Transform = __webpack_require__(125);
	var inherits = __webpack_require__(20);
	var modes = __webpack_require__(126);
	var StreamCipher = __webpack_require__(128);
	var ebtk = __webpack_require__(127);

	inherits(Decipher, Transform);
	function Decipher(mode, key, iv) {
	  if (!(this instanceof Decipher)) {
	    return new Decipher(mode, key, iv);
	  }
	  Transform.call(this);
	  this._cache = new Splitter();
	  this._last = void 0;
	  this._cipher = new aes.AES(key);
	  this._prev = new Buffer(iv.length);
	  iv.copy(this._prev);
	  this._mode = mode;
	}
	Decipher.prototype._transform = function (data, _, next) {
	  this._cache.add(data);
	  var chunk;
	  var thing;
	  while ((chunk = this._cache.get())) {
	    thing = this._mode.decrypt(this, chunk);
	    this.push(thing);
	  }
	  next();
	};
	Decipher.prototype._flush = function (next) {
	  var chunk = this._cache.flush();
	  if (!chunk) {
	    return next;
	  }

	  this.push(unpad(this._mode.decrypt(this, chunk)));

	  next();
	};

	function Splitter() {
	   if (!(this instanceof Splitter)) {
	    return new Splitter();
	  }
	  this.cache = new Buffer('');
	}
	Splitter.prototype.add = function (data) {
	  this.cache = Buffer.concat([this.cache, data]);
	};

	Splitter.prototype.get = function () {
	  if (this.cache.length > 16) {
	    var out = this.cache.slice(0, 16);
	    this.cache = this.cache.slice(16);
	    return out;
	  }
	  return null;
	};
	Splitter.prototype.flush = function () {
	  if (this.cache.length) {
	    return this.cache;
	  }
	};
	function unpad(last) {
	  var padded = last[15];
	  if (padded === 16) {
	    return;
	  }
	  return last.slice(0, 16 - padded);
	}

	var modelist = {
	  ECB: __webpack_require__(129),
	  CBC: __webpack_require__(130),
	  CFB: __webpack_require__(132),
	  OFB: __webpack_require__(133),
	  CTR: __webpack_require__(134)
	};

	module.exports = function (crypto) {
	  function createDecipheriv(suite, password, iv) {
	    var config = modes[suite];
	    if (!config) {
	      throw new TypeError('invalid suite type');
	    }
	    if (typeof iv === 'string') {
	      iv = new Buffer(iv);
	    }
	    if (typeof password === 'string') {
	      password = new Buffer(password);
	    }
	    if (password.length !== config.key/8) {
	      throw new TypeError('invalid key length ' + password.length);
	    }
	    if (iv.length !== config.iv) {
	      throw new TypeError('invalid iv length ' + iv.length);
	    }
	    if (config.type === 'stream') {
	      return new StreamCipher(modelist[config.mode], password, iv, true);
	    }
	    return new Decipher(modelist[config.mode], password, iv);
	  }

	  function createDecipher (suite, password) {
	    var config = modes[suite];
	    if (!config) {
	      throw new TypeError('invalid suite type');
	    }
	    var keys = ebtk(crypto, password, config.key, config.iv);
	    return createDecipheriv(suite, keys.key, keys.iv);
	  }
	  return {
	    createDecipher: createDecipher,
	    createDecipheriv: createDecipheriv
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25).Buffer))

/***/ }
/******/ ]);