import { expectType } from 'tsd/dist/index';

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
