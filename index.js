import assign from 'object-assign';

/** this assumes that fetch is available in globals or window */
const getFetch = () => {
    let theFetch;
    if (typeof global !== 'undefined') {
        theFetch = global.fetch;
    }
    if ( !theFetch && typeof window !== 'undefined') {
        theFetch = window.fetch;
    }
    return theFetch;
};

const DEFAULT_CONFIG = Object.freeze({ autoBust: true, sameOrigin: true });
const AUTO_SAME_ORIGIN = Object.freeze({ credentials: 'same-origin' });
const DEFAULT_JSON_POST = Object.freeze({
    method: 'post',
    headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});


export const bust = (path) => {
    let resultingPath = path;
    if ( path.indexOf('?') > -1 ) {
        resultingPath += '&';
    } else {
        resultingPath += '?';
    }
    return resultingPath += '__bust__=' + (new Date()).getTime();
};

const toJson = ( res ) => res.json();

const baseJFetch = (config, path, params) => {
    const theFetch = getFetch();
    return theFetch( config.autoBust ? bust(path) : path,
        assign({}, params || {} , config.sameOrigin ? AUTO_SAME_ORIGIN : {} )).then( toJson );
};

const baseJFetchPost = (config, path, toPost) => {
    return baseJFetch(config, path, assign({}, DEFAULT_JSON_POST,{
        body: JSON.stringify(toPost||{})
    })).then( toJson );
};

/**
 * Create base object
 */
const jfetch = baseJFetch.bind(null, DEFAULT_CONFIG);
jfetch.prototype = {};
jfetch.prototype.post = baseJFetchPost.bind(null, DEFAULT_CONFIG );

export const createjFetch = (config) => {
    const configBase = assign({}, config, DEFAULT_CONFIG );
    return baseJFetch.bind(null, configBase);
};

export default jfetch;
