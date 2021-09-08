const {
  BN,           // Big Number support
  expectEvent,  // Assertions for emitted events
} = require('@openzeppelin/test-helpers')

contract('FluwixTokenSaleTest', ([sender, receiver, ...accounts]) => {
  const FluwixToken = artifacts.require('FluwixToken')
  const FluwixTokenSale = artifacts.require('FluwixTokenSale')
  
  before(async () => {
    this.token = await FluwixToken.deployed()
    this.tokenSale = await FluwixTokenSale.deployed()
  })

  it('should not have any token in owner account', async () => {
    const balance = await this.token.balanceOf(sender)
    assert.equal(balance.toString(), '0')
  })

  it('all tokens should be in the token sale contract by default', async () => {
    const balance = await this.token.balanceOf(FluwixTokenSale.address)
    const totalSupply = await this.token.totalSupply()
    // TODO: chai-bn doesn't work
    // expect(balance).to.be.a.bignumber.equal(totalSupply)
    assert.equal(balance.toString(), totalSupply.toString())

  })

  it('should be able to buy tokens', async () => {
    const previousBalance = await this.token.balanceOf(sender)
    const value = new BN(1)
    const receipt = await this.tokenSale.sendTransaction(
      { from: sender, value }
    )
    console.log('receipt', receipt)
    expectEvent(receipt, 'TokensPurchased', {
      purchaser: sender,
      beneficiary: sender,
      value,
      amount: value,
    })
    assert.equal((await this.token.balanceOf(sender)).toString(), 
                previousBalance.add(value).toString())
  })
})

