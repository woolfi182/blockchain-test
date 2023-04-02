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
    const daiTransactions = await daiContract.queryFilter(
      "Transfer",
      blockNumber,
      blockNumber + 1
    );
    /*
      -> data provided:
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
    await Promise.all(
      daiTransactions.map(async (trx) => {
        const { transactionHash } = trx;
        const data = await provider.getTransaction(transactionHash);
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
            data: '0x52ce13d50000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003a0000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000f14449914f181637f4030179e3a1618725377734000000000000000000000000b8c2fdeefe986f4c59935ff5343223c99cf0444400000000000000000000000043e47344f0e328a8cde5f386514217242a92c5c4000000000000000000000000d66bb30361a5fbd26e8f472bca232979980ee0440000000000000000000000006719a029b0604c2cb4b0a394d3636c173505939f000000000000000000000000f7efaddf5624e8b222d5ffa14dd0cfd084a1c5880000000000000000000000001a822575c7750f5765c53a263c082bab4378a8d4000000000000000000000000ecb15f3756f18e6a32504e98533363c29b8cd34a0000000000000000000000001e6a799289d7f892bb2f2575a0cd648c4e4418340000000000000000000000004112544a4f08aa9c59ebb940904a1ae2087c0cc20000000000000000000000002f198450e6debecbffe3f3283f8e58518850e832000000000000000000000000d40833a99ffca42870b46b4c849ec73ab5dcfa6f000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000d404fec64ac1bceac85ab46bcb617d2519e6fa6f0000000000000000000000005777d92ad49a87d43578e32b1dd001b5ac9e2168000000000000000000000000567679c7bfed57131a394966bcde9689ab0a6bc0000000000000000000000000d21ae2e8e4919295a277b9bcedb3d37e146f0f7700000000000000000000000023613e4eacb77607a1966d76d677a2374a7eace800000000000000000000000041d3d330ff4096ba8de46431487fb58768f587b30000000000000000000000000b5fac1b2e9ed137649ee81f1010ad219c0544670000000000000000000000004e41f02937373d7c16beab0b580675c2e1226ee80000000000000000000000009b87396cf426d22893eface602a5aaa2887babea0000000000000000000000008fefa578bdbf1a5163a7fab36303adbf44ad54c8000000000000000000000000d4ebc2260ea2b57b91fcb70fa56d8877206245ce000000000000000000000000f144358085498368beeea8cccde511c7fea07734000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000',
            r: '0xed053e90f4a7b3596a091231a9e9c3df05a1ba838d093ead1ffcaa0541fc7f55',
            s: '0x62be7f688b4b8e16f5285e2c52c24c8a6ef938ef3c44020188da1054503795bf',
            v: 1,
            creates: null,
            chainId: 1,
            wait: [Function (anonymous)]
          }
        */
        console.log("trx data", data);
      })
    );
  });
};

main().catch((error) => console.error);
