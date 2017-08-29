#!/usr/bin/env node


require('./handle-errors')();
const path = require('path');
const cp = require('child_process');
const chalk = require('chalk');
const columnify = require('columnify');
const services = require('./services.js');
const program = require('commander');

program.parse(process.argv);
const action = program.args[0];
const verbose = program.verbose;

if (!action) {
  const entryPath = path.resolve(__dirname, 'coins.js');
  cp.exec(`node ${entryPath} -h`, (err, stdout) => console.log(stdout));
} else {
  services.bulkAction({ action, verbose }, (err, rslt) => {
    if (err) throw err;
    const output = rslt.map((rp) => {
      if (rp.error) {
        /* eslint-disable no-param-reassign */
        rp.status = chalk.red(rp.error);
        delete rp.error;
        /* eslint-enable no-param-reassign */
      }
      return rp;
    });
    console.log(columnify(output));
  });
}
