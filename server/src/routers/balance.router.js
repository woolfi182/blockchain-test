const { Router } = require("express");
const { isValidAddress, EntityNotFoundError } = require("../helpers");

const router = new Router();

// For task purposes simple try/catch (should be moved up)
router.get("/:address", async (req, res, next) => {
  const trxService = req.app.get("trxService");

  // Address' DAI balance (sender or recipient) from indexed transactions / aggregated data only
  const { address } = req.params;

  try {
    isValidAddress(address);

    const addressData = await trxService.getBalance(address);

    if (!addressData) {
      throw new EntityNotFoundError();
    }

    return res.json({
      success: true,
      data: {
        addressBalance: addressData,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
