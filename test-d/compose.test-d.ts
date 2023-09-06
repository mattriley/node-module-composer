import { expectType } from 'tsd/dist/index';

import composer from '../main';

// accessing original target reference
{
    const target = { mod: {} };
    const { compose } = composer(target);
    expectType<typeof target>(compose.target);
}
