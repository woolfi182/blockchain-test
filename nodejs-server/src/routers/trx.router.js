const { Router } = require("express");

const router = new Router();

router.get("/", async (req, res) => {
  const trxService = req.app.get("trxService");

  const latestTrx = await trxService.getTransactions();
  return res.json({
    success: true,
    data: {
      transactions: latestTrx,
    },
  });
});

module.exports = router;
