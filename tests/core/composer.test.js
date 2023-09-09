module.exports = ({ test, assert }) => composer => {

    test('access to composer function(s)', () => {
        assert.equal(composer.composer, composer);
    });


    test('invalid options', () => {
        const target = { mod: {} };
        assert.throws(() => composer(target, { foo: 'bar', bar: 'foo' }), 'Error: Invalid option(s): foo, bar');
    });

};
