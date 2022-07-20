import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import MyToken from "../../contracts/MyToken.json";
import KnowYourCustomerContract from "../../contracts/KnowYourCustomerContract.json";
import MyTokenSale from "../../contracts/MyTokenSale.json";
import getWeb3 from "../../getWeb3.js";
function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifacts => {
      if (artifacts) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:9545");
        /*const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:9545"
        );
        const web3 = new Web3(provider);*/
        const accounts = await web3.eth.requestAccounts();
        console.log(accounts);
        const networkID = await web3.eth.net.getId();
        const tokenInstance = new web3.eth.Contract(MyToken.abi, MyToken.networks[networkID].address);
        const kycInstance = new web3.eth.Contract(KnowYourCustomerContract.abi, KnowYourCustomerContract.networks[networkID].address);
        const myTokenSaleInstance = new web3.eth.Contract(MyTokenSale.abi, MyTokenSale.networks[networkID].address);

        let totalInTokenSale = await tokenInstance.methods.balanceOf(accounts[0]).call();
        console.log(totalInTokenSale);
        /* const { abi } = artifact;
        let address, contract;
        try {
          
          console.log(artifact.contractName, abi, networkID, artifact.networks[networkID])
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
        } catch (err) {
          console.error(err);
        } */
        let loaded = true;
        let kycAddress = KnowYourCustomerContract.networks[networkID].address;
        let tokenSaleAddress = MyTokenSale.networks[networkID].address;
        dispatch({
          type: actions.init,
          data: { loaded,web3, accounts, networkID, tokenInstance, kycInstance, myTokenSaleInstance, kycAddress, tokenSaleAddress}
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        
        const artifact = require("../../contracts/MyToken.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);



  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
