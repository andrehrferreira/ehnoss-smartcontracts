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
      accounts: [process.env.LOCAL_PRIVATE_KEY || ""]
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
