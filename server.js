const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = process.env.K_SERVICE
  ? path.join(os.tmpdir(), "arabety-data")
  : path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "arabety-db.json");

function ensureDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(
        DB_FILE,
        JSON.stringify(
          { initializedAt: new Date().toISOString(), csvBatches: [], orders: [] },
          null,
          2
        ),
        "utf8"
      );
    }
  } catch (err) {
    console.warn("DB init warning:", err.message);
  }
}

const server = http.createServer((req, res) => {
  ensureDb();
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || "/";

  // Serve sample CSV template
  if (pathname === "/sample-trader-stock.csv") {
    const csvPath = path.join(PUBLIC_DIR, "sample-trader-stock.csv");
    if (fs.existsSync(csvPath)) {
      res.writeHead(200, {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="sample-trader-stock.csv"',
      });
      return res.end(fs.readFileSync(csvPath, "utf8"));
    }
  }

  // Serve main app or /trader/stock route with preloaded mock data
  if (
    pathname === "/" ||
    pathname === "/index.html" ||
    pathname === "/preview.html" ||
    pathname === "/trader/stock"
  ) {
    const htmlPath = path.join(PUBLIC_DIR, "preview.html");
    if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, "utf8");
      if (pathname === "/trader/stock") {
        html = html.replace(
          "activeTab: 'storefront'",
          "activeTab: 'trader-stock'"
        );
      }
      // Include standard Tailwind CDN + fallback theme tokens for any public browser
      html = html.replace(
        '<script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>',
        '<script src="https://cdn.tailwindcss.com"></script>\n  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>\n  <style>:root { --background: #f8fafc; --card: #ffffff; --foreground: #0f172a; --muted-foreground: #64748b; --border: #e2e8f0; --placeholder: #94a3b8; }</style>'
      );
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    }
  }

  // Health/API status endpoint for Cloud Run readiness probes
  if (pathname === "/api/health" || pathname === "/_ah/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ status: "ok", app: "Arabety Marketplace (Mock Data Active)" })
    );
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`====================================================`);
  console.log(`🚗 Arabety (عربيتي) Server is running on port ${PORT}!`);
  console.log(`👉 Storefront & All Tabs: http://localhost:${PORT}`);
  console.log(`👉 Trader CSV Stock Page: http://localhost:${PORT}/trader/stock`);
  console.log(`====================================================`);
});
