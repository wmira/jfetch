jfetch
=======

jfetch is a small library that assumes that all fetch calls are json based.


# Install

```javascript
npm install --save jfetch
```

# Usage

```javascript

import jfetch from 'jfetch';

jfetch('/somewhere').then ( res => {
    console.log('res here is json object' , res);
});

jfetch.post('/post/path', {id:1, name: 'Name', data: []}).then ( res => {
    console.log('res here is result of the post - translated to json' , res);
});

```

By default jfetch auto busts get requests. If needed you can build that will have a different config.

```javascript
import { createjFetch } from 'jfetch';

const jfetch = createJFetch({autoBust: false});
jfetch('/somewhere'); # no url busts
```
