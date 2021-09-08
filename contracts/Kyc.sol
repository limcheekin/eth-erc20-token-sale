// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Kyc is Ownable {
    mapping(address => bool) allowed;

    function setKycCompleted(address _address) external onlyOwner {
        allowed[_address] = true;
    }

    function setKycRevoked(address _address) external onlyOwner {
        allowed[_address] = false;
    }

    function isKycCompleted(address _address) external view returns(bool) {
        return allowed[_address];
    }        
}