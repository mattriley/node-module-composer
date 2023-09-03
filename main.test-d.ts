import { expectType } from 'tsd';

import composer from './main';

type BarDeps = {
    foo: { doAThing: () => void }
}

const modules = { 
    foo: { doAThing: () => () => {} },
    bar: { doAThing: ({ foo }: BarDeps) => () => 1 }
}
const { compose } = composer(modules);

// compose with no dependencies
expectType<{ foo: { doAThing: () => void }}>(compose('foo', {}));

// compose with a dependency
const { foo } = compose('foo', {})
expectType<{ bar: { doAThing: () => number }}>(compose('bar', { foo }));

// compose as-is with no dependencies
expectType<{ foo: { doAThing: () => () => void } }>(compose.asis('foo'));
