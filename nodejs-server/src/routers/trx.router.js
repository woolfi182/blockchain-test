const { Router } = require("express");

const router = new Router();

const sortValues = ["byrecipient", "bysender"];

// For testing purposes basic validation is here
const validatePage = (page) => {
  if (isNaN(Number(page))) {
    throw new Error("Page parameter should be number");
  }
};
const validateSort = (sort) => {
  if (!sortValues.includes(sort)) {
    throw new Error(`Sort could include only next values: ${sortValues}`);
  }
};

// For task purposes simple try/catch (should be moved up)
router.get("/", async (req, res, next) => {
  const trxService = req.app.get("trxService");
  // pagination
  const { page = 0 } = req.query;
  // by sender or recipient
  const { sort = "bysender" } = req.query;

  try {
    validatePage(page);
    validateSort(sort);

    const latestTrx = await trxService.getTransactions(page, sort);
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
