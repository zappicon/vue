<script setup lang="ts">
import { computed } from "vue"
import type { ZappiconProps, IconVariant } from "./types"
import { type VNode } from "vue"

type VariantRenderFunction = () => VNode | VNode[]

const props = defineProps<
  ZappiconProps & {
    variants: Record<IconVariant, VariantRenderFunction>
  }
>()

const size = computed(() => props.size ?? 24)

const variantRender = computed(() => {
  const v = props.variant ?? "regular"
  const renderFn = props.variants[v] ?? props.variants["regular"]
  const result = renderFn()
  return Array.isArray(result) ? result : [result]
})

const filteredProps = computed(() => {
  const { xmlns, viewBox, fill, tabindex, width, height, ...rest } = props
  return rest
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="color"
    :tabindex="props.tabindex ?? 0"
    v-bind="filteredProps">
    <template v-for="(node, idx) in variantRender" :key="idx">
      <component :is="node" />
    </template>
  </svg>
</template>
