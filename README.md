# Deep Dive into Smart Contract Proxies: Gas Usage Comparison

This repository contains the code sample for measuring gas usages of different types of proxies used in the article, "Deep Dive into Smart Contract Proxies: CREATE vs. CREATE2, Variants, and Security Considerations".

[Placeholder Link for Article]

## Structure

- `contracts`: Comparison of four different deployment mechanisms for ERC20 tokens.
- `test`: Tests for contracts.
- `hardhart.config.js`: Hardhat configuration, including compiler optimization options.

## Scripts

- `yarn compile`: Compile the contracts.
- `yarn test`: Run the tests and produce a gas usage report.

## Examples
  - Description:

    In this example, we deploy ERC20 using different mechanisms. This allows us to compare the deployment and usage costs associated with the different deployment patterns.

  - Gas Usage for each function call
    |  Contract                           |  Method       |  Gas        |
    | ----------------------------------- | ------------- | ----------- |
    |  Implementation ERC20               |  transfer     |      51375  |
    |  Clone ERC20                        |  transfer     |      54053  |
    |  TUP ERC20                          |  transfer     |      58676  |
    |  UUPS ERC20                         |  transfer     |      56276  |
    |  FactoryImplementation              |  createToken  |     955713  |
    |  FactoryClone                       |  createToken  |     184530  |
    |  FactoryTUP                         |  createToken  |     642123  |
    |  FactoryUUPS                        |  createToken  |     259799  |


  - Gas Usage for contract deployments

    | Contract                                            |  Gas        |
    | --------------------------------------------------- | ----------  |
    | FactoryImplementation                               |    1039468  |
    | FactoryClone                                        |    1107602  |
    | FactoryTUP                                          |    1861538  |
    | FactoryUUPS (Uses UUPSCompatibleERC20)              |    1956580  |
