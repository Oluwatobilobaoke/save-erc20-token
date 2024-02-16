# SAVEERC20 Smart Contract

A smart contract that allows users to save ERC20 tokens and withdraw it later.

ERC 20 tokens are a type of cryptocurrency that is used solely for the Ethereum platform. They are used to represent assets or value and are used as a method of transferring that value between users. ERC20 tokens are stored and sent using Ethereum addresses and transactions, and use gas to cover transaction fees.

The ERC20 standard makes it easier for developers to create their own cryptocurrencies on the Ethereum platform. It is a set of rules and functions that developers must follow when creating their own tokens. This makes it easier for developers to create their own tokens, and makes it easier for users to interact with these tokens.

ERC20 token: WEB3CX
[0x18dE7F8D525cc8d350E0Ccd83a0b4DDcfb922622](https://sepolia.etherscan.io/address/0x18dE7F8D525cc8d350E0Ccd83a0b4DDcfb922622#code)

Save ERC20 token: SaveERC20
[0x477cF189BB03193701dFF96a3a49586A6262b3e7](https://sepolia.etherscan.io/address/0x477cF189BB03193701dFF96a3a49586A6262b3e7#code)

Code is written in Solidity and tested with Hardhat.

## Install

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

```bash
npx hardhat verify --network sepolia <contract-address> <constructor arguments>
```

```bash
npx hardhat test
```
