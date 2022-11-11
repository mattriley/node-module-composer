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

    const inferredCompositionNames = [
        configKeys.flatMap(key => session.config[key] ?? []),
        isNode ? readPackageName(globalThis.process.cwd()) : []
    ].flat();

    compositions.push([inferredCompositionNames[0], session.external]);
    Object.assign(globalThis, { compositions });

};

module.exports = { globalRegister };
