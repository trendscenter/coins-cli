#!/usr/bin/env node
'use strict'
require('./handle-errors')()
const pkgJSON = require('../package.json')
const program = require('commander')
.version(pkgJSON.version)
.command('git [action]', 'perform bulk git operations on one or more coins packages')
.command('services [action]', 'manage coins services')
program.on('--help', function () {
  console.log([
    '    Please provide a git command (e.g. pull, push, checkout, etc), or',
    '    a service command.\n',
    '    Examples:\n',
    '\tcoins git checkout release',
    '\tcoins services status',
    ''
  ].join('\n'))
})
.parse(process.argv)

module.exports = program
