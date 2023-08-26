const axios = require("axios");
const fs = require("fs");
const search = async (query, page = 1, pageSize = 15) => {
  const token = fs.readFileSync("api.key", "utf8");
  const response = await axios.post(
    "https://netcore.faselhd.pro/api/v1.0/Content/ContentSearch",
    {
      data: {
        pageNumber: page,
        data: {
          searchText: query,
        },
        pageSize: pageSize,
      },
    },
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

module.exports = { search };
