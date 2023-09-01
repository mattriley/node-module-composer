const flatten = require('flat');
const util = require('module-composer/src/core/util');

const eject = session => () => {
    const target = session.targetModules;
    const deps = session.composedDependencies;

    const targetKeys = Object.keys(deps);

    const lines = Object.entries(deps).flatMap(([targetKey, deps]) => {
        const moduleName = targetKey.split('.').pop();
        const keys = Object.keys(flatten({ [moduleName]: util.get(target, targetKey) }));
        return [
            '',
            `const ${moduleName} = { ...modules.${targetKey} };`,
            `const ${moduleName}Dependencies = { ${[moduleName, ...deps].join(', ')} };`,
            ...keys.map(key => `${key} = ${key}({ ...${moduleName}Dependencies });`)
        ];
    }).concat(
        '',
        `return { ${['...modules', ...targetKeys.map(key => key.split('.').pop())].join(', ')} };`,
        ''
    );

    const uniqDeps = Array.from(new Set(Object.values(deps).flat()));
    const args = uniqDeps.filter(dep => !target[dep]);

    return [
        `(modules, { ${args.join(', ')} }) => {`,
        `${lines.map(line => ' '.repeat(line ? 4 : 0) + line).join('\n')}`,
        '};'
    ].join('\n');
};

module.exports = { eject };
