expect = require('expect.js');
Worker = require("tiny-worker");

function unset() {
  delete require.cache[require.resolve('../src/base64.js')];
  delete require.cache[require.resolve('./test.js')];
  base64 = null;
  BUFFER = undefined;
  HI_BASE64_NO_WINDOW = undefined;
  HI_BASE64_NO_NODE_JS = undefined;
  HI_BASE64_NO_COMMON_JS = undefined;
  window = undefined;
}

function runCommonJsTest() {
  base64 = require('../src/base64.js');
  require('./test.js');
  unset();
}

function runWindowTest() {
  window = global;
  require('../src/base64.js');
  require('./test.js');
  unset();
}

// Node.js env
runCommonJsTest();

// Webpack browser env
HI_BASE64_NO_NODE_JS = true;
runCommonJsTest();

// browser env
HI_BASE64_NO_NODE_JS = true;
HI_BASE64_NO_COMMON_JS = true;
runWindowTest();

// browser env with atob
HI_BASE64_NO_NODE_JS = true;
HI_BASE64_NO_COMMON_JS = true;
window = global;
require('../src/base64.js');
atob = base64.atob;
btoa = base64.btoa;
runWindowTest();

// browser AMD
HI_BASE64_NO_NODE_JS = true;
HI_BASE64_NO_COMMON_JS = true;
window = global;
define = function(func) {
  base64 = func();
  require('./test.js');
};
define.amd = true;

require('../src/base64.js');
unset();

// webworker
WORKER = 'tests/worker.js';
SOURCE = 'src/base64.js';

require('./worker-test.js');

delete require.cache[require.resolve('./worker-test.js')];

// cover webworker
HI_BASE64_NO_WINDOW = true;
HI_BASE64_NO_NODE_JS = true;
WORKER = './worker.js';
SOURCE = '../src/base64.js';
window = global;
self = global;

Worker = function (file) {
  require(file);
  currentWorker = this;

  this.postMessage = function (data) {
    onmessage({data: data});
  };
}

postMessage = function (data) {
  currentWorker.onmessage({data: data});
}

importScripts = function () {};

base64 = require('../src/base64.js');
require('./worker-test.js');
