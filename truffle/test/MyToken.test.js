let chai = require('./setup_chai.js');
const MyToken = artifacts.require("MyToken.sol");

const BN = web3.utils.BN;
const expect = chai.expect;
contract("MyToken test", async (acc)=>{
    const [deployer, other] = acc;
    console.log('accounts' ,acc);
    console.log('deployer' ,deployer);
    console.log('other' ,other);
    beforeEach(async ()=>{
        this.myToken = await MyToken.new(1000000000);
    })
    it("Kiểm tra token trong tk đầu tiên deploy", async () =>{

        let instance = await this.myToken;
        let totalSupply = await instance.totalSupply();
    
        expect(await instance.balanceOf(acc[0])).to.be.a.bignumber.equal(totalSupply);
    });

    it("kiểm tra chuyển token giữa các account", async () =>{
        const sendToken = 1;
        let instance = await this.myToken;
        let totalSupply = await instance.totalSupply();
        //let balanceOfDeployer = instance.balanceOf(deployer);
        //await expect(balanceOfDeployer).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(other, sendToken)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken)));
        await expect(instance.balanceOf(other)).to.eventually.be.a.bignumber.equal(new BN(sendToken));
        //balanceOfDeployer = instance.balanceOf(deployer);
        //balanceOfOther = instance.balanceOf(other);
        //expect(balanceOfDeployer).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken)));
        //expect(balanceOfOther).to.eventually.be.a.bignumber.equal(new BN(sendToken));
    });

    
    
    it("kiểm tra không cho chuyển token nhiều hơn số đang có", async () =>{
        let instance = await this.myToken;
        let balanceDeploy = await instance.balanceOf(deployer);
        
        await expect( instance.transfer(other, new BN(balanceDeploy + 1))).to.eventually.be.rejected;
        await expect (instance.balanceOf(deployer)).to.eventually.be.a.bignumber.equal(balanceDeploy);
    });
})