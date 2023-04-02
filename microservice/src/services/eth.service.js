const { ethers } = require("ethers");

module.exports = class EthService {
  constructor(provider, trxService) {
    this.provider = provider;
    this.trxService = trxService;
  }

  connectToContract(address, abi) {
    return new ethers.Contract(address, abi, this.provider);
  }

  readBlocksTransactions(contract) {
    this.provider.on("block", async (blockNumber) => {
      console.log(`New block detected: ${blockNumber}`);

      // filter block transactions
      const trxs = await this.getBlockTransactions(contract, blockNumber);

      // process: fetch details, save to db
      await this.processTransactions(trxs);
    });
  }

  async getBlockTransactions(contract, blockNumber) {
    /*
      -> data provided: [ trx, ...], where each trx:
      blockNumber: 16962784,
      blockHash: '0xa2620622defa695a9749dc2e34e139d39846f370bd363a7ae25225050af72577',
      transactionIndex: 50,
      removed: false,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      data: '0x00000000000000000000000000000000000000000000001147a6e8c5922d8d6d',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c8',
        '0x000000000000000000000000555b6ee8fab3dfdbcca9121721c435fd4c7a1fd1'
      ],
      transactionHash: '0x455a1cb1c993e58cd5567cf2b55bc4c33f41d881b02fed53deb3e5962ffcbe57',
      logIndex: 99,
      event: 'Transfer',
      args: [
        '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        '0x555B6eE8faB3DfdBcCa9121721c435FD4C7a1fd1',
        [BigNumber],
        src: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        dst: '0x555B6eE8faB3DfdBcCa9121721c435FD4C7a1fd1',
        wad: [BigNumber]
      ]
    */
    const trxs = await contract.queryFilter(
      "Transfer",
      blockNumber,
      blockNumber + 1
    );
    return trxs;
  }

  /*
    trx data example:
    {
      hash: '0x73b6e22154bcedb12f72850ca1116925ae7d081ecd7208cde7958daa66bdec97',
      type: 2,
      accessList: [],
      blockHash: '0xfc9fb1b315c3174f93d74064add7c2e899f46bc06be66994fbb7a284858bae2f',
      blockNumber: 16962805,
      transactionIndex: 22,
      confirmations: 1,
      from: '0x102A457bE62Ee0cDA23F722AF1930de1F72762c2',
      gasPrice: BigNumber { _hex: '0x060bab3f00', _isBigNumber: true },
      maxPriorityFeePerGas: BigNumber { _hex: '0xb2d05e00', _isBigNumber: true },
      maxFeePerGas: BigNumber { _hex: '0x12a05f2000', _isBigNumber: true },
      gasLimit: BigNumber { _hex: '0x011a49a0', _isBigNumber: true },
      to: '0x93823919cf51d3a5C355e1b4d21973B48DFe9d02',
      value: BigNumber { _hex: '0x00', _isBigNumber: true },
      nonce: 9071,
      data: '0x52ce13d5000000000...',
      r: '0xed053e90f4a7b3596a091231a9e9c3df05a1ba838d093ead1ffcaa0541fc7f55',
      s: '0x62be7f688b4b8e16f5285e2c52c24c8a6ef938ef3c44020188da1054503795bf',
      v: 1,
      creates: null,
      chainId: 1,
    }
  */
  async processTransactions(trxs) {
    await Promise.all(
      trxs.map(async (trx) => {
        // get basic details
        const { transactionHash } = trx;

        // fetch trx details
        const trxData = await this.provider.getTransaction(transactionHash);

        const toSaveData = {
          hash: trxData.hash,
          blockHash: trxData.blockHash,
          blockNumber: trxData.blockNumber,
          transactionIndex: trxData.transactionIndex,
          from: trxData.from,
          gasPrice: ethers.utils.formatEther(trxData.gasPrice),
          gasLimit: ethers.utils.formatEther(trxData.gasLimit),
          to: trxData.to,
          value: ethers.utils.formatEther(trxData.value),
          nonce: trxData.nonce,
        };

        // save to DB
        await this.trxService.saveTransaction(toSaveData);
      })
    );
  }
};
