const DefaultOptions = require('./default-options');
const _ = require('./util');
const Ajv = require('ajv');

const composeOptionsSchema = {
    type: 'object',
    properties: {
        customiser: { type: 'string' },
        depth: { type: 'number' },
        flat: { type: 'boolean' },
        overrides: { type: 'object' },
        functionAlias: { type: 'array' },
        moduleAlias: {
            anyOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } }
            ]
        },
        privatePrefix: { type: 'string' },
        publicPrefix: { type: 'string' }
    },
    required: [],
    additionalProperties: false
};

const composerOptionsSchema = {
    type: 'object',
    properties: {
        ...composeOptionsSchema.properties,
        moduleAlias: { type: 'object' },
        configAlias: { type: 'array' },
        freezeConfig: { type: 'boolean' },
        defaultConfig: { type: 'object' },
        config: {
            anyOf: [
                { type: 'object' },
                { type: 'array', items: { type: 'object' } }
            ]
        },
        extensions: { type: 'boolean' },
        compositionModule: { type: 'boolean' },
        globalThis: { type: 'object' }
    },
    required: [],
    additionalProperties: false
};

const ajv = new Ajv({ strictNumbers: false });
const validateComposeOptions = ajv.compile(composeOptionsSchema);
const validateComposerOptions = ajv.compile(composerOptionsSchema);

const throwError = errors => {
    const message = errors.map(error => `${error.instancePath} ${error.message}`).join('\n');
    throw new Error(message);
};

module.exports = opts => {

    const valid = validateComposerOptions(opts);
    if (!valid) throwError(validateComposerOptions.errors);

    const defaults = DefaultOptions();
    const globalOptions = { ...defaults.core, ...defaults.extensions, ...opts };

    const getModuleOptions = (path, opts) => {
        const valid = validateComposeOptions(opts);
        if (!valid) throwError(validateComposeOptions.errors);

        return {
            ...globalOptions, ...opts,
            moduleAlias: opts.moduleAlias ?? globalOptions.moduleAlias[path],
            overrides: opts.overrides ? _.set(_.cloneDeep(globalOptions.overrides), path, opts.overrides) : globalOptions.overrides
        };
    };

    return { globalOptions, getModuleOptions };

};
