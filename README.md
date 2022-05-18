# Module Composer

A module composition utility.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- [Install](#install)
- [Basic Usage](#basic-usage)
- [Advanced Example: Agile Avatars](#advanced-example-agile-avatars)
- [File system structure](#file-system-structure)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```
npm install module-composer
```

## Basic Usage

Consider the following example:

```js
const composer = require('module-composer');
const modules = require('./src/modules');

const { compose } = composer(modules);
const { stores } = compose('stores');
const { services } = compose('services', { stores });
const { components } = compose('components', { services });
```

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

```js
{
    stores: { 
        addToCart: () => product => { ... }
    },
    services: { 
        orderProduct: ({ stores }) => product => { ... }
    },
    components: {
        productDetails: ({ services }) => product => { ... }
    }
}
```

Notice the "double arrow" functions? This is syntactic sugar for "a function at returns another function".

Here's the equivalent with double arrows, using `components` as an example:

```js
{
    components: {
        productDetails: ({ services }) => {
            return product => { ... }
        }
    }
}
```

The `compose` function calls the first arrow function with the specified dependencies for each entry in the module and returns the second arrow function.

This is analogous to calling a class constructor with dependencies and returning the resulting instance. However rather than using a class to encapsulate dependency state, closures (stateful functions) are used instead.

## Advanced Example: Agile Avatars

This is the composition root from [Agile Avatars](https://agileavatars.com):

<details open>
<summary>https://raw.githubusercontent.com/mattriley/agileavatars/master/src/compose.js</summary>

```js
import composer from 'module-composer';
import modules from './modules';
import defaultConfig from './default-config';
const { storage, util } = modules;

export default ({ window, configs }) => {

    const { compose, config } = composer({ window, ...modules }, defaultConfig, configs);

    // Data
    const { stores } = compose('stores', { storage, config });
    const { subscriptions } = compose('subscriptions', { stores, util });

    // Domain
    const { core } = compose('core', { util, config });
    const { io } = compose('io', { window });
    const { services } = compose('services', { subscriptions, stores, core, io, util, config });
    const { vendorServices } = compose('vendorServices', { io, config, window });

    // Presentation
    const { ui } = compose('ui', { window });
    const { el } = ui;
    const { elements } = compose('elements', { el, ui, util });
    const { vendorComponents } = compose('vendorComponents', { el, ui, config, window });
    const { components } = compose('components', { el, ui, elements, vendorComponents, vendorServices, services, subscriptions, util, config });
    const { styles } = compose('styles', { el, ui, subscriptions, config });

    // Startup    
    compose('diagnostics', { stores, util });
    return compose('startup', { ui, components, styles, services, subscriptions, stores, util, config });

};
```
</details>

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
        orderProducts.js        
    components/
        index.js
        productDetails.js        
```

`index.js` files can be used as "barrel" files to rollup each file in a directory:

```js
// modules/index.js
module.exports = {
    stores: require('./stores'),
    services: require('./services'),
    components: require('./components')
};
```

```js
// modules/components/index.js
module.exports = {
    productDetails: require('./productDetails')
};
```

This pattern opens the possibility of autogenerating `index.js` files.

`module-indexgen` is a package design to do just that: https://github.com/mattriley/node-module-indexgen
