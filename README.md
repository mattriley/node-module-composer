new readme

# module-composer

TODO

## Install

`npm i @mattriley/module-composer`

## Usage

TODO

## Example

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

Here's how these modules might be composed manually:

```js
const moduleB = {};
moduleB.baz = modules.moduleB.baz({ moduleB });
moduleB.qux = modules.moduleB.qux({ moduleB });

const moduleA = {};
moduleA.foo = modules.moduleA.foo({ moduleA, moduleB });
moduleA.bar = modules.moduleA.bar({ moduleA, moduleB });

moduleA.foo();
```

`module-composer` automates composition by looking for a `__modulename` entry on each module.

Here's how these modules might be composed with `module-composer`:

```js
const compose = require('@mattriley/module-composer');

const modules = {
    moduleA: {
        __modulename: 'moduleA',
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
        __modulename: 'moduleB',
        baz: ({ moduleB }) => () => {
            console.log('baz');
            moduleB.qux();
        },
        qux: ({ moduleB }) => () => {
            console.log('qux');
        }
    }
};

const moduleB = compose(modules.moduleB, {});
const moduleA = compose(modules.moduleA, { moduleB });

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

const compose = require('@mattriley/module-composer');
const src = require('./src');

const moduleB = compose(src.moduleB, {});
const moduleA = compose(src.moduleA, { moduleB });

moduleA.foo();
```

`proj/src`

```js
// index.js

module.exports = {
    __modulename: 'src',
    moduleA: require('./module-a'),
    moduleB: require('./module-b')
};
```

`proj/src/module-a`

```js
// index.js

module.exports = {
    __modulename: 'moduleA',
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
    __modulename: 'moduleB',
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

## Couldn't those `index.js` files be generated?

Glad you asked. Absolutely. See: https://github.com/mattriley/node-indexgen

