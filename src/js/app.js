App = {
  web3Provider: null,
  ipfs: null,
  contracts: {},
  emptyAddress: "0x0000000000000000000000000000000000000000",
  sku: 0,
  upc: 0,
  metamaskAccountID: "0x0000000000000000000000000000000000000000",
  ownerID: "0x0000000000000000000000000000000000000000",
  originFarmerID: "0x0000000000000000000000000000000000000000",
  originFarmName: null,
  originFarmInformation: null,
  originFarmLatitude: null,
  originFarmLongitude: null,
  productNotes: null,
  productPrice: 0,
  distributorID: "0x0000000000000000000000000000000000000000",
  retailerID: "0x0000000000000000000000000000000000000000",
  consumerID: "0x0000000000000000000000000000000000000000",

  init: async function () {
    App.readForm();
    await App.initIpfs();
    return await App.initWeb3();
  },

  initIpfs: async function () {
    App.ipfs = window.IpfsApi({
      host: "ipfs.infura.io",
      port: "5001",
      protocol: "https",
    });
  },

  readForm: function () {
    App.sku = $("#sku").val();
    App.upc = $("#upc").val();
    App.ownerID = $("#ownerID").val();
    App.originFarmerID = $("#originFarmerID").val();
    App.originFarmName = $("#originFarmName").val();
    App.originFarmInformation = $("#originFarmInformation").val();
    App.originFarmLatitude = $("#originFarmLatitude").val();
    App.originFarmLongitude = $("#originFarmLongitude").val();
    App.productNotes = $("#productNotes").val();
    App.productPrice = $("#productPrice").val();
    App.productImageHash = $("#productImageHash").val();
    App.distributorID = $("#distributorID").val();
    App.retailerID = $("#retailerID").val();
    App.consumerID = $("#consumerID").val();

    console.log(
      App.sku,
      App.upc,
      App.ownerID,
      App.originFarmerID,
      App.originFarmName,
      App.originFarmInformation,
      App.originFarmLatitude,
      App.originFarmLongitude,
      App.productNotes,
      App.productPrice,
      App.productImageHash,
      App.distributorID,
      App.retailerID,
      App.consumerID
    );
  },

  initWeb3: async function () {
    /// Find or Inject Web3 Provider
    /// Modern dapp browsers
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }

    App.getMetaskAccountID();
    return App.initSupplyChain();
  },

  getMetaskAccountID: function () {
    web3 = new Web3(App.web3Provider);

    web3.eth.getAccounts(function (err, res) {
      if (err) {
        console.log("Error:", err);
        return;
      }
      console.log("getMetaskID:", res);
      App.metamaskAccountID = res[0];
    });
  },

  initSupplyChain: function () {
    var jsonSupplyChain = "../../build/contracts/SupplyChain.json";

    $.getJSON(jsonSupplyChain, function (data) {
      console.log("data", data);
      var SupplyChainArtifact = data;
      App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
      App.contracts.SupplyChain.setProvider(App.web3Provider);

      App.fetchItemBufferOne();
      App.fetchItemBufferTwo();
      App.fetchEvents();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    document
      .getElementById("file-upload")
      .addEventListener("change", App.handleFileUpload);

    document
      .getElementById("button-set-image-hash")
      .addEventListener("click", App.saveProductImageHash);

    document
      .getElementById("button-harvest")
      .addEventListener("click", App.harvestItem);

    document
      .getElementById("button-process")
      .addEventListener("click", App.processItem);

    document
      .getElementById("button-pack")
      .addEventListener("click", App.packItem);

    document
      .getElementById("button-sell")
      .addEventListener("click", App.sellItem);

    document
      .getElementById("button-buy")
      .addEventListener("click", App.buyItem);

    document
      .getElementById("button-ship")
      .addEventListener("click", App.shipItem);

    document
      .getElementById("button-receive")
      .addEventListener("click", App.receiveItem);

    document
      .getElementById("button-purchase")
      .addEventListener("click", App.purchaseItem);

    document
      .getElementById("button-fetch-buffer-one")
      .addEventListener("click", App.fetchItemBufferOne);

    document
      .getElementById("button-fetch-buffer-two")
      .addEventListener("click", App.fetchItemBufferOne);
  },

  /*
  handleButtonClick: async function (event) {
    event.preventDefault();

    App.getMetaskAccountID();

    var processId = parseInt($(event.target).data("id"));
    console.log("processId", processId);

    switch (processId) {
      case 1:
        return await App.harvestItem(event);
        break;
      case 2:
        return await App.processItem(event);
        break;
      case 3:
        return await App.packItem(event);
        break;
      case 4:
        return await App.sellItem(event);
        break;
      case 5:
        return await App.buyItem(event);
        break;
      case 6:
        return await App.shipItem(event);
        break;
      case 7:
        return await App.receiveItem(event);
        break;
      case 8:
        return await App.purchaseItem(event);
        break;
      case 9:
        return await App.fetchItemBufferOne(event);
        break;
      case 10:
        return await App.fetchItemBufferTwo(event);
        break;
      case 11:
        return await App.setItemImage(event);
        break;
    }
  },*/

  harvestItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.harvestItem(
          App.upc,
          App.metamaskAccountID,
          App.originFarmName,
          App.originFarmInformation,
          App.originFarmLatitude,
          App.originFarmLongitude,
          App.productNotes
        );
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("harvestItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  processItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.processItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("processItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  packItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.packItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("packItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  sellItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        const productPrice = web3.toWei(1, "ether");
        console.log("productPrice", productPrice);
        return instance.sellItem(App.upc, App.productPrice, {
          from: App.metamaskAccountID,
        });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("sellItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  buyItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        const walletValue = web3.toWei(3, "ether");
        return instance.buyItem(App.upc, {
          from: App.metamaskAccountID,
          value: walletValue,
        });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("buyItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  shipItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.shipItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("shipItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  receiveItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.receiveItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("receiveItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  purchaseItem: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.purchaseItem(App.upc, { from: App.metamaskAccountID });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("purchaseItem", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  handleFileUpload: async function (event) {
    event.preventDefault();

    let file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = function () {
      console.log(reader.result);
      var arrayBuffer = reader.result;
      var buffer = new App.ipfs.Buffer(arrayBuffer);

      App.ipfs.add(buffer, (err, data) => {
        console.log("IPFS HASH:", data[0].hash);
        document.getElementById("productImageHash").value = data[0].hash;
        if (err) {
          console.log("Error:", err);
        }
      });
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  },

  saveProductImageHash: function (event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        var imageHash = $("#productImageHash").val();
        console.log("imageHash:" + imageHash);
        return instance.setProductImageHash(App.upc, imageHash, {
          from: App.metamaskAccountID,
        });
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("uploadItemImage", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  fetchItemBufferOne: function () {
    App.upc = $("#upc").val();
    console.log("upc", App.upc);

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.fetchItemBufferOne(App.upc);
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferOne", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  fetchItemBufferTwo: function () {
    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        return instance.fetchItemBufferTwo.call(App.upc);
      })
      .then(function (result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferTwo", result);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  fetchEvents: function () {
    if (
      typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function"
    ) {
      App.contracts.SupplyChain.currentProvider.sendAsync = function () {
        return App.contracts.SupplyChain.currentProvider.send.apply(
          App.contracts.SupplyChain.currentProvider,
          arguments
        );
      };
    }

    App.contracts.SupplyChain.deployed()
      .then(function (instance) {
        var events = instance.allEvents(function (err, log) {
          if (!err)
            $("#ftc-events").append(
              "<li>" + log.event + " - " + log.transactionHash + "</li>"
            );
        });
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
