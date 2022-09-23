const composer = require('../');

module.exports = ({ test }) => {

    test('default customiser is invoked', t => {
        const target = {
            foo: {
                setup: () => () => ({ bar: {} })
            }
        };
        const { compose } = composer(target);
        compose('foo', {});
        t.equal(compose.modules, { foo: { bar: {} } });
        t.equal(compose.dependencies, { foo: [] });
    });

    test('default customiser is invoked async', async t => {
        const target = {
            foo: {
                setup: () => async () => ({})
            }
        };
        const { compose } = composer(target);
        const modules = await compose('foo', {});
        t.equal(compose.modules, modules);
        t.equal(compose.modules, { foo: {} });
        t.equal(compose.dependencies, { foo: [] });
    });

    test('default customiser returns non-plain object', t => {
        const target = {
            foo: {
                setup: () => () => {
                    return [[1], [2]];
                }
            }
        };
        const { compose } = composer(target);
        t.throws(() => compose('foo', {}), 'key customiser must return plain object');
    });

};
