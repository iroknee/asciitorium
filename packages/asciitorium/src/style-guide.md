# Asciitorium Documentation Style Guide

## 1. Overview

Asciitorium uses a **single mono font** across all documentation — both in the web and terminal renderers.  
This style guide recommends how to structure readable, expressive documents **without relying on font weight or size.**

The goals are:

- Maintain clarity and hierarchy using ASCII structure.
- Ensure visual consistency across all output environments.
- Keep documents easily parsable by both humans and tools.

---

## 2. Headings

Headings are created using **ASCII rulers**, not Markdown `#`.  
Each level has a distinct line pattern.

### 2.1 Heading Levels

``` txt
===========================  H1  ===========================
Optional subtitle line

-- H2 ------------------------------------------------------
```

### 2.2 Example

``` txt
============================= COMPONENTS =============================
Defines reusable elements in the Asciitorium UI.

__ BUTTON ____________________________________________________________
Simple clickable element.

- normal
- focused
- disabled
```

Each heading should be followed by a blank line.

---

## 3. Paragraphs

Paragraphs use a consistent **left alignment**

``` txt
  This is a paragraph. It should read comfortably in both terminal
  and browser <pre> environments. Keep lines short and separate
  paragraphs with a blank line.
```

Note: indent each paragraph by two spaces for clarity.

---

## 4. Lists

### 4.1 Bulleted Lists

``` txt
- Top-level item
  - Nested item
    - Deeper level
```

### 4.3 Property Lists

```
width:       number of columns (default: 80)
height:      number of rows (default: 24)
fullscreen:  expands to container bounds
```

---

## 5. Callouts (Admonitions)

Use **boxed callouts** to draw attention to notes, warnings, or tips.

``` txt
+------+-------------------------------------------------------------+
| NOTE |Asciitorium renders using <pre> blocks, so spacing and       |
|      |line length are significant.                                 |
+--------------------------------------------------------------------+
```

Labels can include:

- `NOTE`
- `TIP`
- `WARNING`
- `DEPRECATED`
- `EXPERIMENTAL`

Short inline form:

```
[NOTE] The width value cannot exceed 200.
```

---

## 6. Horizontal Rules

Use horizontal rules to separate major document sections:

```
------------------------------------------------------------------------
```

---

## 7. Code & Examples

Indent code by **4 spaces**, or use **triple backticks** for fenced blocks.

Indented example:

```
    const app = new Asciitorium();
    app.mount('#root');
```

Fenced example:

```

```

const app = new Asciitorium();
app.mount('#root');

```

```

Prefer indented style for terminal-readability.

---

## 8. Tables

Align columns using spaces or ASCII borders.  
Avoid Markdown pipes (`|`) unless needed for web-only docs.

```
+------------+------------+-----------------------+
| Option     | Default    | Description           |
+------------+------------+-----------------------+
| width      | 80         | Virtual screen cols   |
| height     | 24         | Virtual screen rows   |
| fullscreen | false      | Stretch to container  |
+------------+------------+-----------------------+
```

---

## 10. Inline Emphasis

Since bold and italics are unavailable, use ASCII-based emphasis:

| Method         | Example                 | Meaning             |
| -------------- | ----------------------- | ------------------- |
| Brackets       | `[experimental]`        | State or flag       |
| Quotes         | "virtual screen"        | Refer to a term     |
| Uppercase      | NOTE, WARNING           | Callout keyword     |
| Asterisks      | _important_             | Soft emphasis       |
| Equals         | =key term=              | Technical reference |
| Spaced letters | R E L E A S E N O T E S | Decorative banners  |

---

## 12. Metadata Blocks

Add optional metadata headers to the top of files for parsing and clarity.

```
:doc: Component API Reference
:version: 0.5
:status: stable
:updated: 2025-11-02
```

---

## 13. Status Badges

Plain-text status tags can be placed below titles or section headers.

```
[STABLE] [SYNC-SAFE] [PUBLIC API]
```

---

## 14. Anchors & Cross-References

Create internal anchors for cross-links.

```
[sec:component-layout]

See [sec:component-layout] for details.
```

---

## 15. Templates

### 15.1 Component Specification

```
=========================== COMPONENT SPEC ============================

-- NAME ---------------------------------------------------------------
ListBox

-- PURPOSE ------------------------------------------------------------
Displays selectable items in a scrollable view.

-- PROPERTIES ---------------------------------------------------------
width:   number  | default=80
height:  number  | default=24
selected: string | currently selected item ID

-- EVENTS -------------------------------------------------------------
onSelect(itemId): triggered when an item is chosen.

-- EXAMPLE ------------------------------------------------------------
    const list = new ListBox({ items });
    list.onSelect = (id) => console.log(id);
```
