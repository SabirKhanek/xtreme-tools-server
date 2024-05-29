const { Axios } = require("axios");
const { RAPID_API_KEY, DEVELOPMENT } = require("../../environments/config");
const { sendMail } = require("../nodemailer/controllers/sendMail");
const { ErrorWithStatus } = require("../error");
const axios = new Axios({
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "x-rapidapi-key": RAPID_API_KEY,
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

axios.interceptors.response.use(async (res) => {
  if (res.status >= 200 && res.status < 205) {
    return res;
  } else if (res.status >= 400 && res.status < 405) {
    console.log(res.data);
    throw new ErrorWithStatus(`Service error: Bad request`, 400);
  }
  {
    await sendMail(
      DEVELOPMENT ? "sabirkhanek66@gmail.com" : "kf7866@gmail.com",
      "RapidAPI error report",
      `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>API Response</title>
        </head>
        <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p><strong>API Url:</strong> ${res.request.host}</p>
            <p><strong>Status:</strong> ${res.status}</p>
            <p><strong>Response JSON:</strong></p>
            <pre style="white-space: pre-wrap;">${JSON.stringify(
              res.data,
              null,
              3
            )}</pre>
            <p style="margin-top: 10px;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>`
    );
    console.log(
      `APIUrl: ${res.request.host}<br/>Status: ${
        res.status
      }<br/>Response JSON:<br/>${JSON.stringify(res.data, null, 3)}`
    );
    throw new ErrorWithStatus(
      "Tool is under maintainence! Check back later.",
      res.status
    );
  }
});

module.exports.axios = axios;
