const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

const getDirectLink = async (id) => {
  const url = `https://faselhd-embed.scdn.to/video_player?uid=0&vid=${id}`;
  const { data: script } = await axios.get(url);

  const regex = /\/g.....(.*?)\)/gm;
  const matches = [...script.matchAll(regex)];
  const code = matches[0]?.[1] || null;

  if (!script || !code) {
    return { success: false };
  }

  let page = "";
  const cleanedScript = script.replace(/['+\n]/g, "");
  const scriptChunks = cleanedScript.split(".");

  scriptChunks.forEach((elm) => {
    const c_elm = Buffer.from(elm + "==", "base64").toString("ascii");
    const matches = c_elm.match(/\d+/g);

    if (matches) {
      const nb = parseInt(matches[0], 10) + parseInt(code, 10);
      page += String.fromCharCode(nb);
    }
  });

  const regexPattern = /file":"(.+?)"/s;
  const matches2 = page.match(regexPattern);
  const directLinks = matches2?.[1] || "";

  if (!directLinks) {
    return { success: false };
  }

  const { data: directLinkData } = await axios.get(directLinks);
  const qualityUrls = [];
  const lines = directLinkData.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("http")) {
      const match = line.match(/(\d+)_([a-z]+)(\d+)b_playlist.m3u8/);
      if (match) {
        const quality = match[3] + "p";
        qualityUrls.push({ label: quality, url: line });
      }
    }
  });

  return {
    directLink: qualityUrls,
    success: true,
  };
};

app.all("/api/directlink", async (req, res) => {
  try {
    const id = req.method === 'POST' ? req.body.id : req.query.id;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const result = await getDirectLink(id);
    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, (err, res) => {
  if (err) {
    console.log(err);
    return res.status(500).send(err.message);
  } else {
    console.log("[INFO] Server Running on http://localhost:" + port);
  }
});

module.exports = app;
