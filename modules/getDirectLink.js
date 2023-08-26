const axios = require("axios");

getDirectLink = async (id) => {
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
    return { success: false, error: "No direct links found" };
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

module.exports = { getDirectLink };
