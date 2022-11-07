# CHANGELOG

## 2.0.0

### Changed

- CHANGELOG format
- jest/ts configuration for `import.meta` support
- DOCS to only reference Node@12+

### Fixed

- Removed `getConfig` usage of `path.basename`
- Extend via `package.json` now passes `path.dirname`

### Breaking

- Uses [module.createRequire](https://nodejs.org/api/module.html#modulecreaterequirefilename) to
  support `require.resolve` and dynamic `require` calls (Node@12.2.0+)

---

## 1.0.0

### Added

- Initial Release
