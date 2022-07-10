import chai from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { SouCryptoNft } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("SouCrypto Nft", function () {
    let contractSouCryptoNft: SouCryptoNft;
    let owner: SignerWithAddress;
    let address1: SignerWithAddress;
    let address2: SignerWithAddress;

    before(async () => {
        [owner, address1, address2] = await ethers.getSigners();
    });

    beforeEach(async () => {
        const minValuePublicMint = utils.parseUnits("0.01", 18);
        const SouCryptoNftFactory = await ethers.getContractFactory("SouCryptoNft");
        contractSouCryptoNft = await SouCryptoNftFactory.deploy(minValuePublicMint);
        await contractSouCryptoNft.deployed();
    });

    it("should mint nft and transfer", async () => {
        const nftURI = "https://ipfs.io/ipfs/QmTCnV18BUkhzcshH2fdd212oN5ufx8GvXc1kUTrjP3ptz?filename=metadata.json"
        let tx = await contractSouCryptoNft.safeMint(owner.address, nftURI);
                        
        const receipt = await tx.wait();
        const eventMint = receipt.events?.filter((event) => event.event == "MintNft")[0];

        if(eventMint && eventMint.data){
            const returnURI = await contractSouCryptoNft.tokenURI(Number(eventMint?.data));
            expect(nftURI).to.equal(returnURI);
        }      
    });

    it("should mint nft public", async () => {
        const nftURI = "https://ipfs.io/ipfs/QmTCnV18BUkhzcshH2fdd212oN5ufx8GvXc1kUTrjP3ptz?filename=metadata.json"
        const oneEth = utils.parseUnits("0.01", 18);

        let tx = await contractSouCryptoNft.publicMint(nftURI, {
            value: oneEth
        });

        const receipt = await tx.wait();
        const eventMint = receipt.events?.filter((event) => event.event == "MintNft")[0];

        if(eventMint && eventMint.data){
            const returnURI = await contractSouCryptoNft.tokenURI(Number(eventMint?.data));
            expect(nftURI).to.equal(returnURI);
        }
    });
});