expect = require('expect.js');
base64 = require('../src/base64.js');
require('./test.js');

delete require.cache[require.resolve('../src/base64.js')];
delete require.cache[require.resolve('./test.js')];
base64 = null;

HI_BASE64_TEST = true;
require('../src/base64.js');
require('./test.js');

delete require.cache[require.resolve('../src/base64.js')];
delete require.cache[require.resolve('./test.js')];
base64 = null;

define = function(func) {
  base64 = func();
  require('./test.js');
};
define.amd = true;

require('../src/base64.js');

atob = base64.atob;
btoa = base64.btoa;
delete require.cache[require.resolve('../src/base64.js')];
delete require.cache[require.resolve('./test.js')];
base64 = null;

require('../src/base64.js');
require('./test.js');
