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

// PWA Install Prompt Handling
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add("hidden");
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
  const proxyUrl = `/api/download?fileUrl=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(filename)}`;
  const a = document.createElement("a");
  a.href = proxyUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function addActionButton(label, colorClass, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `dl-btn ${colorClass}`;
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
  statusMsg.classList.remove("hidden", "error");

  try {
    const res = await fetch("/api/fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch link.");
    }

    statusMsg.classList.add("hidden");
    resultArea.classList.remove("hidden");
    mediaCaption.textContent = data.title || "";

    // If TikTok post contains Photos (Photo Mode / Slideshow)
    if (data.type === "photo" && data.images.length > 0) {
      photoGallery.classList.remove("hidden");

      data.images.forEach((imgUrl, index) => {
        const item = document.createElement("div");
        item.className = "photo-item";

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `TikTok Photo ${index + 1}`;

        const dlBtn = document.createElement("button");
        dlBtn.type = "button";
        dlBtn.className = "photo-dl-btn";
        dlBtn.textContent = `Download Photo ${index + 1}`;
        dlBtn.addEventListener("click", () => {
          triggerDownload(imgUrl, `tiktok-photo-${index + 1}.jpg`);
        });

        item.appendChild(img);
        item.appendChild(dlBtn);
        photoGallery.appendChild(item);
      });

      addActionButton(
        `Download All Photos (${data.images.length})`,
        "btn-green",
        () => {
          data.images.forEach((imgUrl, idx) => {
            setTimeout(() => {
              triggerDownload(imgUrl, `tiktok-photo-${idx + 1}.jpg`);
            }, idx * 450);
          });
        }
      );
    } else if (data.cover) {
      previewCover.src = data.cover;
      previewCover.classList.remove("hidden");
    }

    // Video & Audio Buttons
    if (data.downloads.hdVideo) {
      addActionButton("Download 1080p Full HD (No Watermark)", "btn-green", () => {
        triggerDownload(data.downloads.hdVideo, "tiktok-1080p-no-watermark.mp4");
      });
    }

    if (data.downloads.sdVideo) {
      addActionButton("Download 720p HD (No Watermark)", "btn-blue", () => {
        triggerDownload(data.downloads.sdVideo, "tiktok-720p-no-watermark.mp4");
      });
    }

    if (data.downloads.watermarkVideo) {
      addActionButton("Download Watermark Video", "btn-orange", () => {
        triggerDownload(data.downloads.watermarkVideo, "tiktok-watermark.mp4");
      });
    }

    if (data.downloads.audio) {
      addActionButton("Download Audio (MP3)", "btn-purple", () => {
        triggerDownload(data.downloads.audio, "tiktok-audio.mp3");
      });
    }
  } catch (err) {
    statusMsg.textContent = err.message;
    statusMsg.classList.add("error");
  } finally {
    submitBtn.disabled = false;
  }
});
