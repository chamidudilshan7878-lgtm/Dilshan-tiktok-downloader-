const MANIFEST_JSON = JSON.stringify({
  name: "TikTok DL",
  short_name: "TikTok DL",
  start_url: "/",
  display: "standalone",
  background_color: "#000000",
  theme_color: "#000000",
  description: "Download TikTok Photos, Videos and MP3",
  icons: [
    {
      src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23000000' stroke='%23ffffff' stroke-width='6'/><text x='50' y='65' font-size='48' text-anchor='middle' fill='%23ffffff'>DL</text></svg>",
      sizes: "192x192",
      type: "image/svg+xml"
    }
  ]
});

const SW_JS = `
const CACHE_NAME = "tiktok-dl-bw-v1";
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
      color: #ffffff;
      padding: 16px;
    }

    .top-bar {
      max-width: 460px;
      margin: 0 auto 12px auto;
      display: flex;
      justify-content: flex-end;
    }

    .logout-btn {
      background: #0a0a0a;
      color: #ffffff;
      border: 1px solid #333333;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
    }

    .logout-btn:hover {
      border-color: #ffffff;
    }

    .container {
      max-width: 460px;
      margin: 0 auto;
    }

    .card {
      background: #090909;
      border: 1px solid #262626;
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
      border: 1px solid #ffffff;
      background: #000000;
      color: #ffffff;
      display: grid;
      place-items: center;
      font-size: 13px;
      font-weight: bold;
    }

    .brand-title {
      color: #ffffff;
      font-weight: 700;
      font-size: 15px;
    }

    .install-btn {
      background: #ffffff;
      color: #000000;
      border: 1px solid #ffffff;
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .install-btn:hover {
      background: #e5e5e5;
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
      border: 1.5px solid #ffffff;
      background: #000000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .hero-icon .arrow {
      font-size: 24px;
      color: #ffffff;
      line-height: 1;
    }

    .hero-icon .badge-text {
      background: #ffffff;
      color: #000000;
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
      color: #ffffff;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .sub-heading {
      text-align: center;
      font-size: 13px;
      color: #b3b3b3;
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
      border: 1px solid #333333;
      background: #000000;
      color: #ffffff;
      font-size: 14px;
      outline: none;
    }

    #tiktokUrl:focus {
      border-color: #ffffff;
    }

    .primary-btn {
      width: 100%;
      padding: 13px;
      border: 1px solid #ffffff;
      border-radius: 10px;
      background: #ffffff;
      color: #000000;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }

    .primary-btn:hover {
      background: #e5e5e5;
    }

    .primary-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .status-msg {
      text-align: center;
      margin-top: 14px;
      font-size: 13px;
      color: #e5e5e5;
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
      border: 1px solid #262626;
      margin-bottom: 12px;
    }

    .photo-gallery {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .photo-item {
      background: #000000;
      border: 1px solid #262626;
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
      border: 1px solid #ffffff;
      border-radius: 7px;
      background: #ffffff;
      color: #000000;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .caption {
      font-size: 13px;
      color: #cccccc;
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
      border: 1px solid #ffffff;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-white {
      background: #ffffff;
      color: #000000;
    }

    .btn-dark {
      background: #000000;
      color: #ffffff;
    }

    .btn-dark:hover {
      background: #1a1a1a;
    }

    .footer {
      margin-top: 22px;
      text-align: center;
      font-size: 12px;
      color: #888888;
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
    });

    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      } else {
        statusMsg.classList.remove("hidden");
        statusMsg.textContent =
          "Browser menu (⋮) එකෙන් 'Install app' හෝ 'Add to Home screen' තෝරන්න.";
      }
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
          throw new Error("Server එකෙන් හරි response එකක් ආවේ නැහැ. නැවත උත්සාහ කරන්න.");
        }

        if (!res.ok || !data || !data.success) {
          throw new Error((data && data.error) || "Link එකෙන් media ලබාගත නොහැකි විය.");
        }

        statusMsg.classList.add("hidden");
        resultArea.classList.remove("hidden");
        mediaCaption.textContent = data.title || "";

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

          addActionButton("Download All Photos (" + data.images.length + ")", "btn-white", () => {
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
          addActionButton("Download 1080p Full HD (No Watermark)", "btn-white", () => {
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
      } catch (err) {
        statusMsg.textContent = err.message || "දෝෂයක් ඇති විය.";
        statusMsg.classList.remove("hidden");
      } finally {
        submitBtn.disabled = false;
      }
    });
  </script>
</body>
</html>`;

async function fetchTikTokInfo(tiktokUrl) {
  const endpoints = [
    "https://www.tikwm.com/api/?url=" + encodeURIComponent(tiktokUrl) + "&hd=1",
    "https://tikwm.com/api/?url=" + encodeURIComponent(tiktokUrl) + "&hd=1"
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json, text/plain, */*"
        }
      });
      const text = await res.text();
      if (!text) continue;
      const json = JSON.parse(text);
      if (json && json.code === 0 && json.data) {
        return json.data;
      }
    } catch (_) {
      // Try next endpoint
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
            { error: "කරුණාකර වලංගු TikTok link එකක් ඇතුළත් කරන්න." },
            { status: 400 }
          );
        }

        const info = await fetchTikTokInfo(tiktokUrl);
        if (!info) {
          return Response.json(
            { error: "Link එකෙන් media තොරතුරු ලබාගත නොහැකි විය. වෙනත් link එකක් උත්සාහ කරන්න." },
            { status: 404 }
          );
        }

        const isPhotoPost = Array.isArray(info.images) && info.images.length > 0;

        return Response.json({
          success: true,
          type: isPhotoPost ? "photo" : "video",
          title: info.title || "TikTok Media",
          cover: info.cover || (isPhotoPost ? info.images[0] : ""),
          images: isPhotoPost ? info.images : [],
          downloads: {
            hdVideo: info.hdplay || info.play || null,
            sdVideo: info.play || null,
            watermarkVideo: info.wmplay || null,
            audio: info.music || null
          }
        });
      } catch (err) {
        return Response.json(
          { error: "Server එකේ දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න." },
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
