import { expectError, expectType } from 'tsd/dist/index';

import composer from '../main';

// accessing original target reference
{
    const target = { mod: {} };
    const { compose } = composer(target);
    expectType<typeof target>(compose.target);
}

// target keys that are not plain objects are omitted from dependencies list
{
    const target = { mod: '' };
    const { compose } = composer(target);
    expectError(compose('mod'));
}

// result of module's setup function is returned from compose
{
    const target = {
        mod: {
            setup: () => () => ({
                green: () => { }
            })
        }
    };
    const { compose } = composer(target);
    const { mod } = compose('mod');
    expectType<{ green: () => void }>(mod);
}

// result of module's setup function is returned from compose with dependencies
{
    const target = {
        mod: {
            setup: ({ config }: { config: object}) => () => ({
                green: () => config
            })
        }
    };
    const { compose } = composer(target, { config: { shade: 'dark'}});
    const { mod } = compose('mod');
    expectType<{ green: () => object }>(mod);
}

// compose does not go deep
{
    const target = {
        mod1: {
            sub: {
                fun: () => () => 'foobar'
            }
        },
        mod2: {
            sub: {
                fun: ({ mod2 }: { mod2: { sub: { fun: () => string } } }) => () => mod2.sub.fun()
            }
        }
    };

    const { compose } = composer(target);
    const { mod1 } = compose('mod1');
    const { mod2 } = compose('mod2', { mod1 });

    expectType<() => () => string>(mod1.sub.fun);
    expectType<({ mod2 }: { mod2: { sub: { fun: () => string } } }) => () => string>(mod2.sub.fun);
}

// must specify all dependencies when composing a module
{
    const target = {
        mod2: {
            fun: ({ mod1, mod3 }: { mod1: { fun: () => string }, mod3: { fun: () => string } }) => () => mod1.fun() + mod3.fun()
        }
    };

    const { compose } = composer(target);
    const mod1 = { fun:  () => 'foobar' };
    const mod3 = { fun:  () => 'foobar' };
    expectError(compose('mod2', { }));
    expectError(compose('mod2', { mod3 }));
    const { mod2 } = compose('mod2', { mod1, mod3 });
    expectType<() => string>(mod2.fun);
}

// composing a module with no dependencies
{
    const target = {
        mod2: {
            fun: () => () => 'hello'
        }
    };

    const { compose } = composer(target);
    const { mod2 } = compose('mod2');
    expectType<() => string>(mod2.fun);
}

// manually provide a config dependency
{
    type Config = { name: string, surname: string }
    const target = {
        mod1: {
            fun: ({ config }: { config: Config }) => () => `hello ${config.name}`
        },
        mod2: {
            fun: ({ mod1, config }: { mod1: { fun: () => string }, config: Config }) => () => `${mod1.fun()} ${config.surname}`
        }
    };

    const config: Config = { name: 'harry', surname: 'potter' };
    const { compose } = composer(target);
    expectError(compose('mod1'));
    expectError(compose('mod2', { mod1 }));
    const { mod1 } = compose('mod1', { config });
    const { mod2 } = compose('mod2', { mod1, config });
    expectType<() => string>(mod2.fun);
}

// config does not need to be specified as a dependency if passed into the composer
{
    type Config = { name: string, surname: string }
    const target = {
        mod1: {
            fun: ({ config }: { config: Config }) => () => `hello ${config.name}`
        },
        mod2: {
            fun: ({ mod1, config }: { mod1: { fun: () => string }, config: Config }) => () => `${mod1.fun()} ${config.surname}`
        }
    };

    const config: Config = { name: 'harry', surname: 'potter' };
    const { compose } = composer(target, { config });
    const { mod1 } = compose('mod1');
    const { mod2 } = compose('mod2', { mod1 });
    expectType<() => string>(mod2.fun);
}

// config can be specified as a list of object to merge
{
    type Config = { name: string, surname: string }
    const target = {
        mod1: {
            fun: ({ config }: { config: Config }) => () => `hello ${config.name}`
        },
        mod2: {
            fun: ({ mod1, config }: { mod1: { fun: () => string }, config: Config }) => () => `${mod1.fun()} ${config.surname}`
        }
    };

    const config: Config = { name: 'harry', surname: 'potter' };
    const { compose } = composer(target, { config: [{}, config] });
    const { mod1 } = compose('mod1');
    const { mod2 } = compose('mod2', { mod1 });
    expectType<() => string>(mod2.fun);
}
