const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

const {expect} = require("chai");




describe("ERC1155 Token Contract", function(){


    async function deployFixture(){

        const [owner, market, alice, bob] = await ethers.getSigners();

        const contractFactory = await ethers.getContractFactory("ERC1155");

        const contract = await contractFactory.deploy("", market.address);

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

        it("Should set the uri of collection to empty", async function(){

            const {contract} =  await loadFixture(deployFixture);

            expect(await contract.uri(0)).to.equal("");
        });

    })

    describe("Tokenization", function(){

        it("Should be able to mint ERC-1155 tokens through marketplace address", async function(){

            const {contract, market, alice} =  await loadFixture(deployFixture);

            console.log(market.address);
            
            await contract.connect(market).createSupply(alice.address, "http://www.example.com", 1, 10, "0x");

            expect(await contract.exists(1)).to.equal(true);
        });


        it("Should fail to mint ERC-1155 tokens if marketplace is bypassed", async function(){

            const {contract, alice} =  await loadFixture(deployFixture);

            await expect(contract.createSupply(alice.address, "http://www.example.com", 1, 10, "0x"))
            .to
            .be
            .revertedWith("ERR1155: Tokens can only be minted through our Marketplace.");
        });

        it("Should set the ownership of minted token", async function(){

            const {contract, market, owner} =  await loadFixture(deployFixture);
            
            await contract.connect(market).createSupply(owner.address, "http://www.example.com", 1, 10, "0x");

            expect(await contract.balanceOf(owner.address, 1)).to.equal(10);
        });

        it("Should set the supply of minted token", async function(){

            const {contract, market, owner} =  await loadFixture(deployFixture);
            
            await contract.connect(market).createSupply(owner.address, "http://www.example.com", 1, 10, "0x");

            expect(await contract.totalSupply(1)).to.equal(10);
        });

        it("Should set the token uri of the minted token", async function(){

            const {contract, market, owner} =  await loadFixture(deployFixture);
            
            await contract.connect(market).createSupply(owner.address, "http://www.example.com", 1, 10, "0x");

            expect(await contract.tokenSpecificURI(1)).to.equal("http://www.example.com");
        });

        it("Should set the operator approval for marketplace", async function(){

            const {contract, market, owner} =  await loadFixture(deployFixture);
            
            await contract.connect(market).createSupply(owner.address, "http://www.example.com", 1, 10, "0x");

            expect(await contract.isApprovedForAll(owner.address, market.address)).to.equal(true);
        });
    })

})