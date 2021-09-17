import { Button, Text, Input, Grid, GridItem } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { globalContext } from '../store'
import FluwixToken from '../contracts/FluwixToken.json'
import FluwixTokenSale from '../contracts/FluwixTokenSale.json'
import Kyc from '../contracts/Kyc.json'
import { AbiItem } from 'web3-utils'
import BeatLoader from 'react-spinners/BeatLoader'

// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function TokenSale() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, web3 } = globalState
  const FLUWIX_TOKEN_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FLUWIX_TOKEN_CONTRACT_ADDRESS
  const KYC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_KYC_CONTRACT_ADDRESS
  const FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS
  const fluwixTokenAbi: AbiItem[] = web3 && JSON.parse(JSON.stringify(FluwixToken.abi))
  const fluwixTokenSaleAbi: AbiItem[] = web3 && JSON.parse(JSON.stringify(FluwixTokenSale.abi))
  const kycAbi: AbiItem[] = web3 && JSON.parse(JSON.stringify(Kyc.abi))
  const fluwixToken = web3 && FLUWIX_TOKEN_CONTRACT_ADDRESS && new web3.eth.Contract(fluwixTokenAbi, FLUWIX_TOKEN_CONTRACT_ADDRESS)
  const kyc = web3 && KYC_CONTRACT_ADDRESS && new web3.eth.Contract(kycAbi, KYC_CONTRACT_ADDRESS)
  const fluwixTokenSale = web3 && FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS && new web3.eth.Contract(fluwixTokenSaleAbi, FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS)
  // REF: https://stackoverflow.com/questions/55757761/handle-an-input-with-react-hooks
  const [kycLoading, setKycButton] = useButton(handleKycAddress, 'Allow address to buy FWX token')
  const [buyTokenLoading, buyTokenButton] = useButton(handleBuyTokens, 'Buy FWX token')
  const [kycAddress, kycAddressInput] = useInput(kycLoading as boolean)
  const [buyToken, buyTokenInput] = useInput(buyTokenLoading as boolean)
  const [balance, setBalance] = useState(0)

  function useInput(isReadOnly: boolean) {
    const [value, setValue] = useState("")
    const input = <Input value={value} isReadOnly={isReadOnly} onChange={e => setValue(e.target.value)} />
    return [value, input]
  }

  function useButton(onClickHandler, label: string) {
    const [loading, setLoading] = useState(false)
    const button = <Button isFullWidth isLoading={loading}
      spinner={<BeatLoader size={8} color="grey" />}
      onClick={async () => { setLoading(true); await onClickHandler(); setLoading(false) }}>{label}</Button>
    return [loading, button]
  }

  async function handleKycAddress() {
    console.log('handleKycAddress')
    try {
      await kyc.methods.setKycCompleted(kycAddress).send({ from: account })
    } catch (error) {
      console.error('error in try...catch', error)
    }
  }

  async function handleBuyTokens() {
    console.log('handleBuyTokens')
    try {
      const receipt = await fluwixTokenSale.methods.buyTokens(account).send(
        { from: account, value: buyToken * (10 ** 18) }
      )
      console.log('receipt', receipt)
      getBalance()
    } catch (error) {
      console.error('error in try...catch', error)
    }
  }

  function getBalance() {
    console.log('getBalance')
    fluwixToken.methods.balanceOf(account).call().then((result: any) => {
      setBalance(result)
    });
  }

  useEffect(() => {
    if (web3) {
      console.log('FLUWIX_TOKEN_CONTRACT_ADDRESS', FLUWIX_TOKEN_CONTRACT_ADDRESS)
      console.log('fluwixToken', fluwixToken)
      console.log('KYC_CONTRACT_ADDRESS', KYC_CONTRACT_ADDRESS)
      console.log('kyc', kyc)
      console.log('FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS', FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS)
      console.log('fluwixTokenSale', fluwixTokenSale)
      getBalance()
    }
  })

  return (
    <div>
      { 
        fluwixTokenSale &&
        (
          <Grid mt="5" maxWidth={800} templateColumns="repeat(2, 1fr)" templateRows="repeat(5, 1fr)" gap={1}>
            <GridItem colSpan={2}>
                <Text>
                As an owner of the token sale (The account used for smart contract deployment),
                you need to whitelist the buyer accounts before they can buy token.
                </Text>
            </GridItem>
            <GridItem align="end">{setKycButton}</GridItem>
            <GridItem>{kycAddressInput}</GridItem>
            <GridItem colSpan={2}><Text>Once a buyer account being whitelisted by the owner,
                it can participate in the token sale by sending Wei to
                the following contract address or using the Buy FWX token button below:</Text>
              <Text fontWeight="bold" textAlign="center">{FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS}</Text>
            </GridItem>
            <GridItem align="end">{buyTokenButton}</GridItem>
            <GridItem>{buyTokenInput}</GridItem>
            <GridItem colSpan={2}>
              <Text fontWeight="bold" textAlign="center">Your FWX Balance is {balance}</Text>
              <Text>If you want to see the FWX balance in your wallet, add the token with the following contract address:</Text>
              <Text fontWeight="bold" textAlign="center">{FLUWIX_TOKEN_CONTRACT_ADDRESS}</Text>
            </GridItem>
          </Grid>
        ) 
      }
    </div>
  )
}