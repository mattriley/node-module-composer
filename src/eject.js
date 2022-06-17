const flatten = require('flat');

module.exports = ({ target, dependencies }) => {

    const targetKeys = Object.keys(dependencies);

    const lines = Object.entries(dependencies).reverse().flatMap(([moduleName, deps]) => {
        const keys = Object.keys(flatten({ [moduleName]: target[moduleName] }));
        return [
            '',
            `const ${moduleName} = { ...modules.${moduleName} };`,
            ...keys.map(key => `${key} = modules.${key}({ ${[moduleName, ...deps].join(', ')} });`)
        ];
    }).concat(
        '',
        `return { ${['...modules', ...targetKeys].join(', ')} };`,
        ''
    );

    const uniqDeps = Array.from(new Set(Object.values(dependencies).flat()));
    const args = uniqDeps.filter(dep => !target[dep]);

    return [
        `(modules, { ${args.join(', ')} }) => {`,
        `${lines.map(line => `    ${line}`).join('\n')}`,
        '};'
    ].join('\n');

};
