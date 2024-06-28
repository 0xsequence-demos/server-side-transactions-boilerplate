import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ethers } from 'ethers'
import { Session } from '@0xsequence/auth'
import { findSupportedNetwork, NetworkConfig } from '@0xsequence/network'

const PORT = 3000
const app = express()

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(express.json());
app.use(cors(corsOptions))

const callContract = async (address: string, tokenID: number): Promise<ethers.providers.TransactionResponse> => {
	
	const signer = await getSigner()
	
	// Standard interface for ERC1155 contract deployed via Sequence Builder
	const collectibleInterface = new ethers.utils.Interface([
		'function mint(address to, uint256 tokenId, uint256 amount, bytes data)'
	])
		
	const data = collectibleInterface.encodeFunctionData(
		'mint', [`${address}`, `${tokenID}`, "1", "0x00"]
	)

	const txn = {
		to: process.env.COLLECTIBLE_CONTRACT_ADDRESS, 
		data: data
	}

	try {
		return await signer.sendTransaction(txn)
	} catch (err) {
		console.error(`ERROR: ${err}`)
		throw err
	}
}

const getSigner = async () => {
	const chainConfig: NetworkConfig = findSupportedNetwork(process.env.CHAIN_HANDLE!)!
	const provider = new ethers.providers.StaticJsonRpcProvider({
		url: chainConfig.rpcUrl
	})

	const walletEOA = new ethers.Wallet(process.env.PKEY!, provider);
	const relayerUrl = `https://${chainConfig.name}-relayer.sequence.app`

	try {
		// Create a single signer sequence wallet session
		const session = await Session.singleSigner({
			signer: walletEOA,
			projectAccessKey: process.env.PROJECT_ACCESS_KEY!
		})
		return session.account.getSigner(chainConfig.chainId)er
	} catch (err) {
		console.error(`ERROR: ${err}`)
		throw err
	}
}

app.post('/mint', async (req: any,res: any) => {
    try{
        const {address, tokenID} = req.body
        const result = await callContract(address,tokenID)
        res.send({txHash: result.hash})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/minterAddress', async (req: any,res: any) => {
    try{
        const signer = await getSigner()
        res.send({minterAddress: await signer.getAddress()})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})