module.exports = class TrxService {
  constructor(db) {
    this.db = db;
  }

  async saveTransaction(data) {
    console.log("trx data to save", data);
    await this.db.models.TrxModel.create(data);
  }
};
