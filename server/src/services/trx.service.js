const Sequelize = require("sequelize");

module.exports = class TrxService {
  constructor(db) {
    this.db = db;
  }

  async getTransactions(page, orderBy) {
    const LIMIT = 100;

    const params = {
      limit: 100,
      offset: page * LIMIT,
      order: [[orderBy, "DESC"]],
    };

    return this.db.models.TrxModel.findAll(params);
  }

  async getBalance(address) {
    const params = {
      attributes: [
        "hash",
        "blockNumber",
        "sender",
        "senderBalance",
        "recipient",
        "recipientBalance",
      ],
      where: {
        [Sequelize.Op.or]: [{ sender: address }, { recipient: address }],
      },
      order: [["createdAt", "DESC"]],
    };

    return this.db.models.TrxModel.findOne(params);
  }
};
