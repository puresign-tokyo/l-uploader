import type { BrowserContext, Page } from "@playwright/test";

export async function blockExternalRequests(context: BrowserContext) {
  await context.route("**/*", (route) => {
    const host = new URL(route.request().url()).hostname;
    return host === "127.0.0.1" ? route.continue() : route.abort();
  });
}

export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const root = document.querySelector("#__nuxt") as HTMLElement & {
      __vue_app__?: { config: { globalProperties: { $nuxt?: { isHydrating: boolean } } } };
    };
    return root?.__vue_app__?.config.globalProperties.$nuxt?.isHydrating === false;
  });
}
