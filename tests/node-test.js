expect = require('expect.js');
base64 = require('../src/base64.js');
testName = 'default';
require('./test.js');

delete require.cache[require.resolve('../src/base64.js')]
delete require.cache[require.resolve('./test.js')]

global.HI_BASE64_TEST = true;
testName = 'without btoa';
base64 = require('../src/base64.js');
require('./test.js');

delete require.cache[require.resolve('../src/base64.js')]
delete require.cache[require.resolve('./test.js')]

atob = base64.atob;
btoa = base64.btoa;
testName = 'with btoa';
base64 = require('../src/base64.js');
require('./test.js');
