const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

// create express app
const app = express();

// use cors
app.use(cors());
// server port
const port = 5000;

// start server
app.listen(port, () =>
  console.log(
    `Server started on port ${port} and url = http://localhost:${port} `
  )
);

app.get("/api/directlink", (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.send({
      error: "id is required",
    });
  }

  let videoId = id;
  const url = "https://faselhd-embed.scdn.to/video_player?uid=0&vid=" + videoId;

  axios.get(url).then((response) => {
    const $ = cheerio.load(response.data);
    let script = $("script").eq(0).html();
    const regex = /\/g.....(.*?)\)/gm;
    const matches = [...script.matchAll(regex)];
    const code = matches[0]?.[1] || null;
    const directLinks = adilboHTMLdecoder(code, script, false);

    if (directLinks == "") {
      res.send({
        success: false,
      });
      return;
    }
    axios
      .get(directLinks)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const qualityUrls = {};
        $("body")
          .contents()
          .each(function (i, el) {
            if (el.type === "text") {
              const lines = el.data.split("\n");
              lines.forEach((line) => {
                if (line.startsWith("http")) {
                  const match = line.match(
                    /(\d+)_([a-z]+)(\d+)b_playlist.m3u8/
                  );
                  if (match) {
                    const quality = match[3] + "p";
                    qualityUrls[quality] = line;
                  }
                }
              });
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

function adilboHTMLdecoder(code, script, nativePlayer) {
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
    return matches2?.[1] || "";
  }
  return "";
}

module.exports = app;
