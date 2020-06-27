// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./Roles.sol";

/**
 * @dev Contract module which provides a basic access control mechanism
 * for the Consumer Role.
 *
 * By default, the first consumer account will be the one that deploys the contract.
 *
 */
contract ConsumerRole {
    using Roles for Roles.Role;

    event ConsumerAdded(address indexed account);
    event ConsumerRemoved(address indexed account);

    Roles.Role private _consumers;

    constructor() public {
        _addConsumer(msg.sender);
    }

    modifier onlyConsumer() {
        require(isConsumer(msg.sender), "CALLER_DOES_NOT_HAVE_CONSUMER_ROLE");
        _;
    }

    function isConsumer(address account) public view returns (bool) {
        return _consumers.has(account);
    }

    function addConsumer(address account) public onlyConsumer {
        _addConsumer(account);
    }

    function renounceConsumer() public {
        _removeConsumer(msg.sender);
    }

    function _addConsumer(address account) internal {
        _consumers.add(account);
        emit ConsumerAdded(account);
    }

    function _removeConsumer(address account) internal {
        _consumers.remove(account);
        emit ConsumerRemoved(account);
    }
}
