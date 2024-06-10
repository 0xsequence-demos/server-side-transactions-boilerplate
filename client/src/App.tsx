import {useState, useEffect} from 'react'
import './App.css'
import { Button } from '@0xsequence/design-system'
import {sequence} from '0xsequence'
import {ethers} from 'ethers'

const SERVER_URL = 'http://localhost:3000'

function App() {
  const [address, setAdddress] = useState<any>(null)
  const [txHash, setTxHash] = useState<any>(null)

  sequence.initWallet('AQAAAAAAAHqkj2Z_7wzLMfUU3WLeAwMtUV8', {defaultNetwork: 'astar-zkyoto'})

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
    const response = await fetch(`${SERVER_URL}/mint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({tokenID, address})
    });

    const data = await response.json();
    console.log(data)
    setTxHash(data.txHash)
  }

  useEffect(() => {

  }, [txHash])

  return (
    <>
     <p></p>
     {!txHash ? !address ? <Button onClick={() => signIn()} label="Sign In"/> : <Button label="mint" onClick={() => mint()}/> : `https://astar-zkyoto.blockscout.com/tx/${txHash}`}
    </>
  )
}

export default App
