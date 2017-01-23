(function (base64) {
  var strs = [
    'Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.',
    'Base64 is a group of similar binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation.',
  ];

  var base64Strs = [
    'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=',
    'QmFzZTY0IGlzIGEgZ3JvdXAgb2Ygc2ltaWxhciBiaW5hcnktdG8tdGV4dCBlbmNvZGluZyBzY2hlbWVzIHRoYXQgcmVwcmVzZW50IGJpbmFyeSBkYXRhIGluIGFuIEFTQ0lJIHN0cmluZyBmb3JtYXQgYnkgdHJhbnNsYXRpbmcgaXQgaW50byBhIHJhZGl4LTY0IHJlcHJlc2VudGF0aW9uLg==',
  ];

  var utf8Str = [
    '中文',
    'aécio',
    'base64可以用來將binary的位元組序列資料編碼成ASCII字元序列構成的a',
    'Base64是一種基於64個可列印字元來表示二進制資料的表示方法',
    '對應於4個Base64單元',
    '𠜎'
  ];

  var base64Utf8Strs = [
    '5Lit5paH',
    'YcOpY2lv',
    'YmFzZTY05Y+v5Lul55So5L6G5bCHYmluYXJ555qE5L2N5YWD57WE5bqP5YiX6LOH5paZ57eo56K85oiQQVNDSUnlrZflhYPluo/liJfmp4vmiJDnmoRh',
    'QmFzZTY05piv5LiA56iu5Z+65pa8NjTlgIvlj6/liJfljbDlrZflhYPkvobooajnpLrkuozpgLLliLbos4fmlpnnmoTooajnpLrmlrnms5U=',
    '5bCN5oeJ5pa8NOWAi0Jhc2U2NOWWruWFgw==',
    '8KCcjg=='
  ];

  var base64NonUtf8Strs = [
    '+A==',
    '33k=',
    '7aCA',
    '9JCAgA=='
  ];

  var bytes = [
    [0],
    new Uint8Array([0]),
    new ArrayBuffer(1),
    [0, 0],
    [0, 0, 0]
  ];

  var base64Bytes = [
    'AA==',
    'AA==',
    'AA==',
    'AAA=',
    'AAAA'
  ];

  function arrayToStr(array) {
    if(array.constructor === ArrayBuffer) {
      array = new Uint8Array(array);
    }
    return Array.prototype.join.call(array, ',');
  }

  describe('#encode', function () {
    context('when ascii', function () {
      context('without ascii option', function () {
        for (var i = 0; i < strs.length; ++i) {
          (function (i) {
            it('should be equal', function () {
              expect(base64.encode(strs[i])).to.be(base64Strs[i]);
            });
          })(i);
        }
      });

      context('with ascii option', function () {
        it('should be equal', function () {
          expect(base64.encode(strs[0], true)).to.be(base64Strs[0]);
        });
      });
    });

    context('when UTF8', function () {
      for (var i = 0; i < utf8Str.length; ++i) {
        (function (i) {
          it('should be equal', function () {
            expect(base64.encode(utf8Str[i])).to.be(base64Utf8Strs[i]);
          });
        })(i);
      }
    });

    context('when Bytes', function () {
      for (var i = 0; i < bytes.length; ++i) {
        (function (i) {
          it('should be equal', function () {
            expect(base64.encode(bytes[i])).to.be(base64Bytes[i]);
          });
        })(i);
      }
    });
  });

  describe('#decode', function () {
    context('when ascii', function () {
      context('without ascii option', function () {
        for (var i = 0; i < strs.length; ++i) {
          (function (i) {
            it('should be equal', function () {
              expect(base64.decode(base64Strs[i])).to.be(strs[i]);
            });
          })(i);
        }
      });

      context('with ascii option', function () {
        it('should be equal', function () {
          expect(base64.decode(base64Strs[0], true)).to.be(strs[0]);
        });
      });
    });

    context('when UTF8', function () {
      for (var i = 0; i < utf8Str.length; ++i) {
        (function (i) {
          it('should be equal', function () {
            expect(base64.decode(base64Utf8Strs[i])).to.be(utf8Str[i]);
          });
        })(i);
      }
    });

    if (typeof HI_BASE64_NO_NODE_JS !== 'undefined') {
      context('when non-UTF8 as UTF8', function () {
        for (var i = 0; i < base64NonUtf8Strs.length; ++i) {
          (function (i) {
            it('should throw exception', function () {
              expect(function () {
                base64.decode(base64NonUtf8Strs[i]);
              }).to.throwError();
            });
          })(i);
        }
      });
    }
  });

  describe('#decode.string', function () {
    for (var i = 0; i < strs.length; ++i) {
      (function (i) {
        it('should be equal', function () {
          expect(base64.decode.string(base64Strs[i])).to.be(strs[i]);
        });
      })(i);
    }
  });

  describe('#decode.bytes', function () {
    for (var i = 0; i < bytes.length; ++i) {
      (function (i) {
        it('should be equal', function () {
          expect(arrayToStr(base64.decode.bytes(base64Bytes[i]))).to.be(arrayToStr(bytes[i]));
        });
      })(i);
    }
  });
})(base64);
