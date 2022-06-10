module.exports = ({ target, dependencies, util }) => {

    const lines = Object.entries(dependencies).flatMap(([key, deps]) => {
        const members = Object.keys(util.get(target, key));
        const lines = members.map(member => {
            return `${key}.${member} = target.${key}.${member}({ ${key}, ${deps.join(', ')} });`;
        });
        return [`const ${key} = { ...target.${key} };`, ...lines];
    });

    return lines.join('\n');
};
