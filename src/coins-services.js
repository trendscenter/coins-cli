#!/usr/bin/env node
'use strict'
require('./handle-errors')()
const path = require('path');
const cp = require('child_process');
const chalk = require('chalk')
const columnify = require('columnify')
const services = require('./services.js')
const program = require('commander')
program.parse(process.argv)
const action = program.args[0]
const verbose = program.verbose

if (!action) {
  const entryPath = path.resolve(__dirname, 'coins.js')
  return cp.exec(`node ${entryPath} -h`, (err, stdout) => console.log(stdout))
}

services.bulkAction({ action, verbose }, (err, rslt) => {
  if (err) {
    program.outputHelp()
    throw err
  }
  rslt = rslt.map((rp) => {
    if (rp.error) {
      rp.status = chalk.red(rp.error)
      delete rp.error
    }
    return rp
  })
  console.log(columnify(rslt))
})
