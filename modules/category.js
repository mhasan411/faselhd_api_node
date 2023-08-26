const axios = require("axios");
const fs = require("fs");
const token = fs.readFileSync("token.key", "utf8");

const allCategories = async () => {
  const response = await axios.get(
    "https://netcore.faselhd.pro/api/v1.0/Category/GetCategories",
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

const getSubCategories = async (id) => {
  const response = await axios.get(
    "https://netcore.faselhd.pro/api/v1.0/Category/GetHomeCategories",
    {
      params: {
        CategoryMainId: id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let subData = response.data;

  if (subData.statusCode !== 1) {
    return { success: false, error: subData };
  }

  subData = subData.result;

  return subData;
};

module.exports = { allCategories, getSubCategories };
