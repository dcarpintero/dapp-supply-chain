// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./Roles.sol";

/**
 * @dev Contract module which provides a basic access control mechanism
 * for the Retailer Role.
 *
 * By default, the first retailer account will be the one that deploys the contract.
 *
 */
contract RetailerRole {
    using Roles for Roles.Role;

    event RetailerAdded(address indexed account);
    event RetailerRemoved(address indexed account);

    Roles.Role private _retailers;

    // In the constructor make the address that deploys this contract the 1st retailer
    constructor() internal {
        _addRetailer(msg.sender);
    }

    modifier onlyRetailer() {
        require(isRetailer(msg.sender), "CALLER_DOES_NOT_HAVE_RETAILER_ROLE");
        _;
    }

    function isRetailer(address account) public view returns (bool) {
        return _retailers.has(account);
    }

    function addRetailer(address account) public onlyRetailer {
        _addRetailer(account);
    }

    function renounceRetailer() public {
        _removeRetailer(msg.sender);
    }

    function _addRetailer(address account) internal {
        _retailers.add(account);
        emit RetailerAdded(account);
    }

    function _removeRetailer(address account) internal {
        _retailers.remove(account);
        emit RetailerRemoved(account);
    }
}
