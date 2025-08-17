# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.12] - 2024-08-17

### Breaking Changes

- **API Changes:**
  - `Asciitorium` class renamed to `App`
  - `bootstrap()` function replaced with `start()`
  - Removed `HorizontalLayout` and `VerticalLayout` classes

- **Layout System:**
  - Complete refactor from inheritance-based to strategy pattern
  - Layout behavior now handled through `LayoutStrategy` interface

### Added

- **New Components:**
  - `Box` component with gap and auto-sizing support
  - `PerfMonitor` component for performance monitoring and debugging

- **New Layout Strategies:**
  - `AbsoluteLayoutStrategy` for absolute positioning
  - `HorizontalLayoutStrategy` for horizontal layouts
  - `VerticalLayoutStrategy` for vertical layouts
  - `LayoutStrategy` interface for custom layout implementations

### Changed

- **Core Architecture:**
  - Enhanced `Component` base class with improved functionality
  - Better focus management and keyboard navigation
  - Streamlined application startup process
  - Enhanced utilities and helper functions

- **Developer Experience:**
  - Updated JSX configuration and imports
  - Improved documentation and examples
  - Better TypeScript definitions
  - Simplified bootstrap process

- **Templates (create-asciitorium):**
  - Updated generated projects to use new `start()` function
  - Modified imports to use `App` class instead of `Asciitorium`
  - Updated TypeScript and dependency configurations

### Technical Details

- **Files Changed:** 23 files
- **Lines Added:** +887
- **Lines Removed:** -333
- **Net Change:** +554 lines

### Migration Guide

To upgrade from 0.1.11 to 0.1.12:

1. **Update imports:**
   ```tsx
   // Before
   import { Asciitorium, bootstrap } from 'asciitorium';
   
   // After
   import { App } from 'asciitorium';
   ```

2. **Update JSX usage:**
   ```tsx
   // Before
   const app = <Asciitorium>...</Asciitorium>;
   
   // After
   const app = <App>...</App>;
   ```

3. **Update startup:**
   ```tsx
   // Before
   await bootstrap(app);
   
   // After
   await app.start();
   ```

4. **Layout updates:**
   - Layout components are now handled automatically
   - No need to import or use `HorizontalLayout`/`VerticalLayout` classes
   - Components use layout strategies internally

## [0.1.11] - Previous Release

Initial release with core framework functionality.