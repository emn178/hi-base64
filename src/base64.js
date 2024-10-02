/*
 * [hi-base64]{@link https://github.com/emn178/hi-base64}
 *
 * @version 0.4.1
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2023
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var ENCODING_ERROR = 'not a UTF-8 string';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.HI_BASE64_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.HI_BASE64_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.HI_BASE64_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var BASE64_ENCODE_CHAR_BASIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var BASE64_ENCODE_CHAR_STANDARD = (BASE64_ENCODE_CHAR_BASIC + '+/').split('');
  var BASE64_ENCODE_CHAR_URL_SAFE = (BASE64_ENCODE_CHAR_BASIC + '-_').split('');
  var BASE64_ENCODE_CHAR_IMAP = (BASE64_ENCODE_CHAR_BASIC + '+,').split('');
  var BASE64_ENCODE_CHAR = {
    rfc_4648_url_safe: BASE64_ENCODE_CHAR_URL_SAFE,
    rfc_3501: BASE64_ENCODE_CHAR_IMAP
  };
  var PADDING = {
    rfc_4648: true,
    rfc_4648_url_safe: true,
    rfc_2045: true
  };

  var BASE64_DECODE_CHAR = {};
  for (var i  = 0; i < 64; ++i) {
    BASE64_DECODE_CHAR[BASE64_ENCODE_CHAR_STANDARD[i]] = i;
  }
  BASE64_DECODE_CHAR['-'] = 62;
  BASE64_DECODE_CHAR['_'] = 63;
  BASE64_DECODE_CHAR[','] = 63;

  var BATCH_SIZE = 10000;

  var cleanBase64Str = function (base64Str) {
    return base64Str.split('=')[0].replace(/[\r\n]/g, '');
  };

  var cleanBase64Str2 = function (base64Str) {
    return base64Str.replace(/_/g, '/').replace(/-/g, '+').replace(/,/g, '/');
  };

  var chunkStr = function (str, size) {
    var numChunks = Math.ceil(str.length / size);
    var chunks = new Array(numChunks);
    for (var i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size);
    }
    return chunks;
  };

  var getFormatInfo = function (format) {
    if (format === undefined) {
      format = 'rfc_4648';
    }
    return [BASE64_ENCODE_CHAR[format] || BASE64_ENCODE_CHAR_STANDARD, PADDING[format], format === 'rfc_2045'];
  };

  var convertFormat = function (base64Str, format) {
    switch (format) {
      // URL Safe
      case 'rfc_4648_url_safe':
        return base64Str.replace(/\//g, '_').replace(/\+/g, '-');
      // MIME
      case 'rfc_2045':
        return chunkStr(base64Str, 76).join('\r\n');
      // UTF-7
      case 'rfc_2152':
        return base64Str.replace(/=/g, '');
      // IMAP
      case 'rfc_3501':
        return base64Str.replace(/\//g, ',').replace(/=/g, '');
      default:
        return base64Str;
    }
  };

  var utf8ToBytes = function (str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 0x80) {
        bytes[bytes.length] = c;
      } else if (c < 0x800) {
        bytes[bytes.length] = 0xc0 | (c >> 6);
        bytes[bytes.length] = 0x80 | (c & 0x3f);
      } else if (c < 0xd800 || c >= 0xe000) {
        bytes[bytes.length] = 0xe0 | (c >> 12);
        bytes[bytes.length] = 0x80 | ((c >> 6) & 0x3f);
        bytes[bytes.length] = 0x80 | (c & 0x3f);
      } else {
        c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
        bytes[bytes.length] = 0xf0 | (c >> 18);
        bytes[bytes.length] = 0x80 | ((c >> 12) & 0x3f);
        bytes[bytes.length] = 0x80 | ((c >> 6) & 0x3f);
        bytes[bytes.length] = 0x80 | (c & 0x3f);
      }
    }
    return bytes;
  };

  var bytesToUtf8 = function (bytes) {
    var utf8Bytes = [], length = bytes.length;
    var i = 0, followingChars = 0, b, c;
    while (i < length) {
      b = bytes[i++];
      if (b <= 0x7F) {
        utf8Bytes.push(b);
        continue;
      } else if (b > 0xBF && b <= 0xDF) {
        c = b & 0x1F;
        followingChars = 1;
      } else if (b <= 0xEF) {
        c = b & 0x0F;
        followingChars = 2;
      } else if (b <= 0xF7) {
        c = b & 0x07;
        followingChars = 3;
      } else {
        throw new Error(ENCODING_ERROR);
      }

      for (var j = 0; j < followingChars; ++j) {
        b = bytes[i++];
        if (b < 0x80 || b > 0xBF) {
          throw new Error(ENCODING_ERROR);
        }
        c <<= 6;
        c += b & 0x3F;
      }
      if (c >= 0xD800 && c <= 0xDFFF) {
        throw new Error(ENCODING_ERROR);
      }
      if (c > 0x10FFFF) {
        throw new Error(ENCODING_ERROR);
      }

      if (c <= 0xFFFF) {
        utf8Bytes.push(c);
      } else {
        c -= 0x10000;
        utf8Bytes.push((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
      }
    }
    return bytesToString(utf8Bytes);
  };

  var bytesToString = function (bytes) {
    var result = [];
    var batchCount = Math.ceil(bytes.length / BATCH_SIZE);
    for (var i = 0; i < batchCount; i++) {
      result.push(String.fromCharCode.apply(null, bytes.slice(i * BATCH_SIZE, Math.min((i + 1) * BATCH_SIZE, bytes.length))));
    }
    return result.join('');
  };

  var binaryStringToBytes = function (str, BytesClass) {
    var bytes = new BytesClass(str.length);
    for (var i = 0; i < str.length; ++i) {
      bytes[i] = str.charCodeAt(i);
    }
    return bytes;
  };

  var decodeAsBytesBase = function (base64Str, BytesClass) {
    return binaryStringToBytes(atob(cleanBase64Str2(cleanBase64Str(base64Str))), BytesClass);
  };

  var decodeAsBytes = function (base64Str) {
    return decodeAsBytesBase(base64Str, Array);
  };

  var decodeAsUint8Array = function (base64Str) {
    return decodeAsBytesBase(base64Str, Uint8Array);
  };

  var btoa = root.btoa, atob = root.atob, utf8Base64Encode, utf8Base64Decode, encodeFromBytes;
  if (NODE_JS) {
    var Buffer = require('buffer').Buffer;
    btoa = function (str) {
      return Buffer.from(str, 'binary').toString('base64');
    };

    utf8Base64Encode = function (str, format) {
      return convertFormat(Buffer.from(str).toString('base64'), format);
    };

    encodeFromBytes = utf8Base64Encode;

    atob = function (base64Str) {
      return Buffer.from(base64Str, 'base64').toString('binary');
    };

    utf8Base64Decode = function (base64Str) {
      return Buffer.from(cleanBase64Str2(base64Str), 'base64').toString();
    };
  } else if (!btoa) {
    btoa = function (str) {
      var v1, v2, v3, i = 0, j = 0, length = str.length, remainder = length % 3;
      var base64Str = new Array(Math.ceil(length / 3) << 2);
      length -= remainder;
      while (i < length) {
        v1 = str.charCodeAt(i++);
        v2 = str.charCodeAt(i++);
        v3 = str.charCodeAt(i++);
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[v1 >>> 2];
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[(v1 << 4 | v2 >>> 4) & 63];
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[(v2 << 2 | v3 >>> 6) & 63];
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[v3 & 63];
      }

      // remain char
      if (remainder === 1) {
        v1 = str.charCodeAt(i);
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[v1 >>> 2];
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[(v1 << 4) & 63];
        base64Str[j++] = '==';
      } else if (remainder === 2) {
        v1 = str.charCodeAt(i++);
        v2 = str.charCodeAt(i);
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[v1 >>> 2];
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[(v1 << 4 | v2 >>> 4) & 63];
        base64Str[j++] = BASE64_ENCODE_CHAR_STANDARD[(v2 << 2) & 63];
        base64Str[j++] = '=';
      }
      return base64Str.join('');
    };

    utf8Base64Encode = function (str, format) {
      return encodeFromBytes(utf8ToBytes(str), format);
    };

    encodeFromBytes = function (bytes, format) {
      var info = getFormatInfo(format);
      var v1, v2, v3, i = 0, j = 0, length = bytes.length, remainder = length % 3, chars = info[0], padding = info[1], chunk = info[2];
      var base64Str = new Array(Math.ceil(length / 3) << 2);
      length -= remainder;
      while (i < length) {
        v1 = bytes[i++];
        v2 = bytes[i++];
        v3 = bytes[i++];
        base64Str[j++] = chars[v1 >>> 2];
        base64Str[j++] = chars[(v1 << 4 | v2 >>> 4) & 63];
        base64Str[j++] = chars[(v2 << 2 | v3 >>> 6) & 63];
        base64Str[j++] = chars[v3 & 63];
      }

      // remain char
      if (remainder === 1) {
        v1 = bytes[i];
        base64Str[j++] = chars[v1 >>> 2];
        base64Str[j++] = chars[(v1 << 4) & 63];
        if (padding) {
          base64Str[j++] = '=='
        }
      } else if (remainder === 2) {
        v1 = bytes[i++];
        v2 = bytes[i];
        base64Str[j++] = chars[v1 >>> 2];
        base64Str[j++] = chars[(v1 << 4 | v2 >>> 4) & 63];
        base64Str[j++] = chars[(v2 << 2) & 63];
        if (padding) {
          base64Str[j++] = '='
        }
      }
      base64Str = base64Str.join('');
      if (chunk) {
        base64Str = chunkStr(base64Str, 76).join('\r\n');
      }
      return base64Str;
    };

    atob = function (base64Str) {
      var v1, v2, v3, v4, i = 0, j = 0, length = base64Str.length, j = 0, remainder = length % 4;
      var bytes = new Array((length >>> 2) * 3 + (remainder && (remainder - 1)));
      length -= remainder;
      // 4 char to 3 bytes
      while (i < length) {
        v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v3 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v4 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        bytes[j++] = (v1 << 2 | v2 >>> 4) & 255;
        bytes[j++] = (v2 << 4 | v3 >>> 2) & 255;
        bytes[j++] = (v3 << 6 | v4) & 255;
      }

      // remain bytes
      if (remainder === 2) {
        v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        bytes[j++] = (v1 << 2 | v2 >>> 4) & 255;
      } else if (remainder === 3) {
        v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v3 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        bytes[j++] = (v1 << 2 | v2 >>> 4) & 255
        bytes[j++] = (v2 << 4 | v3 >>> 2) & 255;
      }
      return bytesToString(bytes);
    };

    utf8Base64Decode = function (base64Str) {
      return bytesToUtf8(decodeAsBytesBase(base64Str, Array, true));
    };

    decodeAsBytesBase = function (base64Str, BytesClass, cleaned) {
      if (!cleaned) {
        base64Str = cleanBase64Str(base64Str);
      }
      var v1, v2, v3, v4, i = 0, j = 0, length = base64Str.length, remainder = length % 4;
      var bytes = new BytesClass((length >>> 2) * 3 + (remainder && (remainder - 1)));
      length -= remainder;
      // 4 char to 3 bytes
      while (i < length) {
        v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v3 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v4 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        bytes[j++] = (v1 << 2 | v2 >>> 4) & 255;
        bytes[j++] = (v2 << 4 | v3 >>> 2) & 255;
        bytes[j++] = (v3 << 6 | v4) & 255;
      }

      // remain bytes
      if (remainder === 2) {
        v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        bytes[j++] = (v1 << 2 | v2 >>> 4) & 255;
      } else if (remainder === 3) {
        v1 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v2 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        v3 = BASE64_DECODE_CHAR[base64Str.charAt(i++)];
        bytes[j++] = (v1 << 2 | v2 >>> 4) & 255;
        bytes[j++] = (v2 << 4 | v3 >>> 2) & 255;
      }
      return bytes;
    };
  } else {
    utf8Base64Encode = function (str, format) {
      return convertFormat(btoa(bytesToString(utf8ToBytes(str))), format);
    };

    utf8Base64Decode = function (base64Str) {
      var tmpStr = atob(cleanBase64Str2(base64Str));
      if (!/[^\x00-\x7F]/.test(tmpStr)) {
        return tmpStr;
      }
      return bytesToUtf8(binaryStringToBytes(tmpStr, Array));
    };

    encodeFromBytes = function (bytes, format) {
      return convertFormat(btoa(bytesToString(bytes)), format);
    };
  }

  var encode = function (str, asciiOnly, format) {
    var notString = typeof(str) != 'string';
    if (notString && str.constructor === root.ArrayBuffer) {
      str = new Uint8Array(str);
    }
    if (notString) {
      return encodeFromBytes(str, format);
    } else {
      if (!asciiOnly && /[^\x00-\x7F]/.test(str)) {
        return utf8Base64Encode(str, format);
      } else {
        return convertFormat(btoa(str), format);
      }
    }
  };

  var decode = function (base64Str, asciiOnly) {
    base64Str = cleanBase64Str(base64Str);
    return asciiOnly ? atob(cleanBase64Str2(base64Str)) : utf8Base64Decode(base64Str);
  };

  var exports = {};
  exports.encode = encode;
  exports.decode = decode;
  exports.atob = atob;
  exports.btoa = btoa;
  decode.bytes = decodeAsBytes;
  decode.uint8Array = decodeAsUint8Array;
  decode.string = decode;

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.base64 = exports;
    if(AMD) {
      define(function() {
        return exports;
      });
    }
  }
})();
