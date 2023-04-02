const express = require("express");
const cors = require("cors");
const { json } = require("body-parser");

const { PORT } = process.env;

const createApp = () => {
  const app = express();
  app.use(json());
  app.use(cors());

  app.get("/", (req, res) => {
    return res.json({
      done: true,
    });
  });

  return app;
};

const app = createApp();

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
