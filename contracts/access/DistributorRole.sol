// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./Roles.sol";

/**
 * @dev Contract module which provides a basic access control mechanism
 * for the Distributor Role.
 *
 * By default, the first distributor account will be the one that deploys the contract.
 *
 */
contract DistributorRole {
    using Roles for Roles.Role;

    event DistributorAdded(address indexed account);
    event DistributorRemoved(address indexed account);

    Roles.Role private _distributors;

    constructor() public {
        _addDistributor(msg.sender);
    }

    modifier onlyDistributor() {
        require(
            isDistributor(msg.sender),
            "CALLER_DOES_NOT_HAVE_DISTRIBUTOR_ROLE"
        );
        _;
    }

    function isDistributor(address account) public view returns (bool) {
        return _distributors.has(account);
    }

    function addDistributor(address account) public onlyDistributor {
        _addDistributor(account);
    }

    function renounceDistributor() public {
        _removeDistributor(msg.sender);
    }

    function _addDistributor(address account) internal {
        _distributors.add(account);
        emit DistributorAdded(account);
    }

    function _removeDistributor(address account) internal {
        _distributors.remove(account);
        emit DistributorRemoved(account);
    }
}
