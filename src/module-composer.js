const composers = require('./composers');
const initialiseProps = require('./initialise-props');

module.exports = (target, userOptions = {}) => {

    let ended = false;
    const { props, options, config } = initialiseProps(target, userOptions);
    const end = () => { ended = true; return props; };
    const baseCompose = composers.base(props);
    const timeCompose = composers.time(props, baseCompose);
    const composeFunc = options.stats ? timeCompose : baseCompose;

    const compose = (key, deps = {}) => {
        if (ended) throw new Error('Composition has ended');
        return composeFunc(key, deps);
    };

    Object.assign(compose, props, { end });
    return { compose, config };

};
