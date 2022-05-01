# Module Composer

A module composition utility.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```
npm install module-composer
```

## Usage

```js
const composer = require('module-composer');
const src = require('./src');
const compose = composer(src);
const moduleB = compose('moduleB');
const moduleA = compose('moduleA', { moduleB });
```

## Example: Agile Avatars

This is the composition root from Agile Avatars:

<%- fetchCode('https://raw.githubusercontent.com/mattriley/agileavatars/master/src/compose.js') %>

Recommended reading:
- [Composition Root - Mark Seemann](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)

## How it works

Take the following object graph:

```js
const modules = {
    moduleA: {
        foo: ({ moduleA, moduleB }) => () => {
            console.log('foo');
            moduleA.bar();
        },
        bar: ({ moduleA, moduleB }) => () => {
            console.log('bar');
            moduleB.baz();
        }
    },
    moduleB: {
        baz: ({ moduleB }) => () => {
            console.log('baz');
            moduleB.qux();
        },
        qux: ({ moduleB }) => () => {
            console.log('qux');
        }
    }
};
```

Upon composition, and invocation of `foo`, the intended output is:

```
foo
bar
baz
qux
```

Here's how these modules would be composed manually:

```js
const moduleB = {};
moduleB.baz = src.moduleB.baz({ moduleB });
moduleB.qux = src.moduleB.qux({ moduleB });

const moduleA = {};
moduleA.foo = src.moduleA.foo({ moduleA, moduleB });
moduleA.bar = src.moduleA.bar({ moduleA, moduleB });

moduleA.foo();
```

Here's how these modules would be composed with `module-composer`:

```js
const composer = require('module-composer');
const { compose } = composer(modules);
const { moduleB } = compose('moduleB');
const { moduleA } = compose('moduleA', { moduleB });

moduleA.foo();
```

## How is this useful?

The above example could be broken down into the following directory structure:

```
proj/
    run.js
    src/
        index.js
        module-a/
            index.js
            foo.js
            bar.js            
        module-b/
            index.js  
            baz.js
            qux.js                  
```

`proj`

```js
// run.js

const composer = require('module-composer');
const modules = require('./modules');

const compose = composer(modules);
const { moduleB } = compose('moduleB', {});
const { moduleA } = compose('moduleA', { moduleB });

moduleA.foo();
```

`src/modules`

```js
// index.js

module.exports = {
    moduleA: require('./module-a'),
    moduleB: require('./module-b')
};
```

`src/modules/module-a`

```js
// index.js

module.exports = {
    foo: require('./foo'),
    bar: require('./bar')
};


// foo.js

module.exports = ({ moduleA, moduleB }) => () => {
    console.log('foo');
    moduleA.bar();
};


// bar.js

module.exports = ({ moduleA, moduleB }) => () => {
    console.log('bar');
    moduleB.baz();
};
```

`src/modules/module-b`

```js
// index.js

module.exports = {
    baz: require('./baz'),
    qux: require('./qux')
};


// baz.js

module.exports = ({ moduleA, moduleB }) => () => {
    console.log('baz');
    moduleA.qux();
};


// qux.js

module.exports = ({ moduleA, moduleB }) => () => {
    console.log('qux');
};
```

## Couldn't those index.js files be generated?

Glad you asked. Absolutely. See: https://github.com/mattriley/node-module-indexgen
