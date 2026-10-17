import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { flushPromises, type VueWrapper } from "@vue/test-utils";
import NewPost from "../pages/NewPost.vue";

const { config, INPUT_LIMITS } = vi.hoisted(() => {
  const INPUT_LIMITS = {
    usernameLengthLimit: 20,
    uploadCommentLengthLimit: 15,
    optionalTagLengthLimit: 20,
    deletePasswordLengthLimit: 100,
    filesizeKbLimit: 200,
  } as const;

  return {
    INPUT_LIMITS,
    config: {
      public: {
        httpProtocol: "http",
        backendHost: "localhost",
        backendPort: "8088",
        ...INPUT_LIMITS,
        recaptchaEnabled: false,
      },
    },
  };
});
mockNuxtImport("useRuntimeConfig", () => () => config);
mockNuxtImport("useLocalePath", () => () => (path: string) => path);
// 翻訳文面の変更で業務処理のテストが壊れないよう、キーを表示する。
mockNuxtImport("useI18n", () => () => ({ t: (key: string) => key }));

let wrapper: VueWrapper;
const fetchMock = vi.fn();
const prefix = "pages.new_post.scripts.snack_bar.";

function textField(name: string) {
  const component = wrapper
    .findAllComponents({ name: "VTextField" })
    .find((item) => String(item.props("label")).includes(`.${name}.label`));
  if (!component) throw new Error(`Field missing: ${name}`);
  return component;
}

async function field(name: string, value: unknown) {
  await textField(name).get("input").setValue(value);
}

async function submit() {
  const button = wrapper
    .findAllComponents({ name: "VBtn" })
    .find(
      (item) =>
        item.props("text") ===
        "pages.new_post.template.new_post.sections.submit.text",
    );
  if (!button) throw new Error("Submit button missing");
  await button.trigger("click");
  await flushPromises();
}

async function validForm() {
  await field("user_name", "霊夢");
  await field("delete_password", "secret");
  wrapper
    .findComponent({ name: "VFileInput" })
    .vm.$emit("update:modelValue", new File(["replay"], "test.rpy"));
  await flushPromises();
}

beforeEach(async () => {
  fetchMock.mockReset();
  config.public.recaptchaEnabled = false;
  vi.stubGlobal("$fetch", fetchMock);
  wrapper = await mountSuspended(NewPost, {
    global: {
      stubs: {
        VMain: { template: "<main><slot /></main>" },
        VSubheader: { template: "<div><slot /></div>" },
        I18nT: { template: "<span><slot name='replay_path' /></span>" },
        // オーバーレイの配置・アニメーションは対象外。開閉状態と内容を検証する。
        VDialog: {
          name: "VDialog",
          props: ["modelValue"],
          template: "<div v-if='modelValue'><slot /></div>",
        },
        VSnackbar: {
          name: "VSnackbar",
          props: ["modelValue", "color"],
          template: "<div v-if='modelValue'><slot /></div>",
        },
      },
    },
  });
});

afterEach(() => {
  wrapper?.unmount();
  document.head
    .querySelectorAll('script[src*="recaptcha/api.js"]')
    .forEach((script) => script.remove());
});

describe("投稿フォーム", () => {
  it("空のフォームは送信せず、ユーザー名が必要と表示する", async () => {
    await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(wrapper.findComponent({ name: "VSnackbar" }).text()).toContain(
      prefix + "validations.username_required",
    );
  });

  it("ファイル未選択では送信しない", async () => {
    await field("user_name", "霊夢");
    await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(wrapper.findComponent({ name: "VSnackbar" }).text()).toContain(
      prefix + "validations.replay_file_required",
    );
  });

  it.each([
    [
      "user_name",
      "a".repeat(INPUT_LIMITS.usernameLengthLimit + 1),
      "username_length_limit_exceed",
    ],
    [
      "optional_tag",
      "a".repeat(INPUT_LIMITS.optionalTagLengthLimit + 1),
      "optional_tag_length_limit_exceed",
    ],
    [
      "delete_password",
      "a".repeat(INPUT_LIMITS.deletePasswordLengthLimit + 1),
      "delete_password_length_limit_exceed",
    ],
    ["delete_password", "", "delete_password_required"],
    ["delete_password", "   ", "delete_password_do_not_only_space"],
    ["delete_password", "あ", "delete_password_is_only_ascii"],
    ["delete_password", "abc😀", "delete_password_is_only_ascii"],
    ["delete_password", "ａｂｃ", "delete_password_is_only_ascii"],
    ["delete_password", "abc\u200B", "delete_password_is_only_ascii"],
  ])("不正な%sを拒否する: %s", async (name, value, error) => {
    await validForm();
    await field(name, value);
    await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(wrapper.findComponent({ name: "VSnackbar" }).text()).toContain(
      prefix + "validations." + error,
    );
  });

  it("コメントの上限超過を拒否する", async () => {
    await validForm();
    await wrapper
      .findComponent({ name: "VTextarea" })
      .get("textarea")
      .setValue("a".repeat(INPUT_LIMITS.uploadCommentLengthLimit + 1));
    await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(wrapper.findComponent({ name: "VSnackbar" }).text()).toContain(
      prefix + "validations.upload_comment_length_limit_exceed",
    );
  });

  it("有効な入力をFormDataで送り、成功ダイアログを表示する", async () => {
    fetchMock.mockImplementation(async (_url, options) => {
      options.onResponse({
        response: { status: 201, _data: { replay_id: "test-id" } },
      });
    });
    await validForm();
    await field("user_name", "a".repeat(INPUT_LIMITS.usernameLengthLimit));
    await field(
      "optional_tag",
      "b".repeat(INPUT_LIMITS.optionalTagLengthLimit),
    );
    await field(
      "delete_password",
      "c".repeat(INPUT_LIMITS.deletePasswordLengthLimit),
    );
    await wrapper
      .findComponent({ name: "VTextarea" })
      .get("textarea")
      .setValue("d".repeat(INPUT_LIMITS.uploadCommentLengthLimit));
    await submit();
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:8088/replays");
    expect(options.method).toBe("post");
    expect(Object.fromEntries(options.body.entries())).toMatchObject({
      user_name: "a".repeat(INPUT_LIMITS.usernameLengthLimit),
      optional_tag: "b".repeat(INPUT_LIMITS.optionalTagLengthLimit),
      delete_password: "c".repeat(INPUT_LIMITS.deletePasswordLengthLimit),
      upload_comment: "d".repeat(INPUT_LIMITS.uploadCommentLengthLimit),
      category: "clear",
      recaptcha_token: "",
    });
    expect(options.body.get("replay_file").name).toBe("test.rpy");
    expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(
      true,
    );
    expect(
      wrapper.findComponent({ name: "VFileInput" }).props("modelValue"),
    ).toBeNull();
    expect(
      wrapper.findComponent({ name: "VTextarea" }).props("modelValue"),
    ).toBe("");
  });

  it("429なら再試行を促すメッセージを表示する", async () => {
    fetchMock.mockRejectedValue({ response: { status: 429 } });
    await validForm();
    await submit();
    expect(wrapper.findComponent({ name: "VSnackbar" }).text()).toContain(
      prefix + "http_requested.too_many_requested",
    );
    expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(
      false,
    );
  });

  it("reCAPTCHA有効時はトークンなしで送信しない", async () => {
    config.public.recaptchaEnabled = true;
    await validForm();
    await submit();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(wrapper.findComponent({ name: "VSnackbar" }).text()).toContain(
      prefix + "validations.recaptcha_required",
    );
  });

  it("reCAPTCHAのトークンを送信データに含める", async () => {
    config.public.recaptchaEnabled = true;
    vi.stubGlobal("grecaptcha", { getResponse: () => "test-token" });
    await validForm();
    await submit();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][1].body.get("recaptcha_token")).toBe(
      "test-token",
    );
  });

  it("API失敗時は入力を保持してエラーを表示する", async () => {
    fetchMock.mockRejectedValue({
      statusCode: 500,
      statusMessage: "Server Error",
      data: { detail: "failed" },
    });
    await validForm();
    await submit();
    expect(wrapper.findComponent({ name: "VSnackbar" }).text()).toContain(
      "500;Server Error;failed",
    );
    expect(
      wrapper.findComponent({ name: "VFileInput" }).props("modelValue"),
    ).not.toBeNull();
  });
});
