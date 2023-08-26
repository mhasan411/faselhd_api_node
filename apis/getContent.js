const axios = require("axios");
const fs = require("fs");
const { getDirectLink } = require("./getDirectLink");

const getContent = async (id) => {
  const token = fs.readFileSync("api.key", "utf8");
  const response = await axios.get(
    `https://netcore.faselhd.pro/api/v1.0/Content/GetContent?ContentId=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  let data = response.data;

  if (data.statusCode !== 1) {
    return { success: false, error: data };
  }

  data = data.result;
  return data;
};

const getMovies = async (id) => {
  let data = await getContent(id);

  const directLink = await getDirectLink(data.videoId);
  let links = [];

  if (directLink.success) {
    links = directLink.directLink;
  }

  data = {
    ...data,
    links: links,
    success: directLink.success,
  };

  return data;
};

const getSeries = getContent;

const getEpisode = async (id, episodeNumber) => {
  let seriesData = await getSeries(id);

  if (
    episodeNumber !== null &&
    seriesData.episodesVideosIds[episodeNumber - 1]
  ) {
    let videoId = seriesData.episodesVideosIds[episodeNumber - 1]?.videoId;

    if (!videoId) {
      return { success: false, error: "Video ID does not exist" };
    }

    const directLink = await getDirectLink(videoId);
    let links = [];

    if (directLink.success) {
      links = directLink.directLink;
    }

    seriesData = {
      name: `${seriesData.name} - Episode ${episodeNumber}`,
    };

    seriesData = {
      ...seriesData,
      links: links,
      success: directLink.success,
    };
  } else {
    seriesData = {
      success: false,
      error: "Episode number is required or does not exist",
    };
  }

  return seriesData;
};

module.exports = { getMovies, getSeries, getEpisode };
