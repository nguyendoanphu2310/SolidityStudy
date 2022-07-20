// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
contract KnowYourCustomerContract is Ownable{
    mapping(address => bool) allowed;

    function KycSet(address _a) public onlyOwner{
        allowed[_a] = true;
    }

    function KycRevoke(address _a) public onlyOwner{
        allowed[_a] = false;
    }

    function KycCompleted(address _a) public view returns(bool){
        return allowed[_a];
    }
}