const test = require('tape');
const compose = require('..');

test('module without __modulename is returned without changes', t => {
    const module = {
        key: 'val',
        fun: () => {}
    };

    Object.freeze(module); // So that error is raised on attempt to change.
    const initialisedModule = compose(module);
    t.strictEqual(initialisedModule, module);
    t.end();
});

test('__modulename is removed', t => {
    const module = {
        __modulename: 'someModule'
    };

    const initialisedModule = compose(module);
    t.notOk(initialisedModule.__modulename);
    t.end();
});

test('argument is optional', t => {
    const module = {
        __modulename: 'someModule',
        doSomething: () => () => {}
    };

    const initialisedModule = compose(module); // No argument passed.
    t.ok(initialisedModule.doSomething);
    t.end();
});

test('existing properties remain unchanged', t => {
    const module = {
        __modulename: 'someModule',
        doSomething: ({ foo }) => () => {
            t.equal(foo, 'bar');
            t.end();
        }
    };

    const argument = { foo: 'bar' };
    const initialisedModule = compose(module, argument);
    initialisedModule.doSomething();
});

test('peer function can be invoked', t => {
    const module = {
        __modulename: 'someModule',
        doSomething: ({ someModule }) => () => {
            someModule.doSomethingElse();
        },
        doSomethingElse: () => () => {
            t.end();
        }
    };

    const initialisedModule = compose(module);
    initialisedModule.doSomething();
});

test('function within submodule can be invoked', t => {
    const module = {
        __modulename: 'module',
        submodule: {
            __modulename: 'submodule',
            doSomethingElse: argument => () => {
                t.ok(argument.module);
                t.ok(argument.submodule);
                t.end();
            }
        },
        doSomething: ({ module }) => () => {
            module.submodule.doSomethingElse();
        }
    };

    const initialisedModule = compose(module);
    initialisedModule.doSomething();
});
