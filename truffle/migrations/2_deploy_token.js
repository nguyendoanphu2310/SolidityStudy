let MyToken = artifacts.require("MyToken");
let MyTokenSale = artifacts.require("MyTokenSale");
let KnowYourCustomerContract = artifacts.require("KnowYourCustomerContract");
module.exports = async function (deployer) {
  let addr = await web3.eth.getAccounts();
  
  await deployer.deploy(MyToken,1000000000);
  await deployer.deploy(KnowYourCustomerContract)
  await deployer.deploy(MyTokenSale,1, addr[0], MyToken.address, KnowYourCustomerContract.address);

  let tokenInstance = await MyToken.deployed();
  let totalSupply = await tokenInstance.totalSupply();
  console.log('tokenInstance totalSupply',totalSupply);
  await tokenInstance.transfer(MyTokenSale.address, totalSupply);

};
