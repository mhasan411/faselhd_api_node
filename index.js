const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

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
