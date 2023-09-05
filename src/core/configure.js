const _ = require('./util');

module.exports = (callback = c => c, ...initialConfigs) => {

    const mergeWith = (customiser, ...configs) => {
        const reducer = (acc, c) => _.mergeWith(acc, _.invokeOrReturn(c, acc), customiser);
        const config = [...initialConfigs, ...configs].flat().reduce(reducer, {});
        return callback(config);
    };

    const merge = (...configs) => mergeWith(undefined, ...configs);
    return Object.assign(merge, { merge, mergeWith });

};
