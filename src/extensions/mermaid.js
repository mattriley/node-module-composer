const mermaid = session => opts => {
    const { omit = [] } = opts ?? {};

    const lines = Object.entries(session.dependencies)
        .flatMap(ent => ent[1].map(dep => [ent[0], dep]))
        .filter(ent => !ent.some(key => omit.includes(key)))
        .map(ent => `    ${ent.join('-->')};`);

    return ['graph TD;', ...lines].join('\n');
};

module.exports = { mermaid };
