module.exports = class TrxService {
  constructor(db) {
    this.db = db;
  }

  async getTransactions(page = 0) {
    const LIMIT = 100;
    return this.db.models.TrxModel.findAll({
      limit: 100,
      offset: page * LIMIT,
      order: [["createdAt", "DESC"]],
    });
  }
};
