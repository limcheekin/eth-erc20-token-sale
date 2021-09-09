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
  const { account, web3, provider } = globalState
  const { FLUWIX_TOKEN_CONTRACT_ADDRESS } = process.env
  const { KYC_CONTRACT_ADDRESS } = process.env
  const { FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS } = process.env
  const fluwixTokenAbi: AbiItem[] = web3 && JSON.parse(JSON.stringify(FluwixToken.abi))
  const fluwixTokenSaleAbi: AbiItem[] = web3 && JSON.parse(JSON.stringify(FluwixTokenSale.abi))
  const kycAbi: AbiItem[] = web3 && JSON.parse(JSON.stringify(Kyc.abi))
  const fluwixToken = web3 && FLUWIX_TOKEN_CONTRACT_ADDRESS && new web3.eth.Contract(fluwixTokenAbi, FLUWIX_TOKEN_CONTRACT_ADDRESS)
  const kyc = web3 && KYC_CONTRACT_ADDRESS && new web3.eth.Contract(kycAbi, KYC_CONTRACT_ADDRESS)
  const fluwixTokenSale = web3 && FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS && new web3.eth.Contract(fluwixTokenSaleAbi, FLUWIX_TOKEN_SALE_CONTRACT_ADDRESS)
  // REF: https://stackoverflow.com/questions/55757761/handle-an-input-with-react-hooks
  const [kycAddress, kycAddressInput] = useInput()
  const [buyToken, buyTokenInput] = useInput()
  const [setKycButton] = useButton(handleKycAddress, 'Allow address to buy FWX token')
  const [buyTokenButton] = useButton(handleBuyTokens, 'Buy FWX token')
  const [balance, setBalance] = useState(0)

  function useInput() {
    const [value, setValue] = useState("")
    const input = <Input value={value} onChange={e => setValue(e.target.value)} />
    return [value, input]
  }

  function useButton(onClickHandler, label: string) {
    const [loading, setLoading] = useState(false)
    const button = <Button isFullWidth isLoading={loading}
      spinner={<BeatLoader size={8} color="grey" />}
      onClick={() => { setLoading(true); onClickHandler(); setLoading(false) }}>{label}</Button>
    return [button]
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
        { from: account, value: buyToken }
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
      {fluwixTokenSale ?
        (
          <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(4, 1fr)" gap={3}>
            <GridItem align="end">{setKycButton}</GridItem>
            <GridItem>{kycAddressInput}</GridItem>
            <GridItem colSpan={2}>
              <Text fontWeight="bold" textAlign="center">Token Contract Address: {FLUWIX_TOKEN_CONTRACT_ADDRESS}</Text>
            </GridItem>
            <GridItem align="end">{buyTokenButton}</GridItem>
            <GridItem>{buyTokenInput}</GridItem>
            <GridItem colSpan={2}>
              <Text fontWeight="bold" textAlign="center">Your FWX Balance is {balance}</Text>
            </GridItem>
          </Grid>
        ) : ''
      }
    </div>
  )
}