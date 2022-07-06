import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    try {
        const SouCryptoNft = await ethers.getContractFactory("SouCryptoNft");
        const souCryptoNft = await SouCryptoNft.deploy();
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