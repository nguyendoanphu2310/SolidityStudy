// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CrowdSale.sol";
import "./KnowYourCustomerContract.sol";
contract MyTokenSale is CrowdSale {
    KnowYourCustomerContract kyc;
    constructor(uint256 rate,  address payable wallet,  IERC20 token, KnowYourCustomerContract _kyc) CrowdSale(rate, wallet, token) public
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary,weiAmount);
        require(kyc.KycCompleted(beneficiary), "KYC not completed,try again");
    }
}