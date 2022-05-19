# Module Composer

A tiny but powerful closure-based module composition utility.

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

<%- readCode('./examples/basic/compose.js') %>

`modules` is simply an object containing an entry for each module:

```js
{
    stores: { ... },
    services: { ... },
    components: { ... }
}
```

`composer` is passed `modules` and returns a `compose` function.

`compose` is then passed dependencies for a given module name and returns the "composed" module.

Each module is simply an object containing an entry for each module function:

<%- readCode('./examples/basic/modules.js') %>

Notice the "double arrow" functions? That's syntactic sugar for "a function at returns another function".

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

```js
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

<%- readCode('./examples/basic/modules/index.js') %>

<%- readCode('./examples/basic/modules/components/index.js') %>

This pattern opens the possibility of autogenerating `index.js` files.

`module-indexgen` is a package designed to do just that: https://github.com/mattriley/node-module-indexgen

## Advanced example: Agile Avatars

This is the composition root from [Agile Avatars](https://agileavatars.com):

<%- fetchCode('https://raw.githubusercontent.com/mattriley/agileavatars/master/src/compose.js') %>
