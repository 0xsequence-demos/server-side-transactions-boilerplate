import {useState, useEffect} from 'react'
import './App.css'
import { Button, Spinner } from '@0xsequence/design-system'
import {sequence} from '0xsequence'
import {ethers} from 'ethers'

const SERVER_URL = 'http://localhost:3000'

function App() {
  const [address, setAdddress] = useState<any>(null)
  const [txHash, setTxHash] = useState<any>(null)
  const [isMinting, setIsMinting] = useState<any>(false)

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
        body: JSON.stringify({tokenID, address})
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

  return (
    <>
     <p></p>
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
