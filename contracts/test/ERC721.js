const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

const {expect} = require("chai");




describe("ERC721 Token Contract", function(){


    async function deployFixture(){

        const [owner, market, alice, bob] = await ethers.getSigners();

        const contractFactory = await ethers.getContractFactory("ERC721");

        const contract = await contractFactory.deploy("MintablePoly", "MPLY", market.address);

        await contract.deployed();


        //fixture returns values that will be used later on in the tests
        return {
            owner,
            market,
            alice,
            bob,
            contract
        };
    }


    describe("Deployment", function(){

        it("Should set the name of collection", async function(){

            const {contract} =  await loadFixture(deployFixture);

            expect(await contract.name()).to.equal("MintablePoly");
        });


        it("Should set the symbol of collection", async function(){

            const {contract} =  await loadFixture(deployFixture);

            expect(await contract.symbol()).to.equal("MPLY");
        });
    })

    describe("Tokenization", function(){

        it("Should be able to mint ERC-721 tokens through marketplace address", async function(){

            const {contract, market, alice} =  await loadFixture(deployFixture);
            
            await contract.connect(market).mintERC721Token(1, alice.address, "http://www.example.com");

            expect(await contract.ownerOf(1)).to.equal(alice.address);
        });


        it("Should fail to mint ERC-721 tokens if marketplace is bypassed", async function(){

            const {contract, alice} =  await loadFixture(deployFixture);

            await expect(contract.mintERC721Token(1, alice.address, "http://www.example.com")).to.be
            .revertedWith("ERR-721: Tokens can only be minted through our Marketplace.");
        });

        it("Should set the ownership of minted token", async function(){

            const {contract, market, owner} =  await loadFixture(deployFixture);
            
            await contract.connect(market).mintERC721Token(1, owner.address, "http://www.example.com");

            expect(await contract.ownerOf(1)).to.equal(owner.address);
        });

        it("Should set the token uri of the minted token", async function(){

            const {contract, market, owner} =  await loadFixture(deployFixture);
            
            await contract.connect(market).mintERC721Token(1, owner.address, "http://www.example.com");

            expect(await contract.tokenURI(1)).to.equal("http://www.example.com");
        });

        it("Should set the operator approval for marketplace", async function(){

            const {contract, market, owner} =  await loadFixture(deployFixture);
            
            await contract.connect(market).mintERC721Token(1, owner.address, "http://www.example.com");

            expect(await contract.isApprovedForAll(owner.address, market.address)).to.equal(true);
        });
    })

})