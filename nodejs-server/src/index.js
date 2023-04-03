const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const { DbProvider } = require("./providers");
const { TrxService, LogsService } = require("./services");
const { trxRouter, balanceRouter } = require("./routers");
const { apiLimiter, apiAuthentication, logRequest } = require("./middlewares");

const { PORT } = process.env;

const main = async () => {
  const dbProvider = new DbProvider();

  await dbProvider.connect();

  dbProvider.initModels();

  const trxService = new TrxService(dbProvider.db);
  const logsService = new LogsService(dbProvider.db);

  const app = express();

  app.set("trxService", trxService);
  app.set("logsService", logsService);

  app.use(json());
  app.use(cors());

  app.use(logRequest);
  app.use(apiAuthentication);
  app.use(apiLimiter);

  app.use("/transactions", trxRouter);
  app.use("/balance", balanceRouter);

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
