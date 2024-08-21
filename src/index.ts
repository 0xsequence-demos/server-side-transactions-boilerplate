import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ethers } from 'ethers'
import { Session } from '@0xsequence/auth'
import { findSupportedNetwork, NetworkConfig } from '@0xsequence/network'

const isValidEthereumAddress = (address: any) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const isValidBoolean = (value: any) => {
    return typeof value === 'boolean';
};

const isValidUint256 = (value: any) => {
    return /^\d+$/.test(value) && BigInt(value) >= 0n;
};

async function getContractBytecode(provider: any, contractAddress: string) {
	// storage slot consistent location where proxies store the address of the logic contract they delegate to
    const implementationSlot = "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50";
    try {
        const storageValue1 = await provider.getStorageAt(contractAddress, implementationSlot);
		return storageValue1
    } catch (error) {
        console.error("Error fetching bytecode:", error);
		return null
    }
}

const isNotValidERC1155ContractAddress = async (provider: any, contractAddress: string) => {
	return await getContractBytecode(provider, contractAddress) != '0x000000000000000000000000ec9bf99632c3e97d2e461d16f48fc6fde8591191'
}

const isNotValidERC721ContractAddress = async (provider: any, contractAddress: string) => {
	return await getContractBytecode(provider, contractAddress) != '0x000000000000000000000000f625720cdd63a65a5b7b31e7d0e64ae1ce08e52c'
}

const PORT = 3001
const app = express()

const corsOptions = {
    origin: '*',
};

app.use(express.json());
app.use(cors(corsOptions))

const getSigner = async (chainHandle: string) => {
	try {
		const chainConfig: NetworkConfig = findSupportedNetwork(chainHandle)!
		const provider = new ethers.providers.StaticJsonRpcProvider({
			url: chainConfig.rpcUrl
		})

		const walletEOA = new ethers.Wallet(process.env.EVM_PRIVATE_KEY!, provider);

		// Create a single signer sequence wallet session
		const session = await Session.singleSigner({
			signer: walletEOA,
			projectAccessKey: process.env.PROJECT_ACCESS_KEY!
		})

		return session.account.getSigner(chainConfig.chainId)
	} catch (err) {
		console.error(`ERROR: ${err}`)
		throw err
	}
}

// check to ensure Project Access Key & EVM Private Key is valid
getSigner('mainnet')

const callContract = async (evmAddress: string, chainHandle: string, contractAddress: string, isERC1155: boolean, tokenID: string, amount: string): Promise<ethers.providers.TransactionResponse> => {
	
	const signer = await getSigner(chainHandle)
	
	let collectibleInterface;
	let data;

	if(isERC1155){

		// Standard interface for ERC1155 contract deployed via Sequence Builder
		collectibleInterface = new ethers.utils.Interface([
			'function mint(address to, uint256 tokenId, uint256 amount, bytes data)'
		])

		data = collectibleInterface.encodeFunctionData(
			'mint', [`${evmAddress}`, `${tokenID}`, String(amount), "0x00"]
		)

	} else {
		
		// Standard interface for ERC1155 contract deployed via Sequence Builder
		collectibleInterface = new ethers.utils.Interface([
			'function mint(address to, uint256 amount)'
		])

		data = collectibleInterface.encodeFunctionData(
			'mint', [`${evmAddress}`, String(amount)]
		)
	}

	const txn = {
		to: contractAddress, 
		data: data
	}

	try {
		return await signer.sendTransaction(txn)
	} catch (err) {
		console.error(`ERROR: ${err}`)
		throw err
	}
}

app.post('/mint', async (req: any,res: any) => {
    try{
        const { evmAddress, chainHandle, contractAddress, isERC1155, tokenID, amount } = req.body
        
		const chainConfig: NetworkConfig = findSupportedNetwork(chainHandle)!

		const provider = new ethers.providers.StaticJsonRpcProvider({
			url: chainConfig.rpcUrl
		})

		if (
			!isValidEthereumAddress(evmAddress)
		) 
		{
			return res.status(400).send({ error: "Invalid input parameters: 'evmAddress'" });
		}

		if(
			!findSupportedNetwork(chainHandle)
		)
		{
			return res.status(400).send({ error: "Invalid input parameters: 'chainHandle'" });
		}

		if(
			!isValidBoolean(isERC1155)
		)
		{
			return res.status(400).send({ error: "Invalid input parameters: 'isERC1155'" });
		}

		if(
			isERC1155 && !isValidUint256(tokenID)
		)
		{
			return res.status(400).send({ error: "Invalid input parameters: 'tokenID'" });
		}

		if(
			!isValidUint256(amount)
		)
		{
			return res.status(400).send({ error: "Invalid input parameters: 'amount'" });
		}

		if(isERC1155 && await isNotValidERC1155ContractAddress(provider, contractAddress)){
			return res.status(400).send({ error: "Invalid input parameters: 'contractAddress'" });
		} 
		
		if(!isERC1155 && await isNotValidERC721ContractAddress(provider, contractAddress)){
			return res.status(400).send({ error: "Invalid input parameters: 'contractAddress'" });
		}

		const result = await callContract(evmAddress, chainHandle, contractAddress, isERC1155, tokenID, String(amount))
        
		res.send({txHash: result.hash})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/minterAddress', async (req: any,res: any) => {
    try{
        const signer = await getSigner('mainnet')
        res.send({minterAddress: await signer.getAddress()})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})