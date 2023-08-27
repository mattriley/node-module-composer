const configKeys = ['compositionName', 'appName', 'displayName', 'packageName'];

const globalRegister = session => {

    const { globalThis } = session.options;
    const { compositions = [] } = globalThis;

    const readPackageName = () => {
        try { return require(`${globalThis.process.cwd()}/package.json`).name; }
        catch { } // eslint-disable-line no-empty
    };

    const compositionName = [
        configKeys.flatMap(key => session.constants[key] ?? []),
        readPackageName() ?? [],
        'Unnamed Composition'
    ].flat()[0];

    compositions.push({ [compositionName]: session.external });
    Object.assign(globalThis, { compositions });

};

module.exports = { globalRegister };
