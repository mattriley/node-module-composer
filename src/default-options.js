module.exports = {
    defaults: undefined,
    overrides: undefined,
    customiser: m => m.setup ? m.setup() : m
};
