import { test, expect, type Page } from "@playwright/test";

import { API, UPLOADED_REPLAY_ID } from "./settings.mjs";
import { blockExternalRequests, waitForHydration } from "./support";
// replay_id=123の保存後の名前。選択した元ファイル名とは異なる。
const STORED_FILENAME = "th6_ud003f.rpy";
const INPUT = {
  username: "おおたじゅ",
  password: "e2e-password",
  comment: "E2E comment",
  tag: "e2e-tag",
  filename: "e2e.rpy",
  fileContent: "mock replay content",
};
const locales = [
  {
    code: "ja",
    prefix: "",
    title: "新規投稿",
    user: "ユーザ名",
    password: "削除用パスワード",
    comment: "コメント",
    tag: "タグ",
    submit: "送信",
    success: "リプレイを投稿しました",
    detailTitle: "リプレイ詳細",
    userRequired: "ユーザ名を入力してください",
    invalidPassword: "パスワードは半角のASCII可視文字のみが許容されています",
    rateLimit: "リプレイ送信上限を超えました。時間を置いて送信してください。",
  },
  {
    code: "en",
    prefix: "/en",
    title: "New Post",
    user: "Username",
    password: "Deletion Password",
    comment: "Comment",
    tag: "Tag",
    submit: "Submit",
    success: "Replay Uploaded",
    detailTitle: "Replay Details",
    userRequired: "Please enter a username.",
    invalidPassword:
      "Password may only contain visible half-width ASCII characters.",
    rateLimit: "Upload limit exceeded. Please wait and try again.",
  },
] as const;

async function openForm(page: Page, prefix: string) {
  await page.goto(`${prefix}/NewPost`);
  // SSRのHTML表示だけでなく、イベントを処理できるhydration完了まで待つ。
  await waitForHydration(page);
}

async function fillForm(page: Page, labels: (typeof locales)[number]) {
  await page.getByLabel(labels.user, { exact: true }).fill(INPUT.username);
  await page.getByLabel(labels.password, { exact: true }).fill(INPUT.password);
  await page.getByLabel(labels.comment, { exact: true }).fill(INPUT.comment);
  await page.getByLabel(labels.tag, { exact: true }).fill(INPUT.tag);
  await page.locator('input[type="file"]').setInputFiles({
    name: INPUT.filename,
    mimeType: "application/octet-stream",
    buffer: Buffer.from(INPUT.fileContent),
  });
}

test.beforeEach(async ({ context, request }) => {
  expect(
    (await request.post(`${API}/__control`, { data: {} })).ok(),
  ).toBeTruthy();
  // reCAPTCHA等の外部サービスへ通信せず、ローカルのアプリと模擬APIだけ利用する。
  await blockExternalRequests(context);
});

for (const labels of locales) {
  test.describe(labels.code, () => {
    test.use({ locale: labels.code === "ja" ? "ja-JP" : "en-US" });

    test("投稿して同じ言語の詳細画面を表示し、再読み込みできる", async ({
      page,
      request,
    }) => {
      await openForm(page, labels.prefix);
      await expect(page).toHaveTitle(new RegExp(labels.title));
      await fillForm(page, labels);
      await page
        .getByRole("button", { name: labels.submit, exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      await expect(
        dialog.getByText(labels.success, { exact: true }),
      ).toBeVisible();
      const state = await (await request.get(`${API}/__state`)).json();
      expect(state).toMatchObject({
        uploadCount: 1,
        lastUpload: {
          fields: {
            user_name: INPUT.username,
            delete_password: INPUT.password,
            upload_comment: INPUT.comment,
            optional_tag: INPUT.tag,
            category: "clear",
            recaptcha_token: "",
          },
          filename: INPUT.filename,
          fileContent: INPUT.fileContent,
        },
      });
      // 成功ダイアログを閉じると、既存のwatch処理が詳細画面へ遷移する。
      await page.keyboard.press("Escape");
      await expect(page).toHaveURL(
        `${labels.prefix}/replays/${UPLOADED_REPLAY_ID}`,
      );
      await expect(
        page.getByText(STORED_FILENAME, { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(INPUT.username, { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(INPUT.comment, { exact: true }),
      ).toBeVisible();
      await expect(page.getByText(INPUT.tag, { exact: true })).toBeVisible();
      // SSRで取得する場合も模擬APIを参照できることを確認する。
      await page.reload();
      await expect(page).toHaveTitle(new RegExp(labels.detailTitle));
      await expect(
        page.getByText(STORED_FILENAME, { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(INPUT.username, { exact: true }),
      ).toBeVisible();
    });

    test("未入力と許可外のパスワードを拒否し、APIに送信しない", async ({
      page,
      request,
    }) => {
      await openForm(page, labels.prefix);
      await page
        .getByRole("button", { name: labels.submit, exact: true })
        .click();
      await expect(
        page.getByText(labels.userRequired, { exact: true }),
      ).toBeVisible();
      await fillForm(page, labels);
      await page
        .getByLabel(labels.password, { exact: true })
        .fill("パスワード😀");
      await page
        .getByRole("button", { name: labels.submit, exact: true })
        .click();
      await expect(
        page.getByText(labels.invalidPassword, { exact: true }),
      ).toBeVisible();
      expect(
        (await (await request.get(`${API}/__state`)).json()).uploadCount,
      ).toBe(0);
    });

    test("APIの429を表示し、入力を保持する", async ({ page, request }) => {
      expect(
        (
          await request.post(`${API}/__control`, {
            data: { uploadStatus: 429 },
          })
        ).ok(),
      ).toBeTruthy();
      await openForm(page, labels.prefix);
      await fillForm(page, labels);
      await page
        .getByRole("button", { name: labels.submit, exact: true })
        .click();
      await expect(
        page.getByText(labels.rateLimit, { exact: true }),
      ).toBeVisible();
      await expect(page.getByLabel(labels.user, { exact: true })).toHaveValue(
        INPUT.username,
      );
      await expect(
        page.getByLabel(labels.comment, { exact: true }),
      ).toHaveValue(INPUT.comment);
      await expect(page.getByRole("dialog")).not.toBeVisible();
      expect(
        (await (await request.get(`${API}/__state`)).json()).uploadCount,
      ).toBe(1);
    });
  });
}
