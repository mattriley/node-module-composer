module.exports = dependencies => {

    const lines = Object.entries(dependencies)
        .flatMap(([key, deps]) => deps.map(dep => [key, dep]))
        .map(([key, dep]) => `    ${key}-->${dep};`);

    return ['graph TD;', ...lines].join('\n');

};
