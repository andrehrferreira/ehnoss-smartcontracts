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
        "17ae93f23f7bc7fb63795d067b98946cfc50fe3a1bc6617b6ef0dbad4a1ca88d",
        "1a44f82552b90d05f01eaf25c9cbe0ad43190162ef4ede748ecbf087aee803f3",
        "60ea6ad36da10e9cc77c886df9b589bed5df8644d18ac6fcb5eb23d2da0d5ea3",
        "5c633fee605bf0e69d0d4faf61c2c5abfe02907817d476eebcd2dfdb524c07bf"
      ]
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.POLYGON_PRIVATE_KEY || ""]
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [process.env.BINANCE_PRIVATE_KEY || ""]
    },
    ethereum: {
      url: ""
    }
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
      path: './abi',
      clear: true,
      flat: true,
      only: [],
      spacing: 2
  }
};

export default config;
