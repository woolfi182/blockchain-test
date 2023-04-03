const getOrderByValue = (sort) => {
  const orders = {
    byrecipient: "to",
    bysender: "from",
  };

  return orders[sort];
};

module.exports = class TrxService {
  constructor(db) {
    this.db = db;
  }

  async getTransactions(page, sort) {
    const LIMIT = 100;
    const orderBy = getOrderByValue(sort);

    const params = {
      limit: 100,
      offset: page * LIMIT,
      order: [[orderBy, "DESC"]],
      group: [orderBy],
    };

    return this.db.models.TrxModel.findAll(params);
  }
};
