# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No changes yet.

## [0.1.1] - 2026-03-02

### Fixed

- Demo workspace dependency and imports now use `@ateliercartographie/motif.js`, fixing GitHub Actions install failure on demo deployment.
- GitHub Release install snippet now uses `npm install @ateliercartographie/motif.js` to avoid invalid version syntax from `v`-prefixed tags.

## [0.1.0] - 2026-03-02

### Added

- Initial release
- Core pattern generation functionality
- SVG and Canvas support
- TypeScript type definitions
