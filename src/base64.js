/*
 * hi-base64 v0.1.0
 * https://github.com/emn178/hi-base64
 *
 * Copyright 2014, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function(root, undefined) {
  'use strict';

  var BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var BASE64_DECODE_CHAR = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8,
    'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 
    'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 
    'Z': 25, 'a': 26, 'b': 27, 'c': 28, 'd': 29, 'e': 30, 'f': 31, 'g': 32, 
    'h': 33, 'i': 34, 'j': 35, 'k': 36, 'l': 37, 'm': 38, 'n': 39, 'o': 40, 
    'p': 41, 'q': 42, 'r': 43, 's': 44, 't': 45, 'u': 46, 'v': 47, 'w': 48, 
    'x': 49, 'y': 50, 'z': 51, '0': 52, '1': 53, '2': 54, '3': 55, '4': 56, 
    '5': 57, '6': 58, '7': 59, '8': 60, '9': 61, '+': 62, '/': 63, '-': 62,
    '_': 63
  };

  var encodeAsBytes = function(str) {
    var bytes = [];
    for (var i = 0;i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 0x80) {
        bytes.push(c);
      } else if (c < 0x800) {
        bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      } else if (c < 0xd800 || c >= 0xe000) {
        bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      } else {
        c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff))
        bytes.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 0x3f), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      }
    }
    return bytes;
  };

  var decodeAsBytes = function(base64Str) {
    var bytes = [];
    var index = 0;
    var length = base64Str.length;
    if(base64Str.charAt(length - 2) == '=') {
      length -= 2;
    } else if(base64Str.charAt(length - 1) == '=') {
      length -= 1;
    }

    // 4 char to 3 bytes
    for(var i = 0, count = length >> 2 << 2;i < count;) {
      var v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      var v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      var v3 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      var v4 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      bytes[index++] = (v1 << 2 | v2 >>> 4) & 255;
      bytes[index++] = (v2 << 4 | v3 >>> 2) & 255;
      bytes[index++] = (v3 << 6 | v4) & 255;
    }

    // remain bytes
    var remain = length - count;
    if(remain == 2) {
      var v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      var v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      bytes[index++] = (v1 << 2 | v2 >>> 4) & 255;
    } else if(remain == 3) {
      var v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      var v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      var v3 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
      bytes[index++] = (v1 << 2 | v2 >>> 4) & 255;
      bytes[index++] = (v2 << 4 | v3 >>> 2) & 255;
    }
    return bytes;
  };

  var btoa = root.btoa, atob = root.atob, utf8Base64Encode, utf8Base64Decode;
  // node.js
  if(typeof(module) != 'undefined') {
    var Buffer = require('buffer').Buffer;
    btoa = utf8Base64Encode = function(str) {
      return new Buffer(str).toString('base64');
    };

    atob = function(base64Str) {
      return new Buffer(base64Str, 'base64').toString('ascii');
    };

    utf8Base64Decode = function(base64Str) {
      return new Buffer(base64Str, 'base64').toString();
    };
  } else if(!btoa) {
    btoa = function(str) {
      var base64Str = '';
      var length = str.length;
      for(var i = 0, count = parseInt(length / 3) * 3;i < count;) {
        var v1 = str.charCodeAt(i++);
        var v2 = str.charCodeAt(i++);
        var v3 = str.charCodeAt(i++);
        base64Str += BASE64_ENCODE_CHAR.charAt(v1 >>> 2);
        base64Str += BASE64_ENCODE_CHAR.charAt((v1 << 4 | v2 >>> 4) & 63);
        base64Str += BASE64_ENCODE_CHAR.charAt((v2 << 2 | v3 >>> 6) & 63);
        base64Str += BASE64_ENCODE_CHAR.charAt(v3 & 63);
      }
      
      // remain char
      var remain = length - count;
      if(remain == 1) {
        var v1 = str.charCodeAt(i);
        base64Str += BASE64_ENCODE_CHAR.charAt(v1 >>> 2);
        base64Str += BASE64_ENCODE_CHAR.charAt((v1 << 4) & 63);
        base64Str += '==';
      } else if(remain == 2) {
        var v1 = str.charCodeAt(i++);
        var v2 = str.charCodeAt(i);
        base64Str += BASE64_ENCODE_CHAR.charAt(v1 >>> 2);
        base64Str += BASE64_ENCODE_CHAR.charAt((v1 << 4 | v2 >>> 4) & 63);
        base64Str += BASE64_ENCODE_CHAR.charAt((v2 << 2) & 63);
        base64Str += '=';
      }
      return base64Str;
    };

    utf8Base64Encode = function(str) {
      var base64Str = '';
      var bytes = encodeAsBytes(str);
      var length = bytes.length;
      for(var i = 0, count = parseInt(length / 3) * 3;i < count;) {
        var v1 = bytes[i++];
        var v2 = bytes[i++];
        var v3 = bytes[i++];
        base64Str += BASE64_ENCODE_CHAR.charAt(v1 >>> 2);
        base64Str += BASE64_ENCODE_CHAR.charAt((v1 << 4 | v2 >>> 4) & 63);
        base64Str += BASE64_ENCODE_CHAR.charAt((v2 << 2 | v3 >>> 6) & 63);
        base64Str += BASE64_ENCODE_CHAR.charAt(v3 & 63);
      }
      
      // remain char
      var remain = length - count;
      if(remain == 1) {
        var v1 = bytes[i];
        base64Str += BASE64_ENCODE_CHAR.charAt(v1 >>> 2);
        base64Str += BASE64_ENCODE_CHAR.charAt((v1 << 4) & 63);
        base64Str += '==';
      } else if(remain == 2) {
        var v1 = bytes[i++];
        var v2 = bytes[i];
        base64Str += BASE64_ENCODE_CHAR.charAt(v1 >>> 2);
        base64Str += BASE64_ENCODE_CHAR.charAt((v1 << 4 | v2 >>> 4) & 63);
        base64Str += BASE64_ENCODE_CHAR.charAt((v2 << 2) & 63);
        base64Str += '=';
      }
      return base64Str;
    };

    atob = function(base64Str) {
      var str = '';
      var length = base64Str.length;
      if(base64Str.charAt(length - 2) == '=') {
        length -= 2;
      }
      else if(base64Str.charAt(length - 1) == '=') {
        length -= 1;
      }

      // 4 char to 3 bytes
      for(var i = 0, count = length >> 2 << 2;i < count;) {
        var v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        var v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        var v3 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        var v4 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        str += String.fromCharCode((v1 << 2 | v2 >>> 4) & 255);
        str += String.fromCharCode((v2 << 4 | v3 >>> 2) & 255);
        str += String.fromCharCode((v3 << 6 | v4) & 255);
      }

      // remain bytes
      var remain = length - count;
      if(remain == 2) {
        var v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        var v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        str += String.fromCharCode((v1 << 2 | v2 >>> 4) & 255);
      } else if(remain == 3) {
        var v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        var v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        var v3 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        str += String.fromCharCode((v1 << 2 | v2 >>> 4) & 255);
        str += String.fromCharCode((v2 << 4 | v3 >>> 2) & 255);
      }
      return str;
    };

    utf8Base64Decode = function(base64Str) {
      var str = '';
      var bytes = decodeAsBytes(base64Str);
      var i = 0, length = bytes.length, followingChars = 0, b, c;
      while(i < length) {
        b = bytes[i++];
        if(b <= 0x7F) {
          str += String.fromCharCode(b);
          continue;
        } else if(b > 0xBF && b <= 0xDF) {
          c = b & 0x1F;
          followingChars = 1;
        } else if(b <= 0xEF) {
          c = b & 0x0F;
          followingChars = 2;
        } else if(b <= 0xF7) {
          c = b & 0x07;
          followingChars = 3;
        } else {
          throw 'not a UTF-8 string';
        }

        for(var j = 0;j < followingChars;++j) {
          b = bytes[i++];
          if (b < 0x80 || b > 0xBF) {
            throw 'not a UTF-8 string';
          }
          c <<= 6;
          c += b & 0x3F;
        }
        if (c >= 0xD800 && c <= 0xDFFF) {
          throw 'not a UTF-8 string';
        }
        if (c > 0x10FFFF) {
          throw 'not a UTF-8 string';
        }

        str += String.fromCharCode(c);
      }
      return str;
    };
  } else {
    utf8Base64Encode = function(str) {
      var result = '';
      for (var i=0;i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) {
          result += String.fromCharCode(charcode);
        }
        else if (charcode < 0x800) {
          result += String.fromCharCode(0xc0 | (charcode >> 6));
          result += String.fromCharCode(0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          result += String.fromCharCode(0xe0 | (charcode >> 12));
          result += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
          result += String.fromCharCode(0x80 | (charcode & 0x3f));
        }
        else {
          charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff))
          result += String.fromCharCode(0xf0 | (charcode >> 18));
          result += String.fromCharCode(0x80 | ((charcode >> 12) & 0x3f));
          result += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
          result += String.fromCharCode(0x80 | (charcode & 0x3f));
        }
      }
      return btoa(result);
    };

    utf8Base64Decode = function(base64Str) {
      var tmpStr = atob(base64Str.trim('=').replace(/-/g, '+').replace(/_/g, '/'));
      if(!/[^\x00-\x7F]/.test(tmpStr)) {
        return tmpStr;
      }
      var str = '';

      var i = 0, length = tmpStr.length, followingChars = 0, b, c;
      while(i < length) {
        b = tmpStr.charCodeAt(i++);
        if(b <= 0x7F) {
          str += String.fromCharCode(b);
          continue;
        } else if(b > 0xBF && b <= 0xDF) {
          c = b & 0x1F;
          followingChars = 1;
        } else if(b <= 0xEF) {
          c = b & 0x0F;
          followingChars = 2;
        } else if(b <= 0xF7) {
          c = b & 0x07;
          followingChars = 3;
        } else {
          throw 'not a UTF-8 string';
        }

        for(var j = 0;j < followingChars;++j) {
          b = tmpStr.charCodeAt(i++);
          if (b < 0x80 || b > 0xBF) {
            throw 'not a UTF-8 string';
          }
          c <<= 6;
          c += b & 0x3F;
        }
        if (c >= 0xD800 && c <= 0xDFFF) {
          throw 'not a UTF-8 string'; 
        }
        if (c > 0x10FFFF) {
          throw 'not a UTF-8 string';
        }

        str += String.fromCharCode(c);
      }
      return str;
    };
  }
  
  var encode = function(str, asciiOnly) {
    if(!asciiOnly && /[^\x00-\x7F]/.test(str)) {
      return utf8Base64Encode(str);
    } else {
      return btoa(str);
    }
  };

  var decode = function(base64Str, asciiOnly) {
    return asciiOnly ? atob(base64Str) : utf8Base64Decode(base64Str);
  };

  var exports = {
    encode: encode,
    decode: decode,
    encodeAsBytes: encodeAsBytes,
    decodeAsBytes: decodeAsBytes
  };

  if(typeof(module) != 'undefined') {
    module.exports = exports;
  } else if(root) {
    root.base64 = exports;
  }
}(this));
