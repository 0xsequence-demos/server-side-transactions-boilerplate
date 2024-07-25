import {useState, useEffect} from 'react'
import './App.css'
import { useTheme,Button, Spinner, Box, Image } from '@0xsequence/design-system'
import {sequence} from '0xsequence'
import {ethers} from 'ethers'
import sequenceIconSrc from "./assets/sequence-icon.svg";

const SERVER_URL = 'http://localhost:3000'
const projectACcessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY || "AQAAAAAAAHqkq694NhWZQdSNJyA6ubOK494"
const collectibleAddress = import.meta.env.VITE_COLLECTIBLE_ADDRESS || "0x9f00671530137a433d5a775698094e5c68aae996"

function App() {
  const {setTheme} = useTheme()
  const [address, setAdddress] = useState<any>(null)
  const [txHash, setTxHash] = useState<any>(null)
  const [isMinting, setIsMinting] = useState<any>(false)
  const [minterAddress, setMinterAddress] = useState<any>('')

  sequence.initWallet(projectACcessKey, {defaultNetwork: 'xr-sepolia'})
  // setTheme('light')
  const signIn = async () => {
    const wallet = sequence.getWallet()
    const details = await wallet.connect({app: 'Tx Manager: NodeJs Transactions API Example'})
    if(details.connected){
      setAdddress(details.session?.accountAddress)
    }
  }

  const mint = async () => {

    setIsMinting(true)

    try{
      const response = await fetch(`${SERVER_URL}/mint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({evmAddress: address, contractAddress: collectibleAddress, isERC1155: false, amount: 1})
      });
  
      const data = await response.json();
      console.log(data)
      setIsMinting(false)
      setTxHash(data.txHash)
    }catch(err){
      setIsMinting(false)
      alert(err)
    }
  }

  useEffect(() => {

  }, [txHash, isMinting])

  useEffect(() => {
    setTimeout(async () => {
      try{
        const response = await fetch(`${SERVER_URL}/minterAddress`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });
        const data = await response.json();
        setMinterAddress(data.minterAddress)
      }catch(err){
        alert(err)
      }
    }, 0)
  }, [])

  return (
    <>
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="5"
        paddingTop={'12'}
        >
        <Image
          src={sequenceIconSrc}
          alt="Sequence Logo"
          style={{
            width: "150px"
          }}
        />
      </Box>
      <br/>
      <br/>
      <p>TX Manager: Nodejs & Express Transactions API Boilerplate</p>
      <p>Minter Address: {minterAddress}</p>
      <div className="center-container">
        {!txHash ? (
          !address ? (
            <Button style={{backgroundColor: '#414141', color: 'white'}} onClick={() => signIn()} label="Sign In" />
          ) : isMinting ? (
            <Spinner />
          ) : (
            <Button style={{backgroundColor: '#414141', color: 'white'}}  label="Mint" onClick={() => mint()} />
          )
        ) : (
          <a href={`https://xr-sepolia-testnet.explorer.caldera.xyz/tx/${txHash}`} target="_blank">
            View Transaction
          </a>
        )}
      </div>
    </>
  )
}

export default App
