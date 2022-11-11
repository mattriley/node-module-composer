const configKeys = ['compositionName', 'appName', 'displayName', 'packageName'];

const readPackageName = path => {
    try {
        return require(`${path}/package.json`).name;
    } catch (ex) {
        return undefined;
    }
};

const globalRegister = session => {

    const { globalThis } = session;
    const { compositions = [] } = globalThis;
    const isNode = globalThis.process?.release?.name === 'node';

    const compositionName = [
        configKeys.map(key => session.config[key]).find(val => !!val),
        isNode ? readPackageName(globalThis.process.cwd()) : undefined
    ].find(name => !!name);

    compositions.push([compositionName, session.external]);
    Object.assign(globalThis, { compositions });

};

module.exports = { globalRegister };
