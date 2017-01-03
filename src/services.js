const async = require('async');
const cp = require('child_process');
const formatOutput = require('./format-output');
const platformHelper = require('./utils/platform-helper.js');

/**
 * Service names.
 * @private
 *
 * @const {string[]}
 */
const SERVICES = [
  'apache2',
  'nginx',
  'steelpenny',
  'webpack-dev-server',
];

/**
 * Get an OS-appropriate command for a service.
 * @private
 *
 * @param {string} service
 * @param {string} action
 * @param {getServiceCommandCallback} cb Callback
 */
function getServiceCommand(service, action, cb) {
  platformHelper.getIsUbuntu16((error, isUbuntu16) => {
    if (error) {
      cb(error);
    } else {
      let command = isUbuntu16 ?
        `systemctl ${action} ${service}` :
        `service ${service} ${action}`;

      if (action !== 'status') {
        command = `sudo ${command}`;
      }

      cb(null, command);
    }
  });
}

/**
 * @callback getServiceCommandCallback
 * @param {Error} error
 * @param {string} command
 */

/**
 * Do a bulk action.
 *
 * @param {Object} opts
 * @param {string} opts.action
 * @param {boolean} [opts.verbose]
 * @param {bulkActionCallback} cb Callback
 */
function bulkAction({ action, verbose }, cb) {
  async.waterfall([
    cb1 => async.map(
      SERVICES,
      (service, cb1a) => getServiceCommand(
        service,
        action,
        (error, command) => cb1a(error, { command, service })
      ),
      cb1
    ),
    (items, cb2) => async.map(
      items,
      ({ command, service }, cb2a) => cp.exec(
        command,
        (error, stderr, stdout) => {
          if (error) {
            cb2a(null, {
              error: error.message,
              service,
            });
          } else {
            cb2a(null, {
              output: formatOutput(verbose, stderr, stdout),
              service,
            });
          }
        }
      ),
      cb2
    ),
  ], cb);
}

/**
 * @callback bulkActionCallback
 * @param {Error} error
 * @param {Object} output
 */

module.exports = {
  bulkAction,
  getServiceCommand,
  SERVICES,
};

