# Module Composer

<p align="right"><code>100% cov</code>&nbsp;<code>383 sloc</code>&nbsp;<code>15 files</code>&nbsp;<code>1 deps</code>&nbsp;<code>13 dev deps</code></p>

Bring order to chaos. Level up your JS application architecture with Module Composer, a tiny but powerful module composition utility based on functional dependency injection.

<br />

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

  - [Install](#install)
  - [At a glance](#at-a-glance)
- [API Reference](#api-reference)
  - [Composing modules](#composing-modules)
    - [`compose.make` or just `compose`: Compose a module](#composemake-or-just-compose-compose-a-module)
    - [`compose.deep`: Compose a deep module](#composedeep-compose-a-deep-module)
    - [`compose.flat`: Compose and flatten a module](#composeflat-compose-and-flatten-a-module)
    - [`compose.asis`: Register an existing module](#composeasis-register-an-existing-module)
    - [Nested modules](#nested-modules)
  - [Self referencing](#self-referencing)
    - [`self`: Refer to the same module](#self-refer-to-the-same-module)
    - [`here`: Refer to the same level](#here-refer-to-the-same-level)
  - [Overriding modules](#overriding-modules)
  - [Application configuration](#application-configuration)
    - [`configure.merge` or just `configure`: Merge config objects](#configuremerge-or-just-configure-merge-config-objects)
    - [`configure.mergeWith`: Custom merge config objects](#configuremergewith-custom-merge-config-objects)
    - [Configuration as an option](#configuration-as-an-option)
    - [Freezing config](#freezing-config)
    - [Config aliases](#config-aliases)
  - [Extensions](#extensions)
    - [`mermaid`: Generate dependency diagrams](#mermaid-generate-dependency-diagrams)
    - [`module-alias`: Reference *modules* with alternative names](#module-alias-reference-modules-with-alternative-names)
    - [`function-alias`: Reference *functions* with alternative names](#function-alias-reference-functions-with-alternative-names)
    - [`access-modifiers`: True public and private functions](#access-modifiers-true-public-and-private-functions)
    - [`eject`: Opt out of Module Composer](#eject-opt-out-of-module-composer)
    - [`perf`: Meaure composition performance](#perf-meaure-composition-performance)
- [Why Module Composer?](#why-module-composer)
  - [Background](#background)
  - [How it works](#how-it-works)
  - [Composition root](#composition-root)
  - [File-per-function](#file-per-function)
  - [Dependency injection](#dependency-injection)
  - [Functional programming](#functional-programming)
  - [Fitness functions](#fitness-functions)
    - [Example 1: N-tier architecture](#example-1-n-tier-architecture)
    - [Example 2: Pure-impure segregation](#example-2-pure-impure-segregation)
  - [Testability](#testability)
- [Advanced example: Agile Avatars](#advanced-example-agile-avatars)
  - [Design principles](#design-principles)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

###### <p align="right"><a href="https://www.npmjs.com/package/module-composer">https://www.npmjs.com/package/module-composer</a></p>
```sh
npm install module-composer
```

## At a glance

A contrived example to set the scene.

```js
// compose.js
import composer from 'module-composer';
import modules from './modules/index.js';

export default ({ config }) => {
    const { compose } = composer(modules, { config });
    const { repositories } = compose('repositories');
    const { services } = compose('services', { repositories });
    const { views } = compose('views', { services });
    return compose.modules;
}
```

```js
// app.js
import compose from './compose.js';
const { views } = compose();
views.welcome.render(); 
```

# API Reference

## Composing modules

### `compose.make` or just `compose`: Compose a module

```js
const modules = {
    mod1: {
        fun1: () => () => 'hello world'
    },
    mod2: {
        fun2: ({ mod1 }) => () => mod1.fun1()
    }
};

const { compose } = composer(modules);
const { mod1 } = compose('mod1');
const { mod2 } = compose('mod2', { mod1 });
mod2.fun2(); // == "hello world"
```

### `compose.deep`: Compose a deep module

For modules that have organisational substructures.

```js
const modules = {
    mod1: {
        sub1: { // 👀 organisational substructure
            fun1: () => () => 'hello world'
        }
    },
    mod2: {
        sub2: { // 👀 organisational substructure
            fun2: ({ mod1 }) => () => mod1.sub1.fun1();
        }
    }
};

const { compose } = composer(modules);
const { mod1 } = compose.deep('mod1');
const { mod2 } = compose.deep('mod2', { mod1 });
mod2.sub2.fun2(); // == "hello world"
```

### `compose.flat`: Compose and flatten a module

For modules that have organisational substructures for development convenience that should be stripped from (flattened in) the final result.

```js
const modules = {
    mod1: {
        sub1: { // 👀 organisational substructure
            fun1: () => () => 'hello world'
        }
    },
    mod2: {
        sub2: { // 👀 organisational substructure
            fun2: ({ mod1 }) => () => mod1.fun1();
        }
    }
};

const { compose } = composer(modules);
const { mod1 } = compose.flat('mod1');
const { mod2 } = compose.flat('mod2', { mod1 });
mod2.fun2(); // == "hello world"
```

### `compose.asis`: Register an existing module

For modules that don't require dependencies.

```js
const modules = {
    mod1: {
        fun1: () => 'hello world' // 👀 no higher order function to accept deps
    },
    mod2: {
        fun2: ({ mod1 }) => () => mod1.fun1()
    }
};

const { compose } = composer(modules);
const { mod1 } = compose.asis('mod1');
const { mod2 } = compose('mod2', { mod1 });
mod2.fun2(); // == "hello world"
```

### Nested modules

Modules that have an organisational superstructure can be composed by specifying the path (delimited by dot) to the module. This can be useful for namespacing modules to avoid naming collisions.

```js
const modules = {
    sup1: {  // 👀 organisational superstructure
        mod: { // 👀 same module name
            fun1: () => () => 'hello world'
        }
    },
    sup2: { // 👀 organisational superstructure
        mod: { // 👀 same module name
            fun2: ({ sup1 }) => () => sup1.mod1.fun1();
        }
    }
};

const { compose } = composer(modules);
const { sup1 } = compose.flat('sup1.mod'); // 👀 delimited by dot
const { sup2 } = compose.flat('sup2.mod', { sup1 });  // 👀 delimited by dot
sup2.mod.fun2(); // == "hello world"
```

## Self referencing

Module functions can reference others functions in the same module either by name, or by the special alias `self`.

### `self`: Refer to the same module

```js
const modules = {
    mod: {
        fun1: ({ mod }) => () => mod.fun2(),
        fun2: ({ self }) => () => self.fun3(), // 👀 self is an alias of mod
        fun3: () => () => 'hello world'
    }
};

const { compose } = composer(modules);
const { mod } = compose('mod');
mod.fun1(); // == "hello world"
```

### `here`: Refer to the same level

In the case of deep modules, `here` is a reference to the current level in the object hierarchy.

```js
const modules = {
    mod: {
        fun1: ({ here }) => () => here.sub.fun2(), // 👀 here is an alias of mod
        sub: {
            fun2: ({ here }) => () => here.fun3(), // 👀 here is an alias of mod.sub
            fun3: () => () => 'hello world'
        }
    }
};

const { compose } = composer(modules);
const { mod } = compose.deep('mod');
mod.fun1(); // == "hello world"
```

## Overriding modules

Module Composer provides an `overrides` option to override any part of the dependency graph. This can be useful for stubbing in tests.

In the tests:

```js
const overrides = {
    someHttpClient: {
        post: () => {
            return { status: 201 };
        }
    }
};
```

In the composition:

```js
const { compose } = composer(modules, { overrides });
```

## Application configuration

Module Composer provides convenient utility functions for managing application configuration.

### `configure.merge` or just `configure`: Merge config objects

`configure.merge`, or simply `configure` takes objects, arrays of objects, and functions and merges them in the order specified using [Lodash merge](https://lodash.com/docs#merge). Functions are invoked with the preceeding merged value as an argument, and the result takes the function's place in the merge sequence.  

```js
import { configure } from 'module-composer';

const defaultConfig = { a: 1 };
const userConfig = { b: 2 };
const deriveConfig = config => ({ c: config.a + config.b });
const config = configure(defaultConfig, userConfig, deriveConfig);
// Result is { a: 1, b: 2, c: 3 }
```

### `configure.mergeWith`: Custom merge config objects

`configure.mergeWith` applies a customiser function as the first argument using [Lodash mergeWith](https://lodash.com/docs/#mergeWith). The following example demonstrates array concatenation.

```js
import { configure } from 'module-composer';

const customiser = (objValue, srcValue) => {
    if (Array.isArray(objValue)) return objValue.concat(srcValue);
};

const defaultConfig = { arr: [1] };
const userConfig = { arr: [2] };
const config = configure.mergeWith(customiser, defaultConfig, userConfig);
// config is { arr: [1, 2] }
```

### Configuration as an option

Module Composer can also take configuration as an option with the same behaviour as `configure.merge`. This not only returns the resulting configuration but also injects it automatically into each composed module.

```js
import composer from 'module-composer';

const defaultConfig = { a: 1 };
const userConfig = { b: 2 };
const deriveConfig = config => ({ c: config.a + config.b });
const { compose, config } = composer(modules, { config: [defaultConfig, userConfig, deriveConfig] });
// config is { a: 1, b: 2, c: 3 }
const { mod } = compose('mod', { dep }); // config injected automatically
```

For added convienience, `defaultConfig` is also an option that will take precedence over `config`.

```js
import composer from 'module-composer';

const defaultConfig = { a: 1 };
const config = { b: 2 };
const { compose, config } = composer(modules, { defaultConfig, config });
// config is { a: 1, b: 2 }
```

### Freezing config

To encourage immutability, configuration is frozen (deeply) to prevent modification. In effect, turning config into constants. This effect can be disabled with the `freezeConfig` option.

#### Frozen config

```js
const { compose, config } = composer(modules, { config: { a: 1 } });
config.a = 2; // has no effect
```

#### Unfrozen config

```js
const { compose, config } = composer(modules, { config: { a: 1 }, freezeConfig: false });
config.a = 2; // change is applied
```

### Config aliases

The `configAlias` option takes a string or array of string specifying alternative names for config. Config aliases are also injected into each module automatically. By default, config is automatically aliased to `constants`, since config should not change once injected. 

#### Default alias

```js
const { compose, config, constants } = composer(modules, { config: { a: 1 } });
// config and constants are the same object reference
```

#### Custom alias

```js
const { compose, config, settings } = composer(modules, { config: { a: 1 }, configAlias: 'settings' });
// config and settings are the same object reference
```


## Extensions

Module Composer features a number of built-in extensions.

Extensions are enabled by default.

To selectively enable extensions, import each extension from `module-composer/extensions/`, then import `module-composer/core`:

Taking the `mermaid` extension as an example: 

```js
import 'module-composer/extensions/mermaid.js';
import composer from 'module-composer/core';
```

### `mermaid`: Generate dependency diagrams

A picture paints a thousand words. There's no better aid for reasoning about software design than a good old-fashioned dependency diagram.

Module Composer supports Mermaid diagrams by generating *Mermaid* diagram-as-code syntax for a given composition.

> Mermaid is a tool for creating diagrams and visualizations using text and code.<br/> https://mermaid-js.github.io • https://github.com/mermaid-js/mermaid

Did you know that GitHub can render diagrams directly from Mermaid syntax?! See [Include diagrams in your Markdown files with Mermaid](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/) for more information.

Given the following composition:

```js
import composer from 'module-composer';
import modules from './modules/index.js';

export default () => {
    const { compose } = composer(modules);
    const { stores } = compose('stores');
    const { services } = compose('services', { stores });
    compose('components', { services });
    return compose.modules;
};
```

Use `compose.mermaid()` to generate the following Mermaid diagram-as-code:

```
graph TD;
    components-->services;
    services-->stores;
```

Which Mermaid renders as:

```mermaid
graph TD;
    components-->services;
    services-->stores;
```

Pretty cool, huh!

### `module-alias`: Reference *modules* with alternative names

The `moduleAlias` option takes a string or array of string specifying alternative names for a module.

In the following examples, `fb` is an alias of `foobar`.

As a `compose` option, applies to associated module:

```js
const { compose } = composer(modules};
const { foobar, fb } = compose('foobar', { dep1, dep2 }, { moduleAlias: 'fb' });
```

As a `composer` option, applies to named module:

```js
const { compose } = composer(modules, { moduleAlias: { foobar: 'fb' } }};
const { foobar, fb } = compose('foobar', { dep1, dep2 });
```

### `function-alias`: Reference *functions* with alternative names

The `functionAlias` option takes an array of entries specifying patterns and replacements for any matching function.

As a `compose` option, applies to associated module:

```js
const modules = {
    mod: {
        fun1: () => () => 'hello world',
        fun2: ({ mod }) => () => mod.fn1(), // 👀 fn1 is an alias of fun1
    } 
};

const { compose } = composer(modules};
const { mod } = compose('mod', { dep1, dep2 }, { functionAlias: [ [/fun/, 'fn'] ] });
mod.fn2(); // == "hello world" 👀 fn2 is an alias of fun2
```

As a `composer` option, applies to any module:

```js
const modules = {
    mod1: {
        fun1: () => () => 'hello world'        
    },
    mod2: {
        fun2: ({ mod1 }) => () => mod1.fn1(), // 👀 fn1 is an alias of fun1
    }
};

const { compose } = composer(modules, { functionAlias: [ [/fun/, 'fn'] ] }}; // 👀 composer option
const { mod1 } = compose('mod1');
const { mod2 } = compose('mod2', { mod1 });
mod2.fn2(); // == "hello world" 👀 fn2 is an alias of fun2
```

### `access-modifiers`: True public and private functions

The `privatePrefix` and `publicPrefix` options take a string specifying a prefix used to determine whether a function should be considered private or public. By default, these are set to `_` and `$` respectively. The prefixes are stripped from the final result.

Typically only one prefix is required, since any unprefixed functions will assume the opposite. If both prefixes are used, unprefixed default to private.

```js
const modules = {
    foo: {
        public:   ({ foo }) => () => { /* ✅ foo.private */ },
        _private: ({ foo }) => () => { /* ✅ foo.public  */ }
    },
    bar: {
        $public: ({ foo, bar }) => () => { /* ❌ foo.private, ✅ bar.private */ },
        private: ({ foo, bar }) => () => { /* ✅ foo.public,  ✅ bar.public  */ }
    }
};

const { compose } = composer(modules);
const { foo } = compose('foo');          // ✅ foo.public, ❌ foo.private
const { bar } = compose('bar', { foo }); // ✅ bar.public, ❌ bar.private
```

### `eject`: Opt out of Module Composer

Module Composer can be _ejected_ by generating the equivalent vanilla JavaScript code. Well, that's the vision anyway! The current implementation has some limitations. Please raise an issue if you'd like to see this developed further.

### `perf`: Meaure composition performance

Module Composer is fast. In fact, so fast that it needs to be measured with sub-millisecond precision. Performance is measured by default for easy analysis.

Use `compose.perf()` to see the total composition duration, and a break down of duration per module.


# Why Module Composer?

## Background

Why is it so common for JavaScript applications these days (backend _and_ frontend) to be organised and reasoned about in terms of scripts and files, and navigated via a convoluted maze of file imports?

Module Composer aims to encourage good modular design and intentionality for application architecture by making it easier to design and reason about applications at a higher level, in this case, as a composition of _modules_.

So what is a module? Not to be confused with JavaScript CJS or ESM modules, a module in this context is simply a plain old JavaScript object (a POJO!) containing _higher-order_ functions that accept module dependencies as arguments. These higher-order functions in turn, return first-order functions enabling invocation to be deferred to later in the application lifecycle. Module dependencies remain available to the first-order function owing to the power of _closures_ (stateful functions). Closures are a native feature of JavaScript.

This is analogous to calling a class constructor with dependencies and returning the resulting instance. However rather than using a class to encapsulate dependency state, closure functions are used instead.

If that sounds like a lot to wrap your head around, fear not! Implementation-wise it's actually rather simple. 

## How it works

Consider the following example:

```js
const modules = {
    components: {
        productDetails: ({ orderingService }) => ({ product }) => {
            // When Add to Cart button clicked...
            orderingService.addToCart({ product, quantity: 1 });
        }
    },
    orderingService: {
        addToCart: () => ({ product, quantity }) => {
            ...
        }
    }
};
```

The `components` module is a plain-old JavaScript object representing some kind of UI components. 

It contains one entry, `productDetails` which returns a higher-order function accepting the `orderingService` module as a dependency. This dependency would be satisfied early in the application lifecycle, ideally as close to the application entry point, i.e. _main_, as possible. 

The result is a first-order function which in this context could be thought of as the `productDetails` component factory function. It accepts a `product` argument and enables the capability of adding a product to a shopping cart via the `orderingService` module. The entry point is too early in the application lifecycle to be reasoning about products. Therefore it needs to be pushed deeper into the application so that invocation can be deferred until the appropriate moment.

The following example demonstrates invocation without Module Composer:

```js
// Program entry point
import modules from './modules/index.js'; // as above
const components = {}, orderingService = {};
orderingService.addToCart = modules.orderingService.addToCart(); // no dependencies
components.productDetails = modules.components.productDetails({ orderingService });

// Later in the application lifecycle
const product = ...
const productDetails = components.productDetails({ product });
```

As demonstrated, this handy pattern can be applied in vanilla JavaScript without the use of any tools.

So why Module Composer?

It doesn't take long before all the _wiring_ adds up. The wiring follows a consistent pattern an is ripe for automation. And in a nutshell, that's what Module Composer does. 

Module Composer simply iterates over an object, invokes each function it finds with the given module dependencies, and returns a _mirror_ of the object with the higher-order functions substituted with the first-order functions. Module Composer is very simple. Is _not_ an IoC container; it does _not_ feature dependency resolution. It is a simple tool that facilitates _Pure DI_. See more on [Dependency Injection](#dependency-injection) below.

Here's the equivalent using Module Composer:

```js
import composer from 'module-composer';
import modules from './modules/index.js';
const { compose } = composer(modules);
const { orderingService } = compose('orderingService');
const { components } = compose('components', { services });
```

Module Composer takes care of injecting dependencies into each individual function, cleaning up the code and shifting focus to the composition of modules.

p.s. In case you're wondering, Module Composer works with React. Say hello to dependency injection in React, and farewell and good riddance to prop-drilling, context, custom hooks, attemping to work around that lack of it.

See [Stazione Simulation](https://github.com/mattriley/stazione-simulation) for example usage of Module Composer with React.

## Composition root

> A Composition Root is a (preferably) unique location in an application where modules are composed together.<br/>— [Mark Seeman](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)

Module Composer is a tool that facilitates module composition, therefore its use should be limited and isolated to the Composition Root, as close to the application entry point as possible.

In the following example, the Composition Root has been extracted to a separate file, then consumed by the application entry point:

```js
import composer from 'module-composer';
import modules from './modules/index.js';

export default () => {
    const { compose } = composer(modules);
    const { orderingService } = compose('orderingService');
    compose('components', { orderingService });
    return compose.modules;
};
```

Example of an entry point for a SPA:

```js
import compose from './compose.js';
const { components } = compose(); // Invoke the Composition Root
const app = components.app(); // Create an instance of the app component
document.getElementById('app').append(app); // Append the app component to the DOM
```

Extracting the Composition Root can be especially useful for applications that have multiple entry points.

Recommended reading:

- [Composition Root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/) — Mark Seemann
- [Understanding the Composition Root](https://freecontent.manning.com/dependency-injection-in-net-2nd-edition-understanding-the-composition-root/) — Steven van Deursen & Mark Seemann

## File-per-function

Many applications revolve around a number of rather large, overwhelming files containing many functions. This can happen organically through the pressure of delivery and sometimes by design driven by the ideas of cohesion and ecapsulation, amongst others. While breaking these large files down into smaller ones would seem to be the logical solution, the thought of managing a great number of small files can also seem overwhelming.

Module Composer makes the idea of file-per-function easy when used in conjunction with *barrel rollups*. In JavaScript, a barrel rollup is typically implemented as an `index.js` file that exports every other file (and perhaps sub-directory) in the same directory - an approach most JavaScript developers would already be familiar with.

Example of file-per-function on the file system:

```
src
└── app.js
└── compose.js
└── modules
    └── index.js
    └── ordering-service
        └── index.js
        └── add-to-cart.js
    └── components
        └── index.js
        └── product-details.js
```

Example `src/modules/index.js` using ES Modules:

```js
import orderingService from './ordering-service/index.js';
import components from './components/index.js';

export default {
    orderingService,
    components
};
```

Example `src/modules/index.js` using Common JS:

```js
const orderingService = require('./ordering-service');
const components = require('./components');

module.exports = {
    orderingService,
    components
};
```

This approach offers a number of additional benefits including:

- Only ever needing to import a file once regardless of the number of usages.
- Reducing or eliminating the large blocks of import statements typically found at the top of any file.
- Eliminating any need for path traversal, i.e. `../../../`. Path traversal is a potential code smell due to the risk of inappropriate coupling. Instead, the relationships between each module are explicitly established during at application initialisation time.

This pattern opens the possibility of generating `index.js` files. This means that not only is each file only ever imported once, import/require statements needn't be manually written at all. The `module-indexgen` package is designed to do just that: https://github.com/mattriley/node-module-indexgen

It should be noted that Module Composer is not dependent on the file-per-function pattern. How you structure the file system is up to you.

## Dependency injection

Module Composer achieves the equivalent of _dependency injection_ using closures (stateful functions).

Well known advantages of dependency injection include:

- Enables Inversion of Control (IoC). Hollywood principle: Don't call us, we'll call you!
- Ability to swap implementations, e.g. repositories that integrate with different database engines.
- Ability to stub/mock/fake dependencies for testing purposes.

A DI Container is a framework to create dependencies and inject them automatically when required.

Please note, Module Composer is NOT a _DI Container_. A DI Container is a tool that creates dependencies and injects them automatically when required. Module Composer is a utility for making _Pure DI_ easy.

Dependency injection is a big (and sometimes controversial) topic and worth being familiar with.

Although Module Composer enables dependency injection, remember that the primary aim is to encourage good modular design and intentionality for application architecture.

Recommended reading:

- [Pure DI](https://blog.ploeh.dk/2014/06/10/pure-di/) — Mark Seemann
- [When to use a DI Container](https://blog.ploeh.dk/2012/11/06/WhentouseaDIContainer/) — Mark Seeman
- [Partial application is dependency injection](https://blog.ploeh.dk/2017/01/30/partial-application-is-dependency-injection/) — Mark Seemann
- [DIP in the Wild](https://martinfowler.com/articles/dipInTheWild.html) — Brett L. Schuchert on martinfowler.com
- [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html) — Martin Fowler
- [Dependency Injection Inversion](https://sites.google.com/site/unclebobconsultingllc/home/articles/dependency-injection-inversion) — Robert C. "Uncle Bob" Martin
- [The Dependency Inversion Principle](https://drive.google.com/file/d/0BwhCYaYDn8EgMjdlMWIzNGUtZTQ0NC00ZjQ5LTkwYzQtZjRhMDRlNTQ3ZGMz/view) — Robert C. "Uncle Bob" Martin

## Functional programming

Module Composer is designed with a bias toward _functional programming_.

The closure-based approach is only possible thanks to JavaScript support for functions as first-class objects. That's not to suggest JavaScript or Module Composer are necessarily functional, but preferencing functions over classes (for instance) may encourage a more functional design. It's entirely possible, and arguably desirable to design JavaScript applications without classes!

An important consideration in functional design is the segregation of pure and impure functions. When designing modules, be intentional about purity and impurity.

> One very important characteristic of impurity is that it’s inherently contagious. Any function that depends on the execution of an impure function becomes impure as well.<br/>—[Oleksii Holub](https://tyrrrz.me/blog/pure-impure-segregation-principle)

See [Fitness functions](#fitness-functions) below to learn how Module Composer can help maintain pure-impure segregation.

Recommended reading:

- [Pure-Impure Segregation Principle](https://tyrrrz.me/blog/pure-impure-segregation-principle) — Oleksii Holub

## Fitness functions

Module Composer can describe the dependency graph to enable _fitness functions_ on coupling.

> An architectural fitness function, as defined in Building Evolutionary Architectures, provides an objective integrity assessment of some architectural characteristics, which may encompass existing verification criteria, such as unit testing, metrics, monitors, and so on.<br/>— [Thoughtworks](https://www.thoughtworks.com/en-au/radar/techniques/architectural-fitness-function)

Inappropriate coupling leads to brittle designs that can be difficult to reason about, difficult to change and difficult to test.

Use `compose.dependencies` to obtain a dependency graph similar to:

```js
{
    components: ['services'],
    services: ['stores'],
    stores: []
}
```

The examples below leverage `compose.dependencies` to demonstrate fitness function in the form of unit tests.

### Example 1: N-tier architecture

Assuming an _n-tier_ architecture, where the `components` module resides in the _presentation_ layer, `services` in the _domain_ layer, and `stores` in the _persistence_ layer, it could be tempting to couple `components` to `stores`,  inadvertently bypassing the domain layer.

###### <p align="right"><em>Can't see the diagram?</em> <a id="link-1" href="https://github.com/mattriley/node-module-composer#user-content-link-1">View it on GitHub</a></p>
```mermaid
graph TD;
    components["components<br/>(presentation)"]-->|OK!|services;
    components-->|NOT OK!|stores;
    services["services<br/>(domain)"]-->|OK!|stores;
    stores["stores<br/>(persistence)"]
```

The following fitness function asserts that `components` is not coupled to `stores`. 

```js
test('components is not coupled to stores in order to maintain layering', () => {
    const { dependencies } = compose();
    t.notOk(dependencies['components'].includes('stores'));
});
```

### Example 2: Pure-impure segregation

`util` is a module of _pure_ utility functions, and `io` is module is _impure_ io operations. It could be tempting to extend `util` with say file utilities that depend on `io`, however doing so would make `util` impure.

###### <p align="right"><em>Can't see the diagram?</em> <a id="link-2" href="https://github.com/mattriley/node-module-composer#user-content-link-2">View it on GitHub</a></p>
```mermaid
graph TD;
    io["io<br/>(impure)"]-->|OK!|util
    util["util<br/>(pure)"]-->|NOT OK!|io
```

The following fitness function asserts that `util` is not coupled to `io`.

```js
test('util is not coupled to io in order to maintain purity', () => {
    const { dependencies } = compose();
    t.notOk(dependencies['util'].includes('io'));
});
```

The solution introducing file utilities whilst maintaining purity would be to introduce a new module, say `fileUtil`:

###### <p align="right"><em>Can't see the diagram?</em> <a id="link-3" href="https://github.com/mattriley/node-module-composer#user-content-link-3">View it on GitHub</a></p>
```mermaid
graph TD;
    io["io<br/>(impure)"]-->|OK!|util
    util["util<br/>(pure)"]-->|NOT OK!|io
    fileUtil["fileUtil<br/>(impure)"]-->|OK!|io
```

## Testability

Module Composer encourages reasoning about _modules_ instead of _files_ and this principle also extends to testing.

A common practice in unit testing, is to stub/mock/fake dependencies, especially those dependencies that are not deterministic, or cause _side-effects_, i.e. interact with databases or other external services. 

In JavaScript, this is commonly achieved using a tool that intercepts the file imports of the dependendenies of the file under test. Digest that for a moment. Why on Earth should our test need to know and be coupled to the physical storage location of a unit's dependencies? No wonder these tests are so brittle.

Here's how mocking is typically achieved with Jest:

TODO: Insert Jest mock example

Module Composer provides an `overrides` option to override any part of the dependency graph:

In the tests:

```js
const overrides = {
    someHttpClient: {
        post: () => {
            return { status: 201 };
        }
    }
};
```

In the composition:

```js
const { compose } = composer(modules, { overrides });
```

# Advanced example: Agile Avatars

> Great looking avatars for your agile board and experiment in FRAMEWORK-LESS, vanilla JavaScript.<br/>
https://agileavatars.com • https://github.com/mattriley/agile-avatars

#### Composition root

###### <p align="right"><a href="https://github.com/mattriley/agile-avatars/tree/master/src/compose.js">https://github.com/mattriley/agile-avatars/tree/master/src/compose.js</a></p>
```js
import composer from 'module-composer';
import modules from './modules/index.js';
import defaultConfig from './default-config.js';
const { storage, util } = modules;

export default ({ window, config, ...options }) => {

    const { compose } = composer({ window, ...modules }, { defaultConfig, config, ...options });

    // Data
    const { stores } = compose('stores', { storage });
    const { subscriptions } = compose('subscriptions', { stores, util });

    // Domain
    const { core } = compose.deep('core', { util });
    const { io } = compose('io', { window });
    const { services } = compose.deep('services', { subscriptions, stores, core, io, util });

    // Presentation
    const { ui } = compose('ui', { window });
    const { elements } = compose('elements', { ui, util });
    const { vendorComponents } = compose('vendorComponents', { ui, window });
    const { components } = compose.deep('components', { io, ui, elements, vendorComponents, services, subscriptions, util });
    const { styles } = compose('styles', { ui, subscriptions });

    // Startup    
    compose('diagnostics', { stores, util });
    return compose('startup', { ui, components, styles, services, subscriptions, stores, util, window });

};
```

#### Performance measurements generated with `perf` extension

MacBook Pro (14 inch, 2021). Apple M1 Max. 32 GB.

```js
{
    "modules": {
        "stores": {
            "path": "stores",
            "startTime": 66.18591701984406,
            "endTime": 66.67520797252655,
            "duration": 0.4892909526824951
        },
        "subscriptions": {
            "path": "subscriptions",
            "startTime": 66.78812503814697,
            "endTime": 66.86195802688599,
            "duration": 0.07383298873901367
        },
        "core": {
            "path": "core",
            "startTime": 67.56666707992554,
            "endTime": 67.78558301925659,
            "duration": 0.2189159393310547
        },
        "io": {
            "path": "io",
            "startTime": 67.83062505722046,
            "endTime": 67.94833302497864,
            "duration": 0.11770796775817871
        },
        "services": {
            "path": "services",
            "startTime": 68.26329207420349,
            "endTime": 68.65608298778534,
            "duration": 0.39279091358184814
        },
        "ui": {
            "path": "ui",
            "startTime": 68.72008299827576,
            "endTime": 68.77066707611084,
            "duration": 0.05058407783508301
        },
        "elements": {
            "path": "elements",
            "startTime": 68.82183301448822,
            "endTime": 68.95145797729492,
            "duration": 0.12962496280670166
        },
        "vendorComponents": {
            "path": "vendorComponents",
            "startTime": 68.98633301258087,
            "endTime": 69.01208305358887,
            "duration": 0.025750041007995605
        },
        "components": {
            "path": "components",
            "startTime": 69.56808304786682,
            "endTime": 70.14520800113678,
            "duration": 0.5771249532699585
        },
        "styles": {
            "path": "styles",
            "startTime": 70.27145802974701,
            "endTime": 70.35195803642273,
            "duration": 0.08050000667572021
        },
        "diagnostics": {
            "path": "diagnostics",
            "startTime": 70.39308297634125,
            "endTime": 70.4152079820633,
            "duration": 0.0221250057220459
        },
        "startup": {
            "path": "startup",
            "startTime": 70.57791697978973,
            "endTime": 70.63024997711182,
            "duration": 0.05233299732208252
        }
    },
    "totalDuration": 2.2305808067321777,
    "durationUnit": "ms"
}
```

#### Mermaid diagram generated with `mermaid` extension

###### <p align="right"><em>Can't see the diagram?</em> <a id="link-4" href="https://github.com/mattriley/node-module-composer#user-content-link-4">View it on GitHub</a></p>
```mermaid
graph TD;
    components-->io;
    components-->ui;
    components-->elements;
    components-->vendorComponents;
    components-->services;
    components-->subscriptions;
    components-->util;
    core-->util;
    diagnostics-->stores;
    diagnostics-->util;
    elements-->ui;
    elements-->util;
    io-->window;
    services-->subscriptions;
    services-->stores;
    services-->core;
    services-->io;
    services-->util;
    startup-->ui;
    startup-->components;
    startup-->styles;
    startup-->services;
    startup-->subscriptions;
    startup-->stores;
    startup-->util;
    startup-->window;
    stores-->storage;
    styles-->ui;
    styles-->subscriptions;
    subscriptions-->stores;
    subscriptions-->util;
    ui-->window;
    vendorComponents-->ui;
    vendorComponents-->window;
```

```
graph TD;
    components-->io;
    components-->ui;
    components-->elements;
    components-->vendorComponents;
    components-->services;
    components-->subscriptions;
    components-->util;
    core-->util;
    diagnostics-->stores;
    diagnostics-->util;
    elements-->ui;
    elements-->util;
    io-->window;
    services-->subscriptions;
    services-->stores;
    services-->core;
    services-->io;
    services-->util;
    startup-->ui;
    startup-->components;
    startup-->styles;
    startup-->services;
    startup-->subscriptions;
    startup-->stores;
    startup-->util;
    startup-->window;
    stores-->storage;
    styles-->ui;
    styles-->subscriptions;
    subscriptions-->stores;
    subscriptions-->util;
    ui-->window;
    vendorComponents-->ui;
    vendorComponents-->window;
```

#### Code generated with `eject` extension

```js
(modules, { window }) => {

    const stores = { ...modules.stores };
    const storesDependencies = { stores, storage };
    stores.setup = stores.setup({ ...storesDependencies });

    const subscriptions = { ...modules.subscriptions };
    const subscriptionsDependencies = { subscriptions, stores, util };
    subscriptions.setup = subscriptions.setup({ ...subscriptionsDependencies });

    const core = { ...modules.core };
    const coreDependencies = { core, util };
    core.gravatar.buildImageUrl = core.gravatar.buildImageUrl({ ...coreDependencies });
    core.gravatar.buildProfileUrl = core.gravatar.buildProfileUrl({ ...coreDependencies });
    core.gravatar.getNameFromProfile = core.gravatar.getNameFromProfile({ ...coreDependencies });
    core.gravatar.hashEmail = core.gravatar.hashEmail({ ...coreDependencies });
    core.roles.assignColor = core.roles.assignColor({ ...coreDependencies });
    core.roles.buildRole = core.roles.buildRole({ ...coreDependencies });
    core.roles.randomColor = core.roles.randomColor({ ...coreDependencies });
    core.tags.buildTag = core.tags.buildTag({ ...coreDependencies });
    core.tags.parseEmailExpression = core.tags.parseEmailExpression({ ...coreDependencies });
    core.tags.parseFileExpression = core.tags.parseFileExpression({ ...coreDependencies });
    core.tags.parseTagExpression = core.tags.parseTagExpression({ ...coreDependencies });
    core.tags.planTagInstanceAdjustment = core.tags.planTagInstanceAdjustment({ ...coreDependencies });
    core.tags.sortTagInstancesByTagThenMode = core.tags.sortTagInstancesByTagThenMode({ ...coreDependencies });
    core.tags.sortTagsByName = core.tags.sortTagsByName({ ...coreDependencies });
    core.tags.sortTagsByRoleThenName = core.tags.sortTagsByRoleThenName({ ...coreDependencies });

    const io = { ...modules.io };
    const ioDependencies = { io, window };
    io.setup = io.setup({ ...ioDependencies });

    const services = { ...modules.services };
    const servicesDependencies = { services, subscriptions, stores, core, io, util };
    services.gravatar.changeFallback = services.gravatar.changeFallback({ ...servicesDependencies });
    services.gravatar.changeFreetext = services.gravatar.changeFreetext({ ...servicesDependencies });
    services.gravatar.fetchImageAsync = services.gravatar.fetchImageAsync({ ...servicesDependencies });
    services.gravatar.fetchProfileAsync = services.gravatar.fetchProfileAsync({ ...servicesDependencies });
    services.gravatar.status = services.gravatar.status({ ...servicesDependencies });
    services.roles.changeRoleColor = services.roles.changeRoleColor({ ...servicesDependencies });
    services.roles.changeRoleName = services.roles.changeRoleName({ ...servicesDependencies });
    services.roles.findOrInsertRoleWithName = services.roles.findOrInsertRoleWithName({ ...servicesDependencies });
    services.roles.getNilRoleId = services.roles.getNilRoleId({ ...servicesDependencies });
    services.roles.getRole = services.roles.getRole({ ...servicesDependencies });
    services.roles.insertRole = services.roles.insertRole({ ...servicesDependencies });
    services.roles.isNilRole = services.roles.isNilRole({ ...servicesDependencies });
    services.roles.setupRolePropagation = services.roles.setupRolePropagation({ ...servicesDependencies });
    services.settings.changeModal = services.settings.changeModal({ ...servicesDependencies });
    services.settings.changeOption = services.settings.changeOption({ ...servicesDependencies });
    services.settings.clearModal = services.settings.clearModal({ ...servicesDependencies });
    services.settings.getGravatar = services.settings.getGravatar({ ...servicesDependencies });
    services.tags.adjustTagInstanceCounts = services.tags.adjustTagInstanceCounts({ ...servicesDependencies });
    services.tags.attachImageAsync = services.tags.attachImageAsync({ ...servicesDependencies });
    services.tags.buildTagInstance = services.tags.buildTagInstance({ ...servicesDependencies });
    services.tags.changeTagName = services.tags.changeTagName({ ...servicesDependencies });
    services.tags.changeTagRole = services.tags.changeTagRole({ ...servicesDependencies });
    services.tags.getTagInstance = services.tags.getTagInstance({ ...servicesDependencies });
    services.tags.insertFileAsync = services.tags.insertFileAsync({ ...servicesDependencies });
    services.tags.insertFileBatchAsync = services.tags.insertFileBatchAsync({ ...servicesDependencies });
    services.tags.insertGravatarAsync = services.tags.insertGravatarAsync({ ...servicesDependencies });
    services.tags.insertGravatarBatchAsync = services.tags.insertGravatarBatchAsync({ ...servicesDependencies });
    services.tags.insertTag = services.tags.insertTag({ ...servicesDependencies });
    services.tags.insertTagInstance = services.tags.insertTagInstance({ ...servicesDependencies });
    services.tags.removeTagInstance = services.tags.removeTagInstance({ ...servicesDependencies });
    services.tags.setupRolePropagation = services.tags.setupRolePropagation({ ...servicesDependencies });
    services.tags.setupTagPropagation = services.tags.setupTagPropagation({ ...servicesDependencies });
    services.tags.sortTagInstances = services.tags.sortTagInstances({ ...servicesDependencies });

    const ui = { ...modules.ui };
    const uiDependencies = { ui, window };
    ui.appendToHead = ui.appendToHead({ ...uiDependencies });
    ui.el = ui.el({ ...uiDependencies });
    ui.event = ui.event({ ...uiDependencies });
    ui.refocus = ui.refocus({ ...uiDependencies });
    ui.toggleBoolClass = ui.toggleBoolClass({ ...uiDependencies });

    const elements = { ...modules.elements };
    const elementsDependencies = { elements, ui, util };
    elements.dropzone = elements.dropzone({ ...elementsDependencies });
    elements.editableSpan = elements.editableSpan({ ...elementsDependencies });
    elements.label = elements.label({ ...elementsDependencies });
    elements.layout = elements.layout({ ...elementsDependencies });
    elements.modal = elements.modal({ ...elementsDependencies });
    elements.number = elements.number({ ...elementsDependencies });

    const vendorComponents = { ...modules.vendorComponents };
    const vendorComponentsDependencies = { vendorComponents, ui, window };
    vendorComponents.vanillaPicker = vendorComponents.vanillaPicker({ ...vendorComponentsDependencies });

    const components = { ...modules.components };
    const componentsDependencies = { components, io, ui, elements, vendorComponents, services, subscriptions, util };
    components.app = components.app({ ...componentsDependencies });
    components.dropzone = components.dropzone({ ...componentsDependencies });
    components.gravatar.actions.container = components.gravatar.actions.container({ ...componentsDependencies });
    components.gravatar.actions.error = components.gravatar.actions.error({ ...componentsDependencies });
    components.gravatar.actions.importButton = components.gravatar.actions.importButton({ ...componentsDependencies });
    components.gravatar.actions.loading = components.gravatar.actions.loading({ ...componentsDependencies });
    components.gravatar.content.container = components.gravatar.content.container({ ...componentsDependencies });
    components.gravatar.content.fallback = components.gravatar.content.fallback({ ...componentsDependencies });
    components.gravatar.content.fallbacks = components.gravatar.content.fallbacks({ ...componentsDependencies });
    components.gravatar.content.freetext = components.gravatar.content.freetext({ ...componentsDependencies });
    components.gravatar.title = components.gravatar.title({ ...componentsDependencies });
    components.header.container = components.header.container({ ...componentsDependencies });
    components.header.titleBar = components.header.titleBar({ ...componentsDependencies });
    components.imageUploadOptions.chooseImages = components.imageUploadOptions.chooseImages({ ...componentsDependencies });
    components.imageUploadOptions.container = components.imageUploadOptions.container({ ...componentsDependencies });
    components.imageUploadOptions.gravatar = components.imageUploadOptions.gravatar({ ...componentsDependencies });
    components.modal = components.modal({ ...componentsDependencies });
    components.modals.gravatar = components.modals.gravatar({ ...componentsDependencies });
    components.modals.tips = components.modals.tips({ ...componentsDependencies });
    components.modals.welcome = components.modals.welcome({ ...componentsDependencies });
    components.optionsBar.container = components.optionsBar.container({ ...componentsDependencies });
    components.optionsBar.numberOption = components.optionsBar.numberOption({ ...componentsDependencies });
    components.optionsBar.options.modes = components.optionsBar.options.modes({ ...componentsDependencies });
    components.optionsBar.options.outline = components.optionsBar.options.outline({ ...componentsDependencies });
    components.optionsBar.options.shapes = components.optionsBar.options.shapes({ ...componentsDependencies });
    components.optionsBar.options.size = components.optionsBar.options.size({ ...componentsDependencies });
    components.optionsBar.options.sort = components.optionsBar.options.sort({ ...componentsDependencies });
    components.optionsBar.options.spacing = components.optionsBar.options.spacing({ ...componentsDependencies });
    components.optionsBar.shapeOption = components.optionsBar.shapeOption({ ...componentsDependencies });
    components.roleList.container = components.roleList.container({ ...componentsDependencies });
    components.roleList.roleCustomiser.container = components.roleList.roleCustomiser.container({ ...componentsDependencies });
    components.roleList.roleCustomiser.masterRoleName = components.roleList.roleCustomiser.masterRoleName({ ...componentsDependencies });
    components.roleList.roleCustomiser.roleColorPicker = components.roleList.roleCustomiser.roleColorPicker({ ...componentsDependencies });
    components.tagList.container = components.tagList.container({ ...componentsDependencies });
    components.tagList.tag.components.roleName = components.tagList.tag.components.roleName({ ...componentsDependencies });
    components.tagList.tag.components.tagImage = components.tagList.tag.components.tagImage({ ...componentsDependencies });
    components.tagList.tag.components.tagName = components.tagList.tag.components.tagName({ ...componentsDependencies });
    components.tagList.tag.container = components.tagList.tag.container({ ...componentsDependencies });
    components.tips.badges = components.tips.badges({ ...componentsDependencies });
    components.tips.images = components.tips.images({ ...componentsDependencies });
    components.tips.laminating = components.tips.laminating({ ...componentsDependencies });
    components.tips.multiples = components.tips.multiples({ ...componentsDependencies });
    components.tips.naming = components.tips.naming({ ...componentsDependencies });
    components.tips.roleShortcut = components.tips.roleShortcut({ ...componentsDependencies });

    const styles = { ...modules.styles };
    const stylesDependencies = { styles, ui, subscriptions };
    styles.roleColor = styles.roleColor({ ...stylesDependencies });
    styles.tagImage = styles.tagImage({ ...stylesDependencies });
    styles.tagOutline = styles.tagOutline({ ...stylesDependencies });
    styles.tagShape = styles.tagShape({ ...stylesDependencies });
    styles.tagSize = styles.tagSize({ ...stylesDependencies });
    styles.tagSpacing = styles.tagSpacing({ ...stylesDependencies });
    styles.vanillaPicker = styles.vanillaPicker({ ...stylesDependencies });

    const diagnostics = { ...modules.diagnostics };
    const diagnosticsDependencies = { diagnostics, stores, util };
    diagnostics.dumpState = diagnostics.dumpState({ ...diagnosticsDependencies });

    const startup = { ...modules.startup };
    const startupDependencies = { startup, ui, components, styles, services, subscriptions, stores, util, window };
    startup.createHandlers = startup.createHandlers({ ...startupDependencies });
    startup.createStyleManager = startup.createStyleManager({ ...startupDependencies });
    startup.insertNilRole = startup.insertNilRole({ ...startupDependencies });
    startup.start = startup.start({ ...startupDependencies });

    return { ...modules, stores, subscriptions, core, io, services, ui, elements, vendorComponents, components, styles, diagnostics, startup };

};
```

## Design principles

- Vanilla and non-intrusive. Structures passed to Module Composer should have no knowledge of / no dependency on Module Composer.
