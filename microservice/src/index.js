const { EthProvider, DbProvider } = require("./providers");
const { EthService, TrxService } = require("./services");

const contracts = {
  DAI: {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    abi: require("./data/dai-abi.json"),
  },
};

const main = async () => {
  const ethProvider = new EthProvider();
  const dbProvider = new DbProvider();

  await dbProvider.connect();
  await ethProvider.connect();

  const trxService = new TrxService(dbProvider.db);
  const ethService = new EthService(ethProvider.provider, trxService);

  // could be moved to configs or so
  // but for the project is fine
  const daiCtrt = ethService.connectToContract(
    contracts.DAI.address,
    contracts.DAI.abi
  );

  // start reading and processing blocks
  ethService.readBlocksTransactions(daiCtrt);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
