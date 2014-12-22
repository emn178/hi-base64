var base64 = require('../src/base64.js');
var test = require('tape');

var strs = [
  'Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.',
  '中文',
  'aécio',
  'base64可以用來將binary的位元組序列資料編碼成ASCII字元序列構成的a'
];

var base64Strs = [
  'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=',
  '5Lit5paH',
  'YcOpY2lv',
  'YmFzZTY05Y+v5Lul55So5L6G5bCHYmluYXJ555qE5L2N5YWD57WE5bqP5YiX6LOH5paZ57eo56K85oiQQVNDSUnlrZflhYPluo/liJfmp4vmiJDnmoRh'
];

test('encode', function (t) {
  for(var i = 0;i < strs.length;++i) {
    t.equal(base64.encode(strs[i]), base64Strs[i]);
  }
  t.equal(base64.encode(strs[0], true), base64Strs[0]);
  t.end()
});

test('decode', function (t) {
  for(var i = 0;i < strs.length;++i) {
    t.equal(base64.decode(base64Strs[i]), strs[i]);
  }
  t.equal(base64.decode(base64Strs[0], true), strs[0]);
  t.end()
});
