import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ganache";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "@symblox/hardhat-abi-gen";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

function getGasPrice(gasPrice: string | undefined) {
  if (gasPrice) {
    return parseInt(gasPrice, 10);
  } else {
    return "auto";
  }
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "local",
  networks: {
    local: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "9b0073bdda0bafcd74a412afb854b6df92d66730397043a1b5103ee80f44c5ab",
        "e520f358f8d78e3caed9adc528b71d43589307d2f52ca6d3306d9259f8c6e407",
        "186355272cc662345c782f7ebe29c7bf9f49004878015b6ed95ca2fa34d22600",
        "5a2cf004175a9452e09808479fc0422f343db4dc995936e431270a7fde3947a9",
      ],
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.POLYGON_PRIVATE_KEY || ""],
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [process.env.BINANCE_PRIVATE_KEY || ""],
    },
    ethereum: {
      url: "",
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  abiExporter: {
    path: "./abi",
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
  },
};

export default config;
