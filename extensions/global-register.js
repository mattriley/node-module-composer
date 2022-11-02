const extensions = require('module-composer/src/extensions');
const isNode = globalThis.process?.release?.name === 'node';
const configKeys = ['compositionName', 'appName', 'displayName', 'packageName'];

const readPackageName = () => {
    try {
        return require(globalThis.process.cwd() + '/package.json').name;
    } catch (ex) {
        return undefined;
    }
};

const globalRegister = session => ({ name } = {}) => {

    const compositionName = [
        name,
        configKeys.map(key => session.config[key]).find(val => !!val),
        isNode ? readPackageName() : undefined
    ].find(name => !!name);

    if (!globalThis.compositions) globalThis.compositions = [];
    globalThis.compositions.push([compositionName, session.external]);

};

const session = { globalRegister };
module.exports = extensions.register({ session });
