//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract ERC1155 is  ERC165, IERC1155, IERC1155MetadataURI, ReentrancyGuard  {

    //Using String,Address libraries from openzepplin to get required functions
    using Strings for uint256;
    using Address for address;
    
    //Using Counters library to keep a track of SFTs
    using Counters for Counters.Counter;


    
    //Counter for token Ids
    Counters.Counter private tokenId;


    //URI for all the token types that will be substituted based on token id
    string private _uri;

    

    //Address of marketplace that will be the approved operator of Tokens
    address immutable MARKET;


    //Mapping to store uint256 tokenId to a mapping to store address account to uint256 balance
    mapping(uint256 => mapping(address => uint256)) private _balances;

    //Mapping to store address account to a mapping to store address operator to bool approval
    mapping(address =>mapping(address=>bool)) private _operatorApprovals;

    //Mapping to store uint256 tokenId to uint256 supply of the  token
    mapping(uint256 => uint256) private _totalSupply;

    //Mapping to store uint256 tokenId to string tokenURIs
    mapping(uint256 => string) private _tokenURIs;

    //mapping to store uint256 tokenId to address minters
    mapping(uint256 => address) private _minters;



    /**
     * @dev constructor calls setURI method to store uri that represents the collection.
     *  
     * stores marketplace address
     */

    constructor(string memory __uri, address _market){
    
           _setURI(__uri);
           MARKET = _market;
    
    }

    /**
     * @dev ERC165 implementation from openzepplin {IERC-165, ERC-165}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * 
    ############################################################
    ||                                                        ||
    ||       IERC1155MetadataURI Functions                    ||
    ||                                                        ||
    ############################################################

    */

    /**
         * @dev Returns the URI for token type `id`.
         *
         * If the `\{id\}` substring is present in the URI, it must be replaced by
         * clients with the actual token type ID.
         */
        function uri(uint256 id) public view override returns (string memory){
            if(id == 0) return _uri;
            return _uri;
            
        }

        
    /**
     * 
    ############################################################
    ||                                                        ||
    ||                  IERC1155 Functions                    ||
    ||                                                        ||
    ############################################################

    */


    /**
     * @dev Returns the amount of tokens of token type `id` owned by `account`.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function balanceOf(address account, uint256 id) public view override returns (uint256){

        require(account != address(0), "ERR-1155: Balance of address zero not found.");

        return _balances[id][account];
    }

        /**
         * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}.
         *
         * Requirements:
         *
         * - `accounts` and `ids` must have the same length.
         */
        function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)
            public
            view
            override
            returns (uint256[] memory){

                require(accounts.length == ids.length, "ERR-1155: accounts and ids length mismatch.");

                uint256[] memory batch = new uint256[](ids.length);

                uint256 length = ids.length;

                for(uint i; i<length; i++){

                    batch[i] = balanceOf(accounts[i],ids[i]);
                }

                return batch;
            }

        /**
         * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,
         *
         * Emits an {ApprovalForAll} event.
         *
         * Requirements:
         *
         * - `operator` cannot be the caller.
         */
        function setApprovalForAll(address operator, bool approved) public override{
            _setApprovalForAll(msg.sender, operator, approved);
        }

        /**
         * @dev Returns true if `operator` is approved to transfer ``account``'s tokens.
         *
         * See {setApprovalForAll}.
         */
        function isApprovedForAll(address account, address operator) public view override returns (bool){

            return _operatorApprovals[account][operator];
        }

        /**
         * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
         *
         * Emits a {TransferSingle} event.
         *
         * Requirements:
         *
         * - `to` cannot be the zero address.
         * - If the caller is not `from`, it must have been approved to spend ``from``'s tokens via {setApprovalForAll}.
         * - `from` must have a balance of tokens of type `id` of at least `amount`.
         * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
         * acceptance magic value.
         */
        function safeTransferFrom(
            address from,
            address to,
            uint256 id,
            uint256 amount,
            bytes calldata data
        ) public override{

             require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERR-1155: caller is not token owner or approved"
        );
        _safeTransferFrom(from, to, id, amount, data);
        }

        /**
         * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.
         *
         * Emits a {TransferBatch} event.
         *
         * Requirements:
         *
         * - `ids` and `amounts` must have the same length.
         * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
         * acceptance magic value.
         */
        function safeBatchTransferFrom(
            address from,
            address to,
            uint256[] calldata ids,
            uint256[] calldata amounts,
            bytes calldata data
        ) public override{

             require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERR-1155: caller is not token owner or approved"
        );
        _safeBatchTransferFrom(from, to, ids, amounts, data);
        }


    /**
     * 
    ############################################################
    ||                                                        ||
    ||             ERC1155 Supply Functions                   ||
    ||                                                        ||
    ############################################################

    */

   /**
     * @notice Total amount of tokens in with a given id.
     */
    function totalSupply(uint256 _id) public view returns (uint256) {
        return _totalSupply[_id];
    }

    /**
     * @notice Indicates whether any token exist with a given id, or not.
     */
    function exists(uint256 _id) public view returns (bool) {
        return _totalSupply[_id] > 0;
    }

    /**
     * @notice checks the _totalSupply mapping before transfering.
     */

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _amounts
    ) internal
    {
        if(_from == address(0)){
            uint256 length = _ids.length;
            for(uint256 i; i<length; ++i){
                _totalSupply[_ids[i]] += _amounts[i];
            }
        }

         if (_to == address(0)) {
            uint256 length = _ids.length;
            for (uint256 i; i < length; ++i) {
                uint256 id = _ids[i];
                uint256 amount = _amounts[i];
                uint256 supply = _totalSupply[id];
                require(supply >= amount, "ERR-1155: burn amount exceeds the supply");
                unchecked {
                    _totalSupply[id] = supply - amount;
                    }
            
                }
            
            }   
    }


    /**
     * 
    ############################################################
    ||                                                        ||
    ||             ERC1155 URIStorage Functions               ||
    ||                                                        ||
    ############################################################

    */

   /**
     * @notice
     * - if `_tokenURIs[tokenId]` is NOT set then we fallback to `uri()`
     *   which in most cases will contain `ERC1155._uri`;
     *
     * - if `_tokenURIs[tokenId]` is NOT set, and if the parents do not have a
     *   uri value set, then the result is empty.
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];

        // If token URI is set, return token- tokenURI .
        return bytes(tokenURI).length > 0 ? tokenURI : uri(tokenId);
    }

    /**
     * @notice Sets `tokenURI` as the tokenURI of `tokenId`.
     */
    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        require(exists(tokenId), "ERR-1155: cannot set URI of non-existent token");
        _tokenURIs[tokenId] = tokenURI;
        emit URI(_tokenURIs[tokenId], tokenId);
    }


    function updateTokenURI(uint tokenId, string memory tokenURI) public nonReentrant {
        require(exists(tokenId), "ERR-1155: cannot set URI of non-existent token");
        require(msg.sender == _minters[tokenId], "ERR-1155: only minter can update the URI");
        require(_balances[tokenId][msg.sender] == _totalSupply[tokenId], "ERR-1155: entire supply does not belong to minter");

        _tokenURIs[tokenId] = tokenURI;

        emit URI(_tokenURIs[tokenId], tokenId);
    } 

      /**
     * 
    ############################################################
    ||                                                        ||
    ||               ERC1155 Mintable Functions               ||
    ||                                                        ||
    ############################################################

    */

      /**
     * @notice Creates `amount` tokens of token type `id`, and assigns them to `to`.
     *
     * `from` refers to zero address
     * 
     * Emits a {TransferSingle} event.
     */

    function _mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
        ) internal {
            require(to != address(0), "ERR-1155: Cannot mint to the zero address");


            address operator = msg.sender;
            uint256[] memory ids = _asSingletonArray(id);
            uint256[] memory amounts = _asSingletonArray(amount);


            //_beforeTokenTransfer hook is applied to check for available supply
            _beforeTokenTransfer(address(0), to, ids, amounts);
            _minters[id] = to;
            _balances[id][to] += amount;

            
            
            emit TransferSingle(operator, address(0), to, id, amount);


            /** @notice
            _doSafeTransferAcceptanceCheck to check whether token are being minted to a
            {IERC1155Receiver} - compliant contract.
            */

           _doSafeTransferAcceptanceCheck(operator, address(0), to, id, amount, data); 
        }
        

         /**
         * @notice Creates `amount` tokens of token type `id`, and assigns them to `to`.
         *
         * `from` refers to zero address
         * 
         * Emits a {TransferBatch} event.
         */

        function _mintBatch(
            address to,
            uint256[] memory ids,
            uint256[] memory amounts,
            bytes memory data
        ) internal {

            require(to != address(0), "ERR-1155: Cannot mint to the zero address");
            require(ids.length == amounts.length, "ERR-1155: ids and amounts length mismatch");

            address operator = msg.sender;

            //_beforeTokenTransfer hook is applied to check for available supply
            _beforeTokenTransfer(address(0), to, ids, amounts);


            for(uint256 i=0; i<ids.length; i++){
                _balances[ids[i]][to] += amounts[i];
            }

            emit TransferBatch(operator, address(0), to, ids, amounts);


            /** @notice
            _doSafeBatchTransferAcceptanceCheck to check whether token are being minted to a
            {IERC1155Receiver} - compliant contract.
            */
            _doSafeBatchTransferAcceptanceCheck(operator, address(0), to, ids, amounts, data);
        }


     /**
     * 
    ############################################################
    ||                                                        ||
    ||               ERC1155 Transfer Functions               ||
    ||                                                        ||
    ############################################################

    */


   /**
     * @notice Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     * Emits a {TransferSingle} event.
     */

   function _safeTransferFrom(
    address from,
    address to,
    uint id,
    uint256 amount,
    bytes memory data
   ) internal {
    require(to != address(0), "ERR-1155: Cannot transfer to zero address.");

    address operator = msg.sender;

    uint[] memory ids = _asSingletonArray(id);
    uint[] memory amounts = _asSingletonArray(amount);


    //_beforeTokenTransfer hook is applied to check for available supply
    _beforeTokenTransfer(from, to, ids, amounts);

    uint256 _fromBalance = _balances[id][from];

    require(_fromBalance>= amount, "ERR-1155: insufficient account balance.");

    
    _balances[id][from] = _fromBalance - amount;
    _balances[id][to] += amount;

    _setApprovalForAll(to,MARKET, true);

    emit TransferSingle(operator, from, to, id, amount);

     /** @notice
            _doSafeTransferAcceptanceCheck to check whether token are being minted to a
            {IERC1155Receiver} - compliant contract.
     */
    _doSafeTransferAcceptanceCheck(operator, from, to, id, amount, data);
   }


   /**
     * @notice Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     * Emits a {TransferBatch} event.
     */

    function _safeBatchTransferFrom(
    address from,
    address to,
    uint[] memory ids,
    uint256[] memory amounts,
    bytes memory data
   ) internal {
    require(ids.length == amounts.length, "ERR-1155: ids and amounts length mismatch.");
    require(to != address(0), "ERR-1155: transfer to the zero address.");

    address operator = msg.sender;


    //_beforeTokenTransfer hook is applied to check for available supply
    _beforeTokenTransfer(from, to, ids, amounts);

    for(uint i; i<ids.length; i++){

        uint id = ids[i];
        uint amount = amounts[i];

        uint256 _frombalance = _balances[id][from];

        require(_frombalance >= amount, "ERR-1155: insufficient account balance.");

        _balances[id][from] =  _frombalance - amount;

        _balances[id][to] += amount;
    }
    
    _setApprovalForAll(to,MARKET, true);
    emit TransferBatch(operator, from, to, ids, amounts);

     /** @notice
            _doSafeTransferAcceptanceCheck to check whether token are being minted to a
            {IERC1155Receiver} - compliant contract.
     */
    _doSafeBatchTransferAcceptanceCheck(operator, from, to, ids, amounts, data);
   }




    /**
     * 
    ############################################################
    ||                                                        ||
    ||               ERC1155 Burnable Functions               ||
    ||                                                        ||
    ############################################################

    */

   /**
     * @notice External callable methods to burn tokens after checks.
     */


    function burn(
        address account,
        uint256 id,
        uint256 value
    ) public nonReentrant virtual {
        require( msg.sender == _minters[id] && account == _minters[id], "ERR-1155: caller is not the minter.");

        _burn(account, id, value);
    }

    /**
     * @notice External callable methods to burn tokens after checks.
     */

    function burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory values
    ) public nonReentrant virtual {
        require(ids.length == values.length, "ERR-1155: ids and values length mismatch.");

        uint256 length = ids.length;
        for(uint i; i<length; i++){
            require( msg.sender == _minters[ids[i]] && account == _minters[ids[i]], "ERR-1155: caller is not the minter.");
        }

        _burnBatch(account, ids, values);
    }


    /**
     * @notice Destroys `amount` tokens of token type `id` from `from`
     *
     * Emits a {TransferSingle} event.
     
     */
    function _burn(
        address from,
        uint256 id,
        uint256 amount
    ) internal {
        require(from != address(0), "ERR-1155: Cannot burn from the zero address.");

        require(_balances[id][from] >= amount, "ERR-1155: Burn amount exceeds the owned supply");

        address operator = msg.sender;
        uint256[] memory ids = _asSingletonArray(id);
        uint256[] memory amounts = _asSingletonArray(amount);


        //_beforeTokenTransfer hook is applied to check for available supply
        _beforeTokenTransfer(from, address(0), ids, amounts);

        uint256 _fromBalance = _balances[id][from];
        require(_fromBalance >= amount, "ERR-1155: burn amount exceeds balance.");
        
            _balances[id][from] = _fromBalance - amount;

            if(_totalSupply[id] == 0){
                delete _minters[id];
                delete _tokenURIs[id];
            }

        emit TransferSingle(operator, from, address(0), id, amount);
    }

    /**
     * @notice Destroys `amount` tokens of token type `id` from `from`
     *
     * Emits a {TransferBatch} event.
     */
    function _burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal {
        require(from != address(0), "ERR-1155: Cannot burn from the zero address");
        require(ids.length == amounts.length, "ERR-1155: ids and amounts length mismatch");

        uint256 length = ids.length;

        for(uint256 i;i<length;++i){
            require(_balances[ids[i]][from] == amounts[i], "ERR-1155: Burn amount exceeds the owned supply");
        }


        address operator = msg.sender;


        //_beforeTokenTransfer hook is applied to check for available supply
        _beforeTokenTransfer(from, address(0), ids, amounts);

        for (uint256 i = 0; i < ids.length; i++) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];

            uint256 _fromBalance = _balances[id][from];
            require(_fromBalance >= amount, "ERR-1155: burn amount exceeds balance.");
            
                _balances[id][from] = _fromBalance - amount;
            
                if(_totalSupply[id] == 0){
                delete _minters[id];
                delete _tokenURIs[id];
            }
        }

        emit TransferBatch(operator, from, address(0), ids, amounts);
    }


    /**
     * 
    ############################################################
    ||                                                        ||
    ||                    Helper Functions                    ||
    ||                                                        ||
    ############################################################

    */

   /**
     * @notice Approve `operator` to operate on all of `owner` tokens
     *
     * Emits an {ApprovalForAll} event.
     */


    function _setApprovalForAll(
        address owner,
        address operator,
        bool approval
    ) internal {
        require(owner != operator || operator == MARKET, "ERC-1155: approve to caller");
        _operatorApprovals[owner][operator] = approval;
        emit ApprovalForAll(owner, operator, approval);

    }



   /**
    * @notice Sets a new URI for all token types, by relying on the token type ID
    */

    function _setURI(string memory _new) internal {
        _uri = _new;
    }



    /**
     * @notice Returns an array with one single element (token) which can be later used in functions.
     * {ERC1155._beforeTokenTransfer}
     */

    function _asSingletonArray(uint256 element) private pure returns (uint256[] memory) {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }

    

     /**
     * 
    ############################################################
    ||                                                        ||
    ||          {IERC1155Receiver - Implementation}           ||
    ||                                                        ||
    ############################################################

    */

   /**
         * @notice private function to invoke {IERC1155Receiver-onERC1155Received} on a target address.
         * The call is not executed if the target address is not a contract.
         *
         *   
         * 
         * */


    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private {
        if (to.isContract()) {
            try IERC1155Receiver(to).onERC1155Received(operator, from, id, amount, data) returns (bytes4 response) {
                if (response != IERC1155Receiver.onERC1155Received.selector) {
                    revert("ERR-1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERR-1155: transfer to non-ERC1155Receiver implementer");
            }
        }
    }

/**
         * @notice private function to invoke {IERC1155Receiver-onERC1155Received} on a target address.
         * The call is not executed if the target address is not a contract.
         *
         *   
         * 
         * */

    function _doSafeBatchTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) private {
        if (to.isContract()) {
            try IERC1155Receiver(to).onERC1155BatchReceived(operator, from, ids, amounts, data) returns (
                bytes4 response
            ) {
                if (response != IERC1155Receiver.onERC1155BatchReceived.selector) {
                    revert("ERR-1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERR-1155: transfer to non-ERC1155Receiver implementer");
            }
        }
    }



     /**
     * 
    ############################################################
    ||                                                        ||
    ||                Marketplace Functions                   ||
    ||                                                        ||
    ############################################################

    */

    /**
     * @notice Function is called by the marketplace contract to create token supply 
     *  */


     function createTokenSupply(string memory _tokenURI, uint256 _amount, bytes memory _data) public returns(uint256){
         tokenId.increment();
         uint256 current_itemId = tokenId.current();
        _mint(msg.sender, current_itemId, _amount, _data);
        _setTokenURI(current_itemId, _tokenURI);
        _setApprovalForAll(msg.sender,MARKET, true);

        return current_itemId;
}

    function getOwnedTokens() public view returns(uint256[] memory ownedTokens) {

        uint256 numberOfExistingTokens = tokenId.current();

        uint256 numberOfOwnedTokens = 0;

        for(uint256 i; i < numberOfExistingTokens; ++i){
            if(_balances[i+1][msg.sender] > 0){
                numberOfOwnedTokens++;
            }
        }

        ownedTokens = new uint256[](numberOfOwnedTokens);
  
        uint256 index = 0;
        uint256 id;

        for(uint256 i; i < numberOfExistingTokens; ++i){
            id = i+1;
            if(_balances[id][msg.sender] == 0) continue;
                ownedTokens[index] = id;
                ++index;
        }
        
    }

    function mintedBy(uint256 _id) public view returns(address){
        return _minters[_id];
    }

    function getMintedTokens() public view returns(uint256[] memory mintedTokens){
        uint256 numberOfExistingTokens = tokenId.current();

        uint256 numberOfMintedTokens = 0;

        for(uint256 i; i < numberOfExistingTokens; ++i){
            if(_minters[i+1] == msg.sender){
                ++numberOfMintedTokens;
            }
        }

        mintedTokens = new uint256[](numberOfMintedTokens);
        
        uint256 index = 0;
        uint256 id;

        for(uint256 i; i < numberOfExistingTokens; ++i){
            
            id = i+1;
            if(_minters[id] != msg.sender) continue;
                mintedTokens[index] = id;
                ++index;
        }

    }

    

}

