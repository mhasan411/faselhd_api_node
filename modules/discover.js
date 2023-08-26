const axios = require("axios");
const fs = require("fs");
const token = fs.readFileSync("api.key", "utf8");

const discover = async (categoryName = "movies", page = 1, pageSize = 10) => {
  const response = await axios.post(
    "https://netcore.faselhd.pro/api/v1.0/Content/GetContents",
    {
      data: {
        pageNumber: page,
        data: {
            subCategoryName: categoryName,
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

module.exports = { discover };
