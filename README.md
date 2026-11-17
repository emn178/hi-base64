# hi-base64
[![CI](https://github.com/emn178/hi-base64/actions/workflows/ci.yml/badge.svg)](https://github.com/emn178/hi-base64/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/emn178/hi-base64/badge.svg?branch=master)](https://coveralls.io/r/emn178/hi-base64?branch=master)
[![NPM](https://img.shields.io/npm/v/hi-base64)](https://www.npmjs.com/package/hi-base64)
[![CDNJS](https://img.shields.io/jsdelivr/npm/hm/hi-base64)](https://www.jsdelivr.com/package/npm/hi-base64)

A simple Base64 encode / decode function for JavaScript supports UTF-8 encoding.

## Demo
[Base64 Encode Online](https://emn178.github.io/online-tools/base64_encode.html)  
[Base64 Decode Online](https://emn178.github.io/online-tools/base64_decode.html)  

## Download
[Compress](https://raw.github.com/emn178/hi-base64/master/build/base64.min.js)  
[Uncompress](https://raw.github.com/emn178/hi-base64/master/src/base64.js)

## Installation
You can also install hi-base64 by using Bower.

    bower install hi-base64

For node.js, you can use this command to install:

    npm install hi-base64

## Usage
### Browser
You could use like this:
```JavaScript
base64.encode('String to encode');
base64.decode('Base64 string to decode');
base64.decode.bytes('Base64 string to decode as bytes');
base64.rfc_4648_url_safe.encode('String to encode');
```

### CommonJS
If you use node.js CommonJS, you should require the module first:
```JavaScript
const { encode, decode } = require('hi-base64');
```

### ESM
If you use node.js ESM or a bundler, you can import like this:
```JavaScript
import { encode, decode } from 'hi-base64';
// or
import base64 from 'hi-base64';
```

In browsers, you can import the ESM build directly:
```HTML
<script type="module">
  import { encode, decode } from 'https://cdn.jsdelivr.net/npm/hi-base64/build/base64.min.mjs';
</script>
```

### TypeScript
If you use TypeScript, you can import like this:
```TypeScript
import { encode, decode } from 'hi-base64';
```

### RequireJS
It supports AMD:
```JavaScript
require(['your/path/base64.js'], function (base64) {
// ...
});
```

### Methods
#### base64.encode(str, asciiOnly)
Encode string to base64, set asciiOnly to true for better performace.

##### *str: `String`*
String to encode.

##### *asciiOnly: `Boolean` (default: `false`)*
Specify the string encoding is ASCII.

#### base64.create(options)
Create a Base64 codec with custom options.

##### *options.alphabet: `String`*
Specify the 64-character alphabet. The alphabet must contain exactly 64 unique characters and cannot contain `=`, CR, or LF.

##### *options.padding: `Boolean` (default: `true`)*
Specify whether encoded output should include `=` padding.

##### *options.lineLength: `Number` (default: `0`)*
Specify the encoded line length. Set `0` to disable line wrapping.

##### *options.lineSeparator: `String` (default: `\r\n`)*
Specify the line separator when `lineLength` is enabled.

#### Built-in codecs
The built-in codecs are:
* rfc_4648
* rfc_4648_url_safe
* rfc_2045
* rfc_2152
* rfc_3501

You can use them directly:
```JavaScript
base64.rfc_4648.encode('String to encode');
base64.rfc_4648.decode('Base64 string to decode');
base64.rfc_4648_url_safe.encode('String to encode');
base64.rfc_4648_url_safe.decode('Base64 string to decode');
```

Please refer to [wiki](https://en.wikipedia.org/wiki/Base64#Variants_summary_table).

#### base64.encode(str, asciiOnly, format)
Encode string to base64 with a legacy format parameter. Prefer the built-in codecs for new code:
```JavaScript
base64.rfc_4648_url_safe.encode(str);
```

#### base64.decode(base64Str, asciiOnly)
Decode base64 string, set asciiOnly to true for better performace. `base64.decode.string` is alias to this method.

##### *base64Str: `String`*
Base64 string to decode.

##### *asciiOnly: `Boolean` (default: `false`)*
Specify the string encoding is ASCII.

#### base64.decode.bytes(base64Str)
Decode base64 string and return bytes `Array`.

##### *base64Str: `String`*
Base64 string to decode.

#### base64.decode.uint8Array(base64Str)
Decode base64 string and return bytes `Uint8Array`.

##### *base64Str: `String`*
Base64 string to decode.

## Example
Code
```JavaScript
base64.encode('Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.');
// TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=

base64.decode('VGhpcyBpcyB0ZXN0Lg==');
base64.decode.string('VGhpcyBpcyB0ZXN0Lg==');
// This is test.


/* Supports UTF-8 encoding: */
base64.encode('中文');
// 5Lit5paH


/* Supports bytes: */
base64.encode([0, 1, 2]);
base64.encode(new Uint8Array([0, 1, 2]));
// AAEC

base64.encode(new ArrayBuffer(3));
// AAAA

base64.decode.bytes('VGhpcyBpcyB0ZXN0Lg==');
// [84, 104, 105, 115, 32, 105, 115, 32, 116, 101, 115, 116, 46]

base64.decode.uint8Array('VGhpcyBpcyB0ZXN0Lg==');
// Uint8Array(13) [84, 104, 105, 115, 32, 105, 115, 32, 116, 101, 115, 116, 46]
```

## Notice
When decoding a non-UTF8 base64 string as UTF-8 string, ill-formed sequences are replaced with U+FFFD (`\ufffd`), the same as `TextDecoder`. Use `base64.decode.bytes()` to get the raw bytes. Unpaired UTF-16 surrogates are encoded as U+FFFD, the same as `TextEncoder`.


## License
The project is released under the [MIT license](https://opensource.org/license/mit/).

## Contact
The project's website is located at https://github.com/emn178/hi-base64  
Author: Chen, Yi-Cyuan <emn178@gmail.com>
