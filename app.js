const config = require("./environments/config");
const express = require("express");
const cors = require("cors");
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { apiRouter } = require("./routes");
const fs = require("fs");
const path = require("path");
const standardizeResponse = require("./middlewares/standardizeResponse");
const util = require("util");
const logFilePath = path.join(__dirname, "logfile.txt");
require("fs").writeFileSync("PID", process.pid.toString());
// Check if the log file exists, create it if not
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

const logFile = fs.createWriteStream(logFilePath, { flags: "a" });
const logStdout = process.stdout;

console.log = function (message) {
  try {
    const timestamp = new Date().toISOString();
    logFile.write(`[${timestamp}] ${util.format(message)}` + "\n");
    logStdout.write(util.format(message) + "\n");
  } catch (error) {
    console.error("Error writing to log file:", error.message);
  }
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
app.use(
  cors({
    origin: ["https://xtreme.tools", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.static("public"));
app.get("/", (req, res) => res.send("Hello World!"));
const { UserService } = require("./services/user");
app.use(standardizeResponse);
app.use(express.json());

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

app.listen(config.PORT, () => {
  console.log(`⚡ Server is live on: ${config.HOST}`);
  console.log(`📄 Docs: ${config.HOST}/api-docs`);
});
