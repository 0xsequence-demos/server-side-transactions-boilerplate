import 'dotenv/config'
import express from 'express'
import { ethers } from 'ethers'
import { Session } from '@0xsequence/auth'
import { findSupportedNetwork, NetworkConfig } from '@0xsequence/network'

const PORT = 3001
const app = express()

app.use(express.json())

// Validation method to check if the provided address is a valid Ethereum address
const isValidEthereumAddress = (address: any) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Method to get a Sequence signer wallet for the EOA wallet defined in the .env file
const getSigner = async (chainHandle: string) => {
    try {
        const chainConfig: NetworkConfig = findSupportedNetwork(chainHandle)!

        const provider = new ethers.JsonRpcProvider(chainConfig.rpcUrl)

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

// Endpoint to mint a collectible to the provided wallet address
// This endpoint will mint 1 collectible to the provided wallet address
app.post('/mint', async (req: any,res: any) => {
    try {
        // Get the wallet address from the request body
        const { walletAddress } = req.body

        // Define the chain handle, contract address, amount, and signer
        // Modify these variables based on your contract and requirements
        const chainHandle = "arbitrum-sepolia"
        const contractAddress = "0x9f00671530137a433d5a775698094e5c68aae996"
        const amount = 1

        // Get the signer for the provided chain handle
        const signer = await getSigner(chainHandle)

        // Validate the provided wallet address
        if (!isValidEthereumAddress(walletAddress)) {
            return res.status(400).send({ error: "Please provide a valid EVM wallet address" });
        }
        
        let collectibleInterface;
        let data;

        // Standard interface for an ERC721 contract deployed via Sequence Builder
        // If you are using an ERC1155 or a different contract, you will need to update this interface
        collectibleInterface = new ethers.Interface([
            'function mint(address to, uint256 amount)'
        ])

        data = collectibleInterface.encodeFunctionData(
            'mint', [`${walletAddress}`, String(amount)]
        )

        // Construct the transaction object
        const txn = {
            to: contractAddress, 
            data: data
        }

        // Send the transaction
        // If you are on a testnet, gas will be sponsored by Sequence
        // For mainnet contracts, make sure to import your contract at sequence.build
        // and sponsor it using the Gas Sponsorship feature
        let result;

        try {
            result = await signer.sendTransaction(txn)
        } catch (err) {
            console.error(`ERROR: ${err}`)
            throw err
        }
        
        res.send({
            txHash: result.hash,
            verificationUrl: `https://sepolia.arbiscan.io/tx/${result.hash}`
        })
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
    console.log(`Run the following command on a separate terminal to test the endpoint:`)
    console.log(`curl -X POST http://localhost:${PORT}/mint -H "Content-Type: application/json" -d '{"walletAddress":"0x0365e0BcAd6D799b732ADB9673cB4C43688Bb450"}'`)
})
