const { Axios } = require("axios");
const { RAPID_API_KEY } = require("../../environments/config");

const axios = new Axios({
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "Content-Type": "application/json",
  },
  transformRequest: [(data) => JSON.stringify(data)],
  transformResponse: [
    (data) => {
      //   console.log(data);
      try {
        return JSON.parse(data);
      } catch (err) {
        return data;
      }
    },
  ],
});

module.exports.axios = axios;
