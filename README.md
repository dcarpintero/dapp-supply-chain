# eth-supply-chain

## Project Description

Supply Chain Ethereum DApp. Items are tracked along Farmers, Distributors, Retailers and Consumers. Implements **Access Control** and **State Transitions** as defined in the diagrams below.

Integrates **IPFS storage** for product images, the returned hash is then saved as part of the Item's metadata.

## UML Diagrams

### Activity Diagram

<p align="center"><img src="/uml/ActivityDiagram.svg" /></p>

### Sequence Diagram

<p align="center"><img src="/uml/SequenceDiagram.svg" /></p>

### State Diagram

<p align="center"><img src="/uml/StateDiagram.svg" /></p>

### Data Model Diagram

<p align="center"><img src="/uml/DataModelDiagram.svg" /></p>

### Dependencies

- Solidity v0.6.0 (solc-js)
- Node v12.17.0
- Web3.js v1.2.1

- Truffle v5.1.30 (core: 5.1.30) - Development framework
- @truffle/hdwallet-provider v1.0.36 - HD Wallet-enabled Web3 provider
- truffle-assertions v0.9.2 - Additional assertions for Truffle tests
- chai v4.2.0 - Assertion library
- lite-server v2.4.0 - Lightweight development only node server
- ipfs-api v26.1.2 - A client library for the IPFS HTTP API

### Smart Contract

- Deployment TX on the Rinkeby Network: https://rinkeby.etherscan.io/tx/0xf32530de6483b54e7d0c818fbb12ca1ab14fb4a7ffab42552f7e0bc25202841c
- Contract Address on the Rinkeby Network: https://rinkeby.etherscan.io/address/0xC53eC3E3c97Ad52485d78FDC632855f28018cc0a

### IPFS

- Product Image IPFS Hash: QmabWWJ2ED6FjgpbgXrjX8qotwDfXp2r9DvUTMHbFVjSCg
- Product Image in IPFS: https://ipfs.infura.io:5001/api/v0/cat?arg=QmabWWJ2ED6FjgpbgXrjX8qotwDfXp2r9DvUTMHbFVjSCg

### TX history

- Harvested: 0x0e08dac2df56e69c098166feb74bc62f3fcf74865dbb36a84c6d42ea3879213f
- Processed: 0xbdb8214ddf79e1555afadf63ef6da066a03803409f6e49c2b246c12c69bb8228
- ItemImageHashSaved: 0xb2202032cbdf176207dc485b8febcfc8432d5a36388bdb8253225f9831ed67bc
- Packed: 0xece69c876b90a702c575126a3899276cb536508e7ccbf365830942a42a333ad3
- ForSale: 0xb06b9089981d7ae93c45aa0393549659e7be05eba395c5ed39518f954d45a994
- **OwnerChanged**: 0x718eb83414b886852f25b49b33efe22e45b5a7265a0ece494b4e37bbc9e9b160
- Sold: 0x718eb83414b886852f25b49b33efe22e45b5a7265a0ece494b4e37bbc9e9b160
- Shipped: 0x254acbf1f274f162e54f52a3bd639e5ac5b89ce45a1d856204ca6c76876cbd3f
- **OwnerChanged**: 0xc61fb724a34e99ae4999af6fbf1fcf0badeb19dff0ab383c3ce3fedc4b500646
- Received: 0xc61fb724a34e99ae4999af6fbf1fcf0badeb19dff0ab383c3ce3fedc4b500646
- **OwnerChanged**: 0xa76d8b1bdbb9fb3534671a96d3e5878da25fb0c3bbda999531f92daeef088f1e
- Purchased: 0xa76d8b1bdbb9fb3534671a96d3e5878da25fb0c3bbda999531f92daeef088f1e

### Deployment to Rinkeby

- Requires .infuraKey and .secret files (see truffle-config.js).

### Getting Started

Install dependencies

```
npm install
```

Launch Ganache

```
ganache-cli
```

Compile, test and migrate

```
truffle compile
truffle test
truffle migrate --reset --network=rinkeby
```

Lauch the DApp

```
npm run dev
```
