// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./Item.sol";
import "../access/FarmerRole.sol";
import "../access/DistributorRole.sol";
import "../access/RetailerRole.sol";
import "../access/ConsumerRole.sol";
import "../core/Ownable.sol";

contract SupplyChain is
    Item,
    FarmerRole,
    DistributorRole,
    RetailerRole,
    ConsumerRole,
    Ownable
{
    uint256 upc;
    uint256 sku;

    mapping(uint256 => string[]) itemsHistory;

    modifier onlyItemOwner(uint256 _upc) {
        require(
            msg.sender == items[_upc].ownerID,
            "CALLER_IS_NOT_THE_ITEM_OWNER"
        );
        _;
    }

    modifier onlyEnoughPrice(uint256 _upc) {
        require(
            msg.value >= items[_upc].productPrice,
            "VALUE_IS_LESS_THAN_PRICE"
        );
        _;
    }

    modifier checkValue(uint256 _upc) {
        _;
        uint256 _price = items[_upc].productPrice;
        uint256 amountToReturn = msg.value - _price;
        address payable consumer = payable(items[_upc].consumerID);
        consumer.transfer(amountToReturn);
    }

    constructor() public payable {
        _owner = msg.sender;
        sku = 1;
        upc = 1;
    }

    function close() public onlyOwner {
        selfdestruct(payable(_owner));
    }

    /**
     * @dev Allows a Farmer to mark an item as 'Harvested'.
     *
     */
    function harvestItem(
        uint256 _upc,
        address _farmerID,
        string memory _farmerName,
        string memory _farmerInformation,
        string memory _farmerLatitude,
        string memory _farmerLongitude,
        string memory _productNotes
    ) public onlyFarmer {
        items[_upc] = Item.ItemMetadata({
            sku: sku,
            upc: _upc,
            ownerID: _farmerID,
            farmerID: _farmerID,
            farmerName: _farmerName,
            farmerInformation: _farmerInformation,
            farmerLatitude: _farmerLatitude,
            farmerLongitude: _farmerLongitude,
            productID: sku + _upc,
            productNotes: _productNotes,
            productPrice: 0,
            itemState: State.Harvested,
            distributorID: address(0),
            retailerID: address(0),
            consumerID: address(0)
        });

        sku = sku + 1;
        emit Harvested(_upc);
    }

    /**
     * @dev Allows a Farmer and Item Owner to mark an Item as 'Processed'.
     */
    function processItem(uint256 _upc)
        public
        onlyFarmer
        onlyItemOwner(_upc)
        onlyHarvested(_upc)
    {
        items[_upc].itemState = State.Processed;
        emit Processed(_upc);
    }

    /**
     * @dev Allows a Farmer and Item Owner to mark an Item as 'Packed'.
     */
    function packItem(uint256 _upc)
        public
        onlyFarmer
        onlyItemOwner(_upc)
        onlyProcessed(_upc)
    {
        items[_upc].itemState = State.Packed;
        emit Packed(_upc);
    }

    /**
     * @dev Allows a Farmer and Item Owner to mark an Item 'ForSale'.
     */
    function sellItem(uint256 _upc, uint256 _price)
        public
        onlyFarmer
        onlyItemOwner(_upc)
        onlyPacked(_upc)
    {
        items[_upc].productPrice = _price;
        items[_upc].itemState = State.ForSale;
        emit ForSale(_upc);
    }

    /**
     * @dev Allows a Distributor to mark an Item as 'Sold'.
     */
    function buyItem(uint256 _upc)
        public
        payable
        onlyDistributor
        onlyEnoughPrice(_upc)
        checkValue(_upc)
        onlyForSale(_upc)
    {
        items[_upc].ownerID = msg.sender;
        items[_upc].distributorID = msg.sender;
        items[_upc].itemState = State.Sold;

        address payable farmer = payable(items[_upc].farmerID);
        farmer.transfer(items[_upc].productPrice);

        emit Sold(_upc);
    }

    /**
     * @dev Allows a Distributor and Item Owner to mark an Item as 'Shipped'.
     */
    function shipItem(uint256 _upc)
        public
        onlyDistributor
        onlyItemOwner(_upc)
        onlySold(_upc)
    {
        items[_upc].itemState = State.Shipped;
        emit Shipped(_upc);
    }

    /**
     * @dev Allows a Retailer to mark an Item as 'Received'.
     */
    function receiveItem(uint256 _upc) public onlyRetailer onlyShipped(_upc) {
        items[_upc].ownerID = msg.sender;
        items[_upc].retailerID = msg.sender;
        items[_upc].itemState = State.Received;
        emit Received(_upc);
    }

    /**
     * @dev Allows a Consumer to mark an Item as 'Purchased'.
     */
    function purchaseItem(uint256 _upc) public onlyConsumer onlyReceived(_upc) {
        items[_upc].ownerID = msg.sender;
        items[_upc].consumerID = msg.sender;
        items[_upc].itemState = State.Purchased;
        emit Purchased(_upc);
    }

    // Getters
    function getItemState(uint256 _upc) public view returns (uint256) {
        return uint256(items[_upc].itemState);
    }

    function getItemPrice(uint256 _upc) public view returns (uint256) {
        return items[_upc].productPrice;
    }

    function getItemOwner(uint256 _upc) public view returns (address) {
        return items[_upc].ownerID;
    }

    function getItemFarmer(uint256 _upc) public view returns (address) {
        return items[_upc].farmerID;
    }

    function getItemDistributor(uint256 _upc) public view returns (address) {
        return items[_upc].distributorID;
    }

    function getItemRetailer(uint256 _upc) public view returns (address) {
        return items[_upc].retailerID;
    }

    function getItemConsumer(uint256 _upc) public view returns (address) {
        return items[_upc].consumerID;
    }

    /**
     * @dev Fetches the first part of the Item data.
     */
    function fetchItemBufferOne(uint256 _upc)
        public
        view
        returns (
            uint256 itemSKU,
            uint256 itemUPC,
            address ownerID,
            address farmerID,
            string memory farmerName,
            string memory farmerInformation,
            string memory farmerLatitude,
            string memory farmerLongitude
        )
    {
        itemSKU = items[_upc].sku;
        itemUPC = items[_upc].upc;
        ownerID = items[_upc].ownerID;
        farmerID = items[_upc].farmerID;
        farmerName = items[_upc].farmerName;
        farmerInformation = items[_upc].farmerInformation;
        farmerLatitude = items[_upc].farmerLatitude;
        farmerLongitude = items[_upc].farmerLongitude;

        return (
            itemSKU,
            itemUPC,
            ownerID,
            farmerID,
            farmerName,
            farmerInformation,
            farmerLatitude,
            farmerLongitude
        );
    }

    /**
     * @dev Fetches the second part of the Item data.
     */
    function fetchItemBufferTwo(uint256 _upc)
        public
        view
        returns (
            uint256 itemSKU,
            uint256 itemUPC,
            uint256 productID,
            string memory productNotes,
            uint256 productPrice,
            uint256 itemState,
            address distributorID,
            address retailerID,
            address consumerID
        )
    {
        itemSKU = items[_upc].sku;
        itemUPC = items[_upc].upc;
        productID = items[_upc].productID;
        productNotes = items[_upc].productNotes;
        productPrice = items[_upc].productPrice;
        itemState = uint256(items[_upc].itemState);
        distributorID = items[_upc].distributorID;
        retailerID = items[_upc].retailerID;
        consumerID = items[_upc].consumerID;

        return (
            itemSKU,
            itemUPC,
            productID,
            productNotes,
            productPrice,
            itemState,
            distributorID,
            retailerID,
            consumerID
        );
    }
}
