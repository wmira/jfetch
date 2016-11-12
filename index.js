
const { assign, freeze } = Object;

const identity = a => a;
const get = (field, withDefault ) => (obj) => {
    return obj[field] || withDefault;
};

const DEFAULT_CONFIG = freeze({ method: 'get', autoBust: true, credentials: 'same-origin', withConfig: identity });

const DEFAULT_JSON_POST = freeze({
    method: 'post',
    headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/** this assumes that fetch is available in globals or window */
export const getFetch = () => {
    let theFetch;
    if (typeof global !== 'undefined') {
        theFetch = global.fetch;
    }
    if ( !theFetch && typeof window !== 'undefined') {
        theFetch = window.fetch;
    }
    if ( !theFetch ) {
        throw new Error('Unable to find fetch');
    }
    return theFetch;
};



export const bust = (path) => {
    let resultingPath = path;
    if ( path.indexOf('?') > -1 ) {
        resultingPath += '&';
    } else {
        resultingPath += '?';
    }
    return resultingPath += '__bust__=' + (new Date()).getTime();
};

const withOnResponse = (onResponse) => next => (response) => {

    if ( onResponse ) {
        try {
            onResponse(response);
        } catch ( ex ) {
            console.warn('Error on calling onResponse handler ', ex);
        }
    }
    return next(response);
};

const toJson = config => withOnResponse(config.onResponse)( response => response.json());



const baseFetcher = (config, path, params = {} ) => {

    const theFetch = getFetch();
    const toJsonHandler = toJson(config);
    
    const { withConfig = identity, ...otherConfig } = config;
    const withUserConfig = withConfig() || {};

    const { headers: paramHeaders, ...otherParams } = params;

    const headers = { ...withUserConfig.headers, ...paramHeaders };
    const credentials = get('credentials', config.credentials )(withUserConfig);    

    const configToUse = {...otherConfig, ...withConfig, ...otherParams, headers, credentials };

    return theFetch( config.autoBust && config.method === 'get' ? bust(path) : path,
        configToUse).then( toJsonHandler );

};


const baseJFetchPost = (config, path, toPost) => {
    return baseFetcher(config, path, { ...DEFAULT_JSON_POST, body: JSON.stringify(toPost||{}) });    
};




const postHandler = (config) => (...args) => {
    const postArg = [ { ...config, ...DEFAULT_JSON_POST }, ...args];
    return baseJFetchPost(...postArg);
};
const putHandler = (config) => postHandler({ ...config, method: 'put' });

const headHandler = (config) => (...args) => {
    const headArgs = [ { ...DEFAULT_CONFIG, ...config, method: 'head', autoBust: 'false' }, ...args ];
    return baseFetcher(...headArgs);
};

const HTTP_ACTIONS = {
    head: headHandler,
    post: postHandler,
    put: putHandler 
};

const addActions = (fetchToEnchance, config) => {
    return Object.keys(HTTP_ACTIONS)
        .reduce( (theFetch, action) => {
            theFetch[action] = HTTP_ACTIONS[action](config);
            return theFetch;
        }, fetchToEnchance);
};

export const createJfetch = (config) => {
    const configBase = { ...DEFAULT_CONFIG, ...config };
    
    const newJfetch = (...args) => {
        return baseFetcher(configBase, ...args);
    };
    return addActions(newJfetch, configBase);

};

/**
 * Create default jfetch
 */
const jfetch = createJfetch(DEFAULT_CONFIG);


export { jfetch };
export default jfetch;
