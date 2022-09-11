// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract ERC721 is ERC165, IERC721, IERC721Metadata  {


    //Using String,Address libraries from openzepplin to get required functions
    using String for uint256;
    using Address for address;

    //Using Counters library to keep a track of minted NFT tokens
    using Counters for Counters.Counter;


    //Name of the collection minted from this contract
    string private _name;

    //Symbol of the collection minted from this contract
    string private _symbol;

    //Counter for token Ids to prevent overflows
    Counters.Counter private _tokenIds;

    //Address of marketplace that will be the approved operator of Tokens
    address marketplaceAddress;


    //Mapping to store uint256 tokenId => string tokenURI 
    mapping(uint256 => string) private _tokenURIs;

    //Mapping to store uint256 tokenId => address owner
    mapping(uint256 => address) private _owners;

    //Mapping to store address owner => uint256 Token Count
    mapping(address => uint256) private _balances;

    //Mapping to store uint256 tokenId => address approved 
    mapping(uint256 => address) private _tokenApprovals;

    //Mapping to store address owner => operator approval mapping
    mapping(address => mapping(address => bool)) private _operatorApprovals;


    constructor(string memory _name, string memory _symbol, address _market) {
        
        _name = _name;
        _symbol = _symbol;

        marketplaceAddress = _market;
    }


    /**
     * @notice Implementing the supportsInterface function from ERC165, IERC165
     */

    function supportsInterface(bytes4 interfaceId) 
    public 
    view 
    virtual 
    override(ERC165, IERC165) 
    returns (bool)
    {
        return 
        interfaceId == type(IERC721).interfaceId ||
        interfaceId == type(IERC721Metadata) ||
        super.supportsInterface(interfaceId);
    }

    /**
     * 
    ############################################################
    ||                                                        ||
    ||           IERC721Metadata Functions                    ||
    ||                                                        ||
    ############################################################

    */



        /**
         * @dev Returns the token collection name.
         */
        function name() external override view returns (string memory){
            return _name;
        }

        /**
         * @dev Returns the token collection symbol.
         */
        function symbol() external override view returns (string memory){
            return _symbol;
        }

        /**
         * @dev Returns the Uniform Resource Identifier (URI) for `tokenId` token.
         */
        function tokenURI(uint256 tokenId) 
        external 
        override
        view 
        returns (string memory){
            _hasBeenMinted(tokenId);

            string memory _tokenURI = _tokenURIs[tokenId];

            if(bytes(_tokenURI).length != 0){
                return _tokenURI;
            }

            return "";

            
        }
    /**
     * @notice baseURI() can be implemented if specific URI pathname is intended in future 
     * */

    
        /**
         * @notice Set `_tokenURI` as the tokenURI of `tokenId`.
         *
         *
         */
        function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal {
            require(_exists(tokenId), "ERR-721: cannot set URI of non-existent token");
            _tokenURIs[_tokenId] = _tokenURI;
        }    


    /**
     * 
    ############################################################
    ||                                                        ||
    ||                   IERC721 Functions                    ||
    ||                                                        ||
    ############################################################

    */

        /**
         * @dev Returns the number of tokens in ``owner``'s account.
         */
        function balanceOf(address owner) 
        external 
        override 
        view 
        returns (uint256 balance)
        {
            require(owner != address(0), "ERR-721: address zero is not a valid owner.");
            return _balances[owner];
        }

        /**
         * @dev Returns the owner of the `tokenId` token.
         *
         * Requirements:
         *
         * - `tokenId` must exist.
         */
        function ownerOf(uint256 tokenId) 
        external 
        view 
        override
        returns (address owner)
        {
            address owner = _ownerOf(tokenId);
            require(owner != address(0), "ERR-721: invalid token ID.");
            return owner;
        }

        /**
         * @dev Safely transfers `tokenId` token from `from` to `to`.
         *
         * Requirements:
         *
         * - `from` cannot be the zero address.
         * - `to` cannot be the zero address.
         * - `tokenId` token must exist and be owned by `from`.
         * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
         * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
         *
         * Emits a {Transfer} event.
         */
        function safeTransferFrom(
            address from,
            address to,
            uint256 tokenId,
            bytes calldata data
        ) override external
        {
            require(_isApprovedOrOwner(msg.sender, tokenId), "ERR-721: caller is not the owner or approved.");
            _safeTransfer(from, to, tokenId, data);
        }

        /**
         * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
         * are aware of the ERC721 protocol to prevent tokens from being forever locked.
         *
         * Requirements:
         *
         * - `from` cannot be the zero address.
         * - `to` cannot be the zero address.
         * - `tokenId` token must exist and be owned by `from`.
         * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
         * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
         *
         * Emits a {Transfer} event.
         */
        function safeTransferFrom(
            address from,
            address to,
            uint256 tokenId
        ) override external 
        {
            safeTransferFrom(from, to, tokenId, "");
        }

        /**
         * @dev Transfers `tokenId` token from `from` to `to`.
         *
         * - `from` cannot be the zero address.
         * - `to` cannot be the zero address.
         * - `tokenId` token must be owned by `from`.
         * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
         *
         * Emits a {Transfer} event.
         */
        function transferFrom(
            address from,
            address to,
            uint256 tokenId
        ) override external
        {
            require(_isApprovedOrOwner(msg.sender, tokenId), "ERR-721: caller is not the owner or approved.");

            _transfer(from, to, tokenId);
        }

        /**
         * @dev Gives permission to `to` to transfer `tokenId` token to another account.
         * The approval is cleared when the token is transferred.
         * 
         * Requirements:
         *
         * - The caller must own the token or be an approved operator.
         * - `tokenId` must exist.
         *
         * Emits an {Approval} event.
         */
        function approve(address to, uint256 tokenId) override external
        {
            address owner = _ownerOf(tokenId);
            require(to != owner, "ERR-721: cannot approve to current owner.");

            require(
                msg.sender == owner || isApprovedForAll(owner, msg.sender),
                "ERR-721: approve caller is not token owner or approved operator."
            );

            _approve(to, tokenId);
        }

        /**
         * @dev Approve or remove `operator` as an operator for the caller.
         * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
         *
         * Requirements:
         *
         * - The `operator` cannot be the caller.
         *
         * Emits an {ApprovalForAll} event.
         */
        function setApprovalForAll(address operator, bool _approved) override external
        {
            _setApprovalForAll(msg.sender, operator, _approved);
        }

        /**
         * @dev Returns the account approved for `tokenId` token.
         *
         * Requirements:
         *
         * - `tokenId` must exist.
         */
        function getApproved(uint256 tokenId) 
        external 
        override
        view 
        returns (address operator)
        {   
            _hasBeenMinted(tokenId);

            return _tokenApprovals[tokenId];
        }
        /**
         * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
         *
         * See {setApprovalForAll}
         */
        function isApprovedForAll(address owner, address operator) 
        external 
        override
        view 
        returns (bool)
        {
            return _operatorApprovals[owner][operator];
        }

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
         * @notice private function to invoke {IERC721Receiver-onERC721Received} on a target address.
         * The call is not executed if the target address is not a contract.
         *
         *   */
    function _checkOnERC721Received(
            address from,
            address to,
            uint256 tokenId,
            bytes memory data
        ) private returns (bool) {
            if (to.isContract()) {
                try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
                    return retval == IERC721Receiver.onERC721Received.selector;
                } catch (bytes memory reason) {
                    if (reason.length == 0) {
                        revert("ERR-721: transfer to non ERC721Receiver.");
                    } else {
                        /// @solidity memory-safe-assembly
                        assembly {
                            revert(add(32, reason), mload(reason))
                        }
                    }
                }
            } else {
                return true;
            }
        }

    /**
    * @notice Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
    * are aware of the ERC721 protocol to prevent tokens from being forever locked.
    *
    * `data` is additional data, it has no specified format and it is sent in call to `to`.
    *
    */
        function _safeTransfer(
            address _from,
            address _to,
            uint256 _tokenId,
            bytes memory _data
        ) internal {
            _transfer(_from, _to, _tokenId);
            require(_checkOnERC721Received(_from, _to, _tokenId, _data), "ERR-721: transfer to non ERC721Receiver.");
        }    


    /**
    * @notice Transfer valid `tokenId` from `from` to `to` address
    emits Transfer event.
    */

    function _transfer(address _from, address _to, uint256 _tokenId) internal {

        require(_ownerOf(_tokenId) == _from, "WARN: Not the owner of token.");
        require(_to != address(0), "ERR-721: Only transfer to valid address.");

        delete _tokenApprovals[_tokenId];

        _balances[_from] -= 1;
        _balances[_to] += 1;

        _owners[_tokenId] = _to;

        emit Transfer(_from, _to, _tokenId);
    }


    /**
    * @notice Mint token when `to` is a contract address. {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], without an additional `data` parameter which is
    * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
    */

    function _safeMint(address _to, uint256 _tokenId) internal {
        _safeMint(_to, _tokenId, "");
    }
        
    /**
    * @notice Mint token when `to` is a contract address. Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
    * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
    */
    function _safeMint(
            address _to,
            uint256 _tokenId,
            bytes memory _data
        ) internal {
            _mint(_to, _tokenId);
            require(
                _checkOnERC721Received(address(0), _to, _tokenId, _data),
                "ERR-721: transfer to non ERC721Receiver."
            );
        }


    /**
     * @notice Mints non-existent `tokenId` and transfers it to a valid `to` address 
     * emits Transfer event from `address(0)` to `to` for `tokenId` 
     * 
     * */

    function _mint(address _to, uint256 _tokenId) internal {
        require(_to !== address(0), "ERR-721: Address does not exist.");
        require(!exists(_tokenId), "ERR-721: Token already exists.");

        _balances[_to] += 1;

        _owners[_tokenId] = _to;

        emit  Transfer(address(0), _to, _tokenId);

    }

    /**
     * @notice bruns existing `tokenId` and transfers it to zero address 
     * emits Transfer from `owner` to `address(0)` for `tokenId`
     * if token-specific URI was set for the token, and if so, 
     * it deletes the token URI from
     * the storage mapping.
     *  */

    function _burn(uint256 _tokenId) internal {

        address owner = _ownerOf(_tokenId);

        delete _tokenApprovals[_tokenId];

        _balances[owner] -= 1;

        delete _owners[_tokenId];

        if (bytes(_tokenURIs[tokenId]).length != 0) {
                delete _tokenURIs[tokenId];
            }
        
        emit Transfer(owner, address(0), _tokenId);    
    }

    function burn(uint256 tokenId) public {

            require(_isApprovedOrOwner(msg.sender, tokenId), "ERR-721: caller is not token owner nor approved.");
            _burn(tokenId);
        }

    /**
    * @notice Returns whether `spender` is allowed.
    *`tokenId` must exist.
    */

    function _isApprovedOrOwner(address _spender, uint256 _tokenId) internal view virtual returns (bool) {
        address owner = _ownerOf(_tokenId);
        return (_spender == owner || isApprovedForAll(owner, _spender) || getApproved(_tokenId) == _spender);
    }


    /**
     * @notice Returns the owner of the Token 
     *  */    

    function _ownerOf(uint256 _tokenId) internal view returns(address) {
        return _owners[_tokenId];
    }

    /**
     * @notice Checks whether Token Id exists
     *  */

    function _exists(uint256 _tokenId) internal view returns(bool) {
        return _owners[_tokenId] != address(0);
    }


    /**
     * @notice Approves the `_to` for the `_tokenId`  
     *  */

    function _approve(address _to, uint256 _tokenId) internal {
        _tokenApprovals[uint256] = _to;

        emit Approval(_ownerOf(_tokenId), _to, _tokenId);
    }

    /**
     * @notice Approves `operator` to operate on tokens of the `owner` 
     *  */

    function _setApprovalForAll(address _owner, address _operator, bool _approval)
    internal 
    {
        require(_owner != _operator, "ERR-721: Owner cannot be the operator.");
        _operatorApprovals[_owner][_operator] = _approval;
        emit ApprovalForAll(_owner, _operator, _approval);
    }

    /**
     * @notice Checks whether token has been minted,
     * if the token is not minted the transaction will be reverted. 
     *  */

    function _hasBeenMinted(uint256 _tokenId) internal view {
        require(_exists(tokenId), "ERR-721: Token is not minted.")
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
     * @notice Function is called by the marketplace contract to create tokens 
     *  */


    function createToken(string memory _tokenURI) public returns(uint256){

        _tokenIds.increment();
        uint256 current_itemId = _tokenIds.current();

        _mint(msg.sender, current_itemId);
        _setTokenURI(current_itemId, _tokenURI);
        setApprovalForAll(marketplaceAddress, true);

        return current_itemId;
}