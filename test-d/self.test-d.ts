import { expectType } from 'tsd/dist/index';

import composer, { ComposedModule } from '../main';

// self dependencies are not required as deps (self reference by name)
{
    const target = {
        mod: {
            fun1: () => () => 1,
            fun2: ({ mod }: { mod: { fun1: () => number } }) => () => mod.fun1()
        }
    };
    const { compose } = composer(target);
    const { mod } = compose('mod');
    expectType<() => number>(mod.fun2);
}

// self dependencies are not required as deps (literal self)
{
    const target = {
        mod: {
            fun1: () => () => 1,
            fun2: ({ self }: { self: { fun1: () => number } }) => () => self.fun1()
        }
    };
    const { compose } = composer(target);
    const { mod } = compose('mod');
    expectType<() => number>(mod.fun2);
}

// self dependencies are not required as deps (literal self in deep module)
{
    const target = {
        mod: {
            fun1: () => () => 1,
            sub: {
                fun2: ({ self }: { self: { fun1: () => number } }) => () => self.fun1()
            }
        }
    };
    const { compose } = composer(target);
    const { mod } = compose.deep('mod');
    expectType<() => number>(mod.sub.fun2);
}

// A self dependency can be typed for use in setup
{
    const createModule = () => {
        const mod = {
            foo: () => () => 'hello'
        };

        type Self = ComposedModule<typeof mod>

        return {
            ...mod,
            setup: ({ self }: { self: Self }) => () => {
                return {
                    process: () => self.foo()
                };
            }
        };
    };

    const target = { mod: createModule() };
    const { compose } = composer(target);
    const { mod } = compose('mod');
    expectType<string>(mod.process());
}
