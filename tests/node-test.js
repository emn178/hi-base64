expect = require('expect.js');
Worker = require("tiny-worker");

var NATIVE_ATOB = global.atob;
var NATIVE_BTOA = global.btoa;

function unset() {
  delete require.cache[require.resolve('../src/base64.js')];
  delete require.cache[require.resolve('./test.js')];
  base64 = null;
  BUFFER = undefined;
  HI_BASE64_NO_WINDOW = undefined;
  HI_BASE64_NO_NODE_JS = undefined;
  HI_BASE64_NO_COMMON_JS = undefined;
  window = undefined;
  global.atob = NATIVE_ATOB;
  global.btoa = NATIVE_BTOA;
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

// browser env without native atob/btoa
HI_BASE64_NO_NODE_JS = true;
HI_BASE64_NO_COMMON_JS = true;
global.atob = undefined;
global.btoa = undefined;
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

// browser with a process polyfill (e.g. BrowserFS)
window = global;
runCommonJsTest();

// Electron renderer
process.type = 'renderer';
base64 = require('../src/base64.js');
delete process.type;
require('./test.js');
unset();

// environment detection in isolated contexts (no Node.js globals)
describe('environment detection', function () {
  var vm = require('vm');
  var fs = require('fs');
  var path = require('path');
  var source = fs.readFileSync(path.join(__dirname, '../src/base64.js'), 'utf8');

  function run(sandbox) {
    vm.runInContext(source, vm.createContext(sandbox));
    return sandbox.base64;
  }

  function check(base64) {
    expect(base64.encode('Hello')).to.be('SGVsbG8=');
    expect(base64.decode('SGVsbG8=')).to.be('Hello');
    expect(base64.encode('中文')).to.be('5Lit5paH');
    expect(base64.decode('5Lit5paH')).to.be('中文');
  }

  it('should not treat a browser with a process polyfill as Node.js', function () {
    var sandbox = { process: { versions: { node: '18.0.0' }, env: {} } };
    sandbox.window = sandbox.self = sandbox;
    check(run(sandbox));
  });

  it('should not treat an Electron renderer as Node.js', function () {
    var sandbox = { process: { type: 'renderer', versions: { node: '20.0.0' } } };
    sandbox.window = sandbox.self = sandbox;
    check(run(sandbox));
  });

  it('should encode bytes without ArrayBuffer', function () {
    var base64 = require('../src/base64.js');
    var NativeArrayBuffer = global.ArrayBuffer;
    delete global.ArrayBuffer;
    try {
      expect(base64.encode([72, 101, 108, 108, 111])).to.be('SGVsbG8=');
    } finally {
      global.ArrayBuffer = NativeArrayBuffer;
    }
  });

  it('should expose to the global scope in a web worker', function () {
    var sandbox = {};
    sandbox.self = sandbox;
    check(run(sandbox));
  });
});

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
