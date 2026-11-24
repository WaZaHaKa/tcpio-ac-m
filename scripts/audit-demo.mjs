import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axe from "axe-core";
import pa11y from "pa11y";
import puppeteer from "puppeteer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSP = "default-src 'self'; script-src 'self'";
const BLOCKING = new Set(["serious", "critical"]);
const PAGES = ["/demo/index.html", "/demo/statement.html"];

function chromePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  for (const candidate of ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/usr/bin/chromium"]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

function contentType(file) {
  const ext = path.extname(file);
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const relative = decodeURIComponent(url.pathname);
    const file = path.resolve(root, `.${relative}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      res.writeHead(400);
      res.end("bad path");
      return;
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": contentType(file),
      "Content-Security-Policy": CSP,
      "Cache-Control": "no-store",
    });
    res.end(fs.readFileSync(file));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

function blockingViolations(results) {
  return results.violations.filter((item) => BLOCKING.has(item.impact));
}

function formatAxe(page, results) {
  const blocking = blockingViolations(results);
  const lines = blocking.map((item) => `${page} ${item.impact} ${item.id}: ${item.help}`);
  const rest = results.violations
    .filter((item) => !BLOCKING.has(item.impact))
    .map((item) => `${page} ${item.impact} ${item.id}`);
  return { lines, rest };
}

async function runAxe(page) {
  await page.evaluate(axe.source);
  return page.evaluate(async () => {
    const axeApi = globalThis.axe;
    return axeApi.run(document, { resultTypes: ["violations"] });
  });
}

async function preparePage(browser, url) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
  const external = [];
  const cspConsole = [];
  page.on("console", (message) => {
    const text = message.text();
    if (/Content Security Policy|Refused to/i.test(text)) cspConsole.push(text);
  });
  page.on("request", (request) => {
    const target = new URL(request.url());
    if ((target.protocol === "http:" || target.protocol === "https:") && target.origin !== new URL(url).origin) {
      external.push(request.url());
    }
  });
  await page.evaluateOnNewDocument(() => {
    globalThis.__tcpioCsp = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      globalThis.__tcpioCsp.push({
        directive: event.violatedDirective,
        blocked: event.blockedURI,
        line: event.lineNumber,
      });
    });
  });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  return { page, external, cspConsole };
}

async function cspEvents(page) {
  return page.evaluate(() => globalThis.__tcpioCsp ?? []);
}

async function toolbarState(page) {
  return page.evaluate(() => {
    const host = document.querySelector("nagishon-widget");
    const shadow = host?.shadowRoot ?? null;
    const button = shadow?.querySelector("button.launcher") ?? null;
    const style = button ? getComputedStyle(button) : null;
    return {
      host: Boolean(host),
      shadowSheets: shadow ? shadow.adoptedStyleSheets.length : 0,
      documentSheets: document.adoptedStyleSheets.length,
      styleTags: shadow ? shadow.querySelectorAll("style").length : -1,
      background: style?.backgroundColor ?? "",
      effectsMarker: document.getElementById("nagishon-effects")?.tagName ?? "",
    };
  });
}

async function auditPage(browser, url, { toolbar }) {
  const { page, external, cspConsole } = await preparePage(browser, url);
  const problems = [];
  if (toolbar) {
    await page.waitForSelector("nagishon-widget", { timeout: 10000 });
    const state = await toolbarState(page);
    if (!state.host || state.shadowSheets < 1 || state.documentSheets < 1 || state.styleTags !== 0) {
      problems.push(`toolbar styles were not applied: ${JSON.stringify(state)}`);
    }
    if (state.effectsMarker !== "META") problems.push(`effects marker is ${state.effectsMarker || "missing"}`);
    if (!state.background || state.background === "rgba(0, 0, 0, 0)") {
      problems.push("launcher has no background color");
    }
  }
  let events = await cspEvents(page);
  if (events.length || cspConsole.length || external.length) {
    problems.push(`CSP or network on load: ${JSON.stringify({ events, cspConsole, external })}`);
  }
  const closed = formatAxe(url, await runAxe(page));
  problems.push(...closed.lines);

  if (toolbar) {
    const before = (await cspEvents(page)).length;
    await page.evaluate(() => {
      const host = document.querySelector("nagishon-widget");
      const button = host?.shadowRoot?.querySelector("button.launcher");
      if (!button) throw new Error("launcher missing");
      button.click();
    });
    await page.waitForFunction(() => document.querySelector("nagishon-widget")?.hasAttribute("data-open"));
    events = await cspEvents(page);
    if (events.length > before || external.length) {
      problems.push(`CSP or network with dialog open: ${JSON.stringify({ events, external })}`);
    }
    const opened = formatAxe(`${url} open`, await runAxe(page));
    problems.push(...opened.lines);
    closed.rest.push(...opened.rest);

    const probeBefore = (await cspEvents(page)).length;
    await page.evaluate(() => {
      const host = document.querySelector("nagishon-widget");
      host?.shadowRoot?.querySelector('[data-key="bigCursor"]')?.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    const probe = (await cspEvents(page)).slice(probeBefore);
    if (probe.length) {
      console.log(`note: big-cursor control reported ${probe.length} CSP event(s) under this policy`);
    }
  }

  await page.close();
  return { problems, notes: closed.rest };
}

function pa11yBlocking(issues) {
  return issues.filter((issue) => {
    // axe "incomplete" results are not confirmed failures. pa11y still returns them.
    if (issue.runnerExtras?.needsFurtherReview) return false;
    const impact = issue.runnerExtras?.impact;
    if (typeof impact === "string") return BLOCKING.has(impact);
    return issue.type === "error";
  });
}

async function runPa11y(url, executablePath) {
  const options = {
    runners: ["axe"],
    standard: "WCAG2AA",
    timeout: 60000,
    wait: 500,
    chromeLaunchConfig: {
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      ...(executablePath ? { executablePath } : {}),
    },
  };
  const result = await pa11y(url, options);
  const review = result.issues.filter((issue) => issue.runnerExtras?.needsFurtherReview);
  if (review.length) {
    console.log(`note: pa11y left ${review.length} unconfirmed axe result(s) on ${url}`);
  }
  return pa11yBlocking(result.issues).map((issue) => {
    const impact = issue.runnerExtras?.impact ?? issue.type;
    return `pa11y ${url} ${impact} ${issue.code}: ${issue.message}`;
  });
}

async function main() {
  const { server, port } = await startServer();
  const executablePath = chromePath();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    ...(executablePath ? { executablePath } : {}),
  });
  const problems = [];
  try {
    for (const pagePath of PAGES) {
      const url = `http://127.0.0.1:${port}${pagePath}`;
      const result = await auditPage(browser, url, { toolbar: pagePath.endsWith("index.html") });
      problems.push(...result.problems);
      if (result.notes.length) console.log(result.notes.join("\n"));
      problems.push(...(await runPa11y(url, executablePath)));
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log("axe, pa11y, and CSP checks passed");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
