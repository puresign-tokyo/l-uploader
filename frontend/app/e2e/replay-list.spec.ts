import { test, expect, type Page } from "@playwright/test";
import { API, POSTS_PER_PAGE } from "./settings.mjs";
import { blockExternalRequests, waitForHydration } from "./support";

const TARGET_TAG = "list-target";
const GAME_NAME = "東方紅魔郷";
const OTHER_GAME_NAME = "東方妖々夢";
const CATEGORY_NAME = "クリア";

function replay(id: string, overrides = {}) {
  return {
    replay_id: id,
    filename: `${id}.rpy`,
    game_id: "th6",
    user_name: `User ${id}`,
    uploaded_at: "2025-01-01T00:00:00Z",
    upload_comment: `Comment ${id}`,
    category: "clear",
    optional_tag: TARGET_TAG,
    replay_meta: {
      name: "E2E Player", shot_type: "ReimuA", difficulty: "1",
      total_score: "12345678", timestamp: "2025-01-01",
      slowdown: "0.1", replay_type: "full_game", stage_details: [],
    },
    ...overrides,
  };
}

// 上限+1件で必ず2ページになる。先頭ページは新しい投稿から表示する。
const targets = Array.from({ length: POSTS_PER_PAGE + 1 }, (_, index) =>
  replay(`target-${index + 1}`, {
    uploaded_at: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
  }),
).reverse();
const otherGame = replay("other-game", { game_id: "th7" });
const otherCategory = replay("other-category", { category: "others" });
const otherTag = replay("other-tag", { optional_tag: "different-tag" });
const seed = [...targets, otherGame, otherCategory, otherTag];
const firstPage = targets.slice(0, POSTS_PER_PAGE);
const secondPage = targets.slice(POSTS_PER_PAGE);

const locales = [
  { code: "ja", prefix: "", welcome: "ようこそ、L-Uploaderへ！", tag: "タグ検索", game: "作品を選択", category: "カテゴリ" },
  { code: "en", prefix: "/en", welcome: "Welcome to L-Uploader!", tag: "Tag Search", game: "Select a Game", category: "Category" },
] as const;

const cards = (page: Page) => page.locator("main [replay]");

async function expectCards(page: Page, entries: ReturnType<typeof replay>[]) {
  await expect(page.locator("main .v-progress-circular")).toHaveCount(0);
  await expect(cards(page)).toHaveCount(entries.length);
  if (entries.length) {
    await expect(cards(page)).toContainText(entries.map((item) => item.filename));
  }
}

async function expectQuery(page: Page, expected: Record<string, string>) {
  await expect(page).toHaveURL((url) =>
    Object.entries(expected).every(([key, value]) => url.searchParams.get(key) === value),
  );
}

async function listResponse(page: Page, key: string, value: string) {
  return page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.origin === API && url.pathname === "/replays"
      && url.searchParams.get(key) === value && response.ok();
  });
}

async function selectFilter(page: Page, label: string, option: string, key: string, value: string) {
  const combobox = page.getByRole("combobox", { name: label, exact: true });
  // VSelectの内部inputは表示用要素に覆われるため、対応するキー操作で開く。
  await combobox.press("ArrowDown");
  await expect(combobox).toHaveAttribute("aria-expanded", "true");
  await Promise.all([
    listResponse(page, key, value),
    page.getByRole("option", { name: option, exact: true }).click(),
  ]);
  await expect(combobox).toHaveValue(option);
  await expect(combobox).toHaveAttribute("aria-expanded", "false");
}

async function searchTag(page: Page, label: string, tag: string) {
  await page.getByRole("textbox", { name: label, exact: true }).fill(tag);
  await Promise.all([
    listResponse(page, "optional_tag", tag),
    page.getByRole("button", { name: label, exact: true }).click(),
  ]);
}

async function goToPage(page: Page, number: number) {
  await Promise.all([
    // UIは1始まり、APIのpageは0始まり。
    listResponse(page, "page", String(number - 1)),
    page.locator(".v-pagination").getByRole("button").filter({ hasText: new RegExp(`^${number}$`) }).click(),
  ]);
  await expectQuery(page, { page: String(number) });
}

async function applyFilters(page: Page, labels: typeof locales[number]) {
  await selectFilter(page, labels.game, GAME_NAME, "game_id", "th6");
  await selectFilter(page, labels.category, CATEGORY_NAME, "category", "clear");
  await searchTag(page, labels.tag, TARGET_TAG);
  await expectCards(page, firstPage);
}

test.beforeEach(async ({ context, request }) => {
  expect((await request.post(`${API}/__control`, { data: { replays: seed } })).ok()).toBeTruthy();
  await blockExternalRequests(context);
});

for (const labels of locales) {
  test.describe(`一覧 ${labels.code}`, () => {
    test.use({ locale: labels.code === "ja" ? "ja-JP" : "en-US" });

    test.beforeEach(async ({ page }) => {
      await page.goto(`${labels.prefix}/`);
      await waitForHydration(page);
      await expect(page.getByText(labels.welcome, { exact: true })).toBeVisible();
      await expectCards(page, firstPage);
    });

    test("作品・カテゴリ・タグで絞り込み、検索時は1ページ目に戻る", async ({ page }) => {
      await goToPage(page, 2);
      await selectFilter(page, labels.game, OTHER_GAME_NAME, "game_id", "th7");
      await expectCards(page, [otherGame]);
      await expectQuery(page, { game_id: "th7", page: "1" });

      await applyFilters(page, labels);
      await expectQuery(page, { game_id: "th6", category: "clear", optional_tag: TARGET_TAG, page: "1" });
      await goToPage(page, 2);
      await expectCards(page, secondPage);
      await searchTag(page, labels.tag, "no-matching-tag");
      await expectQuery(page, { optional_tag: "no-matching-tag", page: "1" });
      await expectCards(page, []);

      // 検索語を消しても作品・カテゴリは維持される。
      await searchTag(page, labels.tag, "");
      await expectQuery(page, { game_id: "th6", category: "clear", optional_tag: "", page: "1" });
      await expectCards(page, firstPage);
    });

    test("絞り込み条件を保ってページ送り・戻る操作・再読み込みができる", async ({ page }) => {
      await applyFilters(page, labels);
      await goToPage(page, 2);
      await expectCards(page, secondPage);
      await expectQuery(page, { game_id: "th6", category: "clear", optional_tag: TARGET_TAG, page: "2" });
      await goToPage(page, 1);
      await expectCards(page, firstPage);

      await page.goBack();
      await expectQuery(page, { page: "2" });
      await expectCards(page, secondPage);
      await page.reload();
      await waitForHydration(page);
      await expectCards(page, secondPage);
      await expect(page.getByRole("textbox", { name: labels.tag, exact: true })).toHaveValue(TARGET_TAG);
      await expect(page.getByRole("combobox", { name: labels.game, exact: true })).toHaveValue(GAME_NAME);
      await expect(page.getByRole("combobox", { name: labels.category, exact: true })).toHaveValue(CATEGORY_NAME);
      await expectQuery(page, { game_id: "th6", category: "clear", optional_tag: TARGET_TAG, page: "2" });
    });

    test("一覧のリンクから同じ言語の詳細へ進み、戻ると検索条件を復元する", async ({ page }) => {
      await applyFilters(page, labels);
      await goToPage(page, 2);
      await expectCards(page, secondPage);
      const selected = secondPage[0];
      const detailPath = `${labels.prefix}/replays/${selected.replay_id}`;
      await cards(page).filter({ hasText: selected.filename }).locator(`a[href="${detailPath}"]`).click();
      await expect(page).toHaveURL(detailPath);
      await expect(page.getByText(selected.filename, { exact: true })).toBeVisible();
      await expect(page.getByText(selected.user_name, { exact: true })).toBeVisible();
      await expect(page.getByText(selected.upload_comment, { exact: true })).toBeVisible();

      await page.goBack();
      await expect(page).toHaveURL((url) => url.pathname.replace(/\/$/, "") === labels.prefix && url.searchParams.get("page") === "2");
      await expectQuery(page, { game_id: "th6", category: "clear", optional_tag: TARGET_TAG });
      await expect(page.getByRole("textbox", { name: labels.tag, exact: true })).toHaveValue(TARGET_TAG);
      await expectCards(page, secondPage);
    });
  });
}
