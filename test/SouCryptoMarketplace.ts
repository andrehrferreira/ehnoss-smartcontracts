import chai from "chai";
import { ethers, waffle } from "hardhat";
import { utils } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { SouCryptoNft, SouCryptoMarketplace } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("SouCrypto Marketplace", function () {
  let contractSouCryptoNft: SouCryptoNft;
  let contractSouCryptoMarketplace: SouCryptoMarketplace;

  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const minValuePublicMint = utils.parseUnits("0.01", 18);

    //SouCrypto NFT
    const ContractSouCryptoNftFactory = await ethers.getContractFactory(
      "SouCryptoNft"
    );
    contractSouCryptoNft = await ContractSouCryptoNftFactory.deploy(
      minValuePublicMint
    );
    await contractSouCryptoNft.deployed();

    //Marketplace
    const ContractSouCryptoMarketplaceFactory = await ethers.getContractFactory(
      "SouCryptoMarketplace"
    );

    contractSouCryptoMarketplace =
      await ContractSouCryptoMarketplaceFactory.deploy(
        contractSouCryptoNft.address,
        addr1.address,
        addr2.address
      );

    await contractSouCryptoMarketplace.deployed();
  });

  it("should mint nft and transfer", async () => {
    const nftURI =
      "https://ipfs.io/ipfs/QmTCnV18BUkhzcshH2fdd212oN5ufx8GvXc1kUTrjP3ptz?filename=metadata.json";
    const oneEth = utils.parseUnits("1", 18);

    let balanceTeamWallet = await waffle.provider.getBalance(addr1.address);
    let balanceCreatorWallet = await waffle.provider.getBalance(addr2.address);

    let tx = await contractSouCryptoNft.safeMint(owner.address, nftURI);
    const receipt = await tx.wait();
    const eventMint = receipt.events?.filter(
      (event) => event.event == "MintNft"
    )[0];

    if (eventMint && eventMint.data) {
      const returnURI = await contractSouCryptoNft.tokenURI(
        Number(eventMint?.data)
      );
      expect(nftURI).to.equal(returnURI);
    }

    //Open trande
    await contractSouCryptoNft.approve(
      contractSouCryptoMarketplace.address,
      0,
      { from: owner.address }
    );

    let tx1 = await (
      await contractSouCryptoMarketplace.openTrade(0, oneEth, {
        from: owner.address,
      })
    ).wait();
    const transEvent1 = tx1.events?.filter(
      (event) => event.event == "TradeStatusChange"
    )[0].args;

    //Execute
    let tx2 = await (
      await contractSouCryptoMarketplace
        .connect(addr3)
        .executeTrade(transEvent1?.ad, {
          from: addr3.address,
          value: oneEth,
        })
    ).wait();

    const transEvent2 = tx2.events?.filter(
      (event) => event.event == "TradeStatusChange"
    )[0].args;

    //Check fees
    expect(await waffle.provider.getBalance(addr1.address)).to.equal(
      balanceTeamWallet.add(oneEth.mul(1).div(100))
    );
    expect(await waffle.provider.getBalance(addr2.address)).to.equal(
      balanceCreatorWallet.add(oneEth.mul(5).div(100))
    );
  });
});
