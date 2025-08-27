# Zappicon Vue

[![npm version](https://badge.fury.io/js/%40zappicon%2Fvue.svg)](https://badge.fury.io/js/%40zappicon%2Fvue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://zappicon.com/license)

Free & premium UI icons library, crafted to simplify workflows for designers, developers and creators.

- 11,00+ Free icons (220+ Icons × 5 Styles).
- 5 Styles Available (Light, Regular, Filled, Duotone, Duotone Line).
- Unified keyline shapes on a 24×24 px grid.
- Easy customization of colors, sizes, and styles.

## Features

- Full TypeScript support with proper type definitions.
- Easy customization of style with CSS.
- Built with Vue 3+ and modern best practices.
- SVG-based icons that scale perfectly on any device.
- Tree-shakeable icons let you import only what you use.

## Installation

```bash
# Using npm
npm install @zappicon/vue

# Using yarn
yarn add @zappicon/vue

# Using pnpm
pnpm add @zappicon/vue
```

## How to use

Zappicon uses ES Modules for full tree-shaking, so your bundle only includes the icons you import.

```vue
<script setup>
import { Star } from "@zappicon/vue"
</script>

<template>
  <div>
    <Star />
  </div>
</template>
```

## Props

| Name    | Type   | Default      | Possible Values                                                 |
| ------- | ------ | ------------ | --------------------------------------------------------------- |
| size    | number | 24           | Any valid CSS size unit                                         |
| color   | string | currentColor | Any CSS color                                                   |
| variant | string | "regular"    | "filled" \| "regular" \| "light" \| "duotone" \| "duotone-line" |
| class   | string | ""           | Additional CSS classes                                          |

### Example

```vue
<script setup>
import { Star } from "@zappicon/vue"
</script>

<template>
  <div>
    <Star variant="filled" :size="48" color="#ff9900" />
  </div>
</template>
```

### variant

Each icon comes in 5 styles:

| Style        | Variant value          |
| ------------ | ---------------------- |
| Filled       | variant="filled"       |
| Regular      | variant="regular"      |
| Light        | variant="light"        |
| Duotone      | variant="duotone"      |
| Duotone Line | variant="duotone-line" |

**Example:**

```vue
<!-- One Variant -->
<script setup>
import { Star } from "@zappicon/vue"
</script>

<template>
  <div>
    <Star variant="regular" />
  </div>
</template>

<!-- Different Variants -->
<script setup>
import { Star } from "@zappicon/vue"
</script>

<template>
  <div>
    <Star variant="light" />
    <Star variant="regular" />
    <Star variant="filled" />
    <Star variant="duotone" />
    <Star variant="duotone-line" />
  </div>
</template>
```

### class

This allows you to apply Tailwind CSS utilities or your own custom CSS classes for size, color, and other effects.

```vue
<!-- Tailwind CSS -->
<Star variant="regular" class="w-8 h-8 text-blue-500" />

<!-- Custom CSS -->
<Star variant="regular" class="my-icon" />
```

## Support

- **Bug Reports**: [GitHub Issues](https://github.com/zappicon/zappicon-vue/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zappicon/zappicon-vue/discussions)
- **Website**: [zappicon.com](https://zappicon.com)
