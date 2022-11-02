const composer = require('module-composer');

module.exports = ({ test }) => {

    test('no stats when stats option is false', t => {
        const target = { mod: {} };
        const { compose } = composer(target, { stats: false });
        compose('mod');
        const composition = compose.end();
        t.notOk('stats' in composition);
    });

};
