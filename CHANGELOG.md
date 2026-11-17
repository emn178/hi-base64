# Change Log

## v0.6.0 / 2026-11-17
### Added
- Support ESM with `build/base64.mjs` and `build/base64.min.mjs`, and package `exports`.
- TypeScript declarations for `atob` and `btoa`.
- GitHub Actions CI across Node.js 20, 22, and 24 against the packed npm artifact.
- GitHub Actions publish workflow on release with npm trusted publishing and provenance.
- `prepack` script to build distributions before `npm pack` / `npm publish`.

### Fixed
- Unpaired UTF-16 surrogates in string input were encoded incorrectly and consumed the following code unit. They are now encoded as U+FFFD, matching `TextEncoder`.
- Truncated, overlong, and other ill-formed UTF-8 sequences could be decoded into wrong characters in browsers.
- `atob` returned trailing NUL characters for padded input in environments without native `atob`.
- Invalid parameter initializers in TypeScript declarations.
- Browsers with a `process` polyfill (e.g. BrowserFS) and Electron renderers were detected as Node.js and threw `global is not defined`.
- `ArrayBuffer` input was not recognized when the global object could not be detected.
- Encoding non-string input threw `ReferenceError` in environments without `ArrayBuffer`.

### Changed
- Decoding invalid UTF-8 in browsers now replaces ill-formed sequences with U+FFFD, matching `TextDecoder` and the Node.js implementation, instead of throwing an error.
- Use the global `Buffer` in Node.js instead of `require('buffer')`, and remove the `browser` field from package.json.
- Replace Travis CI with GitHub Actions.
- Update README badges to GitHub Actions, npm, and jsDelivr.
- Upgrade mocha, nyc and uglify-js, and override vulnerable transitive dev dependencies (glob, minimatch).

## v0.5.0 / 2026-07-08
### Added
- `base64.create(options)` for custom Base64 codecs.
- Built-in codec objects: `rfc_4648`, `rfc_4648_url_safe`, `rfc_2045`, `rfc_2152`, and `rfc_3501`.

## v0.4.1 / 2024-10-02
### Added
- build file

## v0.4.0 / 2024-10-02
### Added
- RFC 4648 URL Safe support
- RFC 2045 (MIME) support
- RFC 2152 (UTF-7) support
- RFC 3501 (IMAP) support
- decode as uint8Array

### Improved
- performance and refactor code.

## v0.3.1 / 2023-10-21
### Added
- WebWork support.
- ESM support.

### Fixed
- TypeScript interfaces.

## v0.3.0 / 2023-10-20
### Added
- TypeScript interfaces.
- Disable webpack polyfill.

### Improved
- performance in most cases.

### Fixed
- deprecated `new Buffer`, replace with `Buffer.from`.
- dependencies and security issues.
- decoding behavior to be the same with Node.js version.

### Changed
- throw error by Error oject.

## v0.2.1 / 2017-01-23
### Fixed
- ArrayBuffer dosen't work in Webpack.

## v0.2.0 / 2015-11-25
### Added
- support for bytes.
- support for AMD.
- missing dependencies to the package.json file.

### Changed
- devDependencies.
- Travis configuration.

## v0.1.3 / 2015-01-10
### Added
- coveralls.

### Fixed
- 4 bytes utf8 character bug.

### Improved
- test framework.

## v0.1.2 / 2015-01-02
### Added
- bower package.

### Fixed
- JSHint warnings.

## v0.1.1 / 2014-12-22
### Improved
- test methods.

## v0.1.0 / 2014-12-22
### Added
- Create project.
