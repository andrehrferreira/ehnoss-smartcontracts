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
        "510b08e64096cd5d6ebd8630f2fbe6b7ec4b03a9257851e2dd91fc3a05715b65",
        "e8c9db2988537ccf590a1fda44cde67cd4fbadb710e1d9a2fe119862ac28797b",
        "5f70ab4bf3a1485de456a42da7802a6d290595ab99d5c25ef4317b083ddcb33f",
        "62bfd196b9c324f92e17374a8af7aafa16cc9a996b5dd9981de0463ab75dc1fb"
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
