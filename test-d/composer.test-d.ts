import composer from '../main';

// allow non-module properties
{
    const target = { 
        mod: {},
        a: '',
        b: 1,
        c: []
    };

    composer(target);
}
