# hi-base64
[![Build Status](https://api.travis-ci.org/emn178/hi-base64.png)](https://travis-ci.org/emn178/hi-base64)  
[![Build Status](https://coveralls.io/repos/emn178/hi-base64/badge.png?branch=master)](https://coveralls.io/r/emn178/hi-base64?branch=master)  
[![NPM](https://nodei.co/npm/hi-base64.png?stars&downloads)](https://nodei.co/npm/hi-base64/)
A simple Base64 encode / decode function for JavaScript supports UTF-8 encoding.  

## Download
[Compress](https://raw.github.com/emn178/hi-base64/master/build/base64.min.js)  
[Uncompress](https://raw.github.com/emn178/hi-base64/master/src/base64.js)

## Demo
[Base64 Encode Online](http://emn178.github.io/online-tools/base64_encode.html)  
[Base64 Decode Online](http://emn178.github.io/online-tools/base64_decode.html)  

## Benchmark
[Encode ASCII](http://jsperf.com/base64-encode-ascii/3)  
[Encode UTF8](http://jsperf.com/base64-encode-utf8/3)  
[Decode ASCII](http://jsperf.com/base64-decode-ascii/2)  
[Decode UTF8](http://jsperf.com/base64-decode-utf8/2)  

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
base64 = require('hi-base64');
```
### Methods

#### base64.encode(str, asciiOnly)

Encode string to base64, set asciiOnly to true for better performace.

##### *str: `String`*

String to encode.

##### *asciiOnly: `Boolean` (default: `false`)*

Specify the string encoding is ASCII.

#### base64.decode(base64Str, asciiOnly)

Decode base64 string, set asciiOnly to true for better performace.

##### *base64Str: `String`*

Base64 string to decode.

##### *asciiOnly: `Boolean` (default: `false`)*

Specify the string encoding is ASCII.

## Example
Code
```JavaScript
base64.encode('Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.');
base64.decode('VGhpcyBpcyB0ZXN0Lg==');
```
Output

    TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=
    This is test.

It also supports UTF-8 encoding:

Code
```JavaScript
base64.encode('中文');
```
Output

    5Lit5paH

## Tests
You can open `tests/index.html` in browser or use node.js to run test

    node tests/node-test.js

or

    npm test

## Extensions
### jQuery
If you prefer jQuery style, you can add following code to add a jQuery extension.

Code
```JavaScript
jQuery.base64 = base64
```
And then you could use like this:
```JavaScript
$.base64.encode('String to encode');
$.base64.decode('Base64 string to decode');
```
### Prototype
If you prefer prototype style, you can add following code to add a prototype extension.

Code
```JavaScript
String.prototype.base64Encode = function(asciiOnly) {
  return base64.encode(this, asciiOnly);
};
String.prototype.base64Decode = function(asciiOnly) {
  return base64.decode(this, asciiOnly);
};
```
And then you could use like this:
```JavaScript
'String to encode'.base64Encode();
'Base64 string to decode'.base64Decode();
```
## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/hi-base64  
Author: emn178@gmail.com
