import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ethers } from 'ethers'
// TODO: imports

const PORT = 3000
const app = express()

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(express.json());
app.use(cors(corsOptions))

const callContract = async (address: string, tokenID: number): Promise<ethers.providers.TransactionResponse> => {
	try {
		return {} as ethers.providers.TransactionResponse
	} catch (err) {
		console.error(`ERROR: ${err}`)
		throw err
	}
}

app.post('/mint', async (req: any,res: any) => {
    try{
        const {address, tokenID} = req.body

        // TODO: call contract

        res.send({txHash: '0x'})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})