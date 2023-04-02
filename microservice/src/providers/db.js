const { Sequelize } = require("sequelize");

const { PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD } = process.env;

class Db {
  async connect() {
    this.sequelize = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
      host: PG_HOST,
      port: PG_PORT,
      dialect: "postgres",
    });

    try {
      await this.sequelize.authenticate();
    } catch (error) {
      console.error(error);
      throw new Error("Connection to Postgres failed");
    }
  }
}

module.exports = Db;
