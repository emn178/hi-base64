type StringOrBytes = string | number[] | ArrayBuffer | Uint8Array;

interface Decode {
  /**
   * Decode base64 string to text.
   *
   * @param base64Str The base64 string you want to decode.
   * @param asciiOnly Decode string as ascii encoding string if true, or utf-8 encoding.
   */
  (base64Str: string, asciiOnly = false): string;

  /**
   * Decode base64 string to text.
   *
   * @param base64Str The base64 string you want to decode.
   * @param asciiOnly Decode string as ascii encoding string if true, or utf-8 encoding.
   */
  string(base64Str: string, asciiOnly = false): string;

  /**
   * Decode base64 string to int array.
   *
   * @param base64Str The base64 string you want to decode.
   */
  bytes(base64Str: string): number[];
}

interface Base64 {
  /**
   * Encode to base64 string
   *
   * @param str The input data you want to encode.
   * @param asciiOnly When input is ascii string, you can set it true to skip detection for better performanace.
   */
  encode(str: StringOrBytes, asciiOnly = false): string;

  /**
   * Return hash in hex string.
   */
  decode: Decode;
}

export var base64: Base64;
