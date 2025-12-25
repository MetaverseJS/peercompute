// Runtime stability test runner.
// For each element, simulate 5 temperature points (min, melt-10, mid, boil+10, max)
// for 1000 timesteps and fail on GPU errors or NaNs.
import { chromium } from "playwright";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createReadStream, statSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "docs");
const PORT = 4179;
const ELEMENTS = [
  "Hydrogen", "Oxygen", "Sodium", "Potassium", "Magnesium",
  "Aluminum", "Silicon", "Calcium", "Titanium", "Iron", "Lead"
];
const TEMP_POINTS = ["min", "solid", "liquid", "gas", "max"];
const MAX_TEMP = 10000;
const STEPS = 10000;
const PHYSICS_DT = 0.005;

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
      if (filePath.endsWith("/")) filePath = path.join(filePath, "index.html");
      const ext = path.extname(filePath);
      const contentType = MIME[ext] || "application/octet-stream";
      const stat = statSync(filePath);
      res.writeHead(200, { "Content-Type": contentType, "Content-Length": stat.size });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

function tempsFor(element) {
  // Rough melt/boil approximations; map by index.
  const melt = [14, 54, 371, 336.5, 923, 933, 1687, 1115, 1941, 1811, 600.6];
  const boil = [20.3, 90.2, 1156, 1032, 1363, 2743, 3538, 1757, 3560, 3134, 2022];
  const idx = Math.max(0, ELEMENTS.indexOf(element));
  const m = melt[idx] || 300;
  const b = boil[idx] || 500;
  return {
    min: 10,
    solid: Math.max(10, m - 10),
    liquid: (m + b) * 0.5,
    gas: b + 10,
    max: MAX_TEMP
  };
}

async function runScenario(browser, element, tempLabel, tempValue) {
  const url = `http://localhost:${PORT}/demos/mpm-headless.html?material=${encodeURIComponent(element)}&temp=${tempValue}&steps=${STEPS}&count=1000`;
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (msg) => {
    const txt = msg.text();
    if (/error/i.test(txt) || /GPUValidationError/i.test(txt) || /nan/i.test(txt)) {
      errors.push(`console(${element}/${tempLabel}): ${txt}`);
    }
  });
  page.on("pageerror", (err) => errors.push(`pageerror(${element}/${tempLabel}): ${err.message}`));
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  // Wait for simulation to start
  const started = await page.waitForFunction(
    () => window.__mpmStarted === true,
    { timeout: 60000 }
  ).catch(() => null);
  if (!started) {
    errors.push(`timeout start (${element}/${tempLabel})`);
  }
  // Poll for completion marker set by headless page
  const ok = await page.waitForFunction(
    () => window.__mpmDone === true && window.__mpmStepsRan >= STEPS,
    { timeout: 900000 }
  ).catch(() => null);
  if (!ok) errors.push(`timeout (${element}/${tempLabel})`);
  await page.close();
  return errors;
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({
    headless: true,
    args: ["--enable-features=WebGPU", "--enable-unsafe-webgpu"]
  });
  let failures = [];

  for (const el of ELEMENTS) {
    const t = tempsFor(el);
    for (const label of TEMP_POINTS) {
      const errs = await runScenario(browser, el, label, t[label]);
      failures = failures.concat(errs);
    }
  }

  if (failures.length) {
    await browser.close();
    server.close();
    throw new Error(`Runtime stability failures:\n${failures.join("\n")}`);
  } else {
    console.log("Runtime stability tests passed");
  }

  await browser.close();
  server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
