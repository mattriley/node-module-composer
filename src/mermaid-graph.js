module.exports = dependencies => {

    const lines = Object.entries(dependencies).map(([key, dep]) => `    ${key}-->${dep};`);
    return ['graph TD;', ...lines].join('\n');

};
