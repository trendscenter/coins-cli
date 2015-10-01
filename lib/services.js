var exec = require('sync-exec');
var columnify = require('columnify');
var chalk = require('chalk');
var services = [
    'apache2',
    'coinsnodeapi',
    'webpack-dev-server',
    'nginx'
];

function print() {
    console.log(chalk.underline.bold('Services:'));
    var statuses = getServiceStatuses(services);
    console.log(columnify(statuses));
}

function servicesCmd(cmd) {
    return services.map(function(service) {
        return exec(['sudo', 'service', service, cmd].join(' '));
    });
}
function restart() {
    return servicesCmd('restart');
}

function stop() {
    return servicesCmd('stop');
}

function start() {
    return servicesCmd('start');
}

var formatServiceRow = function(service, err, msg) {
    var out = { service: service };
    if (err) {
        out.down = chalk.red(err);
    } else {
        out.up = chalk.green(msg || 'ok');
    }
    return out;
};

function getServiceStatuses(services) {
    return services.map(function(service) {
        var cmd = ['service', service, 'status'].join(' ');
        var result = exec(cmd);
        if (result.stderr) {
            return formatServiceRow(service, 'failed get to get status, ' +
                result.stderr.toString());
        }
        if (result.stdout.match('not running') || result.stdout.match('stop')) {
            return formatServiceRow(service, 'down');
        }
        if (result.stdout.match('running')) {
            return formatServiceRow(service, null, 'up');
        }
        return formatServiceRow(service, 'unknown state. run `service' + ' ' +
            service + ' status` manually.  PRs welcome :)');
    });
}

module.exports = {
    print: print,
    restart: restart,
    stop: stop,
    start: start,
};
