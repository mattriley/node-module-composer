import { expectType } from 'tsd/dist/index';

import composer from './main';

type BarDeps = {
    foo: { doAThing: () => void }
}

const modules = { 
    foo: { doAThing: () => () => {} },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bar: { doAThing: ({ foo }: BarDeps) => () => 1 }
};

const { compose } = composer(modules);

// compose with no dependencies
expectType<{ foo: { doAThing: () => void }}>(compose('foo', {}));

// compose with a dependency
const { foo } = compose('foo', {});
expectType<{ bar: { doAThing: () => number }}>(compose('bar', { foo }));

// compose as-is with no dependencies
expectType<{ foo: { doAThing: () => () => void } }>(compose.asis('foo'));
