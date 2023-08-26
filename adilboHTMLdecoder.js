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
