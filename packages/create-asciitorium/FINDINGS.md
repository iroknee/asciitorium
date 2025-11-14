# ASCIITORIUM Reference Validation Findings

## Component Default Behavior Analysis

### Text Component

**Auto-sizing behavior:**

- ✅ Width: Auto-sizes to content when `width` is `undefined` (omitted)
- ✅ Height: Auto-sizes to wrapped content when `height` is `undefined` (omitted)
- ⚠️ `width="auto"` is valid but resolves to `undefined` (same as omitting it)
- Default: `width: undefined` (auto-sizes), `height: undefined` (auto-sizes)
- Default border: `false`

**Key insights:**

- Saying `width="auto"` is technically correct but confusing since omitting the prop does the same thing
- The reference should clarify that omitting width/height = auto-sizing
- `'auto'` is a valid TypeScript value but internally becomes `undefined`

### Button Component

**Auto-sizing behavior:**

- ❌ Button does NOT support true "auto" sizing
- Always calculates: `buttonText.length + 7` for width, `4` for height
- If user provides width/height, those are used instead
- Default: `width: buttonText.length + 7`, `height: 4`
- Default border: `true`

**Key insights:**

- Reference incorrectly implies Button supports `width="auto"`
- Button always has a calculated default, never truly "auto"
- Should document as "auto-calculates based on content" not "auto-sizes"

### Art Component

**Auto-sizing behavior:**

- ✅ Auto-sizes to loaded art dimensions when width/height omitted
- For fonts: initially shows "Loading..." then resizes when font loads
- For sprites: uses frame dimensions from parsed content
- Default: `width: undefined` (sizes to art), `height: undefined` (sizes to art)
- Default border: `false`

**Key insights:**

- Reference is correct about "auto" behavior
- Should clarify async nature of font/src loading

### Select Component

**Default behavior:**

- Default height: `3`
- Default border: `true`
- Width: `undefined` (auto-sizes or fills based on layout)

**Key insights:**

- Reference is correct

### TextInput Component

**Default behavior:**

- Default height: `3`
- Default border: `true`
- Width: `undefined` (typically needs explicit setting)
- ✅ Supports both `State<string>` AND `State<number>`

**Key insights:**

- Reference doesn't mention `State<number>` support
- Reference says default width is `20` but code shows `undefined`

### Row Component

**Default behavior:**

- Default width: `'fill'`
- Default height: `undefined` (auto-sizes to children)

**Key insights:**

- Reference is correct

### Column Component

**Default behavior:**

- Default width: `undefined` (auto-sizes to children)
- Default height: `undefined` (auto-sizes to children)

**Key insights:**

- Reference says `width: 'fill'` as default - INCORRECT
- Column intentionally omits width default to let it size to children

### Keybind Component

**Default behavior:**

- Always invisible (0x0, visible=false)
- Supports `State<boolean>` for disabled prop
- Priority default: `0`

**Key insights:**

- Reference is correct

## Prop Default Discrepancies

| Component | Prop     | Reference Says | Actual Default          | Issue                          |
| --------- | -------- | -------------- | ----------------------- | ------------------------------ |
| Text      | `width`  | `'auto'`       | `undefined`             | Confusing - same result        |
| Text      | `height` | `'auto'`       | `undefined`             | Confusing - same result        |
| Text      | `border` | -              | `false`                 | Missing                        |
| Button    | `width`  | `auto`         | `buttonText.length + 7` | Incorrect                      |
| Button    | `height` | -              | `4`                     | Missing                        |
| Art       | `width`  | `'auto'`       | `undefined`             | Confusing - same result        |
| Art       | `height` | `'auto'`       | `undefined`             | Confusing - same result        |
| TextInput | `width`  | -              | `undefined`             | Missing (reference implies 20) |
| TextInput | `height` | -              | `3`                     | Missing                        |
| Column    | `width`  | `'fill'`       | `undefined`             | WRONG                          |

## SizeValue Type Clarification

From `types.ts` and `sizeUtils.ts`:

```typescript
type SizeValue = number | `${number}%` | 'auto' | 'fill';
```

**Resolution behavior:**

- `number` → exact size
- `"50%"` → 50% of parent
- `'fill'` → fill available space
- `'auto'` → returns `undefined`, component handles auto-sizing
- `undefined` → same as `'auto'`

**Recommendation:**

- Reference should use `undefined` / omitted prop instead of `"auto"`
- Or clarify that `"auto"` and omitted are equivalent
- "auto" is more explicit but adds no functionality

## Common Mistakes Validation

Need to test:

- ❌ `width="auto"` - Actually valid, just unnecessary
- ❌ Using `\n` for newlines - Need to verify `¶` works
- ❌ State directly in Text - Need to verify State is auto-resolved
- ❌ onClick with event parameter - Verify no parameter is passed
- ❌ Using React's useState - Obviously wrong, but document anyway

## Testing Recommendations

Create `reference-validation.tsx` with sections:

1. **Size Behavior Tests** - width/height with different values
2. **Text Newline Tests** - `\n` vs `¶`
3. **State Reactivity Tests** - State updates, subscriptions
4. **Button Auto-sizing Tests** - Verify calculated sizing
5. **Keybind Tests** - keyBinding formats, disabled state
6. **Select Tests** - Option children, OptionGroup
7. **TextInput Tests** - String vs number state

## Required Reference Updates

1. **Clarify "auto" vs undefined:**

   ```markdown
   width={40} // Fixed width
   // Omit width prop for auto-sizing (or use width="auto", equivalent)
   ```

2. **Fix Button defaults:**

   ```markdown
   | `width` | `number` | `content.length + 7` | Auto-calculated from content |
   ```

3. **Fix Column width default:**

   ```markdown
   | `width` | `number \| 'fill'` | `undefined` | Auto-sizes to children |
   ```

4. **Add TextInput number support:**

   ```tsx
   const count = new State(0);
   <TextInput value={count} numeric={true} />;
   ```

5. **Clarify Text border default:**

   ```markdown
   | `border` | `boolean` | `false` | Show border |
   ```

6. **Clarify TextInput width:**
   ```markdown
   | `width` | `number` | `undefined` | Component width (often needs explicit setting) |
   ```
