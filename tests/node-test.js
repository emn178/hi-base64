// Node.js env
expect = require('expect.js');
base64 = require('../src/base64.js');
require('./test.js');

delete require.cache[require.resolve('../src/base64.js')];
delete require.cache[require.resolve('./test.js')];
base64 = null;

// Webpack browser env
HI_BASE64_NO_NODE_JS = true;
window = global;
base64 = require('../src/base64.js');
require('./test.js');

delete require.cache[require.resolve('../src/base64.js')];
delete require.cache[require.resolve('./test.js')];
base64 = null;

// browser env
HI_BASE64_NO_NODE_JS = true;
HI_BASE64_NO_COMMON_JS = true;
window = global;
require('../src/base64.js');
require('./test.js');

delete require.cache[require.resolve('../src/base64.js')];
delete require.cache[require.resolve('./test.js')];
base64 = null;

// browser env with atob
HI_BASE64_NO_NODE_JS = true;
HI_BASE64_NO_COMMON_JS = true;
window = global;
require('../src/base64.js');
atob = base64.atob;
btoa = base64.btoa;
require('./test.js');

delete require.cache[require.resolve('../src/base64.js')];
delete require.cache[require.resolve('./test.js')];
base64 = null;

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
