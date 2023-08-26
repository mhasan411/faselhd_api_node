const express = require('express');
const { getDirectLink } = require("./apis/getDirectLink");
const { search } = require("./apis/search");
const { getMovies, getSeries, getEpisode } = require("./apis/getContent");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

router.all("/directlink", async (req, res) => {
  try {
    const id = req.method === "POST" ? req.body.id : req.query.id;

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

router.all("/search", async (req, res) => {
  try {
    const query = req.method === "POST" ? req.body.query : req.query.query;
    const page = req.method === "POST" ? req.body.page : req.query.page;
    const pageSize =
      req.method === "POST" ? req.body.pageSize : req.query.pageSize;

    const result = await search(query, page, pageSize);

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

router.get("/movie/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const result = await getMovies(id);

    if (!result.success || result.postType !== "movies") {
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

router.get("/tv/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const result = await getSeries(id);

    if (!result.success || result.postType !== "series") {
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

router.get("/tv/:id/episode/:episodeNumber", async (req, res) => {
  try {
    const id = req.params.id;
    const episodeNumber = req.params.episodeNumber;

    if (!id || !episodeNumber) {
      return res
        .status(400)
        .json({ error: "id and episodeNumber are required" });
    }

    const result = await getEpisode(id, episodeNumber);

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

module.exports = router;
