import { createRequire } from 'module';
import expect from 'expect.js';
import * as esm from '../build/base64.mjs';
import * as esmMin from '../build/base64.min.mjs';
import * as pkg from 'hi-base64';

const require = createRequire(import.meta.url);
const NAMES = ['encode', 'decode', 'create', 'atob', 'btoa', 'rfc_4648', 'rfc_4648_url_safe', 'rfc_2045', 'rfc_2152', 'rfc_3501'];

globalThis.expect = expect;

[['build/base64.mjs', esm], ['build/base64.min.mjs', esmMin], ['hi-base64', pkg]].forEach(([name, mod]) => {
  describe('ESM ' + name, () => {
    it('should export named members matching the default export', () => {
      NAMES.forEach((key) => {
        expect(mod[key]).to.be(mod.default[key]);
      });
    });
  });

  globalThis.base64 = mod.default;
  delete require.cache[require.resolve('./test.js')];
  require('./test.js');
});
