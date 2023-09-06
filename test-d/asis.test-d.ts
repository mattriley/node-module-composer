import { expectType } from 'tsd/dist/index';

import composer from '../main';

// compose as-is with no dependencies
{
    const target = {
        mod: {
            fun: () => 1
        }
    };
    const { compose } = composer(target);
    const { mod } = compose.asis('mod');
    expectType<() => number>(mod.fun);
}
