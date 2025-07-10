[**1974 v1.0.0**](../../README.md)

***

[1974](../../modules.md) / [Component](../README.md) / Component

# Class: Component

Defined in: Component.ts:73

Represents a rectangular ASCII UI component.

## Constructors

### Constructor

> **new Component**(`props`): `Component`

Defined in: Component.ts:102

Creates a new Component instance.

#### Parameters

##### props

`ComponentProps`

Configuration for the component.

#### Returns

`Component`

#### Throws

Will throw an error if required props are invalid.

## Properties

### border

> **border**: `boolean`

Defined in: Component.ts:83

Whether the component has a border.

***

### canvas

> **canvas**: [`Cell`](../../Cell/classes/Cell.md)[][] = `[]`

Defined in: Component.ts:89

The 2D grid of cells representing the component.

***

### children

> **children**: `ComponentChild`[] = `[]`

Defined in: Component.ts:91

The child components of this component.

***

### edge

> **edge**: `number` = `0`

Defined in: Component.ts:87

The edge padding for the component.

***

### fill

> **fill**: `string`

Defined in: Component.ts:81

The fill character for the component.

***

### height

> **height**: `number`

Defined in: Component.ts:79

The height of the component.

***

### id

> **id**: `string`

Defined in: Component.ts:75

Unique identifier for the component.

***

### parent

> **parent**: `null` \| `Component` = `null`

Defined in: Component.ts:93

The parent component, if any.

***

### updated

> **updated**: `boolean` = `true`

Defined in: Component.ts:95

Whether the component has been updated.

***

### width

> **width**: `number`

Defined in: Component.ts:77

The width of the component.

***

### zIndex

> **zIndex**: `number`

Defined in: Component.ts:85

The z-index of the component for layering.

## Methods

### add()

> **add**(`props`): `void`

Defined in: Component.ts:126

Adds a new element to the component.

#### Parameters

##### props

`any`

Configuration for the element to add.

#### Returns

`void`

#### Throws

Will throw an error if props are invalid.

***

### clear()

> **clear**(): `void`

Defined in: Component.ts:164

Clears the component, removing all children and resetting the canvas.

#### Returns

`void`

***

### draw()

> **draw**(): `string`

Defined in: Component.ts:400

Renders the component as a string.

#### Returns

`string`

The rendered ASCII representation of the component.

***

### getComponent()

> **getComponent**(`id`): `null` \| `Component`

Defined in: Component.ts:156

Retrieves a child component by its ID.

#### Parameters

##### id

`string`

The ID of the child component to retrieve.

#### Returns

`null` \| `Component`

The child component, or null if not found.

***

### removeComponent()

> **removeComponent**(`id`): `void`

Defined in: Component.ts:143

Removes a child component by its ID.

#### Parameters

##### id

`string`

The ID of the child component to remove.

#### Returns

`void`
