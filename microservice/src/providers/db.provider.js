const { Sequelize } = require("sequelize");

const { PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD } = process.env;

module.exports = class DbProvider {
  async connect() {
    this.db = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
      host: PG_HOST,
      port: PG_PORT,
      dialect: "postgres",
    });

    try {
      await this.db.authenticate();
    } catch (error) {
      console.error(error);
      throw new Error("Connection to Postgres failed");
    }
  }
};
