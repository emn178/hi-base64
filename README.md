# hi-base64
[![Build Status](https://api.travis-ci.org/emn178/hi-base64.png)](https://travis-ci.org/emn178/hi-base64)
[![Build Status](https://coveralls.io/repos/emn178/hi-base64/badge.png?branch=master)](https://coveralls.io/r/emn178/hi-base64?branch=master)  
[![NPM](https://nodei.co/npm/hi-base64.png?stars&downloads)](https://nodei.co/npm/hi-base64/)  
A simple Base64 encode / decode function for JavaScript supports UTF-8 encoding.  

## Demo
[Base64 Encode Online](http://emn178.github.io/online-tools/base64_encode.html)  
[Base64 Decode Online](http://emn178.github.io/online-tools/base64_decode.html)  

## Download
[Compress](https://raw.github.com/emn178/hi-base64/master/build/base64.min.js)  
[Uncompress](https://raw.github.com/emn178/hi-base64/master/src/base64.js)

## Installation
You can also install hi-base64 by using Bower.

    bower install hi-base64

For node.js, you can use this command to install:

    npm install hi-base64

## Usage
You could use like this:
```JavaScript
base64.encode('String to encode');
base64.decode('Base64 string to decode');
```
If you use node.js, you should require the module first:
```JavaScript
var base64 = require('hi-base64');
```
It supports AMD:
```JavaScript
require(['your/path/hi-baes64.js'], function (baes64) {
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
```

## Notice
In node.js, hi-base64 uses Buffer to encode / decode. It will not throw an exception when decoding a non-UTF8 base64 string as UTF-8 string. In browsers, hi-base64 will throw an exception in this case.


## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/hi-base64  
Author: Chen, Yi-Cyuan <emn178@gmail.com>
