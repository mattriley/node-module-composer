# Module Composer

A tiny but powerful closure-based module composition utility.

Why is it so common for modern JavaScript applications to be reasoned about in terms of scripts and files, and implemented as convoluted mazes of file imports?

Module Composer encourages intentionality for application architecture by making it easier to design and reason about an application as a composition of modules.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```
npm install module-composer
```

## Basic example

Consider the following example:

<%- await readCode('./examples/basic/compose.js') %>

`modules` is simply an object containing an entry for each module:

```js
{
    stores: { ... },
    services: { ... },
    components: { ... }
}
```

`composer` is passed `modules` and returns a `compose` function. `compose` is then passed dependencies for a given module name and returns the "composed" module.

Each module is simply an object containing an entry for each function of the module:

<%- await readCode('./examples/basic/modules.js') %>

Notice the "double arrow" functions? That's syntactic sugar for "a function that returns another function".

Here's the equivalent _without_ double arrows, using `components` as an example:

```js
export default {
    components: {
        productDetails: ({ services }) => {
            return ({ product }) => { ... }
        }
    }
}
```

`compose` calls the first arrow function with the specified dependencies for each entry in the module and returns the second arrow function.

This is analogous to calling a class constructor with dependencies and returning the resulting instance. However rather than using a class to encapsulate dependency state, closures (stateful functions) are used instead.

## File system structure

The module hierarchy can be easily represented by the file system:

```
modules/
    index.js
    stores/
        index.js
        addToCart.js        
    services/
        index.js
        orderProduct.js        
    components/
        index.js
        productDetails.js        
```

`index.js` files can be used as "barrel" files to rollup each file in a directory:

<%- await readCode('./examples/basic/modules/index.js') %>

<%- await readCode('./examples/basic/modules/components/index.js') %>

This pattern opens the possibility of autogenerating `index.js` files.

`module-indexgen` is a package designed to do just that: https://github.com/mattriley/node-module-indexgen

## Mermaid diagrams

[Mermaid](https://mermaid-js.github.io) is a tool for creating diagrams and visualizations using text and code. Since early 2022, GitHub can render diagrams directly from Mermaid syntax in markdown files. See [Include diagrams in your Markdown files with Mermaid](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/) for more information.

This diagram is generated from the basic example above:

<%- await moduleGraph('./examples/basic/compose.js') %>

Module Composer produces a module named `composition` which can be used to generate Mermaid syntax.

A consumer might generate Mermaid syntax like so:

```js
const { composition } = compose();
const graph = composition.mermaid();
```

## App config

For convenience, config can be passed as the second and subsequent parameters to the composer function. These configs are merged using [Lodash merge](https://www.npmjs.com/package/lodash.merge) and returned along with the compose function.

In the next example, `defaultConfig` and `userConfig` are merged to produce `config`, which is then passed as a dependency of the `components` module.

```js
const { compose, config } = composer(modules, defaultConfig, userConfig);
const { components } = compose('components', { config });
```

This can be especially useful during testing by applying test config.

## Advanced example: Agile Avatars

> Great looking avatars for your agile board and experiment in FRAMEWORK-LESS, vanilla JavaScript.<br/>
https://agileavatars.com • https://github.com/mattriley/agileavatars

Module composition:

<%- await readCode(['../agileavatars', './src/compose.js']) %>

Generated Mermaid digram:

<%- await moduleGraph('../agileavatars/src/compose.js') %>
