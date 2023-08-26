const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getDirectLink } = require("../modules/getDirectLink");
const { search } = require("../modules/search");
const { getMovies, getSeries, getEpisode } = require("../modules/getContent");
const { discover } = require("../modules/discover");
const { getSubCategories, allCategories } = require("../modules/category");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

app.all("/directlink", async (req, res) => {
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

app.all("/search", async (req, res) => {
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

app.get("/movie/:id", async (req, res) => {
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

app.get("/tv/:id", async (req, res) => {
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

app.get("/tv/:id/episode/:episodeNumber", async (req, res) => {
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

app.get("/discover/:category?", async (req, res) => {
  try {
    const category = req.params.category || "movies";
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;

    const result = await discover(category, page, pageSize);

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

app.get("/allCategories", async (req, res) => {
  try {
    const result = await allCategories();

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

app.get("/categories/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const result = await getSubCategories(id);

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
