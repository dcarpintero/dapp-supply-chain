// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./Roles.sol";

/**
 * @dev Contract module which provides a basic access control mechanism
 * for the Farmer Role.
 *
 * By default, the first farmer account will be the one that deploys the contract.
 *
 */
contract FarmerRole {
    using Roles for Roles.Role;

    event FarmerAdded(address indexed account);
    event FarmerRemoved(address indexed account);

    Roles.Role private _farmers;

    // Make the address that deploys this contract the 1st farmer
    constructor() public {
        _addFarmer(msg.sender);
    }

    modifier onlyFarmer() {
        require(isFarmer(msg.sender), "CALLER_DOES_NOT_HAVE_FARMER_ROLE");
        _;
    }

    function isFarmer(address account) public view returns (bool) {
        return _farmers.has(account);
    }

    function addFarmer(address account) public onlyFarmer {
        _addFarmer(account);
    }

    function renounceFarmer() public {
        _removeFarmer(msg.sender);
    }

    function _addFarmer(address account) internal {
        _farmers.add(account);
        emit FarmerAdded(account);
    }

    function _removeFarmer(address account) internal {
        _farmers.remove(account);
        emit FarmerRemoved(account);
    }
}
