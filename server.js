const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Fetch TikTok Video / Photo Slideshow / Audio info
app.post("/api/fetch", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("tiktok.com")) {
    return res.status(400).json({ error: "කරුණාකර වලංගු TikTok link එකක් ඇතුළත් කරන්න." });
  }

  try {
    const response = await axios.get("https://www.tikwm.com/api/", {
      params: { url, hd: 1 },
      timeout: 15000,
    });

    const data = response.data;
    if (data.code !== 0 || !data.data) {
      return res.status(404).json({ error: "Link එකෙන් media තොරතුරු ලබාගත නොහැකි විය." });
    }

    const info = data.data;
    const isPhotoPost = Array.isArray(info.images) && info.images.length > 0;

    res.json({
      success: true,
      type: isPhotoPost ? "photo" : "video",
      title: info.title || "TikTok Media",
      cover: info.cover || (isPhotoPost ? info.images[0] : ""),
      images: isPhotoPost ? info.images : [],
      downloads: {
        hdVideo: info.hdplay || info.play || null,
        sdVideo: info.play || null,
        watermarkVideo: info.wmplay || null,
        audio: info.music || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server එකේ දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න." });
  }
});

// Proxy file download so photos/videos/mp3 save cleanly
app.get("/api/download", async (req, res) => {
  const { fileUrl, filename } = req.query;

  if (!fileUrl) {
    return res.status(400).send("Missing fileUrl");
  }

  try {
    const streamResponse = await axios({
      method: "GET",
      url: decodeURIComponent(fileUrl),
      responseType: "stream",
      timeout: 30000,
    });

    const safeName = (filename || "tiktok-download").replace(/[^a-zA-Z0-9._-]/g, "_");
    if (streamResponse.headers["content-type"]) {
      res.setHeader("Content-Type", streamResponse.headers["content-type"]);
    }
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);

    streamResponse.data.pipe(res);
  } catch (err) {
    res.status(500).send("File එක download කිරීමට නොහැකි විය.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
