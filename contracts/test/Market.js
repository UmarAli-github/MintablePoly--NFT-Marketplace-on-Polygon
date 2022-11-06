const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

const {expect} = require("chai");


describe("Marketplace Contract", function(){

    async function deployFixture(){

        const [owner, alice, bob] = await ethers.getSigners();

        const contract = await ethers.getContractFactory("Market");

        const market = await contract.connect(owner).deploy();

        await market.deployed();


        const erc721Factory = await ethers.getContractFactory("ERC721");

        const erc721Contract = await erc721Factory.deploy("MintablePoly", "MPLY", market.address);

        await erc721Contract.deployed();


        const erc1155Factory = await ethers.getContractFactory("ERC1155");

        const erc1155Contract = await erc1155Factory.deploy("", market.address);

        await erc1155Contract.deployed();

        return {
            owner,
            alice,
            bob,
            market,
            erc721Contract,
            erc1155Contract
        }
    }


    describe("Deployment", function(){

        it("Should let owner update the listing fee", async function(){

            const {market, owner} =  await loadFixture(deployFixture);

            await market.connect(owner).updateListingFee(1);

            expect(await market.getListingFee()).to.equal(1);
        });


        it("Should let anyone but owner to update the listing fee", async function(){

            const {market, alice} =  await loadFixture(deployFixture);


            await expect(market.connect(alice).updateListingFee(1))
            .to
            .be
            .revertedWith("ERR: Only owner can update the listing fee.");
        });
    })


    describe("Tokenization", function(){


        it("Should create ERC-721 tokens in the ERC-721 contract and emit the event", async function() {

            const {alice, market, erc721Contract} = await loadFixture(deployFixture);

            
            
            await expect(market.connect(alice).createERC721Token(erc721Contract.address, "http://www.example.com"))
            .to
            .emit(market, "NFT_MarketItem_Created")
            .withArgs(1, 
                alice.address, 
                "0x0000000000000000000000000000000000000000",
                alice.address,
                0,
                false);
        });

        it("Should create ERC-1155 tokens in the ERC-1155 contract and emit the event", async function() {

            const {bob, market, erc1155Contract} = await loadFixture(deployFixture);

            
            
            await expect(market.connect(bob).createERC1155Token(erc1155Contract.address, "http://www.example.com", 10))
            .to
            .emit(market, "sNFT_MarketItem_Created")
            .withArgs(1, 
                bob.address, 
                "0x0000000000000000000000000000000000000000",
                bob.address,
                0,
                10);
        });

        it("Should create ERC-721 tokens in the ERC-721 contract and set ownership inside ERC-721 contract", async function() {

            const {alice, market, erc721Contract} = await loadFixture(deployFixture);

            await market.connect(alice).createERC721Token(erc721Contract.address, "http://www.example.com");
            
            expect(await erc721Contract.ownerOf(1))
            .to
            .equal(alice.address);
        });

        it("Should create ERC-1155 tokens in the ERC-1155 contract and set balance of owner inside ERC-1155 contract", async function() {

            const {alice, market, erc1155Contract} = await loadFixture(deployFixture);

            await market.connect(alice).createERC1155Token(erc1155Contract.address, "http://www.example.com", 10);
            
            expect(await erc1155Contract.balanceOf(alice.address, 1))
            .to
            .equal(10);
        });


    })



});