const { Router } = require("express");

const router = new Router();

// For testing purposes basic validation is here
const validatePage = (page) => {
  if (isNaN(Number(page))) {
    throw new Error("Page parameter should be number");
  }
};

// For task purposes simple try/catch (should be moved up)
router.get("/", async (req, res, next) => {
  const trxService = req.app.get("trxService");
  const { page = 0 } = req.query;
  try {
    validatePage(page);

    const latestTrx = await trxService.getTransactions(page);
    return res.json({
      success: true,
      data: {
        transactions: latestTrx,
      },
    });
  } catch (error) {
    console.log("Error", error);
    return next(error);
  }
});

module.exports = router;
