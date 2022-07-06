// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SouCryptoMarketplace {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    
    IERC721 contractAddress;
    Counters.Counter private _itemsSold;

    //Fee
    address payable public teamWallet;
    address payable public creatorWallet;
    uint256 public teamFee = 1;
    uint256 public creatorFee = 5;

    struct Trade {
        address payable owner;
        uint256 item;
        uint256 price;
        bytes32 status;
    }

    mapping(uint256 => Trade) public trades;
    mapping(uint256 => uint256) public tradesByTokenId;
    uint256 public tradeCounter;

    constructor (
        address _contractAddress,
        address _teamWallet,
        address _creatorWallet
    ) {
        contractAddress = IERC721(_contractAddress);
        teamWallet = payable(_teamWallet);
        creatorWallet = payable(_creatorWallet);
        tradeCounter = 0;
    }

    function getTrade(uint256 _trade) public virtual view returns(address, uint256, uint256, bytes32) {
        Trade memory trade = trades[_trade];
        return (trade.owner, trade.item, trade.price, trade.status);
    }

    function getTrageByTokenId(uint256 _item) public virtual view returns(uint256, address, uint256, uint256, bytes32) {
        uint256 _trade = tradesByTokenId[_item];
        require(_trade > 0, "This item is not for sale");

        Trade memory trade = trades[_trade];
        return (_trade, trade.owner, trade.item, trade.price, trade.status);
    }

    function openTrade(uint256 _item, uint256 _price) public payable {
        require(_price > 0, "Price must be at least 1 wei");

        contractAddress.transferFrom(msg.sender, address(this), _item);

        tradeCounter += 1;
        trades[tradeCounter] = Trade({
            owner: payable(msg.sender),
            item: _item,
            price: _price,
            status: "Open"
        });

        tradesByTokenId[_item] = tradeCounter;
        emit TradeStatusChange(tradeCounter, "Open");
    }

    function executeTrade(uint256 _trade) public payable {
        Trade memory trade = trades[_trade];
        require(trade.status == "Open", "Trade is not Open.");
        require(msg.value == trade.price, "Price must be equal to listing price");

        uint256 amount = trade.price;
        uint256 taxedAmount = trade.price;

        if (teamFee > 0) {
            uint256 tokensToTeam = amount.mul(teamFee).div(100);
            taxedAmount = taxedAmount.sub(tokensToTeam);
            teamWallet.transfer(tokensToTeam);
        }

        if (creatorFee > 0) {
            uint256 tokensToCreator = amount.mul(creatorFee).div(100);
            taxedAmount = taxedAmount.sub(tokensToCreator);
            creatorWallet.transfer(tokensToCreator);
        }

        trade.owner.transfer(taxedAmount);
        contractAddress.transferFrom(address(this), msg.sender, trade.item);
        
        _itemsSold.increment();
        trades[_trade].status = "Executed";
        tradesByTokenId[trade.item] = 0;

        emit TradeStatusChange(_trade, "Executed");
    }

    function cancelTrade(uint256 _trade) public payable {
        Trade memory trade = trades[_trade];

        require(
            msg.sender == trade.owner,
            "Trade can be cancelled only by poster."
        );

        require(trade.status == "Open", "Trade is not Open.");

        contractAddress.transferFrom(address(this), trade.owner, trade.item);
        _itemsSold.increment();
        trades[_trade].status = "Cancelled";
        tradesByTokenId[trade.item] = 0;

        emit TradeStatusChange(_trade, "Cancelled");
    }

    function fetchMarketItems() public view returns (Trade[] memory) {
        uint256 itemsCount = tradeCounter - _itemsSold.current();
        uint256 currentIndex = 0;

        Trade[] memory items = new Trade[](itemsCount);

        for (uint256 i = 0; i < tradeCounter; i++) {
            if(trades[i].status == "Open"){
                Trade storage currentItem = trades[i];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    event TradeStatusChange(uint256 ad, bytes32 status);
}