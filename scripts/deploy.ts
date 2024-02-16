import { ethers } from "hardhat";

async function main() {
  const initialOwner = "0x77158c23cc2d9dd3067a82e2067182c85fa3b1f6";
  const erc20Contract = await ethers.deployContract("ERC20Token", [
    initialOwner,
    "WEB3CX",
    "W3B",
  ]);

  await erc20Contract.waitForDeployment();

  console.log(`ERC20 Token contract deployed to ${erc20Contract.target}`);

  const saveERC20 = await ethers.deployContract("SaveERC20", [
    erc20Contract.target,
  ]);

  await saveERC20.waitForDeployment();

  console.log(`SaveERC20 contract deployed to ${saveERC20.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deploy.ts --network sepolia
// ERC20 Token contract deployed to 0x18dE7F8D525cc8d350E0Ccd83a0b4DDcfb922622
// npx hardhat verify --network sepolia 0x18dE7F8D525cc8d350E0Ccd83a0b4DDcfb922622 0x77158c23cc2d9dd3067a82e2067182c85fa3b1f6 WEB3CX W3B

// saveERC20 contract deployed to 0x477cF189BB03193701dFF96a3a49586A6262b3e7
// npx hardhat verify --network sepolia 0x477cF189BB03193701dFF96a3a49586A6262b3e7 0x18dE7F8D525cc8d350E0Ccd83a0b4DDcfb922622

// npx hardhat test
