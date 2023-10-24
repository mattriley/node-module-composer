import { expectType, expectError } from 'tsd/dist/index';

import composer from '../main';

// deep module
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
    const { mod1 } = compose.deep('mod1');
    const { mod2 } = compose.deep('mod2', { mod1 });

    expectType<() => string>(mod1.sub.fun);
    expectType<() => string>(mod2.sub.fun);
}

// self at depth
{
    const target = {
        mod: {
            sub: {
                fun1: ({ self }: { self: { sub: { fun2: () => string } } }) => () => self.sub.fun2(),
                fun2: () => () => 'foobar'
            }
        }
    };
    const { compose } = composer(target);
    const { mod } = compose.deep('mod');

    expectType<() => string>(mod.sub.fun1);
    expectType<() => string>(mod.sub.fun2);
}

// must specify all dependencies when composing a deep module
{
    const target = {
        mod2: {
            sub: {
                fun: ({ mod1, mod3 }: { mod1: { fun: () => string }, mod3: { fun: () => string } }) => () => mod1.fun() + mod3.fun()
            }
        }
    };

    const { compose } = composer(target);
    const mod1 = { fun:  () => 'foobar' };
    const mod3 = { fun:  () => 'foobar' };
    expectError(compose.deep('mod2', { }));
    expectError(compose.deep('mod2', { mod3 }));
    const { mod2 } = compose.deep('mod2', { mod1, mod3 });
    expectType<() => string>(mod2.sub.fun);
}

// composing a deep module with no dependencies
{
    const target = {
        mod2: {
            sub: { fun: () => () => 'hello' }
        }
    };

    const { compose } = composer(target);
    const { mod2 } = compose.deep('mod2');
    expectType<() => string>(mod2.sub.fun);
}
