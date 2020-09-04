# module-composer

Module composition using partial function application.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- [Install](#install)
- [Example](#example)
- [Usage](#usage)
- [Example](#example-1)
- [How is this useful?](#how-is-this-useful)
- [Couldn't those index.js files be generated?](#couldnt-those-indexjs-files-be-generated)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

`npm install module-composer`

## Example

This package was extracted from [Agile Avatars](https://github.com/mattriley/agileavatars).

This is Agile Avatar's [Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/):

<details open>
<summary>https://raw.githubusercontent.com/mattriley/agileavatars/master/boot.js</summary>

```js
const sentry = require('@sentry/browser');
const composer = require('module-composer');
const { lib, startup, ...src } = require('./src');

module.exports = ({ window, ...overrides }) => {

    const compose = composer(src, { overrides });

    const io = compose('io', { window });
    const config = compose('config', { io, window });
    sentry.init(config.sentry);
        
    // Data layer
    const { state, stores, settings, subscriptions } = startup.createStores({ lib, config });
        
    // Domain layer
    const core = compose('core', { lib, config });
    const services = compose('services', { subscriptions, settings, stores, core, io, lib, config, sentry });

    // Presentation layer
    const { el, ...elements } = compose('elements', { lib, window });
    const components = compose('components', { el, elements, services, subscriptions, lib, config, window });

    startup.insertNilRole({ config, settings, stores });
    startup.createHandlers({ services, subscriptions, lib, config });

    return { components, elements, services, core, subscriptions, lib, config, state };

};
```
</details>




## Usage

```js
const composer = require('module-composer');
const src = require('./src');
const compose = composer(src);
const moduleB = compose('moduleB', {});
const moduleA = compose('moduleA', { moduleB });
```

## Example

Take the following object graph:

```js
const src = {
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

Here's how these modules might be composed manually:

```js
const moduleB = {};
moduleB.baz = src.moduleB.baz({ moduleB });
moduleB.qux = src.moduleB.qux({ moduleB });

const moduleA = {};
moduleA.foo = src.moduleA.foo({ moduleA, moduleB });
moduleA.bar = src.moduleA.bar({ moduleA, moduleB });

moduleA.foo();
```

Here's how these modules might be composed with `module-composer`:

```js
const composer = require('module-composer');

const src = {
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

const compose = composer(src);
const moduleB = compose('moduleB', {});
const moduleA = compose('moduleA', { moduleB });

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
const src = require('./src');

const compose = composer(src);
const moduleB = compose('moduleB', {});
const moduleA = compose('moduleA', { moduleB });

moduleA.foo();
```

`proj/src`

```js
// index.js

module.exports = {
    moduleA: require('./module-a'),
    moduleB: require('./module-b')
};
```

`proj/src/module-a`

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

`proj/src/module-b`

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
