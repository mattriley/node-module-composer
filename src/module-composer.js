const composers = require('./composers');
const initialiseProps = require('./initialise-props');

module.exports = (target, userOptions = {}) => {

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

    const compose = (key, deps = {}, opts = {}) => {
        if (ended) throw new Error('Composition has ended');
        return composeFunc(key, deps, opts);
    };

    if (!globalThis.compositions) globalThis.compositions = [];
    globalThis.compositions.push(props);

    Object.assign(compose, props, { end });
    return { compose, config };

};
