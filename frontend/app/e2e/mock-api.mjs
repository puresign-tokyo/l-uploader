import { createServer } from "node:http";
import { BASE_URL, POSTS_PER_PAGE, UPLOADED_REPLAY_ID } from "./settings.mjs";
import { replayFilename } from "./replay-filename.mjs";

// SSRとブラウザの両方が利用する、外部依存のないインメモリAPI。
// 本物のリプレイparserや認証の動作は保証しない。
const HOST = "127.0.0.1";
const PORT = 3101;
const MAX_BODY_BYTES = 1024 * 1024;
let replays = [];
let uploadStatus = 201;
let uploadCount = 0;
let lastUpload = null;

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("Mock request too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

const server = createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", BASE_URL);
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const send = (status, body) => {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));
  };
  const url = new URL(request.url, `http://${HOST}:${PORT}`);
  const path = url.pathname;
  try {
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.method === "GET" && path === "/__health") {
      return send(200, { ready: true });
    }
    if (request.method === "POST" && path === "/__control") {
      const options = JSON.parse((await readBody(request)).toString());
      replays = options.replays ?? [];
      uploadStatus = options.uploadStatus ?? 201;
      uploadCount = 0;
      lastUpload = null;
      return send(200, { reset: true });
    }
    if (request.method === "GET" && path === "/__state") {
      return send(200, { uploadCount, lastUpload });
    }
    if (request.method === "GET" && path === "/replays/count") {
      return send(200, { count: filterReplays(url.searchParams).length });
    }
    if (request.method === "GET" && path === "/replays") {
      const page = Number(url.searchParams.get("page") ?? 0);
      if (!Number.isInteger(page) || page < 0) {
        return send(422, { detail: "Invalid page" });
      }
      const matching = filterReplays(url.searchParams).sort((a, b) => {
        const difference =
          Date.parse(a.uploaded_at) - Date.parse(b.uploaded_at);
        return url.searchParams.get("order") === "asc"
          ? difference
          : -difference;
      });
      return send(
        200,
        matching.slice(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE),
      );
    }
    if (request.method === "POST" && path === "/replays") {
      uploadCount++;
      if (uploadStatus !== 201) {
        return send(uploadStatus, { detail: "Mock upload rejected" });
      }
      const form = await new Response(await readBody(request), {
        headers: { "Content-Type": request.headers["content-type"] ?? "" },
      }).formData();
      const file = form.get("replay_file");
      if (!(file instanceof File)) return send(422, { detail: "Missing file" });
      const fields = Object.fromEntries(
        [...form.entries()].filter(([, value]) => typeof value === "string"),
      );
      lastUpload = {
        fields,
        filename: file.name,
        fileContent: await file.text(),
      };
      const replay = {
        replay_id: UPLOADED_REPLAY_ID,
        game_id: "th6",
        user_name: fields.user_name,
        upload_comment: fields.upload_comment,
        optional_tag: fields.optional_tag,
        category: fields.category,
        filename: replayFilename("th6", UPLOADED_REPLAY_ID),
        uploaded_at: "2026-01-01T00:00:00Z",
        replay_meta: {
          name: "E2E Player",
          shot_type: "ReimuA",
          difficulty: "1",
          total_score: "12345678",
          timestamp: "2026-01-01",
          slowdown: "0.1",
          replay_type: "full_game",
          stage_details: [],
        },
      };
      replays.push(replay);
      return send(201, { replay_id: replay.replay_id });
    }
    if (request.method === "GET" && path.startsWith("/replays/")) {
      const replay = replays.find(
        (item) => path === `/replays/${item.replay_id}`,
      );
      return replay ? send(200, replay) : send(404, { detail: "Not found" });
    }
    return send(404, { detail: "Unexpected mock endpoint" });
  } catch (error) {
    console.error("Mock API request failed:", error.message);
    return send(500, { detail: "Mock API error" });
  }
});

function filterReplays(params) {
  return replays.filter((replay) => {
    const game = params.get("game_id");
    const category = params.get("category");
    const tag = params.get("optional_tag");
    return (
      (!game || game === "all" || replay.game_id === game) &&
      (!category || category === "all" || replay.category === category) &&
      (!tag || replay.optional_tag === tag)
    );
  });
}

server.listen(PORT, HOST);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
