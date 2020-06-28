// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

/*
 * @dev Provides information about the current state and
 * metadata of a tracked Item.
 *
 * This contract is only required for the SupplyChain contract.
 */
abstract contract Item {
    enum State {
        Harvested,
        Processed,
        Packed,
        ForSale,
        Sold,
        Shipped,
        Received,
        Purchased
    }

    struct ItemMetadata {
        uint256 sku;
        uint256 upc;
        address ownerID;
        address farmerID;
        string farmerName;
        string farmerInformation;
        string farmerLatitude;
        string farmerLongitude;
        uint256 productID;
        string productNotes;
        uint256 productPrice;
        string productImageHash;
        State itemState;
        address distributorID;
        address retailerID;
        address consumerID;
    }

    mapping(uint256 => ItemMetadata) items;

    event Harvested(uint256 upc);
    event Processed(uint256 upc);
    event Packed(uint256 upc);
    event ForSale(uint256 upc);
    event Sold(uint256 upc);
    event Shipped(uint256 upc);
    event Received(uint256 upc);
    event Purchased(uint256 upc);
    event OwnerChanged(address account);

    modifier onlyHarvested(uint256 _upc) {
        require(
            items[_upc].itemState == State.Harvested,
            "EXPECTED_HARVESTED_STATUS"
        );
        _;
    }

    modifier onlyProcessed(uint256 _upc) {
        require(
            items[_upc].itemState == State.Processed,
            "EXPECTED_PROCESSED_STATUS"
        );
        _;
    }

    modifier onlyPacked(uint256 _upc) {
        require(
            items[_upc].itemState == State.Packed,
            "EXPECTED_PACKED_STATUS"
        );
        _;
    }

    modifier onlyForSale(uint256 _upc) {
        require(
            items[_upc].itemState == State.ForSale,
            "EXPECTED_FORSALE_STATUS"
        );
        _;
    }

    modifier onlySold(uint256 _upc) {
        require(
            items[_upc].itemState == State.Sold,
            "EXPECTED_THE_SOLD_STATUS"
        );
        _;
    }

    modifier onlyShipped(uint256 _upc) {
        require(
            items[_upc].itemState == State.Shipped,
            "EXPECTED_SHIPPED_STATUS"
        );
        _;
    }

    modifier onlyReceived(uint256 _upc) {
        require(
            items[_upc].itemState == State.Received,
            "EXPECTED_RECEIVED_STATUS"
        );
        _;
    }

    modifier onlyPurchased(uint256 _upc) {
        require(
            items[_upc].itemState == State.Purchased,
            "EXPECTED_PURCHASED_STATUS"
        );
        _;
    }
}
