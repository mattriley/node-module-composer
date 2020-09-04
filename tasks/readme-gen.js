/* eslint-disable no-sync */
const ejs = require('ejs');
const fs = require('fs');

const nodeVersion = fs.readFileSync('.nvmrc', 'utf-8').trim();

const renderJsFile = (path, opts = {}) => {
    const open = opts.open || true;
    const code = fs.readFileSync(path, 'utf-8');
    return [
        `<details ${open ? 'open' : ''}>`,
        `<summary>${path}</summary>`,
        '',
        '```js',
        (opts.includeFootnotes ? code : code.split('/*')[0]).trim(),
        '```',
        '</details>'
    ].join('\n');
};

const data = {
    nodeVersion,
    renderJsFile
};

ejs.renderFile('README-TEMPLATE.md', data, {}, (err, str) => {
    if (err) throw err;
    process.stdout.write(str);
});
