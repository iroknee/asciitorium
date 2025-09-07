# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Component Improvements:**
  - Enhanced `Tab` component by defining label property for better type safety and clarity
  - Refactored `Tab` and `Text` components for improved clarity and consistency  
  - Updated `TabsExample` to enhance content presentation and remove deprecated properties
  - Refactored `Tabs` component into separate `Tab` and `TabContainer` components for improved structure

- **Code Quality:**
  - Removed debug logging from `Text` and `TerminalRenderer` components for cleaner code
  - Refactored component examples to improve layout handling and remove unnecessary properties
  - Updated `FormExample` layout by removing unnecessary gap properties for improved UI consistency
  - Enhanced `Row` and `RowLayout` components for improved alignment handling and code clarity
  - Fixed comment for height default in `TextInput` constructor for clarity

- **Example Updates:**
  - Added `FormExample` to demonstrate form layouts and validation
  - Updated examples to include new `FormExample` component
  - Removed `TextInputExample` in favor of consolidated examples

### Technical Details

- **Key Files Modified:** Tab/Tabs components, Text component, TerminalRenderer, examples
- **Architecture:** Better component separation with Tab/TabContainer pattern
- **Code Quality:** Removed debug logging, improved comments and consistency

## [0.1.26] - 2025-09-01

### Added

- **New Components:**
  - `AsciiMaze` component for rendering and navigating ASCII-based mazes with collision detection and fog of war support
  - `onEnter` callback support for `TextInput` component to handle Enter key press events
  - Maze builder script (`scripts/maze-builder.js`) for generating maze files
  - FIGlet art generation script (`scripts/gen-figlet-art.js`)

### Changed

- **Component Enhancements:**
  - **Breaking Change:** Renamed size value `'fit'` to `'fill'` throughout framework for better semantic clarity
  - Enhanced `AsciiArt` component with `State<string>` support for dynamic content
  - Improved `ColumnLayout` space allocation to properly account for all remaining components when using `height="fill"`
  - Fixed `Select` and `MultiSelect` component alignment and selection behavior
  - Enhanced `Tabs` component with improved layout and styling
  - Updated `CelticBorder` component with better rendering and fixed edge cases
  - Improved `TextInput` component with better focus handling

- **JSX Runtime Improvements:**
  - Added implicit component function support for more flexible JSX usage
  - Streamlined JSX type definitions for better TypeScript integration
  - Enhanced component instantiation logic

- **Layout System:**
  - Enhanced `AlignedLayout` with improved positioning calculations
  - Better space allocation algorithms in column layouts

### Technical Details

- **Key Files Modified:** Core components, JSX runtime, layout system, examples
- **Breaking Changes:** 
  - Size value `'fit'` renamed to `'fill'` - update all references
- **New Features:** Maze navigation with collision detection, Enter key handling in text inputs
- **Architecture:** Enhanced JSX runtime flexibility, improved layout calculations

## [0.1.23] - 2025-08-25

### Fixed

- **Build System:**
  - Fixed missing exports for `setupKeyboardHandling` and `validateWebEnvironment` functions in utils module
  - Resolved CLI runtime error: "The requested module './utils' does not provide an export named 'setupKeyboardHandling'"
  - Ensured all utility functions are properly exported in the built distribution files

### Technical Details

- **Issue Resolution:** Corrected build output to include all necessary exports from core/utils module
- **Affected Components:** CLI applications using `npm create asciitorium@latest`
- **Impact:** CLI applications can now run without import errors

## [0.1.22] - 2025-08-25

### Added

- **New Components:**
  - `Row` component for horizontal layout management
  - `Column` component for vertical layout management
  - Size utility functions for percentage-based sizing and context resolution

### Changed

- **Component Architecture:**
  - **Breaking Change:** Removed fixed width and height properties from multiple components
  - Introduced relative sizing options for dynamic component resizing
  - Enhanced layout handling for dynamic resizing in `App` and `Renderer` classes
  - Updated examples to demonstrate new sizing capabilities

- **Visual Improvements:**
  - Updated font family to JetBrains Mono in CSS and DOM renderer for consistency
  - Enhanced visual consistency across web and CLI environments

- **Architecture Improvements:**
  - Refactored `start` function moved to utils with updated import for render callback
  - Improved code organization and module structure

- **Documentation:**
  - Updated CLAUDE.md for improved command clarity and architecture details
  - Enhanced project documentation with better technical specifications

### Technical Details

- **Key Files Modified:** Core component architecture, sizing system, font rendering, utility functions
- **Breaking Changes:**
  - Fixed width/height properties removed from components - use relative sizing instead
- **Performance:** Enhanced dynamic resizing capabilities and improved layout calculations
- **Architecture:** Better separation of concerns with utility-based sizing system

## [0.1.21] - 2025-08-24

### Added

- **New Components:**
  - `CelticBorder` component with rotation functionality and `CelticBorderExample` for demonstration
  - Multiple slider variants: `ProgressBarSlider`, `GaugeSlider`, `DotSlider`, `VerticalSlider`
  - `SlidersExample` showcasing all slider components
  - New ASCII art borders for bubbles, celtic, and DNA designs

- **New Architecture:**
  - `SliderBase` abstract class for consolidated slider logic
  - Enhanced examples index with better component organization
  - Multiple entry points support in Vite configuration

### Changed

- **Component Enhancements:**
  - Refactored all slider components to extend from `SliderBase` class for better code reuse
  - Enhanced `Select` component with underlining for selected dropdown items and improved line height calculations
  - Updated prefix indicators: `MultiSelect` and `Select` now use '>' for focused items
  - Improved `Button` component label positioning and alignment
  - Simplified `TextInput` focus indicator by removing unnecessary characters

- **Architecture Improvements:**
  - **Breaking Change:** Refactored layout terminology from 'horizontal/vertical' to 'row/column' for consistency
  - **Breaking Change:** Replaced `Box` component with enhanced `Component` base class
  - Consolidated auto-sizing logic into `Component` class
  - Enhanced dynamic content support across components

- **Documentation and Examples:**
  - Updated README to reflect component changes (Box → Component)
  - Enhanced slider documentation with comprehensive examples
  - Improved component width alignment across examples
  - Better text alignment in slider examples
  - Adjusted main app layout dimensions for improved component display

### Removed

- `ProgressBarExample` component (consolidated into `SlidersExample`)
- Redundant `Box` component functionality (moved to `Component` base class)

### Technical Details

- **Key Files Modified:** Core component architecture, slider system, layout terminology, examples
- **Breaking Changes:** 
  - Layout props changed from `horizontal/vertical` to `row/column`
  - `Box` component removed - use `Component` base class instead
- **Performance:** Better code reuse through `SliderBase` abstraction
- **Architecture:** Enhanced component hierarchy and consolidated functionality

## [0.1.20] - 2025-08-21

### Added

- **New Components and Examples:**
  - `AsciiArtExample` component with ASCII art rendering
  - Comprehensive component examples: `ButtonExample`, `MultiSelectExample`, `ProgressBarExample`, `SelectExample`, `TabsExample`,  `TextInputExample`
  - `LayoutExample` demonstrating layout functionality
  - `PersistentState` utility for component selection persistence
  - Gap resolution utility (`gapUtils`) for consistent layout spacing

- **New ASCII Art Assets:**
  - Computer ASCII art added to both core and template packages

### Changed

- **Component Enhancements:**
  - `Button` component: Reduced press delay from 250ms to 100ms for improved responsiveness
  - `Button` component: Enhanced with press effect and improved dimensions
  - `TextInput` component: Updated focus prefix for better visual feedback
  - `Text` component: Implemented automatic word wrapping functionality
  - Multiple components refactored for improved readability and consistency

- **Layout System Improvements:**
  - Refactored layout components to utilize new gap resolution utility
  - Enhanced `Box`, `HorizontalLayout`, `VerticalLayout` components with consistent gap handling
  - Simplified `RelaxedLayout` implementation

- **Developer Experience:**
  - Demo application restructured: renamed `demo.tsx` to `main.tsx`
  - Enhanced component examples with improved layouts and functionality
  - Updated README documentation and package.json for release script consistency
  - Improved template generation with comprehensive examples

- **Visual and UX Improvements:**
  - Enhanced MultiSelectExample with dynamic selection display
  - Better click count display in ButtonExample
  - Improved component imports and dimension adjustments across examples
  - Enhanced focus handling and keyboard navigation

### Technical Details

- **Key Files Modified:** Component library, layout system, demo applications, template generation
- **New Utilities:** Gap resolution system, persistent state management
- **Performance:** Reduced button interaction latency, optimized layout calculations
- **Architecture:** Better separation of concerns in layout handling

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