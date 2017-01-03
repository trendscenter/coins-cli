#!/usr/bin/env node


require('./handle-errors')();
const pkgJSON = require('../package.json');
const program = require('commander')
.version(pkgJSON.version)
.command('git [action]', 'perform bulk git operations on one or more coins packages')
.command('services [action]', 'manage coins services');

program.on('--help', () => {
  console.log([
    '    -v, --verbose     output full command text, vs single line\n',
    '    Please provide a git command (e.g. pull, push, checkout, etc), or',
    '    a service command.\n',
    '    Examples:\n',
    '\tcoins git checkout release',
    '\tcoins services status',
    '',
  ].join('\n'));
})
.parse(process.argv);

module.exports = program;
