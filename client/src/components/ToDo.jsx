
import useEth from "../contexts/EthContext/useEth";
import React, { useState, useEffect } from 'react';
let _loaded, _tokenInstance, _kycInstance, _myTokenSaleInstance, _accounts, _userToken, _kycAddress, _web3,_tokenSaleAddress;

let state = {};
function setState(data) {
  for(let key in data){
    state[key] = data[key];
  }
}
function handleInputChange(event){
  const target = event.target;
  // console('target',target);
  const value = target.value;
  const name = target.name;
  setState({
    [name]: value,
  })
}

async function handleKycWhitelisting(){
  console.log(_kycInstance)
  await _kycInstance.methods
  .KycSet(_kycAddress)
  .send({ from: _accounts[0] });
alert("KYC for: " + _kycAddress + "is successful");
}

async function buyToken() {
  console.log('buyToken', {
    from: _accounts[0],
    value: _web3.utils.toWei("0.001", "ether"),
  });
  await _myTokenSaleInstance.methods.buyTokens(_accounts[0]).send({
    from: _accounts[0],
    value: _web3.utils.toWei("0.001", "ether"),
  })

  let totalInTokenSale = await _tokenInstance.methods.balanceOf(_tokenSaleAddress).call();
  console.log('totalInTokenSale after buytoken',convertToDisplayToken(totalInTokenSale)); 
}

let updateUserToken = async () => {
  let userToken = await _tokenInstance.methods.balanceOf(_accounts[0]).call();
  
  userToken = convertToDisplayToken(userToken);
  setState({ userToken: userToken });
}

let listenToTokenTransfer = () => {
  _tokenInstance.events.Transfer({to: _accounts[0]}).on("data", updateUserToken);
}
function convertToDisplayToken(amount) {
  return _web3.utils.fromWei(amount,"ether");
}
function Todo() {
  let { state: { loaded, kycAddress, tokenInstance, kycInstance, myTokenSaleInstance, accounts,userToken, web3, tokenSaleAddress} } = useEth();
  const [inputValue, setInputValue] = useState("");
  _tokenInstance = tokenInstance;
  _kycInstance = kycInstance;
  _myTokenSaleInstance = myTokenSaleInstance;
  _accounts = accounts;
  _userToken = userToken;
  _kycAddress = kycAddress;
  _web3 = web3;
  _tokenSaleAddress = tokenSaleAddress;
  let count = 0;
  console.log('aa', loaded, accounts);
  if (!loaded) {
    return <div>Loading Web3, accounts, and contract... {loaded} {count} </div>;
  }

  
  listenToTokenTransfer();

  return (
    <div className="App">
      <h1>Phu Token Sale</h1>
      <p>Get your token for today!!!!</p>
      <h2>KYC Whitelisting</h2>
      Address to allow:{""}
      <input
        type="text"
        name="kycAddress"
        value={kycInstance.address}
        onChange={handleInputChange}
      />
      <button type="button" onClick={handleKycWhitelisting}>
        Add to Whitelist
      </button>
      <h2>
        Buy Tokens
      </h2>
      <p>
        If you want to buy tokens, send Wei to this address: {""}
        {myTokenSaleInstance.address}
      </p>
      <p>You currently have:{userToken} PTK Tokens</p>
      <button type="button" onClick={buyToken}>
        Buy Tokens
      </button>
    </div>
  );
}

export default Todo;