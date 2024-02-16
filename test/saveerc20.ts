import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SAVEERC20Token", () => {
  async function deployTokens() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const tokenName = "WEB3CX";
    const tokenSymbol = "W3B";

    const ERC20 = await ethers.getContractFactory("ERC20Token");
    const erc20 = await ERC20.deploy(owner.address, tokenName, tokenSymbol);

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");

    const saveERC20 = await SaveERC20.deploy(erc20.getAddress());

    return { owner, otherAccount, erc20, saveERC20 };
  }

  describe("Deployment", () => {
    it("Should be able to deploy the ERC20 contract", async () => {
      const { erc20 } = await loadFixture(deployTokens);
      expect(erc20.target).to.not.equal(0);
    });

    it("Should be able to deploy the SaveERC20 contract", async () => {
      const { saveERC20 } = await loadFixture(deployTokens);
      expect(saveERC20.target).to.not.equal(0);
    });

    it("Should be able to deploy the ERC20 contract with the right owner", async () => {
      const { owner, erc20 } = await loadFixture(deployTokens);
      expect(await erc20.owner()).to.equal(owner.address);
    });
  });

  describe("Deposit", () => {
    it("Should be able to deposit ERC20 tokens", async () => {
      const { owner, otherAccount, erc20, saveERC20 } = await loadFixture(
        deployTokens
      );

      const depositAmount = ethers.parseUnits("1", 18);

      await erc20.transfer(otherAccount.address, depositAmount);

      await erc20
        .connect(otherAccount)
        .approve(saveERC20.target, depositAmount);
      await saveERC20.connect(otherAccount).deposit(depositAmount);

      const balance = await saveERC20.checkUserBalance(otherAccount.address);

      expect(balance).to.equal(depositAmount);
    });
    it("Owner Should be able to deposit ERC20 tokens", async () => {
      const { owner, erc20, saveERC20 } = await loadFixture(deployTokens);

      const depositAmount = ethers.parseUnits("1", 18);

      await erc20.approve(saveERC20.target, depositAmount);
      await saveERC20.deposit(depositAmount);

      const balance = await saveERC20.checkUserBalance(owner.address);

      expect(balance).to.equal(depositAmount);
    });

    it("Should not be able to deposit if value is 0", async () => {
      const { owner, saveERC20 } = await loadFixture(deployTokens);

      await expect(saveERC20.deposit(0)).to.be.revertedWith(
        "can't save zero value"
      );
    });

    it("Should not be able to deposit if not enough token", async () => {
      const { owner, otherAccount, saveERC20 } = await loadFixture(
        deployTokens
      );

      const depositAmount = ethers.parseUnits("1", 18);

      await expect(
        saveERC20.connect(otherAccount).deposit(depositAmount)
      ).to.be.revertedWith("not enough token");
    });

    it("Should not be able to deposit if not enough allowance", async () => {
      const { owner, otherAccount, erc20, saveERC20 } = await loadFixture(
        deployTokens
      );

      const depositAmount = ethers.parseUnits("1", 18);

      await erc20.transfer(otherAccount.address, depositAmount);

      await expect(saveERC20.connect(otherAccount).deposit(depositAmount)).to.be
        .reverted;
    });

    it("Should emit a Deposit event", async () => {
      const { owner, otherAccount, erc20, saveERC20 } = await loadFixture(
        deployTokens
      );

      const depositAmount = ethers.parseUnits("1", 18);

      await erc20.transfer(otherAccount.address, depositAmount);

      await erc20
        .connect(otherAccount)
        .approve(saveERC20.target, depositAmount);

      await expect(saveERC20.connect(otherAccount).deposit(depositAmount))
        .to.emit(saveERC20, "SavingSuccessful")
        .withArgs(otherAccount.address, depositAmount);
    });
  });

  describe("Withdraw", () => {
    it("Should be able to withdraw ERC20 tokens", async () => {
      const { owner, otherAccount, erc20, saveERC20 } = await loadFixture(
        deployTokens
      );

      const depositAmount = ethers.parseUnits("1", 18);

      await erc20.transfer(otherAccount.address, depositAmount);

      await erc20
        .connect(otherAccount)
        .approve(saveERC20.target, depositAmount);
      await saveERC20.connect(otherAccount).deposit(depositAmount);

      const balanceBefore = await saveERC20.checkUserBalance(
        otherAccount.address
      );

      await saveERC20.connect(otherAccount).withdraw(depositAmount);

      const balanceAfter = await saveERC20.checkUserBalance(
        otherAccount.address
      );

      expect(balanceAfter).to.equal(0);
    });

    it("Should not be able to withdraw if the balance is 0", async () => {
      const { owner, saveERC20 } = await loadFixture(deployTokens);

      await expect(saveERC20.withdraw(0)).to.be.revertedWith(
        "can't withdraw zero value"
      );
    });

    it("Should not be able to withdraw if insufficient funds", async () => {
      const { owner, otherAccount, saveERC20 } = await loadFixture(
        deployTokens
      );
      const amountToWithdraw = ethers.parseUnits("1", 18);

      await expect(
        saveERC20.connect(otherAccount).withdraw(amountToWithdraw)
      ).to.be.revertedWith("insufficient funds");
    });

    it("Should emit a Withdrawal event", async () => {
      const { owner, otherAccount, erc20, saveERC20 } = await loadFixture(
        deployTokens
      );

      const depositAmount = ethers.parseUnits("1", 18);

      await erc20.transfer(otherAccount.address, depositAmount);

      await erc20
        .connect(otherAccount)
        .approve(saveERC20.target, depositAmount);
      await saveERC20.connect(otherAccount).deposit(depositAmount);

      await expect(saveERC20.connect(otherAccount).withdraw(depositAmount))
        .to.emit(saveERC20, "WithdrawSuccessful")
        .withArgs(otherAccount.address, depositAmount);
    });
  });
});
