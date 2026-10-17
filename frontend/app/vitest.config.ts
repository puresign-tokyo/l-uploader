import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    // Nuxt環境の同時起動によるメモリ消費を抑える。
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1,
    environment: "nuxt",
    environmentOptions: {
      nuxt: {
        overrides: {
          // SEOモジュールがdebug.hooksの関数をruntimeConfigへ入れるのを防ぐ。
          debug: false,
        },
      },
    },
    include: ["tests/**/*.test.ts"],
    restoreMocks: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["composables/Settings.ts", "pages/NewPost.vue"],
    },
  },
});
