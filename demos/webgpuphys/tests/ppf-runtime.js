// Headless runtime smoke test for ppf-cubic-barrier demo.
// Serves demos/ and loads /demos/ppf-cubic-barrier.html
// Fails on console errors, GPUValidationError, or uncaught exceptions.
import { chromium } from "playwright";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createReadStream, statSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PORT = 4182;
const URL = `http://localhost:${PORT}/demos/ppf-cubic-barrier.html`;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".wasm": "application/wasm",
  ".ico": "image/x-icon"
};

function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const reqPath = req.url.split("?")[0];
      let filePath = path.join(ROOT, reqPath);
      if (filePath.endsWith(path.sep)) filePath = path.join(filePath, "index.html");
      const ext = path.extname(filePath);
      const contentType = MIME[ext] || "application/octet-stream";
      const stat = statSync(filePath);
      res.writeHead(200, { "Content-Type": contentType, "Content-Length": stat.size });
      createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({
    headless: true,
    args: ["--enable-features=WebGPU", "--enable-unsafe-webgpu"],
  });
  const page = await browser.newPage();
  const errors = [];

  page.on("console", (msg) => {
    const txt = msg.text();
    if (/error/i.test(txt) || /GPUValidationError/i.test(txt)) {
      errors.push(`console: ${txt}`);
    }
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);

  const adapterErrors = errors.filter((e) =>
    /Failed to acquire a WebGPU adapter/i.test(e)
  );
  if (errors.length && errors.length !== adapterErrors.length) {
    await browser.close();
    server.close();
    throw new Error(`Headless runtime errors:\n${errors.join("\n")}`);
  }

  if (adapterErrors.length) {
    console.warn("Headless runtime skipped: WebGPU adapter unavailable in headless browser");
  } else {
    console.log("PPF cubic barrier runtime smoke test passed");
  }

  await browser.close();
  server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
