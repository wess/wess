// render through github so the preview catches unsupported readme markup
const markdown = await Bun.file("README.md").text();
const proc = Bun.spawn(["gh", "api", "markdown", "--input", "-"], {
  stdin: new Blob([JSON.stringify({ text: markdown, mode: "gfm", context: "wess/wess" })]),
  stdout: "pipe",
  stderr: "pipe",
});
const content = await new Response(proc.stdout).text();
if (await proc.exited !== 0) throw new Error(await new Response(proc.stderr).text());
await Bun.write(".preview/rendered.html", content);

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #0d1117; color: #f0f6fc;
    font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  main { max-width: 904px; margin: 40px auto; padding: 24px 32px;
    border: 1px solid #3d444d; border-radius: 6px; }
  p { margin: 0 0 16px; }
  a { color: #79c0ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  img { max-width: 100%; height: auto; vertical-align: middle; }
  table { width: 100%; border-spacing: 0; border-collapse: collapse; margin-bottom: 16px; }
  td { border: 1px solid #3d444d; padding: 6px 13px; }
  tr:nth-child(2n) { background: #151b23; }
  @media (prefers-color-scheme: light) {
    body { background: #fff; color: #1f2328; }
    main, td { border-color: #d1d9e0; }
    a { color: #0969da; }
    tr:nth-child(2n) { background: #f6f8fa; }
  }
  @media (max-width: 600px) {
    body { font-size: 14px; }
    main { margin: 16px 8px; padding: 16px; }
    td { padding: 6px; }
  }
`;

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 4173,
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.startsWith("/assets/") && /^\/assets\/[a-z]+\.(svg|png)$/.test(path)) {
      const asset = Bun.file(path.slice(1));
      return await asset.exists() ? new Response(asset) : new Response("not found", { status: 404 });
    }
    if (path !== "/") return new Response("not found", { status: 404 });
    const narrow = url.searchParams.has("mobile")
      ? "main { max-width:390px; padding:16px; margin:16px auto; } body { font-size:14px; }" : "";
    const light = url.searchParams.has("light")
      ? "body { background:#fff; color:#1f2328; } main { border-color:#d1d9e0; } a { color:#0969da; }" : "";
    return new Response(`<!doctype html><html><head><meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Wess / profile preview</title><style>${css}${narrow}${light}</style></head>
      <body><main>${content}</main></body></html>`, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});
console.log(`profile preview: ${server.url}`);
