const { DataTypes } = require("sequelize");

// Don't create other tables as for this task it's not needed
module.exports = (sequelize) => {
  const TrxModel = sequelize.define("transaction", {
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blockHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blockNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    transactionIndex: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderBalance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientBalance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gasPrice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gasLimit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nonce: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return TrxModel;
};
