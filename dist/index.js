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

	module.exports = riot-compiler;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var JSON5 = __webpack_require__(3);
	var path = __webpack_require__(4);
	var assign = __webpack_require__(5);
	var emojiRegex = /[\uD800-\uDFFF]./;
	var emojiList = __webpack_require__(6).filter(function(emoji) {
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

		var Big = __webpack_require__(7);
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
		var hash = __webpack_require__(8).createHash(hashType);
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
/* 3 */
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
/* 4 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ }
/******/ ]);