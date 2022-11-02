const composer = require('module-composer');
require('module-composer/extensions/eject');

module.exports = ({ test }) => {

    test('[WIP] eject', t => {
        const bar = {
            getBar: () => 'bar'
        };

        const target = {
            foobar: {
                getFoo: ({ foo }) => () => foo.getFoo(),
                getBar: ({ bar }) => () => bar.getBar(),
                getFoobar: ({ foobar }) => () => foobar.getFoo() + foobar.getBar()
            },
            foo: {
                getFoo: () => () => 'foo'
            },
            nested: {
                nested: {
                    getNested: () => () => 'nested'
                }
            },
            nestedTarget: {
                nestedFoo: {
                    getNestedFoo: () => () => 'nested-foo'
                }
            }
        };

        const { compose } = composer(target);
        const { foo } = compose('foo');
        compose('foobar', { foo, bar });
        compose('nestedTarget.nestedFoo');

        const expectedCode = `
(modules, { bar }) => {

    const foo = { ...modules.foo };
    const fooDependencies = { foo };
    foo.getFoo = foo.getFoo({ ...fooDependencies });

    const foobar = { ...modules.foobar };
    const foobarDependencies = { foobar, foo, bar };
    foobar.getFoo = foobar.getFoo({ ...foobarDependencies });
    foobar.getBar = foobar.getBar({ ...foobarDependencies });
    foobar.getFoobar = foobar.getFoobar({ ...foobarDependencies });

    const nestedFoo = { ...modules.nestedTarget.nestedFoo };
    const nestedFooDependencies = { nestedFoo };
    nestedFoo.getNestedFoo = nestedFoo.getNestedFoo({ ...nestedFooDependencies });

    return { ...modules, foo, foobar, nestedFoo };

};
`.trim();

        const code = compose.eject();
        // console.warn(code);
        const modules = eval(code)(target, { bar });
        t.equal(code, expectedCode);
        t.equal(modules.foobar.getFoobar(), 'foobar');
    });

};
