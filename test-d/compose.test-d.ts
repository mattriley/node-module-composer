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
    expectError(compose('mod', {}));
}
