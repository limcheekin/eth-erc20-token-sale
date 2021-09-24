# Ethereum ERC20 Token Sale [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<p>
  <img alt="made for ethereum" src="https://img.shields.io/badge/made_for-ethereum-771ea5.svg">
  <img alt="to the moon" src="https://img.shields.io/badge/to_the-moon-fab127.svg">
  <img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue.svg">
</p>

I think the Initial Coin Offering (ICO) is the first use case every Solidity developer need to get familiar with even the ICO mania is behind us. 

The token known as `Fluwix` with symbol `FWX`, as I assumed whatever I learned here will be integrated into [another project of the same name](https://limcheekin.medium.com/flutter-widgets-explorer-go-web-fluwix-com-2b72f6809c1c) in the future. The exchange rate of `ETH` to `FWX` is 1 to 1. For example, for 0.001 ETH you will get 0.001 FWX in return. 

The project is created by referred to [an excellent tutorial](https://ethereum-blockchain-developer.com/060-tokenization/00-overview/) published by Thomas Wiesner.

The key feature of the project is whitelisting. Only the address of user accounts being whitelisted by the owner (the deployer of the contract) can buy the token.

The project is using the following third party libraries to simplify codes:
- Use `@openzeppelin/contracts@4.3.1` for implementation of ERC20
- Reuse the code of [Crowdsale.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v2.3.0/contracts/crowdsale/Crowdsale.sol) from `@openzeppelin/contracts@2.3.0`.
- Use `@openzeppelin/test-helpers@0.5.13` for writing unit tests.

It is tested with [MetaMask](https://metamask.io/) Chrome extension and Android. I think it is good idea to test out [the dApps](https://eth-erc20-token-sale.vercel.app/) yourself before looking into the code.

The dApps is interacting with smart contracts running on Rinkeby testnet, hence you need some ETH in your wallet. If you don't have any, you can request some ETH from [Rinkeby Faucet](https://faucet.rinkeby.io/). 


## Smart Contract Development
The project is bootstrapped with [Truffle](https://www.trufflesuite.com/truffle) using `truffle init` command.

Steps to run the smart contracts locally:
1. Clone the github repository. This also takes care of installing the necessary dependencies.
    ```bash
    git clone git@github.com:limcheekin/eth-erc20-token-sale.git
    ```
    
2. Create a `.env` file with configuration data for the token, for example:
    ```
    TOKEN_NAME=Your_Token_Name
    TOKEN_SYMBOL=Your_Symbol
    INITIAL_TOKEN_SUPPLY=1000000000
    ```

3. Install dependencies in the root directory.
    ```bash
    npm i
    # or
    yarn
    ```

4. Install Truffle globally.
    ```bash
    npm install -g truffle
    ```

5. Run the development console in the root directory of the project.
    ```bash
    truffle develop
    ```

6. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```bash
    compile
    migrate
    ```
    Please note down the contract address of the deployed smart contracts. We will need to update it in the front-end's `.env.local`.

7. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```bash
    // If inside the development console.
    test

    // If outside the development console.
    truffle test
    ```

7. Deploy smart contract to Rinkeby testnet
    - Add the configuration of Infura Project ID and private key of your Rinkeby account to the `.env` file, for example:
        ```
        INFURA_PROJECT_ID=Your_Infura_Project_Id
        RINKEBY_PRIVATE_KEY=Your_Rinkeby_Private_Key
        ```

    - Run the `truffle migrate --network rinkeby` command to deploy smart contract to Rinkeby network.


## dApps Front End
The front-end code of the dApps is located in `client` directory. It is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The client is created by derived/adapted the codes from the following excellence articles:
- [Build a Web3 Dapp in React & Login with MetaMask](https://dev.to/jacobedawson/build-a-web3-dapp-in-react-login-with-metamask-4chp)
- [Global State Using Only React Hooks with the Context API (TypeScript Edition)](https://javascript.plainenglish.io/global-state-using-only-react-hooks-with-the-context-api-typescript-edition-ada822fc282c)
- [Build Your First Solidity Dapp With Web3.js and MetaMask](http://blog.adnansiddiqi.me/build-your-first-solidity-dapp-with-web3-js-and-metamask/)

Steps to run the client locally:
1. Install dependencies.
    ```bash
    npm i
    # or
    yarn
    ```
2. Update the following environment variables located in [client/.env.local](client/.env.local):
    ```
    NEXT_PUBLIC_FLUWIX_TOKEN_CONTRACT_ADDRESS=0x...
    NEXT_PUBLIC_KYC_CONTRACT_ADDRESS=0x...
    NEXT_PUBLIC_FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS=0x..
    ```

3. Run the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser, you will see the screen of the React client:
    
    ![Main Screen](https://github.com/limcheekin/eth-erc20-token-sale/raw/master/doc/images/main.png "Main Screen")

4. Run with MetaMask
    
    As `truffle develop` exposes the blockchain onto port `9545`, you'll need to add a Custom RPC network of `http://localhost:9545` in your MetaMask to make it work.

## Continuous Integration
The repository setup Continuous Integration build pipeline with GitHub Actions. If you use it as your project template, the first build will fail upon project creation. To fix it, you need to setup the `CC_SECRET` encrypted secret for Codechecks and `DOT_COVERALLS_YML` encrypted secret for Coveralls. Please refer to [Continuous Integration Setup](doc/ContinuousIntegrationSetup.md) for more information.