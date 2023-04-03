module.exports = class LogsService {
  constructor(db) {
    this.db = db;
  }

  async save({ path, method, ip, apiKey }) {
    await this.db.models.LogsModel.create({ path, method, ip, apiKey });
  }
};
