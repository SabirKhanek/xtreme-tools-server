const config = require("./environments/config");
const express = require("express");
const cors = require("cors");
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { apiRouter } = require("./routes");
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
app.use(standardizeResponse);
app.use(express.json());
app.use(cors({ origin: "*" }));
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
