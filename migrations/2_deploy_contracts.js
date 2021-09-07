require('dotenv').config({ path: '../.env' })
const FluwixToken = artifacts.require("FluwixToken");
const FluwixTokenSale = artifacts.require("FluwixTokenSale");

module.exports = async function (deployer, network, accounts) {
    const { TOKEN_NAME, TOKEN_SYMBOL, INITIAL_TOKEN_SUPPLY } = process.env;
    const initialAccount = accounts[0]
    const rate = 1; // 1 wei per token

    await deployer.deploy(FluwixToken, TOKEN_NAME, TOKEN_SYMBOL, INITIAL_TOKEN_SUPPLY);
    await deployer.deploy(FluwixTokenSale, rate, initialAccount, FluwixToken.address);
    const tokenInstance = await FluwixToken.deployed();
    await tokenInstance.transfer(FluwixTokenSale.address, INITIAL_TOKEN_SUPPLY);
};
