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
      return JSON.parse(data);
    },
  ],
});

module.exports.axios = axios;
