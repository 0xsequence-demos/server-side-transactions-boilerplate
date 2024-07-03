import {useState, useEffect} from 'react'
import './App.css'
import { Button, Spinner, Box, Image } from '@0xsequence/design-system'
import {sequence} from '0xsequence'
import {ethers} from 'ethers'
import sequenceIconSrc from "./assets/sequence-icon.svg";

const SERVER_URL = 'http://localhost:3000'

function App() {
  const [address, setAdddress] = useState<any>(null)
  const [txHash, setTxHash] = useState<any>(null)
  const [isMinting, setIsMinting] = useState<any>(false)
  const [minterAddress, setMinterAddress] = useState<any>('')

  sequence.initWallet('AQAAAAAAAHqkl2N_0qmev_ZM-i_L3bsMn1Y', {defaultNetwork: 'xr-sepolia'})

  const signIn = async () => {
    const wallet = sequence.getWallet()
    const details = await wallet.connect({app: 'template nodejs backend'})
    if(details.connected){
      setAdddress(details.session?.accountAddress)
    }
  }

  const mint = async () => {
    const tokenID = ethers.BigNumber.from(
      ethers.utils.hexlify(ethers.utils.randomBytes(10))
    ).toString()

    setIsMinting(true)

    try{
      const response = await fetch(`${SERVER_URL}/mint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({tokenID, evmAddress: address})
      });
  
      const data = await response.json();
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
      <p>Nodejs & Express Transactions API Template</p>
      <p>Minter Address: {minterAddress}</p>
      <div className="center-container">
        {!txHash ? (
          !address ? (
            <Button onClick={() => signIn()} label="Sign In" />
          ) : isMinting ? (
            <Spinner />
          ) : (
            <Button label="Mint" onClick={() => mint()} />
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
