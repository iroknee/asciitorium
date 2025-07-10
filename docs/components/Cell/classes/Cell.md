[**1974 v1.0.0**](../../README.md)

***

[1974](../../modules.md) / [Cell](../README.md) / Cell

# Class: Cell

Defined in: Cell.ts:24

Represents a single character cell in the ASCII UI grid.

## Constructors

### Constructor

> **new Cell**(`props`): `Cell`

Defined in: Cell.ts:45

Creates a new Cell instance.

#### Parameters

##### props

[`CellProps`](../interfaces/CellProps.md)

Configuration for the cell appearance and value.

#### Returns

`Cell`

#### Throws

Will throw an error if required props are invalid.

## Properties

### color

> **color**: `string`

Defined in: Cell.ts:33

The text or highlight color of the cell.

***

### highlight

> **highlight**: `boolean`

Defined in: Cell.ts:38

Whether the cell is highlighted.

***

### value

> **value**: `string`

Defined in: Cell.ts:28

The character or string value of the cell.

## Methods

### draw()

> **draw**(): `null` \| `string`

Defined in: Cell.ts:73

Renders the cell as an HTML string if necessary.

#### Returns

`null` \| `string`

The styled or raw string value, or null if the value is '@'.
