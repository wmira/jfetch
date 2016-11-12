jfetch
=======

jfetch is a small library that makes it easier to use the fetch library. Use it if you
have an all json communication with your rest endpoint


# Install

```javascript
npm install --save jfetch
```

# Usage

```javascript

//es6 modules
import jfetch from 'jfetch';

//amd
const { jfetch } = require('jfetch');
//amd alt
const jfetch = require('jfetch').default;
```


# Quick Usage


```javascript
//standard get 

//process json here is a function
jfetch('/api/inventories')
    .then( processJson );

//post
jfetch.post('/api/inventories', { id: 'xY33bG', name: 'New Inventory' })
    .then( processJson );

```

# Customizing Jfetch

You can use jfetch such that you are able to change the behavior on how each of the requests behaves.
This is done using the createJfetch function.

```javascript
import { createJfetch } from 'jfetch'; //es6 modules

//const { createJfetch } = require('jfetch'); //amd

const jfetch = createJfetch({ autoBust: false });

jfetch('/api/inventories').then(...); //...will not auto bust get

```


## withConfig

You can use with config to pass extra configurati

## Response Combinator

Sometimes you would want to have a combinator to check a json response for application
level response code. You can use 











jfetch('/somewhere').then ( res => {
    console.log('res here is json object' , res);
});

jfetch.post('/post/path', {id:1, name: 'Name', data: []}).then ( res => {
    console.log('res here is result of the post - translated to json' , res);
});



By default jfetch auto busts get requests. If needed you can build that will have a different config.


import { createjFetch } from 'jfetch';

const jfetch = createJFetch({autoBust: false});
jfetch('/somewhere'); # no url busts

