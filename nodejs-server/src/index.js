const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const { DbProvider } = require("./providers");
const { TrxService } = require("./services");
const { trxRouter, balanceRouter } = require("./routers");
const { apiLimiter, apiAuthentication } = require("./middlewares/rate.mdlwr");

const { PORT } = process.env;

const main = async () => {
  const dbProvider = new DbProvider();

  await dbProvider.connect();

  dbProvider.initModels();

  const trxService = new TrxService(dbProvider.db);

  const app = express();
  app.use(json());
  app.use(cors());
  app.use(apiAuthentication);
  app.use(apiLimiter);

  app.set("trxService", trxService);

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
