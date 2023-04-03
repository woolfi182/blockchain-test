const { ethers } = require("ethers");

module.exports = class EthService {
  constructor(provider, trxService) {
    this.provider = provider;
    this.trxService = trxService;
  }

  connectToContract(address, abi) {
    return new ethers.Contract(address, abi, this.provider);
  }
};
