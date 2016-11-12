/* global Promise: false */
import should from 'should';

import fetch, { createJfetch } from './index.js';

describe('jfetch tests', () => {
    const createFetch = () => { 
        const createResponse = (...args) => {
            return {
                json() {
                    return Promise.resolve(args);
                }
            };
        };   
        return ( ...args ) => {            
            return Promise.resolve(createResponse(args));
        };
    };
    
    global.fetch = createFetch();
    it('get has basic config', (done) => {
        
        fetch('/sample/url')
            .then( args => {
                const [,params] = args[0];
                
                should(params.credentials).be.exactly('same-origin');
                should(params.method).be.exactly('get');                
                should(params.headers).be.ok();                
                done();
            }).catch(err => {
                console.error(err);  
            });
    });
    it('head will not auto busts', (done) => {
               
        fetch.head('/sample/url')
            .then( args => {
                const [url] = args[0];
                
                should(url).be.exactly('/sample/url');
                
                done();
            }).catch(err => {
                console.error(err);  
            });
    });
    it('gets using autoBusts', (done) => {
       
        fetch('/sample/url')
            .then( args => {
                const [url] = args[0];               
                should(url).be.ok();               
                should(url.indexOf('/sample/url')).be.exactly(0);
                should(url.indexOf('__bust__') !== -1 ).be.exactly(true);
                
                done();
            }).catch( err => {
                console.error(err);
            });
    });

    it('posts stringifying body', (done) => {
       
        const objToPost = {a:1, b:2 };
        fetch.post('/post/it', objToPost)
            .then( args => {
                const [url, params] = args[0];               
                should(url).be.ok();
                should(url).be.exactly('/post/it');

                should(params.body).be.exactly(JSON.stringify(objToPost));
                done();
            }).catch( err => {
                console.error(err);
            });
    });

    it('changes config with withConfig', (done) => {
        const mockFetch = createFetch();
        global.fetch = mockFetch;
        const jfetch = createJfetch({ withConfig: () => ({ headers: { a: 1, b: 2 } } ) });
        jfetch('/a/b')
            .then( args => {
                const [, params] = args[0];
                should(params.headers.a).be.exactly(1);
                should(params.headers.b).be.exactly(2);
                done();
            });
    });
    it('adds default headers for post with withConfig', (done) => {
        const mockFetch = createFetch();
        global.fetch = mockFetch;
        const jfetch = createJfetch({ withConfig: () => ({ headers: { a: 1, b: 2 } } ) });
        jfetch.post('/a/b')
            .then( args => {
                const [, params] = args[0];

                should(params.headers.a).be.exactly(1);
                should(params.headers.b).be.exactly(2);
                should(params.headers.Accept).be.exactly('application/json');
                should(params.headers['Content-Type']).be.exactly('application/json');
                done();
            });
    });
    it('adds default headers for put with withConfig', (done) => {
        const mockFetch = createFetch();
        global.fetch = mockFetch;
        const jfetch = createJfetch({ withConfig: () => ({ headers: { a: 1, b: 2 } } ) });
        jfetch.post('/a/b')
            .then( args => {
                const [, params] = args[0];                
                should(params.headers.a).be.exactly(1);
                should(params.headers.b).be.exactly(2);
                should(params.headers.Accept).be.exactly('application/json');
                should(params.headers['Content-Type']).be.exactly('application/json');
                done();
            });
    });

    it('can intercept response', (done) => {
        let isCalled = false;
        let jfetch = createJfetch({ onResponse: (response) => {
            should(response).be.ok();
            isCalled = true;
        } });

        jfetch('/a/url')
            .then( () => {
                should(isCalled).be.exactly(true);
                done();
            });
    });
});