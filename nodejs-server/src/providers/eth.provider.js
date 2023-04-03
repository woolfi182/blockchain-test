const { ethers } = require("ethers");

const { INFURA_API_KEY } = process.env;

module.exports = class EthProvider {
  async connect() {
    this.provider = new ethers.providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
    );

    const network = await this.provider.getNetwork();

    if (!network.chainId) {
      console.log("Provider is not connected");
      throw new Error("Provider is not connected");
    }

    console.log(`Connected to ${network.name} (chainId: ${network.chainId})`);
  }
};
