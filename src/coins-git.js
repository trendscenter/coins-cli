#!/usr/bin/env node

require('./handle-errors')();

const chalk = require('chalk');
const columnify = require('columnify');
const git = require('./git.js');
const program = require('commander')
  .option('-v, --verbose', 'show full command output, vs single line');

program.on('--help', () => {
  console.log([
    '    Please provide a git command (e.g. pull, push, checkout, etc).',
    '    Example:',
    '\tcoins git checkout release',
    '',
  ].join('\n\n'));
});
program.parse(process.argv);
const action = program.args[0];
const verbose = program.verbose;
const args = program.args;

if (!action) {
  git.print();
} else {
  git.bulkAction({ args, verbose }, (err, rslt) => {
    if (err) {
      program.outputHelp();
      throw err;
    }
    const output = rslt.map((rp) => {
      if (rp.error) {
        /* eslint-disable no-param-reassign */
        rp.error = chalk.red(rp.error);
        /* eslint-enable no-param-reassign */
      }
      return rp;
    });
    console.log(columnify(output));
  });
}
