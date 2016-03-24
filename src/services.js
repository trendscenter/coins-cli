'use strict'
const async = require('async')
const cp = require('child_process')
const exec = cp.execSync
const services = [
  'apache2',
  'coinsnodeapi',
  'webpack-dev-server',
  'nginx'
]

const me = {}

me.bulkAction = function (opts, cb) {
  const action = opts.action
  async.map(
    services,
    (service, cb) => {
      try {
        let cmd = `sudo service ${service} ${action}`
        const rslt = exec(cmd)
        if (rslt.stderr) return cb(new Error(rslt.stderr))
        return cb(null, { service, output: rslt.stdout.toString() })
      } catch (error) {
        return cb(null, { service, error })
      }
      return cb(new Error('fatal'))
    },
    cb
  )
}

module.exports = me
