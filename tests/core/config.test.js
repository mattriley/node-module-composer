// const composer = require('module-composer');
const composer = require('../../src/core/composer');

module.exports = ({ test }) => {

    test('single config object', t => {
        const config = { a: 1 };
        const { configure } = composer({});
        const { compose, constants } = configure(config);
        t.equal(constants, config);
        t.isNot(constants, config);
        t.equal(constants, compose.constants);
    });

    test('multiple config objects are merged', t => {
        const config = [
            { a: { b: 'B', c: 'c' } },
            { a: { c: 'C', d: 'D' } }
        ];
        const { configure } = composer({});
        const { compose, constants } = configure(config);
        const expected = { a: { b: 'B', c: 'C', d: 'D' } };
        t.equal(constants, expected);
        t.is(constants, compose.constants);
    });

    test('a module named constants overrides constants as a module', t => {
        const config = { a: 1 };
        const target = { config: { a: 2 } };
        const { configure } = composer(target);
        const { compose } = configure(config);
        t.equal(compose.modules.constants, target.constants);
    });

};



// // const composer = require('module-composer');
// const composer = require('../../src/core/composer');

// module.exports = ({ test }) => {

//     test('single config object', t => {
//         const options = { config: { a: 1 } };
//         const { compose, config } = composer({}, options);
//         t.equal(config, options.config);
//         t.isNot(config, options.config);
//         t.is(config, compose.config);
//     });

//     test('single config object 2', t => {
//         const options = { config: { a: 1 } };
//         const { configure } = composer({});
//         const { compose, config } = configure(options.config);
//         t.equal(config, options.config);
//         t.isNot(config, options.config);
//         t.is(config, compose.config);
//     });

//     test('multiple config objects are merged', t => {
//         const options = {
//             config: [
//                 { a: { b: 'B', c: 'c' } },
//                 { a: { c: 'C', d: 'D' } }
//             ]
//         };
//         const { compose, config } = composer({}, options);
//         const expected = { a: { b: 'B', c: 'C', d: 'D' } };
//         t.equal(config, expected);
//         t.is(config, compose.config);
//     });

//     test('multiple config objects including default config are merged', t => {
//         const options = {
//             defaultConfig: { a: { b: 'B', c: 'c' } },
//             config: { a: { c: 'C', d: 'D' } }
//         };
//         const { compose, config } = composer({}, options);
//         const expected = { a: { b: 'B', c: 'C', d: 'D' } };
//         t.equal(config, expected);
//         t.is(config, compose.config);
//     });

//     test('config is included as a module but omitted from dependency list', t => {
//         const options = { config: { a: 1 } };
//         const { compose, config } = composer({}, options);
//         t.is(compose.modules.config, config);
//         t.equal(compose.dependencies, {});
//     });

//     test('config is not included as a module if not provided', t => {
//         const { compose } = composer({});
//         t.equal(compose.modules.config, undefined);
//     });

//     test('config is not included as a module if empty', t => {
//         const options = { config: {} };
//         const { compose } = composer({}, options);
//         t.equal(compose.modules.config, undefined);
//     });

//     test('a module named config overrides config as a module', t => {
//         const options = { config: { a: 1 } };
//         const target = { config: { a: 2 } };
//         const { compose } = composer(target, options);
//         t.equal(compose.modules.config, target.config);
//     });

// };
