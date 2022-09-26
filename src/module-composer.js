const composers = require('./composers');
const initialiseProps = require('./initialise-props');
const util = require('./util');

module.exports = (target, userOptions = {}) => {

    if (!util.isPlainObject(target)) throw new Error('target must be a plain object');

    let ended = false;
    const { props, options, config } = initialiseProps(target, userOptions);

    const baseCompose = composers.base(props);
    const timeCompose = composers.time(props, baseCompose);
    const composeFunc = options.stats ? timeCompose : baseCompose;

    const end = () => {
        if (ended) throw new Error('Composition has already ended');
        ended = true;
        return props;
    };

    const compose = (key, deps = {}, args = {}, opts = {}) => {
        if (ended) throw new Error('Composition has ended');
        return composeFunc(key, deps, args, opts);
    };

    compose.deep = (key, deps = {}, args = {}, opts = {}) => {
        const optsMod = util.merge({ depth: Infinity }, opts);
        return compose(key, deps, args, optsMod);
    };

    if (!globalThis.compositions) globalThis.compositions = [];
    globalThis.compositions.push(props);

    Object.assign(compose, props, { end });
    return { compose, config };

};
