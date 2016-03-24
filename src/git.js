'use strict'
const cp = require('child_process')
const columnify = require('columnify')
const path = require('path')
const chalk = require('chalk')
const defaultDir = '/coins/www/html'
const async = require('async')

const repositories = [
  { name: 'asmt', dir: path.join(defaultDir, 'micis') },
  { name: 'blockly', dir: defaultDir },
  { name: 'cas', dir: defaultDir },
  { name: 'coins', dir: defaultDir },
  { name: 'closure-library', dir: defaultDir },
  { name: 'coins_core', dir: defaultDir },
  { name: 'coins_auth', dir: '/coins' },
  { name: 'micis', dir: defaultDir },
  { name: 'portals', dir: defaultDir },
  { name: 'p2', dir: defaultDir },
  { name: 'oCoins', dir: defaultDir },
  { name: 'nodeapi', dir: '/coins' }
  // { name: 'dataDownloadCenter', dir: defaultDir },
  // { name: 'dcwebservices', dir: defaultDir },
  // { name: 'DXCapsuleBuilder', dir: defaultDir },
  // { name: 'db_schema', dir: defaultDir },
]

const me = {}

me.getBranchState = () => {
  let currDir = process.cwd()
  const result = repositories.map((repo) => {
    const repoDir = path.join(repo.dir, repo.name)
    try {
      process.chdir(repoDir)
    } catch (err) {
      return { repo: repo.name, error: `invalid directory: ${repoDir}` }
    }
    try {
      const branch = cp.execSync('git branch')
      if (branch.stderr) { throw branch.stderr }
      const currBranch = branch.stdout.split('\n')
      .filter(b => b.match(/\* /))[0]
      .replace('* ', '')
      return { repo: repo.name, branch: currBranch }
    } catch (err) {
      return { repo: repo.name, error: 'unable to get branch: ' + err }
    }
    throw new Error('fatal')
  })
  process.chdir(currDir)
  return result
}

me.print = () => {
  console.log(chalk.underline.bold('Git:'))
  let repoBranches = me.getBranchState()
  const ccBranch = repoBranches.filter((rp) => rp.repo === 'coins_core')[0].branch
  console.log(`All branches compared to coins_core branch: ${ccBranch}`)
  repoBranches = repoBranches.map((rp) => {
    // red-ify error, put into branch column
    if (rp.error) {
      rp.branch = chalk.red(rp.error)
      delete rp.error
    }
    if (rp.branch !== ccBranch) {
      rp.branch = chalk.magenta(rp.branch)
    } else {
      rp.branch = chalk.green(rp.branch)
    }
    return rp
  })
  console.log(columnify(repoBranches))
}

me.bulkAction = function (opts, cb) {
  const action = opts.action
  let target = opts.target
  let currDir = process.cwd()
  async.map(
    repositories,
    (repo, cb) => {
      const repoDir = path.join(repo.dir, repo.name)
      try {
        process.chdir(repoDir)
      } catch (err) {
        return cb(null, { repo: repo.name, error: 'invalid directory: ' + repoDir })
      }
      if (!target) target = ''
      let cmd = `git ${action} ${target}`
      cp.exec(cmd, (err, stderr, stdout) => {
        if (err) return cb(null, { repo: repo.name, error: err.message })
        return cb(null, { repo: repo.name, output: stderr + stdout })
      })
    },
    (err, rslt) => {
      if (err) return cb(err)
      process.chdir(currDir)
      cb(err, rslt)
    }
  )
}

module.exports = me
