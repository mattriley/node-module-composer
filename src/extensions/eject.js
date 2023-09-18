const _ = require('module-composer/src/core/util');

const eject = session => () => {
    const deps = session.dependencies;
    const composedModules = Object.values(session.log).map(log => log.key);

    const lines = session.log.flatMap(log => {
        const funKeys = Object.keys(_.flattenObject({ [log.key]: _.get(session.targetModules, log.path) }, { delimiter: '.' }));
        return [
            '',
            `const ${log.key} = { ...modules.${log.path} };`,
            `const ${log.key}Dependencies = { ${[log.key, ...log.depKeys].join(', ')} };`,
            ...funKeys.map(key => `${key} = ${key}({ ...${log.key}Dependencies });`)
        ];
    }).concat(
        '',
        `return { ${['...modules', ...composedModules].join(', ')} };`,
        ''
    );

    const uniqDeps = Array.from(new Set(Object.values(deps).flat()));
    const args = uniqDeps.filter(dep => !session.targetModules[dep]);

    return [
        `(modules, { ${args.join(', ')} }) => {`,
        `${lines.map(line => ' '.repeat(line ? 4 : 0) + line).join('\n')}`,
        '};'
    ].join('\n');
};

module.exports = { eject };
