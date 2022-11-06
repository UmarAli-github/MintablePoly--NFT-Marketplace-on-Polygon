const { ethers } = require("hardhat");


async function main() {

  const [deployer] = await ethers.getSigners();


  const marketInstance = await ethers.getContractFactory("Market");

  const market = await marketInstance.deploy();

  await market.deployed();

  console.log("Market Address", market.address);


  
  const erc721ContractInstance = await ethers.getContractFactory("ERC721");

  const erc721Contract = await erc721ContractInstance.deploy("MintablePolyNFT", "MPLYNFT", market.address);

  await erc721Contract.deployed();

  console.log("ERC-721 Contract Address", erc721Contract.address);



  const erc1155ContractInstance = await ethers.getContractFactory("ERC1155");

  const erc1155Contract = await erc1155ContractInstance.deploy("", market.address);

  await erc1155Contract.deployed();

  console.log("ERC-1155 Contract Address", erc1155Contract.address);



}

main()
.then(() => {
  process.exit(0);
})
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
