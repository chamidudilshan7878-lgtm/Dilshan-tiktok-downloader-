// Replace these placeholders with your actual base64 PNG strings (without "data:image/png;base64,")
const ICON_192_BASE64 = "PASTE_192X192_PNG_BASE64_HERE";
const ICON_512_BASE64 = "PASTE_512X512_PNG_BASE64_HERE";

const FALLBACK_SVG_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23000000' stroke='%23d4d4d4' stroke-width='5'/><text x='50' y='65' font-size='48' text-anchor='middle' fill='%23e5e5e5'>DL</text></svg>";

const MANIFEST_JSON = JSON.stringify({
  name: "TikTok DL",
  short_name: "TikTok DL",
  start_url: "/",
  display: "standalone",
  orientation: "portrait",
  background_color: "#000000",
  theme_color: "#000000",
  description: "Download TikTok Photos, Videos and MP3",
  icons: [
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    }
  ]
});

const SW_JS = `
const CACHE_NAME = "tiktok-dl-bw-v4";
self.addEventListener("install", (event) => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
`;

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#000000" />
  <title>TikTok DL - TikTok Downloader</title>
  <link rel="manifest" href="/manifest.json" />
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
    }

    body {
      min-height: 100vh;
      background: #000000;
      color: #e5e5e5;
      padding: 16px;
    }

    .top-bar {
      max-width: 460px;
      margin: 0 auto 12px auto;
      display: flex;
      justify-content: flex-end;
    }

    .logout-btn {
      background: #0c0c0c;
      color: #d4d4d4;
      border: 1px solid #2b2b2b;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
    }

    .logout-btn:hover {
      border-color: #737373;
      color: #ffffff;
    }

    .container {
      max-width: 460px;
      margin: 0 auto;
    }

    .card {
      background: #0b0b0b;
      border: 1px solid #242424;
      border-radius: 16px;
      padding: 22px 18px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
      gap: 10px;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mini-icon {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      border: 1px solid #525252;
      background: #050505;
      color: #e5e5e5;
      display: grid;
      place-items: center;
      font-size: 13px;
      font-weight: bold;
    }

    .brand-title {
      color: #e5e5e5;
      font-weight: 700;
      font-size: 15px;
    }

    .install-btn {
      background: #e5e5e5;
      color: #0a0a0a;
      border: 1px solid #d4d4d4;
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .install-btn:hover {
      background: #cccccc;
    }

    .hero-icon-box {
      display: flex;
      justify-content: center;
      margin-bottom: 18px;
    }

    .hero-icon {
      width: 84px;
      height: 84px;
      border-radius: 16px;
      border: 1.5px solid #525252;
      background: #050505;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .hero-icon .arrow {
      font-size: 24px;
      color: #e5e5e5;
      line-height: 1;
    }

    .hero-icon .badge-text {
      background: #e5e5e5;
      color: #0a0a0a;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.6px;
    }

    .main-heading {
      text-align: center;
      font-size: 22px;
      font-weight: 800;
      color: #ededed;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .sub-heading {
      text-align: center;
      font-size: 13px;
      color: #9e9e9e;
      line-height: 1.45;
      margin-bottom: 20px;
    }

    .form-box {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    #tiktokUrl {
      width: 100%;
      padding: 13px 14px;
      border-radius: 10px;
      border: 1px solid #2b2b2b;
      background: #040404;
      color: #e5e5e5;
      font-size: 14px;
      outline: none;
    }

    #tiktokUrl:focus {
      border-color: #737373;
    }

    .primary-btn {
      width: 100%;
      padding: 13px;
      border: 1px solid #d4d4d4;
      border-radius: 10px;
      background: #e5e5e5;
      color: #0a0a0a;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }

    .primary-btn:hover {
      background: #cccccc;
    }

    .primary-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .status-msg {
      text-align: center;
      margin-top: 14px;
      font-size: 13px;
      color: #bdbdbd;
      line-height: 1.45;
    }

    .result-area {
      margin-top: 20px;
    }

    .preview-cover {
      width: 100%;
      max-height: 360px;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid #242424;
      margin-bottom: 12px;
    }

    .photo-gallery {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .photo-item {
      background: #050505;
      border: 1px solid #242424;
      border-radius: 10px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .photo-item img {
      width: 100%;
      height: 165px;
      object-fit: cover;
      border-radius: 7px;
    }

    .photo-dl-btn {
      width: 100%;
      padding: 7px;
      border: 1px solid #d4d4d4;
      border-radius: 7px;
      background: #e5e5e5;
      color: #0a0a0a;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .photo-dl-btn:hover {
      background: #cccccc;
    }

    .caption {
      font-size: 13px;
      color: #bdbdbd;
      margin-bottom: 14px;
      word-break: break-word;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .dl-btn {
      width: 100%;
      padding: 12px;
      border: 1px solid #404040;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-light {
      background: #e5e5e5;
      color: #0a0a0a;
      border-color: #d4d4d4;
    }

    .btn-light:hover {
      background: #cccccc;
    }

    .btn-dark {
      background: #121212;
      color: #e5e5e5;
    }

    .btn-dark:hover {
      background: #1e1e1e;
      border-color: #737373;
    }

    .footer {
      margin-top: 22px;
      text-align: center;
      font-size: 12px;
      color: #7a7a7a;
    }

    .hidden {
      display: none !important;
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <button id="logoutBtn" class="logout-btn" type="button">🔒 Logout</button>
  </div>

  <main class="container">
    <div class="card">
      <div class="card-header">
        <div class="brand-row">
          <div class="mini-icon">⬇</div>
          <span class="brand-title">TikTok DL</span>
        </div>
        <button id="installBtn" class="install-btn" type="button">📲 Install App</button>
      </div>

      <div class="hero-icon-box">
        <div class="hero-icon">
          <span class="arrow">⬇</span>
          <span class="badge-text">TIKTOK</span>
        </div>
      </div>

      <h1 class="main-heading">TIKTOK DOWNLOADER</h1>
      <p class="sub-heading">
        Download TikTok Photos, Videos in 1080p, 720p &amp; MP3 Without Watermark
      </p>

      <form id="dlForm" class="form-box">
        <input
          id="tiktokUrl"
          type="text"
          placeholder="Paste TikTok Link Here..."
          autocomplete="off"
          required
        />
        <button id="submitBtn" class="primary-btn" type="submit">Download Now</button>
      </form>

      <div id="statusMsg" class="status-msg hidden"></div>

      <div id="resultArea" class="result-area hidden">
        <div id="photoGallery" class="photo-gallery hidden"></div>
        <img id="previewCover" class="preview-cover hidden" alt="Preview" />
        <p id="mediaCaption" class="caption"></p>
        <div id="actionButtons" class="action-buttons"></div>
      </div>

      <footer class="footer">© Powered by Dilshan</footer>
    </div>
  </main>

  <script>
    const form = document.getElementById("dlForm");
    const urlInput = document.getElementById("tiktokUrl");
    const submitBtn = document.getElementById("submitBtn");
    const statusMsg = document.getElementById("statusMsg");
    const resultArea = document.getElementById("resultArea");
    const photoGallery = document.getElementById("photoGallery");
    const previewCover = document.getElementById("previewCover");
    const mediaCaption = document.getElementById("mediaCaption");
    const actionButtons = document.getElementById("actionButtons");
    const installBtn = document.getElementById("installBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    let deferredPrompt = null;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.style.opacity = "1";
    });

    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) {
        statusMsg.classList.remove("hidden");
        statusMsg.textContent =
          "Install prompt is not ready yet. Open in Chrome/Brave and tap browser menu (⋮) -> Install app.";
        return;
      }

      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;

      if (choice && choice.outcome === "accepted") {
        statusMsg.classList.remove("hidden");
        statusMsg.textContent = "App installed.";
      }
    });

    window.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      statusMsg.classList.remove("hidden");
      statusMsg.textContent = "TikTok DL installed.";
    });

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }

    logoutBtn.addEventListener("click", () => {
      urlInput.value = "";
      resultArea.classList.add("hidden");
      statusMsg.classList.add("hidden");
    });

    function triggerDownload(fileUrl, filename) {
      const dlUrl =
        "/api/download?fileUrl=" +
        encodeURIComponent(fileUrl) +
        "&filename=" +
        encodeURIComponent(filename);
      const a = document.createElement("a");
      a.href = dlUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    function addActionButton(label, styleClass, onClick) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dl-btn " + styleClass;
      btn.textContent = label;
      btn.addEventListener("click", onClick);
      actionButtons.appendChild(btn);
    }

    function renderResult(data) {
      statusMsg.classList.add("hidden");
      resultArea.classList.remove("hidden");
      mediaCaption.textContent = data.title || "TikTok Media";

      if (data.type === "photo" && Array.isArray(data.images) && data.images.length > 0) {
        photoGallery.classList.remove("hidden");

        data.images.forEach((imgUrl, index) => {
          const item = document.createElement("div");
          item.className = "photo-item";

          const img = document.createElement("img");
          img.src = imgUrl;
          img.alt = "TikTok Photo " + (index + 1);

          const dlBtn = document.createElement("button");
          dlBtn.type = "button";
          dlBtn.className = "photo-dl-btn";
          dlBtn.textContent = "Download Photo " + (index + 1);
          dlBtn.addEventListener("click", () => {
            triggerDownload(imgUrl, "tiktok-photo-" + (index + 1) + ".jpg");
          });

          item.appendChild(img);
          item.appendChild(dlBtn);
          photoGallery.appendChild(item);
        });

        addActionButton("Download All Photos (" + data.images.length + ")", "btn-light", () => {
          data.images.forEach((imgUrl, idx) => {
            setTimeout(() => {
              triggerDownload(imgUrl, "tiktok-photo-" + (idx + 1) + ".jpg");
            }, idx * 450);
          });
        });
      } else if (data.cover) {
        previewCover.src = data.cover;
        previewCover.classList.remove("hidden");
      }

      if (data.downloads && data.downloads.hdVideo) {
        addActionButton("Download 1080p Full HD (No Watermark)", "btn-light", () => {
          triggerDownload(data.downloads.hdVideo, "tiktok-1080p-no-watermark.mp4");
        });
      }

      if (data.downloads && data.downloads.sdVideo) {
        addActionButton("Download 720p HD (No Watermark)", "btn-dark", () => {
          triggerDownload(data.downloads.sdVideo, "tiktok-720p-no-watermark.mp4");
        });
      }

      if (data.downloads && data.downloads.watermarkVideo) {
        addActionButton("Download Watermark Video", "btn-dark", () => {
          triggerDownload(data.downloads.watermarkVideo, "tiktok-watermark.mp4");
        });
      }

      if (data.downloads && data.downloads.audio) {
        addActionButton("Download Audio (MP3)", "btn-dark", () => {
          triggerDownload(data.downloads.audio, "tiktok-audio.mp3");
        });
      }
    }

    function mapTikWMData(d) {
      const images = Array.isArray(d.images) ? d.images.filter(Boolean) : [];
      const isPhotoPost = images.length > 0;
      return {
        success: true,
        type: isPhotoPost ? "photo" : "video",
        title: d.title || "TikTok Media",
        cover: d.cover || (isPhotoPost ? images[0] : ""),
        images,
        downloads: {
          hdVideo: d.hdplay || d.play || null,
          sdVideo: d.play || null,
          watermarkVideo: d.wmplay || null,
          audio: d.music || null
        }
      };
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const url = urlInput.value.trim();
      if (!url) return;

      submitBtn.disabled = true;
      resultArea.classList.add("hidden");
      photoGallery.innerHTML = "";
      actionButtons.innerHTML = "";
      photoGallery.classList.add("hidden");
      previewCover.classList.add("hidden");

      statusMsg.textContent = "Processing link... Please wait...";
      statusMsg.classList.remove("hidden");

      try {
        // 1) Try Worker API first
        const res = await fetch("/api/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });

        const rawText = await res.text();
        let data = null;
        try {
          data = JSON.parse(rawText);
        } catch (_) {
          data = null;
        }

        if (res.ok && data && data.success) {
          renderResult(data);
          return;
        }

        // 2) Fallback directly to TikWM API (same method used in Dilshan All In One)
        const directRes = await fetch(
          "https://www.tikwm.com/api/?url=" + encodeURIComponent(url) + "&hd=1"
        );
        const directJson = await directRes.json();
        if (directJson && directJson.code === 0 && directJson.data) {
          renderResult(mapTikWMData(directJson.data));
          return;
        }

        throw new Error((data && data.error) || "Unable to fetch media from this link.");
      } catch (err) {
        statusMsg.textContent = err.message || "Something went wrong.";
        statusMsg.classList.remove("hidden");
      } finally {
        submitBtn.disabled = false;
      }
    });
  </script>
</body>
</html>`;

function base64ToBytes(base64) {
  const clean = (base64 || "").trim();
  if (!clean || clean.startsWith("PASTE_")) return null;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function resolveShortUrl(rawUrl) {
  try {
    const res = await fetch(rawUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      }
    });
    return res.url || rawUrl;
  } catch (_) {
    return rawUrl;
  }
}

function normalizeTikWM(d) {
  if (!d) return null;
  const images = Array.isArray(d.images) ? d.images.filter(Boolean) : [];
  const isPhotoPost = images.length > 0;
  const hdVideo = d.hdplay || d.play || null;
  const sdVideo = d.play || null;
  const watermarkVideo = d.wmplay || null;
  const audio = d.music || null;

  if (!isPhotoPost && !hdVideo && !sdVideo && !watermarkVideo && !audio) {
    return null;
  }

  return {
    success: true,
    type: isPhotoPost ? "photo" : "video",
    title: d.title || "TikTok Media",
    cover: d.cover || (isPhotoPost ? images[0] : ""),
    images,
    downloads: {
      hdVideo,
      sdVideo,
      watermarkVideo,
      audio
    }
  };
}

async function fetchTikTokInfo(tiktokUrl) {
  const expandedUrl = await resolveShortUrl(tiktokUrl);
  const candidates = expandedUrl !== tiktokUrl ? [expandedUrl, tiktokUrl] : [tiktokUrl];

  for (const targetUrl of candidates) {
    for (const host of ["https://www.tikwm.com", "https://tikwm.com"]) {
      try {
        const res = await fetch(
          `${host}/api/?url=${encodeURIComponent(targetUrl)}&hd=1`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0",
              "Accept": "application/json, text/plain, */*"
            }
          }
        );
        const text = await res.text();
        if (!text) continue;
        const json = JSON.parse(text);
        if (json && json.code === 0 && json.data) {
          const normalized = normalizeTikWM(json.data);
          if (normalized) return normalized;
        }
      } catch (_) {}
    }
  }
  return null;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/manifest.json") {
      return new Response(MANIFEST_JSON, {
        headers: { "Content-Type": "application/manifest+json; charset=utf-8" }
      });
    }

    if (url.pathname === "/icon-192.png") {
      const bytes = base64ToBytes(ICON_192_BASE64);
      if (bytes) {
        return new Response(bytes, {
          headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" }
        });
      }
      return Response.redirect(FALLBACK_SVG_ICON, 302);
    }

    if (url.pathname === "/icon-512.png") {
      const bytes = base64ToBytes(ICON_512_BASE64);
      if (bytes) {
        return new Response(bytes, {
          headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" }
        });
      }
      return Response.redirect(FALLBACK_SVG_ICON, 302);
    }

    if (url.pathname === "/sw.js") {
      return new Response(SW_JS, {
        headers: { "Content-Type": "application/javascript; charset=utf-8" }
      });
    }

    if (url.pathname === "/api/fetch" && request.method === "POST") {
      try {
        const bodyText = await request.text();
        let body = {};
        try {
          body = JSON.parse(bodyText || "{}");
        } catch (_) {
          return Response.json({ error: "Invalid request body." }, { status: 400 });
        }

        const tiktokUrl = (body.url || "").trim();
        if (!tiktokUrl || !tiktokUrl.includes("tiktok.com")) {
          return Response.json(
            { error: "Please enter a valid TikTok URL." },
            { status: 400 }
          );
        }

        const result = await fetchTikTokInfo(tiktokUrl);
        if (!result) {
          return Response.json(
            { error: "Unable to fetch media from this link. Please try another link." },
            { status: 404 }
          );
        }

        return Response.json(result);
      } catch (err) {
        return Response.json(
          { error: "Server error occurred. Please try again." },
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/api/download" && request.method === "GET") {
      const fileUrl = url.searchParams.get("fileUrl");
      const filename = (url.searchParams.get("filename") || "tiktok-download").replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      if (!fileUrl) {
        return new Response("Missing fileUrl", { status: 400 });
      }

      try {
        const fileRes = await fetch(decodeURIComponent(fileUrl), {
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        const headers = new Headers();
        const ct = fileRes.headers.get("content-type");
        if (ct) headers.set("Content-Type", ct);
        headers.set("Content-Disposition", `attachment; filename="${filename}"`);

        return new Response(fileRes.body, {
          status: fileRes.status,
          headers
        });
      } catch (err) {
        return new Response("Download failed", { status: 500 });
      }
    }

    return new Response(HTML_PAGE, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};
