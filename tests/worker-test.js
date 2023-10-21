(function (Worker, WORKER, SOURCE) {
  var strs = [
    'Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.',
    'Base64 is a group of similar binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation.',
  ];

  var base64Strs = [
    'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=',
    'QmFzZTY0IGlzIGEgZ3JvdXAgb2Ygc2ltaWxhciBiaW5hcnktdG8tdGV4dCBlbmNvZGluZyBzY2hlbWVzIHRoYXQgcmVwcmVzZW50IGJpbmFyeSBkYXRhIGluIGFuIEFTQ0lJIHN0cmluZyBmb3JtYXQgYnkgdHJhbnNsYXRpbmcgaXQgaW50byBhIHJhZGl4LTY0IHJlcHJlc2VudGF0aW9uLg=='
  ];

  describe('#encode', function () {
    context('when ascii', function () {
      context('without ascii option', function () {
        for (var i = 0; i < strs.length; ++i) {
          (function (i) {
            it('should be equal', function (done) {
              var worker = new Worker(WORKER);
              worker.onmessage = function(event) {
                expect(event.data).to.be(base64Strs[i]);
                if (worker.terminate) {
                  worker.terminate();
                }
                done();
              };
              worker.postMessage(SOURCE);
              worker.postMessage(strs[i]);
            });
          })(i);
        }
      });
    });
  });
})(Worker, WORKER, SOURCE);
