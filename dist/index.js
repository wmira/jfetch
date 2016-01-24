(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jfetch"] = factory();
	else
		root["jfetch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createjFetch = exports.bust = undefined;

	var _objectAssign = __webpack_require__(1);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/** this assumes that fetch is available in globals or window */
	var getFetch = function getFetch() {
	    var theFetch = undefined;
	    if (typeof global !== 'undefined') {
	        theFetch = global.fetch;
	    }
	    if (!theFetch && typeof window !== 'undefined') {
	        theFetch = window.fetch;
	    }
	    return theFetch;
	};

	var DEFAULT_CONFIG = Object.freeze({ autoBust: true, sameOrigin: true });
	var AUTO_SAME_ORIGIN = Object.freeze({ credentials: 'same-origin' });
	var DEFAULT_JSON_POST = Object.freeze({
	    method: 'post',
	    headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    }
	});

	var bust = exports.bust = function bust(path) {
	    var resultingPath = path;
	    if (path.indexOf('?') > -1) {
	        resultingPath += '&';
	    } else {
	        resultingPath += '?';
	    }
	    return resultingPath += '__bust__=' + new Date().getTime();
	};

	var toJson = function toJson(res) {
	    return res.json();
	};

	var baseJFetch = function baseJFetch(config, path, params) {
	    var theFetch = getFetch();
	    return theFetch(config.autoBust ? bust(path) : path, (0, _objectAssign2.default)({}, params || {}, config.sameOrigin ? AUTO_SAME_ORIGIN : {})).then(toJson);
	};

	var baseJFetchPost = function baseJFetchPost(config, path, toPost) {
	    return baseJFetch(config, path, (0, _objectAssign2.default)({}, DEFAULT_JSON_POST, {
	        body: JSON.stringify(toPost || {})
	    })).then(toJson);
	};

	/**
	 * Create base object
	 */
	var jfetch = baseJFetch.bind(null, DEFAULT_CONFIG);
	jfetch.prototype = {};
	jfetch.prototype.post = baseJFetchPost.bind(null, DEFAULT_CONFIG);

	var createjFetch = exports.createjFetch = function createjFetch(config) {
	    var configBase = (0, _objectAssign2.default)({}, config, DEFAULT_CONFIG);
	    return baseJFetch.bind(null, configBase);
	};

	exports.default = jfetch;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
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


/***/ }
/******/ ])
});
;