'use strict';
var exec = require('sync-exec');
var path = require('path');
var columnify = require('columnify');
var chalk = require('chalk');
var defaultDir = '/coins/www/html';

var repositories = [
    { name: 'blockly', dir: defaultDir },
    { name: 'portals', dir: defaultDir },
    { name: 'closure-library', dir: defaultDir },
    { name: 'coins_core', dir: defaultDir },
    { name: 'coins_auth', dir: '/coins' },
    { name: 'micis', dir: defaultDir },
    { name: 'cas', dir: defaultDir },
    { name: 'asmt', dir: path.join(defaultDir, 'micis') },
    // { name: 'db_schema', dir: defaultDir },
    { name: 'p2', dir: defaultDir },
    // { name: 'dataDownloadCenter', dir: defaultDir },
    // { name: 'dcwebservices', dir: defaultDir },
    // { name: 'DXCapsuleBuilder', dir: defaultDir },
    { name: 'oCoins', dir: defaultDir },
    { name: 'coins', dir: defaultDir },
    { name: 'nodeapi', dir: '/coins' },
];

var getBranches = function() {
    var currDir = process.cwd();
    var result = repositories.map(function(repo) {
        var repoDir = path.join(repo.dir, repo.name);
        try {
            process.chdir(repoDir);
        } catch(err) {
            return { repo: repo.name, error: 'invalid directory: ' + repoDir };
        }
        try {
            var branch = exec('git branch');
            if (branch.stderr) {
                throw branch.stderr;
            }
            var currBranch = branch.stdout.split('\n').filter(function(b) { return b.match(/\* /); })[0].replace('* ', '');
            return { repo: repo.name, branch: currBranch };
        } catch(err) {
            return { repo: repo.name, error: 'unable to get branch: ' + err };
        }
        throw new Error('fatal');
    });
    process.chdir(currDir);
    return result;
};

var print = function() {
    console.log(chalk.underline.bold('Git:'));
    var repoBranches = getBranches();
    var ccBranch = repoBranches.filter(function(rp) { return rp.repo === 'coins_core'; })[0].branch;
    console.log('All branches compared to coins_core branch: ' + ccBranch);
    repoBranches = repoBranches.map(function formatTable(rp) {
        // red-ify error, put into branch column
        if (rp.error) {
            rp.branch = chalk.red(rp.error);
            delete rp.error;
        }
        if (rp.branch !== ccBranch) {
            rp.branch = chalk.magenta(rp.branch);
        } else {
            rp.branch = chalk.green(rp.branch);
        }
        return rp;
    });
    console.log(columnify(repoBranches));
};

var checkout = function(branch) {
    var currDir = process.cwd();
    var result = repositories.map(function(repo) {
        var repoDir = path.join(repo.dir, repo.name);
        try {
            process.chdir(repoDir);
        } catch(err) {
            return { repo: repo.name, error: 'invalid directory: ' + repoDir };
        }
        try {
            var gcresult = exec('git checkout ' + branch);
            if (gcresult.stderr) {
                throw gcresult.stderr;
            }
            return { repo: repo.name, status: 'ok' };
        } catch(err) {
            return { repo: repo.name, error: 'unable to checkout branch: ' + err };
        }
        throw new Error('fatal');
    });
    process.chdir(currDir);

    result = result.map(function formatTable(rp) {
        // red-ify error, put into branch column
        if (rp.error) {
            rp.status = chalk.red(rp.error);
            delete rp.error;
        } else {
            rp.status = chalk.green(rp.status);
        }
        return rp;
    });
    console.log(columnify(result));

    return result;
};

module.exports = {
    print: print,
    checkout: checkout
};
