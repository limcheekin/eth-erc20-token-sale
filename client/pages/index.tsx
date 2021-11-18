import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Component } from 'react'
import Layout from '../components/Layout'
import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import AccountModal from '../components/AccountModal'
import TokenSale from '../components/TokenSale'

function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const title = 'Fluwix Token Sale'
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/limcheekin/eth-erc20-token-sale">{title}</a>
        </h1>

        <p className={styles.description}>
          A dApps to demo the Crowd Sale of an ERC20 token known as Fluwix (FWX).
        </p>

        {
        // Our connect button will only handle opening
        }
        <ConnectButton handleOpenModal={onOpen} />
        {
        // Our Account modal will handle open state & closing
        }
        <AccountModal isOpen={isOpen} onClose={onClose} />
        <TokenSale />
      </main>

      <footer className={styles.footer}>
        Powered by{' '}
        <img className={styles.logo} src="/logos/ethereum.png" alt="Ethereum Logo" width="144" height="32" />
        <img className={styles.logo} src="/logos/nextjs.png" alt="NextJS Logo" width="64" height="32" />
        <img className={styles.logo} src="/logos/metamask.png" alt="MetaMask Logo" width="128" height="32" />
        <img className={styles.logo} src="/logos/walletconnect.png" alt="WalletConnect Logo" width="128" height="32" />
        { process.env.NEXT_PUBLIC_GITHUB_RUN_NUMBER && <div className={styles.logo}>b{process.env.NEXT_PUBLIC_GITHUB_RUN_NUMBER}</div> }
      </footer>
    </Layout>
  )
}


export default Home
