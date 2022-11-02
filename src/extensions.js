const state = { extensions: {}, session: [], compose: [] };

const register = extensions => {
    Object.assign(state.extensions, extensions);

    Object.entries(extensions)
        .map(([name, ext]) => {
            return { ...ext, name };
        })
        .forEach(ext => {
            if (ext.session) state.session.push(ext);
            if (ext.compose) state.compose.push(ext);
        });

    return extensions;
};

module.exports = { state, register };
