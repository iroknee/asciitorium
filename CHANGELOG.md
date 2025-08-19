# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.17] - 2025-08-19

### Added

- **New Components:**
  - `MultiSelect` component for selecting multiple items from a list

### Changed

- **Enhanced Components:**
  - `Select` component refactored with improved focus handling and selection logic
  - `AsciiArt`, `Button`, and `Text` components now support JSX children
  - Improved keyboard handling: `handleKey` method now accepts `KeyboardEvent` parameter
  - Enhanced component positioning and display formatting

- **Component Refinements:**
  - `Select` component: adjusted paddingTop based on height for better visual alignment
  - `CelticBorder` component: made 'edge' property optional with enhanced alignment handling
  - Replaced `HorizontalLine` component with `HR` component for better consistency
  - Added `VR` component for decorative vertical dividers

- **Developer Experience:**
  - Updated demo applications for consistent formatting and better component showcasing
  - Improved keyboard event handling throughout the framework
  - Enhanced documentation and component examples

### Technical Details

- **Key Files Modified:** Core components, demo applications, keyboard handling system
- **Improvements:** Better component flexibility with JSX children support, enhanced keyboard navigation, improved visual consistency

## [0.1.16] - 2025-08-18

### Added

- **New Layout Strategy:**
  - `RelaxedLayout` - A new layout strategy for more flexible component positioning

### Changed

- **Component Updates:**
  - Replaced `ListBox` component with `Select` component for improved usability
  - Enhanced `CelticBorder` component with refactored implementation
  - Improved `AsciiArt` component functionality
  - Updated `Box`, `PerfMonitor`, and core layout components

- **Developer Experience:**
  - Updated README files with better documentation
  - Enhanced FIGlet support and art generation scripts
  - Streamlined project structure by removing test layout script
  - Updated package configurations and dependencies

- **Layout System:**
  - Refactored layout strategies for better performance and flexibility
  - Enhanced `App` class with improved layout handling
  - Updated component utilities and helper functions

### Removed

- Removed `test-layout.mjs` script to streamline project structure
- Cleaned up unused `ListBox` component in favor of `Select`

### Technical Details

- **Key Files Modified:** Core layout system, component library, documentation
- **Breaking Changes:** `ListBox` component removed - use `Select` instead
- **Improvements:** Better layout flexibility, enhanced component functionality

## [0.1.13] - 2024-08-17

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