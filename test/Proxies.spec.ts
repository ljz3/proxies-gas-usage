import { ethers } from "hardhat";
import hre from "hardhat";
import {
  FactoryImplementation,
  FactoryTUP,
  FactoryClone,
  FactoryUUPS,
} from "../typechain-types";
import { expect } from "chai";

describe("factories", async function () {
  let factoryImplementation: FactoryImplementation;
  let factoryTUP: FactoryTUP;
  let factoryClone: FactoryClone;
  let factoryUUPS: FactoryUUPS;

  before(async function () {
    this.accounts = await ethers.getSigners();
  });

  it("Implementation factory deployment cost", async function () {
    const Factory = await ethers.getContractFactory("FactoryImplementation");
    factoryImplementation = await Factory.deploy();
  });

  it("TUP factory deployment cost", async function () {
    const Factory = await ethers.getContractFactory("FactoryTUP");
    factoryTUP = await Factory.deploy();
  });

  it("Clone factory deployment cost", async function () {
    const Factory = await ethers.getContractFactory("FactoryClone");
    factoryClone = await Factory.deploy();
  });

  it("UUPS factory deployment cost", async function () {
    const Factory = await ethers.getContractFactory("FactoryUUPS");
    factoryUUPS = await Factory.deploy();
  });

  it("UUPS implementation compatibility", async function () {
    const UUPSCompatibleERC20 = await hre.ethers.getContractFactory(
      "UUPSCompatibleERC20",
    );

    const proxy = await hre.upgrades.deployProxy(
      UUPSCompatibleERC20,
      ["Name", "Symbol", 1000, this.accounts[0].address],
      { kind: "uups" },
    );

    const UUPSCompatibleERC20V2 = await ethers.getContractFactory(
      "UUPSCompatibleERC20V2",
    );

    const proxyV2 = await hre.upgrades.upgradeProxy(
      proxy,
      UUPSCompatibleERC20V2,
    );
    expect((await proxyV2.version()) === "v2").to.be.true;
  });

  it("Implementation deployment and usage cost", async function () {
    const tx1 = await factoryImplementation.createToken(
      "name",
      "symbol",
      1000,
      {
        from: this.accounts[0].address,
      },
    );
    const { gasUsed: createGasUsed, events } = await tx1.wait();

    const address = events?.find(Boolean)?.address as string;

    const implementation = await ethers.getContractFactory(
      "ERC20PresetFixedSupplyUpgradeable",
    );
    const instance = new ethers.Contract(
      address,
      implementation.interface,
      this.accounts[0],
    );
    const tx2 = await instance.transfer(this.accounts[1].address, 100, {
      from: this.accounts[0].address,
    });
    const { gasUsed: transferGasUsed } = await tx2.wait();

    console.log(
      `FactoryImplementation.createToken: ${createGasUsed.toString()}`,
    );
    console.log(
      `Implementation ERC20.transfer:     ${transferGasUsed.toString()}`,
    );
  });

  it("TUP deployment and usage cost", async function () {
    // Can not set the owner of the token to be the same as the owner of the proxy
    // Since TUP does not delegate the call of the proxy owner to the implementation
    const tx1 = await factoryTUP.createToken(
      "name",
      "symbol",
      1000,
      this.accounts[1].address, // Owner of the token
      {
        from: this.accounts[0].address, // Owner of the proxy
      },
    );
    const { gasUsed: createGasUsed, events } = await tx1.wait();

    const address = events?.find(Boolean)?.address as string;

    const implementation = await ethers.getContractFactory(
      "ERC20PresetFixedSupplyUpgradeable",
    );
    const instance = new ethers.Contract(
      address,
      implementation.interface,
      this.accounts[0],
    );

    const tx2 = await instance
      .connect(this.accounts[1])
      .transfer(this.accounts[0].address, 100);
    const { gasUsed: transferGasUsed } = await tx2.wait();

    console.log(`FactoryTUP.createToken:      ${createGasUsed.toString()}`);
    console.log(`TUP ERC20.transfer:          ${transferGasUsed.toString()}`);
  });

  it("Clone deployment and usage cost", async function () {
    const tx1 = await factoryClone.createToken("name", "symbol", 1000, {
      from: this.accounts[0].address,
    });
    const { gasUsed: createGasUsed, events } = await tx1.wait();

    const address = events?.find(Boolean)?.address as string;

    const implementation = await ethers.getContractFactory(
      "ERC20PresetFixedSupplyUpgradeable",
    );
    const instance = new ethers.Contract(
      address,
      implementation.interface,
      this.accounts[0],
    );

    const tx2 = await instance.transfer(this.accounts[1].address, 100, {
      from: this.accounts[0].address,
    });
    const { gasUsed: transferGasUsed } = await tx2.wait();

    console.log(`FactoryClone.createToken:      ${createGasUsed.toString()}`);
    console.log(`Clone ERC20.transfer:          ${transferGasUsed.toString()}`);
  });

  it("UUPS deployment and usage cost", async function () {
    const tx1 = await factoryUUPS.createToken("name", "symbol", 1000, {
      from: this.accounts[0].address,
    });
    const { gasUsed: createGasUsed, events } = await tx1.wait();

    const address = events?.find(Boolean)?.address as string;

    const implementation = await ethers.getContractFactory(
      "UUPSCompatibleERC20",
    );

    const instance = new ethers.Contract(
      address,
      implementation.interface,
      this.accounts[0],
    );

    const tx2 = await instance.transfer(this.accounts[1].address, 100, {
      from: this.accounts[0].address,
    });
    const { gasUsed: transferGasUsed } = await tx2.wait();

    console.log(`FactoryUUPS.createToken: ${createGasUsed.toString()}`);
    console.log(`UUPS ERC20.transfer:     ${transferGasUsed.toString()}`);
  });
});
