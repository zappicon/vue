import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vitest/config"
import { resolve } from "path"

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "Zappicon",
    },
    rollupOptions: {
      external: ["vue"],
      output: [
        {
          preserveModules: true,
          preserveModulesRoot: "src",
          dir: "dist",
          format: "esm",
          entryFileNames: `[name].mjs`,
          globals: {
            vue: "Vue",
          },
        },
      ],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src"],
    },
    include: ["tests/**/*.test.ts"],
  },
})
