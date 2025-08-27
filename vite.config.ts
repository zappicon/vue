import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
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
})
