const fs = require("fs");
const path = require("path");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function createStaticHandler({ publicDir, sfxDir, eventSfxAliases = {} }) {
  function serveHttp(req, res) {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (url.pathname === "/api/sfx") {
      sendJson(res, { sfx: getEventSfxPaths(sfxDir, eventSfxAliases) });
      return;
    }

    if (url.pathname.startsWith("/sfx/")) {
      const file = safePath(sfxDir, url.pathname.replace(/^\/sfx\//, ""));
      serveFile(req, file, res);
      return;
    }

    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = safePath(publicDir, pathname);
    serveFile(req, file, res);
  }

  return serveHttp;
}

function safePath(root, requestPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(requestPath).replace(/^[/\\]+/, "");
  } catch (error) {
    return null;
  }
  const resolved = path.resolve(root, decoded);
  const normalizedRoot = path.resolve(root);
  const relative = path.relative(normalizedRoot, resolved);
  return relative && (relative.startsWith("..") || path.isAbsolute(relative)) ? null : resolved;
}

function serveFile(req, file, res) {
  if (!file || !fs.existsSync(file)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const stat = fs.statSync(file);
  if (!stat.isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const isAudio = [".wav", ".mp3", ".ogg"].includes(ext);
  const etag = `W/"${stat.size}-${Math.floor(stat.mtimeMs)}"`;
  const baseHeaders = {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Cache-Control": isAudio ? "public, max-age=86400" : "no-cache",
    "ETag": etag,
    "Last-Modified": stat.mtime.toUTCString()
  };

  if (!req.headers.range && req.headers["if-none-match"] === etag) {
    res.writeHead(304, baseHeaders);
    res.end();
    return;
  }

  if (isAudio) {
    baseHeaders["Accept-Ranges"] = "bytes";
  }

  if (isAudio && req.headers.range) {
    const range = parseRange(req.headers.range, stat.size);
    if (!range) {
      res.writeHead(416, {
        ...baseHeaders,
        "Content-Range": `bytes */${stat.size}`
      });
      res.end();
      return;
    }

    res.writeHead(206, {
      ...baseHeaders,
      "Content-Length": range.end - range.start + 1,
      "Content-Range": `bytes ${range.start}-${range.end}/${stat.size}`
    });
    fs.createReadStream(file, { start: range.start, end: range.end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    ...baseHeaders,
    "Content-Length": stat.size
  });
  fs.createReadStream(file).pipe(res);
}

function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header || "");
  if (!match) return null;
  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;

  if (!Number.isInteger(start) || !Number.isInteger(end)) return null;
  if (!match[1] && match[2]) {
    const suffixLength = Number(match[2]);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  }

  end = Math.min(end, size - 1);
  return start <= end && start >= 0 ? { start, end } : null;
}

function sendJson(res, body) {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function getEventSfxPaths(sfxDir, eventSfxAliases) {
  const entries = [];
  try {
    for (const file of fs.readdirSync(sfxDir)) {
      if (!file.toLowerCase().endsWith(".mp3")) continue;
      const name = path.basename(file, path.extname(file));
      entries.push([name, `/sfx/${encodeURIComponent(file)}`]);
    }
  } catch (error) {}
  const paths = Object.fromEntries(entries);
  for (const [alias, target] of Object.entries(eventSfxAliases)) {
    if (paths[target] && !paths[alias]) {
      paths[alias] = paths[target];
    }
  }
  return paths;
}

module.exports = {
  createStaticHandler,
  getEventSfxPaths
};
