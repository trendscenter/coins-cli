const cp = require('child_process');
const os = require('os');
const platformHelper = require('../src/utils/platform-helper.js');
const sinon = require('sinon');
const tape = require('tape');

let execStub;
let platformStub;

tape('platform-helper :: getIsUbuntu16 :: setup', (t) => {
  /* eslint-disable no-tabs */
  execStub = sinon.stub(cp, 'exec').yields(null, null, `Distributor ID:	Ubuntu
Description:	Ubuntu 16.04.1 LTS
Release:	16.04
Codename:	xenial`);
  /* eslint-enable no-tabs */
  platformStub = sinon.stub(os, 'platform').returns('linux');
  platformStub.onCall(0).returns('amiga');

  t.end();
});

tape('platform-helper :: getIsUbuntu16', (t) => {
  t.plan(4);

  platformHelper.getIsUbuntu16((error, isUbuntu16) => {
    t.ok(error.message.indexOf('amiga') > -1, 'returns platform error');
    t.notOk(isUbuntu16, 'no version boolean');

    platformHelper.getIsUbuntu16((error2, isUbuntu162) => {
      t.notOk(error2, 'no platform error');
      t.ok(isUbuntu162, 'parses Ubuntu version');
    });
  });
});

tape('platform-helper :: getIsUbuntu16 :: teardown', (t) => {
  execStub.restore();
  platformStub.restore();
  t.end();
});

