//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18; 


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "./ERC721.sol";
//import "./ERC1155.sol";

contract Market is ReentrancyGuard, Ownable, IERC721Receiver {
    
    //Using Counters library to keep a track of minted NFT tokens
    using Counters for Counters.Counter;


    //Counter for token Ids to prevent overflows
    Counters.Counter private nft_Id;

//    Counters.Counter private sft_Id;

    


    //Listing fee will be the commission that market will charge users for selling their Items;
    uint256 private _listingFee = 0.2 ether;



    //Market items will be the items being auctioned on the marketplace
    struct NFT_MarketItem {
        uint256 NFT_MarketItemId;
        address nftContract;
        uint256 tokenId;
        address payable minter;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    /*struct SFT_MarketItem {
        uint256 SFT_MarketItemId;
        address sftContract;
        uint256 tokenId;
        address payable minter;
        address payable seller;
        address payable owner;
        uint256 price;
        uint256 supply;
    }
    */


    //Mapping to store uint256 tokenId to struct MarketItems
    mapping(uint256 => NFT_MarketItem) private idToNFTs;

//    mapping(uint256 => SFT_MarketItem) private idToSFTs;


    //Mapping to store uint256 tokenId to uint256 market item Id
    mapping(uint256 => uint256) private nftToMarketId;

    //Events for market items creation
    event NFT_MarketItem_Created(
        
        uint256 indexed NFT_MarketItemId,
        address nftContract,
        uint256 indexed tokenId,
        address minter,
        address seller,
        address indexed owner,
        uint256 price,
        bool sold

    );

  /*  event SFT_MarketItem_Created(
        
        uint256 indexed SFT_MarketItemId,
        address sftContract,
        uint256 indexed tokenId,
        address minter,
        address seller,
        address indexed owner,
        uint256 price,
        uint256 supply

    );
*/
    /**
     * 
     * @dev modifiers to check only owner can list items 
     */

    modifier onlyOwnerOfNFT(address _nft, uint256 _tokenId){
        
        address _owner = ERC721(_nft).ownerOf(_tokenId);
        require(msg.sender == _owner, "Only owner can perform this action.");
        _;
    }

  /*  modifier onlyOwnerOfSFT(address _sft, uint256 _tokenId){
        
        uint balance = ERC1155(_sft).balanceOf(msg.sender,_tokenId);
        require(balance > 0 , "Only owner can perform this action.");
        _;
    }

    /**
     * @dev this function lets the owner to update listing fee
     */

    function updateListingFee(uint256 fee) public payable onlyOwner {
        _listingFee = fee;
    }


    /**
     * @dev returns the listing fee of the marketplace
     */

    function getListingFee() external view returns(uint256) {
        return _listingFee;
    }

    /*
    @dev IERC-721 Receiver implemented
    */

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4){
        return IERC721Receiver.onERC721Received.selector;
    }

    
    /**
     * @dev function lets user to list item for sale and transfers it's ownership to marketplace
     */

    function listNFT(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    )public
     payable
     nonReentrant
     onlyOwnerOfNFT(_nftContract, _tokenId)
     returns(uint256){
      
      require(_price > 0, "Price should atleast be 1 wei");
      require(msg.value == _listingFee, "Please pay the listing fee");

      ERC721 nft = ERC721(_nftContract);
      

      if(nftToMarketId[_tokenId] > 0){
        

            uint marketId = nftToMarketId[_tokenId];
            NFT_MarketItem storage item = idToNFTs[marketId];

            item.seller = payable(msg.sender);
            item.owner = payable(address(this));
            item.sold = false;
            item.price = _price;

            nft.safeTransferFrom(msg.sender, address(this), _tokenId);

            return marketId;

      }
      
      nft_Id.increment();
      uint current = nft_Id.current();
      
      nftToMarketId[_tokenId] = current;      

      address _minter = nft.mintedBy(_tokenId);

      idToNFTs[current] = NFT_MarketItem(
        current,
        _nftContract,
        _tokenId,
        payable(_minter),
        payable(msg.sender),
        payable(address(this)),
        _price,
        false
      );

      nft.safeTransferFrom(msg.sender, address(this), _tokenId);


      emit NFT_MarketItem_Created(
            current, 
            _nftContract, 
            _tokenId, 
            _minter, 
            msg.sender, 
            address(0), 
            _price, 
            false
        );


        return current;
    }

    /**
     * @dev function lets user to unlist NFT for sale and refund it's lisitng fee to owner
     */

    function unlistNFT(address _nftContract, uint _marketitemId) public nonReentrant returns(bool sent) {

        NFT_MarketItem storage item = idToNFTs[_marketitemId];
        
        require(_marketitemId > 0, "ID should be greater than 0.");
        require(item.seller == msg.sender, "Only seller can unlist items.");

        
        item.seller = payable(address(0));
        item.owner = payable(msg.sender);

        uint tokenId = item.tokenId;

        ERC721(_nftContract).safeTransferFrom(address(this), msg.sender, tokenId);

        (sent, ) = payable(msg.sender).call{value: _listingFee}("");

    }


    /**
     * @dev function lets user to check whether NFT is up-for-sale
     */

    function getMarketplaceitemByNFT(uint tokenId) public view returns(NFT_MarketItem memory, bool){

        require(tokenId > 0, "ID should be greater than 0.");

        uint itemsCount = nft_Id.current();
        
        for(uint i; i<itemsCount; ++i){
            
            NFT_MarketItem memory item = idToNFTs[i+1];

            if(item.tokenId != tokenId) continue;
            return (item, true);
        }

        NFT_MarketItem memory _item;
        return(_item, false);
    }


    /**
     * @dev Creates nft sale by transfering msg.sender money to the seller and NFT token from the
     * marketplace to the msg.sender. It also sends the listingFee to the marketplace owner.
     */
    function nftSale(address nftContractAddress, uint256 marketItemId) public payable nonReentrant {
        
        NFT_MarketItem storage item = idToNFTs[marketItemId];
        
        uint256 price = item.price;
        uint256 tokenId = item.tokenId;
        require(item.owner == payable(address(this)), "NFT is not up for sale.");
        require(msg.value == price, "Please pay the asking price for the NFT.");
        

        
        item.owner = payable(msg.sender);
        item.sold = true;
        

        item.seller.transfer(msg.value);
        ERC721(nftContractAddress).safeTransferFrom(address(this), msg.sender, tokenId);

        payable(owner()).transfer(_listingFee);

        item.seller = payable(address(0));
    }


    function fetchListedNFTs() public view returns(NFT_MarketItem[] memory) {

            uint256 totalItems = nft_Id.current();

            uint256 totalListed; 

            for(uint256 i; i<totalItems; ++i){
                NFT_MarketItem memory item = idToNFTs[i+1];
                if(item.seller == payable(address(0))) continue;
                ++totalListed;
            }

            NFT_MarketItem[] memory items = new NFT_MarketItem[](totalListed);
            uint256 index = 0;

            for(uint256 i; i<totalItems; ++i){

                NFT_MarketItem memory item = idToNFTs[i+1];
                if(item.seller == payable(address(0))) continue;

                items[index] = item;

                ++index;
            }

            return items;

    }


    function fetchNFTsListedByUser() public view returns(NFT_MarketItem[] memory) {

            uint256 totalItems = nft_Id.current();

            uint256 totalListed; 

            for(uint256 i; i<totalItems; ++i){
                NFT_MarketItem memory item = idToNFTs[i+1];
                if(item.seller != payable(msg.sender)) continue;
                ++totalListed;
            }

            NFT_MarketItem[] memory items = new NFT_MarketItem[](totalListed);
            uint256 index = 0;

            for(uint256 i; i<totalItems; ++i){
                uint256 id = i+1;
                NFT_MarketItem memory item = idToNFTs[id];
                if(item.seller != payable(msg.sender)) continue;

                items[index] = item;

                ++index;
            }

            return items;

    }


}//Implement a way of checking avaiable market items and items where seller is user