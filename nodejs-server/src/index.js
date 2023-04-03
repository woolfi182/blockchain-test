const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const { json } = require("body-parser");

const { DbProvider } = require("./providers");
const { TrxService, LogsService } = require("./services");
const { trxRouter, balanceRouter } = require("./routers");
const { apiLimiter, apiAuthentication, logRequest } = require("./middlewares");

const { PORT } = process.env;

const swaggerConfigPath = "./src/specs/api.yaml";

const main = async () => {
  const dbProvider = new DbProvider();

  await dbProvider.connect();

  dbProvider.initModels();

  const trxService = new TrxService(dbProvider.db);
  const logsService = new LogsService(dbProvider.db);

  const swaggerDoc = yaml.load(swaggerConfigPath);
  const app = express();

  app.set("trxService", trxService);
  app.set("logsService", logsService);

  app.use(json());
  app.use(cors());

  // SWAGGER DOC part
  app.use("/docs", swaggerUi.serve);
  app.get("/docs", swaggerUi.setup(swaggerDoc));

  // RATE LIMITER part
  app.use(logRequest);
  app.use(apiAuthentication);
  app.use(apiLimiter);

  // GENERAL logic
  app.use("/api/v1/transactions", trxRouter);
  app.use("/api/v1/balance", balanceRouter);

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
