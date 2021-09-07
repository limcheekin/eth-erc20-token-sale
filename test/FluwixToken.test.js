require('dotenv').config({ path: '../.env' })
const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')


contract('FluwixToken', ([sender, receiver, ...accounts]) => {
  beforeEach(async () => {
    // The bundled BN library is the same one web3 uses under the hood
    this.value = new BN(1)
    const FluwixToken = artifacts.require('FluwixToken')
    const { TOKEN_NAME, TOKEN_SYMBOL, INITIAL_TOKEN_SUPPLY } = process.env
    const params = [
      TOKEN_NAME,
      TOKEN_SYMBOL,
      INITIAL_TOKEN_SUPPLY,
    ]

    this.erc20 = await FluwixToken.new(...params)
  })

  it('reverts when transferring tokens to the zero address', async () => {
    // Conditions that trigger a require statement can be precisely tested
    await expectRevert(
      this.erc20.transfer(constants.ZERO_ADDRESS, this.value, { from: sender }),
      'ERC20: transfer to the zero address',
    )
  })

  it('emits a Transfer event on successful transfers', async () => {
    const receipt = await this.erc20.transfer(
      receiver, this.value, { from: sender }
    )

    // Event assertions can verify that the arguments are the expected ones
    expectEvent(receipt, 'Transfer', {
      from: sender,
      to: receiver,
      value: this.value,
    })
  })

  it('updates balances on successful transfers', async () => {
    await this.erc20.transfer(receiver, this.value, { from: sender })

    // BN assertions are automatically available via chai-bn (if using Chai)
    const actual = await this.erc20.balanceOf(receiver)
    const expected = this.value

    // chai-bn doesn't works
    // expect(actual).to.be.bignumber.equal(expected)
    assert(actual.eq(expected))
  })
})

