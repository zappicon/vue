import icons from "../core/src/index.ts"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import process from "process"
import { execSync } from "child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { readFileSync } from "node:fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SVG_ICONS_DIR = path.join(__dirname, "../core/icons")
const ICONS_OUTPUT_DIR = path.join(__dirname, "../src/icons")
const VARIANTS_OUTPUT_DIR = path.join(__dirname, "../src/variants")
const VARIANTS = ["light", "regular", "filled", "duotone", "duotone-line"]

function updateGitSubmodules() {
  try {
    console.log("Updating git submodules...")
    execSync("git submodule update --remote --init --force --recursive", {
      stdio: "inherit",
    })
    console.log("✅ Git submodules updated!")
  } catch (error) {
    console.error("Error updating git submodules:", error)
    process.exit(1)
  }
}

async function generateIcons() {
  try {
    await mkdir(ICONS_OUTPUT_DIR, { recursive: true })
    for (const icon of icons) {
      const iconFileContent = `<script lang="ts">
import type { ZappiconComponent, ZappiconProps } from "../lib/types"
/**
 * ${VARIANTS.map((variant) => {
   const file = path.join(variant, `${icon.name}.svg`)
   if (!file) return `@${variant} (missing)`
   const svgPath = join(SVG_ICONS_DIR, file)
   const svgContent = readFileSync(svgPath, "utf8")
   return `@${variant} ${getBase64Svg(svgContent)}`
 }).join("\n * ")}
*/
export default {
  name: "${toPascalCase(icon.name)}",
} as ZappiconComponent
</script>

<script setup lang="ts">
import BaseIcon from "../lib/icon-base.vue"
import variants from "../variants/${icon.name}"
const props = defineProps<ZappiconProps>()
</script>

<template>
  <BaseIcon v-bind="props" :variants="variants" />
</template>
`

      await writeFile(
        join(ICONS_OUTPUT_DIR, `${toPascalCase(icon.name)}.vue`),
        iconFileContent
      )
    }
    console.log(`✅ Generated icon files for ${icons.length} icons!`)
  } catch (error) {
    console.error("Error generating icon files:", error)
    process.exit(1)
  }
}

async function generateIndex() {
  try {
    const indexPath = join(__dirname, "../src/index.ts")
    const indexFileContent = icons
      .map(
        (icon) =>
          `export { default as ${toPascalCase(
            icon.name
          )} } from './icons/${toPascalCase(icon.name)}.vue';`
      )
      .join("\n")

    await writeFile(indexPath, indexFileContent)

    console.log(`✅ Generated index file!`)
  } catch (error) {
    console.error("Error generating index file:", error)
    process.exit(1)
  }
}

async function generateVariants() {
  try {
    await mkdir(VARIANTS_OUTPUT_DIR, { recursive: true })

    for (const icon of icons) {
      const variantEntries: string[] = []

      const iconVariants = icon.variants
      iconVariants.map((v) => {
        const elementCode = renderSvgToVueRenderFunction(v.svg, "  ")
        variantEntries.push(`"${v.variant}": ${elementCode}`)
      })

      const variantsMapContent = `import { h, type VNode } from "vue"
import type { IconVariant } from "../lib/types"

type VariantRenderFunction = () => VNode | VNode[]

const variants: Record<IconVariant, VariantRenderFunction> = {
  ${variantEntries.join(",\n")}
}

export default variants
`
      await writeFile(
        path.join(VARIANTS_OUTPUT_DIR, `${icon.name}.ts`),
        variantsMapContent
      )
    }

    console.log(
      `✅ Generated variants for ${icons.length} icons from core/src/index.ts!`
    )
  } catch (error) {
    console.error("Error generating variant files:", error)
    process.exit(1)
  }
}

function renderSvgToVueRenderFunction(node, indent = "  ") {
  if (!node) return "() => null"

  const { name, type, value, children = [] } = node

  if (type === "text") {
    return value ? `() => "${value}"` : "() => null"
  }

  if (type !== "element") return "() => null"

  // Only process <path> elements and other SVG elements for variants
  if (name === "svg") {
    // For the root svg, return a function that creates children elements
    const childrenCode = children
      .map((child) => renderSvgToVueElement(child, indent + "  "))
      .filter((child) => child !== "null")

    if (childrenCode.length === 0) {
      return `() => []`
    }

    const childrenString =
      childrenCode.length === 1
        ? childrenCode[0]
        : `[\n${indent}  ${childrenCode.join(`,\n${indent}  `)}\n${indent}]`

    return `() => ${childrenString}`
  }

  return "() => null"
}

function renderSvgToVueElement(node, indent = "") {
  if (!node) return "null"

  const { name, type, value, attributes = {}, children = [] } = node

  if (type === "text") {
    return value ? JSON.stringify(value) : "null"
  }

  if (type !== "element") return "null"

  // Build props object for Vue
  const props = {}
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "fill") return // Remove fill property entirely
    const propName = convertAttributeToVueProp(key)
    props[propName] = value
  })

  let propsString = "{"
  const propEntries = Object.entries(props)
  propEntries.forEach(([key, value], index) => {
    propsString += `${key}: "${value}"`
    if (index < propEntries.length - 1) {
      propsString += ", "
    }
  })
  propsString += "}"

  if (children.length === 0) {
    return `h("${name}", ${propsString})`
  }

  const childrenCode = children
    .map((child) => renderSvgToVueElement(child, indent + "  "))
    .filter((child) => child !== "null")

  if (childrenCode.length === 0) {
    return `h("${name}", ${propsString})`
  }

  const childrenString =
    childrenCode.length === 1
      ? childrenCode[0]
      : `[\n${indent}  ${childrenCode.join(`,\n${indent}  `)}\n${indent}]`

  return `h("${name}", ${propsString}, ${childrenString})`
}

function convertAttributeToVueProp(attr: string): string {
  const specialCases = {
    class: "className",
    for: "htmlFor",
    tabindex: "tabIndex",
    readonly: "readOnly",
    maxlength: "maxLength",
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable",
  }
  if (specialCases[attr]) {
    return specialCases[attr]
  }
  return toCamelCase(attr)
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

function toCamelCase(str: string): string {
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1)
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join("")
}

function getBase64Svg(svg: string): string {
  svg = svg.replace(/<svg([^>]*)>/, (_, attrs) => {
    const newAttrs = attrs
      .replace(/\swidth="[^"]*"/g, "")
      .replace(/\sheight="[^"]*"/g, "")
    return `<svg${newAttrs} width="20" height="20"><rect width="100%" height="100%" fill="white" rx="2" ry="2"/>`
  })

  const baseURI = Buffer.from(svg, "utf8").toString("base64")
  return `![img](data:image/svg+xml;base64,${baseURI})`
}

updateGitSubmodules()
generateIcons()
generateIndex()
generateVariants()
