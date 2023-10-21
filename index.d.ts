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

export function encode(str: StringOrBytes, asciiOnly = false): string;
export var decode: Decode;;
