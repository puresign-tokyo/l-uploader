import { describe, expect, it } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useBackendUrl } from "../composables/Settings";

const config = { public: { httpProtocol: "http", backendHost: "api.example.test", backendPort: "80" } };
mockNuxtImport("useRuntimeConfig", () => () => config);

describe("バックエンドURL", () => {
  it.each([
    ["http", "80", "http://api.example.test"],
    ["https", "443", "https://api.example.test"],
    ["http", "8088", "http://api.example.test:8088"],
    ["https", "8443", "https://api.example.test:8443"],
    ["https", "80", "https://api.example.test:80"],
    ["http", "443", "http://api.example.test:443"],
  ])("%s ポート%s → %s", (protocol, port, expected) => {
    config.public.httpProtocol = protocol;
    config.public.backendPort = port;
    expect(useBackendUrl()).toBe(expected);
  });
});
