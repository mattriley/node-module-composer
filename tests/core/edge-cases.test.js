const nonPlainObjects = {
    num: 1,
    str: 'str',
    bool: true,
    arr: [],
    arrOfObj: [{ foo: 'bar' }],
    null: null,
    undef: undefined
};

module.exports = ({ test, assert }) => composer => {

    test('non-plain-objects are returned as-is', () => {
        const target = {
            mod1: {
                sub: nonPlainObjects,
                ...nonPlainObjects
            },
            ...nonPlainObjects
        };
        const { compose } = composer(target);
        const { mod1 } = compose.deep('mod1', {});
        assert.deepEqual(mod1.sub, nonPlainObjects);
    });

};
