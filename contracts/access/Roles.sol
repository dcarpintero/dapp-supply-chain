// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping(address => bool) bearer;
    }

    /**
     * @dev give an account access to this role
     */
    function add(Role storage role, address account) internal {
        require(
            account != address(0),
            "Role.add : THE_ACCOUNT_CANNOT_BE_THE_ZERO_ADDRESS"
        );
        require(
            !has(role, account),
            "Roles.add : THE_INTENDED_ROLE_IS_ALREADY_ASSIGNED_TO_THE_ACCOUNT"
        );

        role.bearer[account] = true;
    }

    /**
     * @dev remove an account's access to this role
     */
    function remove(Role storage role, address account) internal {
        require(
            account != address(0),
            "Roles.remove : THE_ACCOUNT_CANNOT_BE_THE_ZERO_ADDRESS"
        );
        require(
            has(role, account),
            "Roles.remove : THE_INTENDED_ROLE_IS_ALREADY_ASSIGNED_TO_THE_ACCOUNT"
        );

        role.bearer[account] = false;
    }

    /**
     * @dev check if an account has this role
     * @return bool
     */
    function has(Role storage role, address account)
        internal
        view
        returns (bool)
    {
        require(
            account != address(0),
            "Roles.has : THE_ACCOUNT_CANNOT_BE_THE_ZERO_ADDRESS"
        );
        return role.bearer[account];
    }
}
