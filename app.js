const config = require("./environments/config");
const express = require("express");
const cors = require("cors");
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { apiRouter } = require("./routes");
const fs = require("fs");
const path = require("path");
const util = require("util");
const logFile = fs.createWriteStream(path.join(__dirname, "logfile.txt"), {
  flags: "a",
});
const logStdout = process.stdout;

console.log = function (message) {
  logFile.write(util.format(message) + "\n");
  logStdout.write(util.format(message) + "\n");
};

require("./services/ai_tools");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Xtreme Tools",
      version: "1.0.0",
    },
    servers: [
      { url: `${config.HOST}/api` },
      {
        url: `http://localhost:${config.PORT}/api`,
      },
    ],
  },
  apis: ["./routes/*/*.js"],
};
const swaggerSpec = swaggerJsDocs(options);

const app = express();
const standardizeResponse = require("./middlewares/standardizeResponse");
const { UserService } = require("./services/user");
app.use(standardizeResponse);
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/verify_user/:token", async (req, res, next) => {
  try {
    const token = req.params["token"];
    const userService = new UserService();
    const status = await userService.verifyToken(token);
    if (status) res.redirect(`${config.HOST}/user_verified`);
    else res.redirect(`${config.HOST}/verfication_failed`);
  } catch (err) {
    res.redirect(`${config.HOST}/verfication_failed`);
  }
});

app.use("/api", apiRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(express.static("public"));
app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api")) next(); // exclude api routes
  try {
    res.sendFile(require("path").join(__dirname, "public", "index.html"));
  } catch (err) {
    next(err);
  }
});

app.listen(config.PORT, () => {
  console.log(`⚡ Server is live on: ${config.HOST}`);
  console.log(`📄 Docs: ${config.HOST}/api-docs`);
});
