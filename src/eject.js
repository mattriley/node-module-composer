const util = require('./util');
const flatten = require('flat');

module.exports = (target, dependencies) => {

    const targetKeys = Object.keys(dependencies);

    const lines = Object.entries(dependencies).flatMap(([targetKey, deps]) => {
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

    const uniqDeps = Array.from(new Set(Object.values(dependencies).flat()));
    const args = uniqDeps.filter(dep => !target[dep]);

    return [
        `(modules, { ${args.join(', ')} }) => {`,
        `${lines.map(line => ' '.repeat(line ? 4 : 0) + line).join('\n')}`,
        '};'
    ].join('\n');

};
