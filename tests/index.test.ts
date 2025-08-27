import { render, screen, fireEvent } from "@testing-library/vue"
import { describe, it, expect, vi } from "vitest"
import { h, ref, VNode } from "vue"
import { IconVariant } from "../src/lib/types"
import AddressCard from "../src/icons/AddressCard.vue"
import * as Icons from "../src"
import IconBase from "../src/lib/icon-base.vue"

describe("Index File", () => {
  it("all exports are valid Vue components", () => {
    const iconNames = Object.keys(Icons)
    iconNames.forEach((iconName) => {
      const component = Icons[iconName as keyof typeof Icons]
      expect(component).toBeDefined()
      expect(
        typeof component === "function" || typeof component === "object"
      ).toBe(true)
    })
  })

  it("exports a reasonable number of icons", () => {
    const iconCount = Object.keys(Icons).length
    expect(iconCount).toBeGreaterThan(100)
    expect(iconCount).toBeLessThan(2000)
  })
})

describe("Icon Base", () => {
  type VariantRenderFunction = () => VNode | VNode[]

  const dummyVariants: Record<string, VariantRenderFunction> = {
    light: () =>
      h("svg", {
        width: "40",
        height: "40",
        fill: "red",
        "data-testid": "icon-base-svg",
        class: "test-base-class",
      }),
    regular: () =>
      h("svg", {
        width: "40",
        height: "40",
        fill: "red",
        "data-testid": "icon-base-svg",
        class: "test-base-class",
      }),
    filled: () =>
      h("svg", {
        width: "40",
        height: "40",
        fill: "red",
        "data-testid": "icon-base-svg",
        class: "test-base-class",
      }),
    duotone: () =>
      h("svg", {
        width: "40",
        height: "40",
        fill: "red",
        "data-testid": "icon-base-svg",
        class: "test-base-class",
      }),
    "duotone-line": () =>
      h("svg", {
        width: "40",
        height: "40",
        fill: "red",
        "data-testid": "icon-base-svg",
        class: "test-base-class",
      }),
  }

  it("renders without crashing", () => {
    const { container } = render(IconBase, {
      props: { variants: dummyVariants },
      attrs: { "data-testid": "icon-base" },
    })
    const base = container.querySelector('[data-testid="icon-base"]')
    expect(base).toBeTruthy()
  })

  it("falls back to 'regular' variant if unknown variant is provided", () => {
    const { container } = render(IconBase, {
      props: { variants: dummyVariants, variant: "unknown" as IconVariant },
      attrs: { "data-testid": "icon-base-fallback" },
    })
    const base = container.querySelector('[data-testid="icon-base-fallback"]')
    expect(base).toBeTruthy()
    // Should render the fallback 'regular' variant SVG inside the root SVG
    const fallbackSvg = base!.querySelector('[data-testid="icon-base-svg"]')
    expect(fallbackSvg).not.toBeNull()
    expect(fallbackSvg!.getAttribute("fill")).toBe("red")
  })

  it("forwards props to SVG element", () => {
    const { container } = render(IconBase, {
      props: { variants: dummyVariants },
      attrs: {
        "data-testid": "icon-base-svg",
        width: "40",
        height: "40",
        fill: "red",
        class: "test-base-class",
      },
    })
    const base = container.querySelector('[data-testid="icon-base-svg"]')
    expect(base).not.toBeNull()
    expect(base!.getAttribute("width")).toBe("40")
    expect(base!.getAttribute("height")).toBe("40")
    expect(base!.getAttribute("fill")).toBe("red")
    expect(base!.classList.contains("test-base-class")).toBe(true)
  })
})

describe("Icon Components", () => {
  describe("Basic Rendering", () => {
    it("renders AddressCard without crashing", async () => {
      const icons = await import("../src/index")
      Object.entries(icons).forEach(([iconName, IconComponent]) => {
        render(IconComponent, { attrs: { "data-testid": `${iconName}-icon` } })
        const icon = screen.getByTestId(`${iconName}-icon`)
        expect(icon).toBeTruthy()
      })
    })
  })

  describe("SVG Properties", () => {
    it("renders as an SVG element", async () => {
      render(AddressCard, { attrs: { "data-testid": "svg-icon" } })
      const icon = screen.getByTestId("svg-icon")
      expect(icon.tagName).toBe("svg")
    })

    it("has default SVG attributes except width/height", async () => {
      render(AddressCard, { attrs: { "data-testid": "svg-icon" } })
      const icon = screen.getByTestId("svg-icon")
      expect(icon.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg")
      expect(icon.getAttribute("viewBox")).toBe("0 0 24 24")
      expect(icon.getAttribute("width")).toBe("24")
      expect(icon.getAttribute("height")).toBe("24")
    })
  })

  describe("Props Handling", () => {
    it("accepts and applies custom width and height", async () => {
      render(AddressCard, {
        attrs: { "data-testid": "custom-size-icon", width: "32", height: "32" },
      })
      const icon = screen.getByTestId("custom-size-icon")
      expect(icon.getAttribute("width")).toBe("32")
      expect(icon.getAttribute("height")).toBe("32")
    })

    it("accepts and applies size prop", async () => {
      render(AddressCard, {
        attrs: { "data-testid": "size-icon", size: "48" },
      })
      const icon = screen.getByTestId("size-icon")
      expect(icon.getAttribute("width")).toBe("48")
      expect(icon.getAttribute("height")).toBe("48")
    })

    it("accepts and applies variant prop", async () => {
      const variants = ["light", "regular", "filled", "duotone", "duotone-line"]
      variants.forEach((variant) => {
        render(AddressCard, {
          attrs: { "data-testid": `variant-icon-${variant}`, variant },
        })
        const icon = screen.getByTestId(`variant-icon-${variant}`)
        expect(icon).toBeTruthy()
      })
    })

    it("accepts and applies custom className", async () => {
      render(AddressCard, {
        attrs: {
          "data-testid": "custom-class-icon",
          class: "custom-icon-class",
        },
      })
      const icon = screen.getByTestId("custom-class-icon")
      expect(icon.classList.contains("custom-icon-class")).toBe(true)
    })

    it("accepts and applies style prop", async () => {
      render(AddressCard, {
        attrs: {
          "data-testid": "styled-icon",
          style: "color: blue; font-size: 2rem;",
        },
      })
      const icon = screen.getByTestId("styled-icon")
      expect(icon.style.color).toBe("blue")
      expect(icon.style.fontSize).toBe("2rem")
    })
  })

  describe("Event Handlers", () => {
    it("handles click events", async () => {
      const handleClick = vi.fn()
      render(AddressCard, {
        props: { onClick: handleClick },
        attrs: { "data-testid": "clickable-icon" },
      })
      const icon = screen.getByTestId("clickable-icon")
      await fireEvent.click(icon)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("handles mouseenter events", async () => {
      const handleMouseEnter = vi.fn()
      render(AddressCard, {
        props: { onMouseenter: handleMouseEnter },
        attrs: { "data-testid": "hoverable-icon" },
      })
      const icon = screen.getByTestId("hoverable-icon")
      await fireEvent.mouseEnter(icon)
      expect(handleMouseEnter).toHaveBeenCalledTimes(1)
    })
  })

  describe("Accessibility", () => {
    it("supports aria-label for screen readers", async () => {
      render(AddressCard, {
        attrs: {
          "data-testid": "accessible-icon",
          "aria-label": "Address card icon",
        },
      })
      const icon = screen.getByTestId("accessible-icon")
      expect(icon.getAttribute("aria-label")).toBe("Address card icon")
    })

    it("supports role attribute", async () => {
      render(AddressCard, {
        attrs: { "data-testid": "role-icon", role: "img" },
      })
      const icon = screen.getByTestId("role-icon")
      expect(icon.getAttribute("role")).toBe("img")
    })

    it("can be made focusable with tabIndex", async () => {
      render(AddressCard, {
        attrs: { "data-testid": "focusable-icon", tabIndex: 0 },
      })
      const icon = screen.getByTestId("focusable-icon")
      expect(icon.getAttribute("tabindex")).toBe("0")
    })
  })
})

describe("TypeScript Types", () => {
  it("accepts standard SVG attributes", () => {
    const vnode = h(AddressCard, {
      width: 24,
      height: 24,
      fill: "currentColor",
      class: "test-class",
      "data-testid": "typescript-test",
      "@click": () => {},
    })
    expect(vnode).toBeDefined()
  })

  it("accepts style prop", () => {
    const vnode = h(AddressCard, {
      style: { color: "red" },
    })
    expect(vnode).toBeDefined()
  })

  it("accepts Vue ref correctly", () => {
    const svgRef = ref<SVGSVGElement>()
    const vnode = h(AddressCard, { ref: svgRef })
    expect(vnode).toBeDefined()
  })
})

describe("Variants Rendering", () => {
  const variants: IconVariant[] = [
    "light",
    "regular",
    "filled",
    "duotone",
    "duotone-line",
  ]

  it("renders every icon with every variant", async () => {
    const icons = await import("../src/index")

    for (const [iconName, IconComponent] of Object.entries(icons)) {
      for (const variant of variants) {
        const testId = `${iconName}-icon-${variant}`
        const { unmount } = render(IconComponent, {
          attrs: { "data-testid": testId, variant },
        })
        const icon = screen.getByTestId(testId)
        expect(icon).toBeTruthy()
        unmount()
      }
    }
  })
})
