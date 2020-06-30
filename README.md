# eth-supply-chain

ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"

## Project Description

Ethereum DApp that exemplifies a Supply Chain wherein Items are tracked along Farmers, Distributors, Retailers and Consumers. Implements **Access Control** and **State Transitions** as defined in the diagrams below.

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

### Smart Contract

- Contract Address on the Rinkeby Network: https://rinkeby.etherscan.io/address/[...]

### Deployment to Rinkeby

- Requires .infuraKey and .secret files (see truffle-config.js).

### GEtting Started

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
