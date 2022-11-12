const configKeys = ['compositionName', 'appName', 'displayName', 'packageName'];

const globalRegister = session => {

    const { globalThis } = session;
    const { compositions = [] } = globalThis;

    const readPackageName = () => {
        try { return require(`${globalThis.process.cwd()}/package.json`).name; }
        catch { } // eslint-disable-line no-empty
    };

    const inferredCompositionNames = [
        configKeys.flatMap(key => session.config[key] ?? []),
        readPackageName() ?? []
    ].flat();

    compositions.push([inferredCompositionNames[0], session.external]);
    Object.assign(globalThis, { compositions });

};

module.exports = { globalRegister };
