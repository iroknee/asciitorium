# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.42] - 2025-11-10

### Fixed

- **Cross-Platform Compatibility:**
  - Fixed `Text` component typewriter effect to work in both browser and Node.js environments
  - Replaced `window.setInterval` and `window.clearInterval` with `globalThis` equivalents for CLI compatibility
  - Resolved `ReferenceError: window is not defined` crash when using typewriter effect in terminal mode

### Technical Details

- **Key Files Modified:** Text.ts
- **Impact:** Typewriter effect now works correctly in both web and CLI modes
- **Architecture:** Improved environment-agnostic timer management

## [0.1.35] - 2025-11-02

### Added

- **Game Development Architecture:**
  - `GameWorld` class - Central game state coordinator for managing maps, legends, player state, and collision detection
  - `AssetManager` class - Asset loading and parsing system for maps, materials, sprites, and legends
  - Legend system - JSON-based tile metadata with properties: `kind`, `name`, `solid`, `tag`, `asset`
  - `SoundManager` class - Audio playback system for web environment with support for sound effects and ambient audio
  - Material assets with sound properties (`onEnter`, `onExit`, `ambient`)
  - `GridMovement` class - Refactored movement logic for grid-based navigation
  - Map generation and rendering features with fog of war support
  - `visible` property to legend entries for visibility checks in `MapView`

- **New Components:**
  - `FirstPersonView` - First-person perspective renderer with raycasting
  - `FirstPersonCompositor` - Material composition system for first-person views
  - `OptionGroup` - Component for better organization of selectable options
  - `DOMRenderer` - Class for rendering 2D arrays to HTML (renamed from internal renderer)
  - Enhanced `MapView` with `GameWorld` mode and legacy mode support

- **Documentation and Examples:**
  - Comprehensive documentation: `AlignmentBasics`, `ArtBasics`, `ComponentBasics`, `FontsBasics`, `KeybindingsBasics`, `MapsBasics`, `MaterialsBasics`, `NavigationBasics`, `SpritesBasics`, `TextBasics`
  - `GettingStarted` guide with improved navigation instructions
  - Documentation structure reorganized from examples to documentation
  - `ART-DESIGN-SPEC.md` - Comprehensive art asset design specification
  - Art README files for maps, materials, and sprites with usage guides
  - Style guide for documentation consistency

- **Art Assets:**
  - New materials: `bone.art`, `door-wooden.art`, `wall-brick.art`, `wall-wireframe.art`
  - New sprites: `asciitorium.art`, `balloon.art`, `beating-heart.art`, `component-icon.art`, `eyes.art`, `firework.art`, `heart.art`, `nav-basics.art`, `pyramid.art`, `welcome.art`
  - Pencil font character set (`pencil.art`)
  - Sound effects: `door-close.mp3`, `door-open.mp3`, `taps.mp3`
  - Map example with legend: `maps/example/map.art` and `maps/example/legend.json`

- **Build and Deploy:**
  - GitHub Actions workflow for deploying demos to GitHub Pages
  - Demo build script for automated builds
  - Alias configuration for JSX runtime in Vite config

### Changed

- **Component Architecture:**
  - **Breaking Change:** Removed `Tab` and `TabContainer` components
  - **Breaking Change:** Removed `MultiSelect` component
  - **Breaking Change:** Removed `font` prop from `App` component
  - `Text` component now supports arrays of content for multi-line text
  - Enhanced `Text` component with improved alignment logic and word wrapping
  - `Art` component refactored for improved loading handling and content parsing
  - `MapView` and `FirstPersonView` now support `GameWorld` integration
  - `Select` component API improvements for better consistency
  - Enhanced scrollable text focus indicator
  - Improved button shadow rendering with better visual consistency

- **Keyboard Input System:**
  - Implemented capture mode for keyboard input in components
  - Enhanced key handling with component-specific capture support
  - Improved `Keybind` registration handling and component destruction
  - Enhanced keybindings documentation with firework launch demonstration

- **Layout System:**
  - Improved layout handling for fixed children in `RowLayout` and `ColumnLayout`
  - Enhanced column layout space allocation and child sizing
  - Better layout positioning calculations
  - Updated alignment terminology throughout documentation

- **Rendering System:**
  - Fixed transparent character rendering logic
  - Added sprite transparency support
  - `TTYRenderer` improvements: adjusted terminal height calculation and screen clearing
  - Updated font-family in body and `#screen` for consistency (default: Courier New)

- **Asset Management:**
  - **Breaking Change:** Refactored to use `.art` file extension for all art assets (was `.txt`)
  - Asset loading system refactored for better performance
  - Material asset format enhanced with placement attributes and sound properties
  - Legend structure updated to support new metadata format
  - Materials now support `placement` attribute: "floor", "ceiling", "front-wall"

- **Developer Experience:**
  - Simplified layout in main component
  - Enhanced performance monitor toggle
  - Improved import statements with file extensions throughout codebase
  - Updated logo path in HTML template
  - Removed unused font files (PRNumber3, PrintChar21)
  - Updated favicon path
  - `.gitignore` updated to include `dist-demo`
  - Better documentation text for clarity across all guides

- **Examples Restructured:**
  - Converted examples to documentation structure
  - `GettingStartedDoc` and `ComponentsStatesDoc` for improved documentation
  - State change examples reorganized for clarity
  - Removed obsolete `MapViewExample` (integrated into documentation)
  - Enhanced `GameWorldExample` demonstrating new architecture

### Removed

- Tab-based components: `Tab`, `TabContainer` (replaced with documentation structure)
- `MultiSelect` component (consolidated functionality)
- `font` prop from `App` component (use default font family)
- Unused border art files: `bubbles.txt`, `dna.txt`
- Unused sprite files: `computer.txt`, `tatooene.txt`, `asciitorium.txt`
- Unused font files and licenses
- Obsolete documentation and example files
- Debug logging for legend loading and character detection

### Fixed

- Terminal height calculation in `TTYRenderer`
- Transparent character rendering logic
- ASCII art characters for 'm', 'w', and 'x'
- Layout handling for absolutely positioned children
- Z-coordinate handling in firework positioning
- Import path issues throughout codebase

### Technical Details

- **Key Files Modified:** Core architecture, component library, asset system, documentation structure, build configuration
- **Breaking Changes:**
  - Asset file extension changed from `.txt` to `.art`
  - Removed components: `Tab`, `TabContainer`, `MultiSelect`
  - Removed `font` prop from `App`
  - Material and legend format changes
- **New Architecture:** `GameWorld`-based game development pattern, asset management system, sound integration
- **Performance:** Enhanced rendering with transparency support, improved layout calculations, optimized asset loading
- **Lines Changed:** Extensive refactoring across ~80+ files with major documentation additions

## [0.1.34] - 2025-09-22

### Added

- **New Keybind System:**
  - `Keybind` component for declarative global keyboard shortcuts
  - App-level keybind registration and management system
  - Support for global keybinds that override component focus
  - Reactive enabling/disabling with `State<boolean>`
  - Auto-registration and cleanup with component lifecycle

- **Component Visibility System:**
  - Added `visible` property support for all components using `State<boolean>` for reactive show/hide functionality
  - Components with `visible={state}` automatically hide/show when state changes
  - Focus management automatically skips invisible components
  - Rendering optimizations skip invisible components for better performance

- **CDN Support:**
  - Added comprehensive CDN usage documentation for unpkg and jsDelivr
  - Zero-setup browser usage examples with ES module imports
  - Alternative CDN provider options documented

### Changed

- **Component Consolidation:**
  - **Breaking Change:** Replaced `HR` and `VR` components with unified `Line` component
  - `Line` component supports both horizontal and vertical orientations via `direction` prop
  - Updated all examples and documentation to use new `Line` component
  - Simplified line rendering with consistent API across orientations

- **API Improvements - Property Naming:**
  - **Breaking Change:** Renamed `at` property to `position` for better consistency with other component properties
  - **Breaking Change:** Removed deprecated properties: `fill`, `x`, `y`, `z`, `fixed`
  - `background` property replaces `fill` for component background styling
  - `position` property takes object `{ x?: number, y?: number, z?: number }` and automatically enables absolute positioning
  - Eliminated backward compatibility for cleaner, more intuitive API

- **Component Architecture:**
  - Simplified mergeStyles function without complex property precedence logic
  - Cleaner Component constructor using only current property names
  - Updated ComponentStyle and ComponentProps interfaces to remove deprecated properties
  - Enhanced modal example demonstrates new `position` and `background` properties

- **Text Component:**
  - Fixed multi-children processing to properly handle JSX expressions with multiple elements
  - Text components now correctly render complex expressions like `Modal visible: {state ? 'YES' : 'NO'}`

- **Focus Management:**
  - Enhanced reserved hotkey error handling with detailed error messages
  - Added visibility checks in focus navigation to skip hidden components
  - Keybind system integration with focus management

- **Navigation and Performance:**
  - Enhanced `PerfMonitor` functionality with improved metrics
  - Updated navigation instructions to remove deprecated WASD references
  - Improved component-specific focus indicators

### Technical Details

- **Key Files Modified:** Component.ts, types.ts, ModalExample.tsx, README.md, App.ts, FocusManager.ts, Line.ts, Keybind.ts, PerfMonitor.ts
- **Breaking Changes:**
  - Property renaming: `at` → `position`, `fill` → `background`
  - Component consolidation: `HR` and `VR` → `Line` with `direction` prop
  - Removed deprecated properties: `x`, `y`, `z`, `fixed`
  - No backward compatibility - clean API transition
- **New Features:** Declarative keybind system, reactive visibility system, CDN support, unified Line component
- **Architecture:** Cleaner interfaces, simplified property handling, better component organization, app-level keybind management

## [0.1.32] - 2025-09-18

### Changed

- **Focus Indicators:**
  - Simplified focus indicators to use only full block left border (`█`) for all components with borders
  - Removed filled square corners (`■`) from focus indicators for cleaner appearance
  - Updated Button component to use full block indicators (`█`) instead of `>` and `<` arrows
  - Updated TabContainer to use full block indicators (`█`) instead of `>` and `<` arrows for selected tabs
  - Enhanced Button focus indicators to span entire inner height and position at left/right edges

- **Component Visual Design:**
  - Standardized focus indication across all components for consistency
  - Improved Button focus visualization with edge-positioned full block indicators
  - Maintained clean single-line borders for unfocused components

### Technical Details

- **Key Files Modified:** Component.ts, Button.ts, TabContainer.ts, README.md, CLAUDE.md
- **Improvements:** Consistent focus indicator design, cleaner visual feedback, simplified border styling
- **Architecture:** Unified focus indication system across all bordered components

## [0.1.31] - 2025-09-16

### Changed

- **Component Architecture:**
  - Refactored component constructors to prioritize style properties for width, height, and border settings
  - Enhanced constructor organization across all components for improved style property handling
  - Streamlined property assignment logic in component base class

- **Package Updates:**
  - Updated packages for create-asciitorium template generation
  - Enhanced template dependencies and configuration

### Technical Details

- **Key Files Modified:** Component constructors, core Component class, create-asciitorium packages
- **Improvements:** Better style property prioritization, cleaner constructor patterns across components
- **Architecture:** Enhanced property handling in component initialization

## [0.1.30] - 2025-09-15

### Added

- **New Components:**
  - `Fragment` component for grouping child components without visual rendering
  - `Switch`, `Case`, and `Option` components for conditional rendering and selection logic
  - Conditional rendering capabilities with simplified dynamic component handling

### Changed

- **Renderer Improvements:**
  - **Breaking Change:** Renamed `DomRenderer` to `DOMRenderer` for naming consistency
  - Enhanced `TTYRenderer` with color formatting support for improved terminal output
  - Updated all imports and references to use new renderer naming

- **Component Architecture:**
  - Refactored conditional rendering from `ConditionalRenderer` to `Switch` component
  - Simplified dynamic component handling throughout the framework
  - Enhanced component exports and organization

- **Documentation:**
  - Updated README with simplified project description
  - Revised installation instructions for better clarity
  - Enhanced FIGlet examples and component descriptions
  - Improved clarity in installation and usage documentation

### Technical Details

- **Key Files Modified:** Renderer classes, conditional components, examples, documentation
- **Breaking Changes:**
  - `DomRenderer` renamed to `DOMRenderer` - update all imports
  - `ConditionalRenderer` replaced with `Switch` component - update usage patterns
- **New Features:** Fragment grouping, improved conditional rendering, enhanced terminal colors
- **Architecture:** Better component organization, simplified conditional logic

## [0.1.28] - 2025-09-11

### Changed

- **Component Refactoring:**
  - **Breaking Change:** Renamed `AsciiArt` component to `Art` for improved naming consistency
  - **Breaking Change:** Renamed `AsciiMaze` component to `Maze` for improved naming consistency
  - Updated all examples and main application to reflect new component names
  - Enhanced component constructors to support consolidated style properties

- **Code Quality and Structure:**
  - Refactored test files to improve structure and consistency
  - Updated component imports throughout examples and test cases
  - Enhanced test cases for better coverage and reliability
  - Improved layout handling in examples for better consistency

- **Application Improvements:**
  - Added initial render trigger in App for improved startup behavior
  - Removed unused imports and cleaned up codebase
  - Enhanced `FormExample` component with improved style handling and layout consistency

- **Performance and UX:**
  - Enhanced `Maze` component with async loading support for better performance
  - Updated styles for improved visual consistency across components
  - Improved layout handling and navigation instructions

### Technical Details

- **Key Files Modified:** Art/AsciiArt component, Maze/AsciiMaze component, examples, test files, main application
- **Breaking Changes:**
  - `AsciiArt` component renamed to `Art` - update all imports and references
  - `AsciiMaze` component renamed to `Maze` - update all imports and references
- **Architecture:** Better component naming consistency, improved style property handling
- **Code Quality:** Enhanced test structure, removed unused code, improved imports

## [0.1.27] - 2025-09-07

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
  - Enhanced layout system with improved positioning calculations
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
  - Comprehensive component examples: `ButtonExample`, `MultiSelectExample`, `ProgressBarExample`, `SelectExample`, `TabsExample`, `TextInputExample`
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
