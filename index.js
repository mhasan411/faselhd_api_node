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

app.post("/api/directlink", (req, res) => {
  const id = req.body.id;

  if (!id) {
    res.send({
      error: "id is required",
    });
  }

  let videoId = id;
  const url = "https://faselhd-embed.scdn.to/video_player?uid=0&vid=" + videoId;

  axios.get(url).then((response) => {
    let script = response.data;
    const regex = /\/g.....(.*?)\)/gm;
    const matches = [...script.matchAll(regex)];
    const code = matches[0]?.[1] || null;
    const nativePlayer = false;

    let directLinks = "";

    let page = "";
    if (script && code) {
      script = script.replace(/'/g, "").replace(/\+/g, "").replace(/\n/g, "");
      const sc = script.split(".");
      sc.forEach((elm) => {
        const c_elm = Buffer.from(elm + "==", "base64").toString("ascii");
        const matches = c_elm.match(/\d+/g);
        if (matches) {
          const nb = parseInt(matches[0], 10) + parseInt(code, 10);
          page += String.fromCharCode(nb);
        }
      });

      const regex = nativePlayer
        ? /var\s*videoSrc\s*=\s*'(.+?)'/s
        : /file":"(.+?)"/s;
      const matches2 = page.match(regex);
      directLinks = matches2?.[1] || "";
    }

    if (directLinks == "") {
      res.send({
        success: false,
      });
      return;
    }
    axios
      .get(directLinks)
      .then((response) => {
        const qualityUrls = [];
        const lines = response.data.split("\n");
        lines.forEach((line) => {
          if (line.startsWith("http")) {
            const match = line.match(/(\d+)_([a-z]+)(\d+)b_playlist.m3u8/);
            if (match) {
              const quality = match[3] + "p";
              qualityUrls.push({ label: quality, url: line });
            }
          }
        });
        res.send({
          directLink: qualityUrls,
          success: true,
        });
      })
      .catch((error) => {
        res.send({
          success: false,
          error: error.message,
        });
      });
  });
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
