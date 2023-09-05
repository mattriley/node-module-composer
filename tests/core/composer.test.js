module.exports = ({ test, assert }) => composer => {

    test('access to composer function(s)', () => {
        assert.equal(composer.composer, composer);
    });

};
