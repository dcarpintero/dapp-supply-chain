const SupplyChain = artifacts.require("SupplyChain");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

contract("SupplyChain", function (accounts) {
  // Roles
  const ownerID = accounts[0];
  const farmerID = accounts[1];
  const distributorID = accounts[2];
  const retailerID = accounts[3];
  const consumerID = accounts[4];
  const NonAuthorizedID = accounts[5];

  // Farmer
  const farmerName = "Farmer Name";
  const farmerInformation = "Farmer Information";
  const farmerLatitude = "-11.1111";
  const farmerLongitude = "88.8888";

  // Product
  var sku = 1;
  var upc = 1;
  var productID = sku + upc;
  const productNotes = "Product Notes";
  const productPrice = web3.utils.toWei("1", "ether");

  // Item State
  const State = {
    Harvested: 0,
    Processed: 1,
    Packed: 2,
    ForSale: 3,
    Sold: 4,
    Shipped: 5,
    Received: 6,
    Purchased: 7,
  };

  // Logs
  console.log("ganache-cli accounts:");
  console.log("Contract Owner: accounts[0] ", accounts[0]);
  console.log("Farmer: accounts[1] ", accounts[1]);
  console.log("Distributor: accounts[2] ", accounts[2]);
  console.log("Retailer: accounts[3] ", accounts[3]);
  console.log("Consumer: accounts[4] ", accounts[4]);

  describe("ROLES & PERMISSIONS", function () {
    it("lets Farmer Role be checked", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // then
      await truffleAssert.reverts(
        supplyChain.processItem(upc, { from: NonAuthorizedID }),
        "VM Exception while processing transaction"
      );

      await truffleAssert.reverts(
        supplyChain.packItem(upc, { from: NonAuthorizedID }),
        "VM Exception while processing transaction"
      );

      await truffleAssert.reverts(
        supplyChain.sellItem(upc, productPrice, {
          from: NonAuthorizedID,
        }),
        "VM Exception while processing transaction"
      );
    });

    it("lets Distributor Role be checked", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // then
      await truffleAssert.reverts(
        supplyChain.buyItem(upc, {
          from: NonAuthorizedID,
          value: productPrice,
        }),
        "VM Exception while processing transaction"
      );

      await truffleAssert.reverts(
        supplyChain.shipItem(upc, { from: distributorID }),
        "VM Exception while processing transaction"
      );
    });

    it("lets Retailer Role be checked", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // then
      await truffleAssert.reverts(
        supplyChain.receiveItem(upc, { from: retailerID }),
        "VM Exception while processing transaction"
      );
    });

    it("lets Consumer Role be checked", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // then
      await truffleAssert.reverts(
        supplyChain.purchaseItem(upc, { from: retailerID }),
        "VM Exception while processing transaction"
      );
    });
  });

  describe("FARMER Actions", function () {
    it("lets Farmer harvest an Item", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();
      await supplyChain.addFarmer(farmerID);

      // when
      let tx = await supplyChain.harvestItem(
        upc,
        farmerID,
        farmerName,
        farmerInformation,
        farmerLatitude,
        farmerLongitude,
        productNotes
      );

      let resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
      let resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

      // then
      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferOne[2],
        farmerID,
        "Error: Missing or Invalid ownerID"
      );
      assert.equal(
        resultBufferOne[3],
        farmerID,
        "Error: Missing or Invalid farmerID"
      );
      assert.equal(
        resultBufferOne[4],
        farmerName,
        "Error: Missing or Invalid farmerName"
      );
      assert.equal(
        resultBufferOne[5],
        farmerInformation,
        "Error: Missing or Invalid farmerInformation"
      );
      assert.equal(
        resultBufferOne[6],
        farmerLatitude,
        "Error: Missing or Invalid farmerLatitude"
      );
      assert.equal(
        resultBufferOne[7],
        farmerLongitude,
        "Error: Missing or Invalid farmerLongitude"
      );
      assert.equal(resultBufferTwo[5], 0, "Error: Invalid item State");

      truffleAssert.eventEmitted(tx, "Harvested", (ev) => {
        return ev;
      });
    });

    it("lets Farmer process an Item", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // when
      let tx = await supplyChain.processItem(upc, { from: farmerID });

      // then
      assert.equal(await supplyChain.getItemOwner(upc), farmerID);
      assert.equal(await supplyChain.getItemState(upc), State.Processed);

      // event
      truffleAssert.eventEmitted(tx, "Processed", (ev) => {
        return ev;
      });
    });

    it("lets Farmer pack an Item", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // when
      let tx = await supplyChain.packItem(upc, { from: farmerID });

      // then
      assert.equal(await supplyChain.getItemOwner(upc), farmerID);
      assert.equal(await supplyChain.getItemState(upc), State.Packed);

      // event
      truffleAssert.eventEmitted(tx, "Packed", (ev) => {
        return ev;
      });
    });

    it("lets Farmer sell an Item", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // when
      let tx = await supplyChain.sellItem(upc, productPrice, {
        from: farmerID,
      });

      // then
      assert.equal(await supplyChain.getItemOwner(upc), farmerID);
      assert.equal(await supplyChain.getItemPrice(upc), productPrice);
      assert.equal(await supplyChain.getItemState(upc), State.ForSale);

      // event
      truffleAssert.eventEmitted(tx, "ForSale", (ev) => {
        return ev;
      });
    });
  });

  describe("DISTRIBUTOR Actions", function () {
    it("lets Distributor buy an Item", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();
      await supplyChain.addDistributor(distributorID);

      // when
      let tx = await supplyChain.buyItem(upc, {
        from: distributorID,
        value: productPrice,
      });

      // then
      assert.equal(await supplyChain.getItemOwner(upc), distributorID);
      assert.equal(await supplyChain.getItemDistributor(upc), distributorID);
      assert.equal(await supplyChain.getItemPrice(upc), productPrice);
      assert.equal(await supplyChain.getItemState(upc), State.Sold);

      // event
      truffleAssert.eventEmitted(tx, "Sold", (ev) => {
        return ev;
      });
    });

    it("lets Distributor ship an Item", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // when
      let tx = await supplyChain.shipItem(upc, { from: distributorID });

      // then
      assert.equal(await supplyChain.getItemOwner(upc), distributorID);
      assert.equal(await supplyChain.getItemState(upc), State.Shipped);

      // event
      truffleAssert.eventEmitted(tx, "Shipped", (ev) => {
        return ev;
      });
    });
  });

  describe("RETAILER Actions", function () {
    it("lets Retailer receive an Item", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();
      await supplyChain.addRetailer(retailerID);

      // when
      let tx = await supplyChain.receiveItem(upc, { from: retailerID });

      // then
      assert.equal(await supplyChain.getItemOwner(upc), retailerID);
      assert.equal(await supplyChain.getItemRetailer(upc), retailerID);
      assert.equal(await supplyChain.getItemState(upc), State.Received);

      // event
      truffleAssert.eventEmitted(tx, "Received", (ev) => {
        return ev;
      });
    });
  });

  describe("CONSUMER Actions", function () {
    it("lets Consumer purchase an Item", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();
      await supplyChain.addConsumer(consumerID);

      // when
      let tx = await supplyChain.purchaseItem(upc, { from: consumerID });

      // then
      assert.equal(await supplyChain.getItemOwner(upc), consumerID);
      assert.equal(await supplyChain.getItemConsumer(upc), consumerID);
      assert.equal(await supplyChain.getItemState(upc), State.Purchased);

      // event
      truffleAssert.eventEmitted(tx, "Purchased", (ev) => {
        return ev;
      });
    });
  });

  describe("FETCH Actions", function () {
    it("lets anyone fetch Item Details (1) from the blockchain", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // when
      let resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);

      // then
      assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferOne[2],
        consumerID,
        "Error: Invalid item ownerID"
      );
      assert.equal(
        resultBufferOne[3],
        farmerID,
        "Error: Invalid item originFarmerID"
      );
      assert.equal(
        resultBufferOne[4],
        farmerName,
        "Error: Invalid item originFarmName"
      );
      assert.equal(
        resultBufferOne[5],
        farmerInformation,
        "Error: Invalid item originFarmInformation"
      );
      assert.equal(
        resultBufferOne[6],
        farmerLatitude,
        "Error: Invalid item originFarmLatitude"
      );
      assert.equal(
        resultBufferOne[7],
        farmerLongitude,
        "Error: Invalid item originFarmLongitude"
      );
    });

    it("lets anyone fetch Item Details (2) from the blockchain", async () => {
      // given
      let supplyChain = await SupplyChain.deployed();

      // when
      let resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

      // then
      assert.equal(resultBufferTwo[0], sku, "Error: Invalid item SKU");
      assert.equal(resultBufferTwo[1], upc, "Error: Invalid item UPC");
      assert.equal(
        resultBufferTwo[2],
        productID,
        "Error: Invalid item productID"
      );
      assert.equal(
        resultBufferTwo[3],
        productNotes,
        "Error: Invalid item productNotes"
      );
      assert.equal(
        resultBufferTwo[4],
        productPrice,
        "Error: Invalid item productPrice"
      );
      assert.equal(
        resultBufferTwo[5],
        State.Purchased,
        "Error: Invalid item itemState"
      );
      assert.equal(
        resultBufferTwo[6],
        distributorID,
        "Error: Invalid item distributorID"
      );
      assert.equal(
        resultBufferTwo[7],
        retailerID,
        "Error: Invalid item retailerID"
      );
      assert.equal(
        resultBufferTwo[8],
        consumerID,
        "Error: Invalid item consumerID"
      );
    });
  });
});
