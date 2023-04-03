const { Router } = require("express");
const { isValidPage, isValidSort } = require("../helpers");

const router = new Router();

// For task purposes simple try/catch (should be moved up)
router.get("/", async (req, res, next) => {
  const trxService = req.app.get("trxService");
  // pagination
  const { page = 0 } = req.query;
  // by sender or recipient
  const { sort = "sender" } = req.query;

  try {
    isValidPage(page);
    isValidSort(sort);

    const latestTrx = await trxService.getTransactions(page, sort);
    return res.json({
      success: true,
      data: {
        transactions: latestTrx,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
