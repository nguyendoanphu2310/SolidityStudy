let chai = require('./setup_chai.js');
const MyToken = artifacts.require("MyToken.sol");

const MyTokenSale = artifacts.require("MyTokenSale.sol");
const KycContract = artifacts.require("KnowYourCustomerContract.sol");

const BN = web3.utils.BN;
const expect = chai.expect;
contract("MyTokenSale test", async (acc)=>{
    const [deployer, other] = acc;
    console.log('accounts' ,acc);
    console.log('deployer' ,deployer);
    console.log('other' ,other);
    
    it("Kiểm tra token trong tk đầu tiên empty", async () =>{

        let instance = await MyToken.deployed();
    
        expect(await instance.balanceOf(deployer)).to.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens should be in the TokenSal SC by default", async()=>{
        let instance = await MyToken.deployed();
        let totalSupply = await instance.totalSupply();

        let balanceOfTokenSaleSC = await instance.balanceOf(MyTokenSale.address);
        expect(balanceOfTokenSaleSC).to.be.a.bignumber.equal(totalSupply);
    });
    
    it("Ko thể mua 1 token nếu ko trong whitelist", async()=>{
        let instance = await MyToken.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();

        let balanceOfOtherBefore = await instance.balanceOf.call(other);
        await expect(tokenSaleInstance.sendTransaction({from: other,value: web3.utils.toWei("1","wei")})).to.be.rejected;
        await expect(balanceOfOtherBefore).to.be.bignumber.equal(await instance.balanceOf.call(other));
    });

    
    it("Có thể mua 1 token nếu đã add trong whitelist", async()=>{
        let instance = await MyToken.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let kycInstance = await KycContract.deployed();
        await kycInstance.KycSet(other);
        await kycInstance.KycSet(deployer);
        

        let balanceOfOtherBefore = await instance.balanceOf.call(other);
       //await expect(tokenSaleInstance.sendTransaction({from: other,value: web3.utils.toWei("1","wei")})).to.be.fulfilled;
         await expect(tokenSaleInstance.methods.buyTokens(deployer).send({
            from: deployer,
            value: web3.utils.toWei("1", "ether"),
          })).to.be.fulfilled; 
        await expect(balanceOfOtherBefore + 1).to.be.bignumber.equal(await instance.balanceOf.call(other));
    });

})