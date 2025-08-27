import type { DefineComponent, SVGAttributes } from "vue"

export type IconVariant =
  | "light"
  | "regular"
  | "filled"
  | "duotone"
  | "duotone-line"

export interface ZappiconProps extends /* @vue-ignore */ SVGAttributes {
  variant?: IconVariant
  size?: string | number
  color?: string
}

export type ZappiconComponent = DefineComponent<ZappiconProps>
