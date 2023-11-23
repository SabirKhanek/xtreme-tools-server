const config = require("./environments/config");
const express = require("express");
const cors = require("cors");
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { apiRouter } = require("./routes");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Xtreme Tools",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api`,
      },
      { url: `${config.HOST}/api` },
    ],
  },
  apis: ["./routes/*/*.js"],
};
const swaggerSpec = swaggerJsDocs(options);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", apiRouter);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(config.PORT, () => {
  console.log(`⚡ Server is live on: ${config.HOST}:${config.PORT}`);
  console.log(`📄 Docs: ${config.HOST}:${config.PORT}/api-docs`);
});
