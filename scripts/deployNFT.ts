import { ethers } from "hardhat";
import { utils } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  try {
    const oneEth = utils.parseUnits("0.01", 18);
    const SouCryptoNft = await ethers.getContractFactory("SouCryptoNft");
    const souCryptoNft = await SouCryptoNft.deploy(oneEth);
    await souCryptoNft.deployed();

    console.log(
      "Contract SouCrypto NFTs deployed to address:",
      souCryptoNft.address
    );
  } catch (e) {
    console.log(e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
