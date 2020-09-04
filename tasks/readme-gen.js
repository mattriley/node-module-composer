/* eslint-disable no-sync */
const ejs = require('ejs');
const fs = require('fs');
const fetch = require('node-fetch');

const nodeVersion = fs.readFileSync('.nvmrc', 'utf-8').trim();

const renderJsFile = async (url, opts = {}) => {
    const open = opts.open || true;
    const res = await fetch(url);
    const code = await res.text();

    return [
        `<details ${open ? 'open' : ''}>`,
        `<summary>${url}</summary>`,
        '',
        '```js',
        (opts.includeFootnotes ? code : code.split('/*')[0]).trim(),
        '```',
        '</details>'
    ].join('\n');
};

const start = async () => {
    const data = {
        nodeVersion,
        renderJsFile,
        exampleUsage: await renderJsFile('https://raw.githubusercontent.com/mattriley/agileavatars/master/boot.js')
    };
    
    ejs.renderFile('README-TEMPLATE.md', data, {}, (err, str) => {
        if (err) throw err;
        process.stdout.write(str);
    });
    
};

start();

