const composer = require('../');

module.exports = ({ test }) => {

    test('no stats when stats option is false', t => {
        const target = { foo: {} };
        const { compose } = composer(target, { stats: false });
        compose('foo');
        const composition = compose.end();
        t.notOk('stats' in composition);
    });

};
