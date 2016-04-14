'use strict'
const async = require('async')
const cp = require('child_process')
const formatOutput = require('./format-output')
const services = [
  'apache2',
  'steelpenny',
  'webpack-dev-server',
  'nginx'
]

const me = {}

me.bulkAction = function (opts, cb) {
  const action = opts.action
  async.map(
    services,
    (service, cb) => {
      let cmd = `sudo service ${service} ${action}`
      cp.exec(cmd, (err, stderr, stdout) => {
        if (err) return cb(null, { service, error: err.message })
        return cb(null, { service, output: formatOutput(opts.verbose, stderr, stdout) })
      })
    },
    cb
  )
}

module.exports = me
