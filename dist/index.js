'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var assign = Object.assign,
    freeze = Object.freeze;


var identity = function identity(a) {
    return a;
};
var get = function get(field, withDefault) {
    return function (obj) {
        return obj[field] || withDefault;
    };
};

var DEFAULT_CONFIG = freeze({ method: 'get', autoBust: true, credentials: 'same-origin', withConfig: identity });

var DEFAULT_JSON_POST = freeze({
    method: 'post',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/** this assumes that fetch is available in globals or window */
var getFetch = exports.getFetch = function getFetch() {
    var theFetch = void 0;
    if (typeof global !== 'undefined') {
        theFetch = global.fetch;
    }
    if (!theFetch && typeof window !== 'undefined') {
        theFetch = window.fetch;
    }
    if (!theFetch) {
        throw new Error('Unable to find fetch');
    }
    return theFetch;
};

var bust = exports.bust = function bust(path) {
    var resultingPath = path;
    if (path.indexOf('?') > -1) {
        resultingPath += '&';
    } else {
        resultingPath += '?';
    }
    return resultingPath += '__bust__=' + new Date().getTime();
};

var withOnResponse = function withOnResponse(onResponse) {
    return function (next) {
        return function (response) {

            if (onResponse) {
                try {
                    onResponse(response);
                } catch (ex) {
                    console.warn('Error on calling onResponse handler ', ex);
                }
            }
            return next(response);
        };
    };
};

var toJson = function toJson(config) {
    return withOnResponse(config.onResponse)(function (response) {
        return response.json();
    });
};

var baseFetcher = function baseFetcher(config, path) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


    var theFetch = getFetch();
    var toJsonHandler = toJson(config);

    var _config$withConfig = config.withConfig,
        withConfig = _config$withConfig === undefined ? identity : _config$withConfig,
        otherConfig = _objectWithoutProperties(config, ['withConfig']);

    var withUserConfig = withConfig() || {};

    var paramHeaders = params.headers,
        otherParams = _objectWithoutProperties(params, ['headers']);

    var headers = _extends({}, withUserConfig.headers, paramHeaders);
    var credentials = get('credentials', config.credentials)(withUserConfig);

    var configToUse = _extends({}, otherConfig, withConfig, otherParams, { headers: headers, credentials: credentials });

    return theFetch(config.autoBust && config.method === 'get' ? bust(path) : path, configToUse).then(toJsonHandler);
};

var baseJFetchPost = function baseJFetchPost(config, path, toPost) {
    return baseFetcher(config, path, _extends({}, DEFAULT_JSON_POST, { body: JSON.stringify(toPost || {}) }));
};

var postHandler = function postHandler(config) {
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var postArg = [_extends({}, config, DEFAULT_JSON_POST)].concat(args);
        return baseJFetchPost.apply(undefined, _toConsumableArray(postArg));
    };
};
var putHandler = function putHandler(config) {
    return postHandler(_extends({}, config, { method: 'put' }));
};

var headHandler = function headHandler(config) {
    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var headArgs = [_extends({}, DEFAULT_CONFIG, config, { method: 'head', autoBust: 'false' })].concat(args);
        return baseFetcher.apply(undefined, _toConsumableArray(headArgs));
    };
};

var HTTP_ACTIONS = {
    head: headHandler,
    post: postHandler,
    put: putHandler
};

var addActions = function addActions(fetchToEnchance, config) {
    return Object.keys(HTTP_ACTIONS).reduce(function (theFetch, action) {
        theFetch[action] = HTTP_ACTIONS[action](config);
        return theFetch;
    }, fetchToEnchance);
};

var createJfetch = exports.createJfetch = function createJfetch(config) {
    var configBase = _extends({}, DEFAULT_CONFIG, config);

    var newJfetch = function newJfetch() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return baseFetcher.apply(undefined, [configBase].concat(args));
    };
    return addActions(newJfetch, configBase);
};

/**
 * Create default jfetch
 */
var jfetch = createJfetch(DEFAULT_CONFIG);

exports.jfetch = jfetch;
exports.default = jfetch;
