module.exports = class TrxService {
  constructor(db) {
    this.db = db;
  }

  async getTransactions() {
    return this.db.models.TrxModel.findAll({
      limit: 100,
      order: [["createdAt", "DESC"]],
    });
  }
};
