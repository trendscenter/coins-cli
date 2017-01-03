const cp = require('child_process');
const os = require('os');

let ubuntu16;

/**
 * Get whether OS is Ubuntu 16+.
 *
 * @param {getIsUbuntuCallback} cb Callback
 */
function getIsUbuntu16(cb) {
  const platform = os.platform();

  if (typeof ubuntu16 === 'boolean') {
    cb(null, ubuntu16);
  } else if (platform !== 'linux') {
    cb(new Error(`coins-cli doesn't support platform: ${platform}`));
  } else {
    cp.exec('lsb_release -a', (error, stderr, stdout) => {
      if (error) {
        cb(error);
      } else if (stderr) {
        cb(new Error(`Couldn't determine release version:

${stderr}`));
      } else if (!/Description:\s+Ubuntu/.test(stdout)) {
        cb(new Error(`Release isn't Ubuntu:

${stdout}`));
      } else {
        const matches = /Release:\s+(\d+)/.exec(stdout);

        if (!matches) {
          cb(new Error(`Couldn't parse release version:

${stdout}`));
        } else {
          ubuntu16 = matches[1] >= 16;
          cb(null, ubuntu16);
        }
      }
    });
  }
}

/**
 * @callback getIsUbuntuCallback
 * @param {Error} error
 * @param {boolean} isUbuntu16
 */

module.exports = {
  getIsUbuntu16,
};

