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
        name => execStub.calledWith(`systemctl start ${name}`)
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

  services.getServiceCommand('nginx', 'status', (error, command) => {
    t.notOk(error, 'no error');
    t.equal(command, 'service nginx status', 'Ubuntu 14 command');

    services.getServiceCommand('nginx', 'status', (error2, command2) => {
      t.equal(command2, 'systemctl status nginx', 'Ubuntu 16+ command');
    });
  });
});

tape('services :: getServiceCommand :: teardown', (t) => {
  isUbuntuStub.restore();
  t.end();
});

