const { ethers } = require("ethers");

const daiAbi = require("./dai-abi.json");

const DAI_CONTRACT_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
);

const daiContract = new ethers.Contract(DAI_CONTRACT_ADDRESS, daiAbi, provider);

const main = async () => {
  const currentBlockNumber = await provider.getBlockNumber();

  console.log(`Current block number: ${currentBlockNumber}`);

  provider.on("block", async (blockNumber) => {
    console.log(`New block detected: ${blockNumber}`);
  });
};

main().catch((error) => console.error);
