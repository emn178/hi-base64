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

  /**
   * Decode base64 string to Uint8Array.
   *
   * @param base64Str The base64 string you want to decode.
   */
  uint8Array(base64Str: string): Uint8Array;
}

interface Codec {
  encode(str: StringOrBytes, asciiOnly?: boolean): string;
  decode: Decode;
}

interface CreateOptions {
  alphabet: string;
  padding?: boolean;
  lineLength?: number;
  lineSeparator?: string;
}

export function encode(str: StringOrBytes, asciiOnly?: boolean, format?: string): string;
export var decode: Decode;
export function create(options: CreateOptions): Codec;
export var rfc_4648: Codec;
export var rfc_4648_url_safe: Codec;
export var rfc_2045: Codec;
export var rfc_2152: Codec;
export var rfc_3501: Codec;
