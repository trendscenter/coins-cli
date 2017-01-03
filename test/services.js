const async = require('async');
const cp = require('child_process');
const platformHelper = require('../src/utils/platform-helper.js');
const services = require('../src/services.js');
const sinon = require('sinon');
const tape = require('tape');

let execStub;
let isUbuntuStub;

tape('services :: bulkAction :: setup', (t) => {
  execStub = sinon.stub(cp, 'exec').yields(null, null, '');
  isUbuntuStub = sinon.stub(platformHelper, 'getIsUbuntu16').yields(null, true);
  t.end();
});

tape('services :: bulkAction', (t) => {
  t.plan(3);

  services.bulkAction({ action: 'start' }, (error, output) => {
    t.notOk(error, 'no error');
    t.ok(output, 'yields output');
    t.ok(
      services.SERVICES.every(
        name => execStub.calledWith(`sudo systemctl start ${name}`)
      ),
      'starts every service'
    );
  });
});

tape('services :: bulkAction :: teardown', (t) => {
  execStub.restore();
  isUbuntuStub.restore();
  t.end();
});

tape('services :: getServiceCommand :: setup', (t) => {
  isUbuntuStub = sinon.stub(platformHelper, 'getIsUbuntu16').yields(null, true);
  isUbuntuStub.onCall(0).yields(null, false);
  t.end();
});

tape('services :: getServiceCommand', (t) => {
  t.plan(3);

  async.series([
    cb1 => services.getServiceCommand('nginx', 'status', (error, command) => {
      t.equal(command, 'service nginx status', 'Ubuntu 14 command');
      cb1(error);
    }),
    cb2 => services.getServiceCommand('nginx', 'status', (error, command) => {
      t.equal(command, 'systemctl status nginx', 'Ubuntu 16+ command');
      cb2(error);
    }),
    cb3 => services.getServiceCommand('nginx', 'start', (error, command) => {
      t.equal(command, 'sudo systemctl start nginx', 'adds sudo to command');
      cb3(error);
    }),
  ], t.end);
});

tape('services :: getServiceCommand :: teardown', (t) => {
  isUbuntuStub.restore();
  t.end();
});

