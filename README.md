# tx-manager-boilerplate
a simple nodejs backend that relays transactions via the Sequence Transactions API from a restricted origin frontend. the tx-manager server can be generalized for any type of transaction beyond just collectible minting (e.g. distributing ERC20 tokens to wallets)

## Prerequisites
- Git installed
- Node version v22.6.0 installed and in use
- Project cloned with `git clone https://github.com/0xsequence-demos/tx-manager-boilerplate/`

## How to run locally
1. `Update Server Configuration`: In `/server`, change `.env.example` to `.env` with `cp ./server/.env.example ./server/.env` and complete fields
- `EVM_PRIVATE_KEY`: Generate Ethereum private key as an Externally Owned Account (EOA) passed into a Relayer Wallet, for demo purposes you can obtain a private key from [here](https://sequence-ethauthproof-viewer.vercel.app/)
- `PROJECT_ACCESS_KEY`: Use [this walkthrough](https://docs.sequence.xyz/solutions/builder/getting-started#claim-an-api-access-key) to obtain an access key 
2. `Deploy Collectible`: Deploy an ERC721 contract with this [walkthrough](https://docs.sequence.xyz/solutions/collectibles/contracts/deploy-an-item-collection), and the obtained contract collectible contract address to be used in step 4
3. `Set Minter Role`: Navigate to the `Contracts` page in the Builder and under `Write Contract` tab expand the `grantRole` method. Complete with the following details:
- bytes32 role: `0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6`
- address account: `<Generated Sequence Transactions API Wallet Address from Step 1>`
4. `Install Packages`: Run in the project's root directory: `$ pnpm install`
5. `Run tx-manager`: Also in the project's root directory run: `$ pnpm start`
6. `Mint Token`: Use a command line interface to call using cURL to mint to a wallet address (could change the `evmAddress` to your own):

Note: `tokenID` is passed to the call only if the contract address is an ERC1155

### Example ERC721 cURL
```shell
curl -X POST http://localhost:3001/mint \
-H "Content-Type: application/json" \
-d '{"evmAddress": "0xe6eB28398CCBe46aA505b62b96822c2Ce8DAABf4", "chainHandle": "xr-sepolia", "contractAddress":"0x9f00671530137a433d5a775698094e5c68aae996", "isERC1155": false, "amount": 1 }'
```

### Example ERC1155 cURL 
```shell
curl -X POST http://localhost:3001/mint \
-H "Content-Type: application/json" \
-d '{"evmAddress": "<EVM_WALLET_ADDRESS>", "chainHandle":"<CHAIN_HANDLE>","tokenID": "<TOKEN_ID>", "contractAddress":"<COLLECTIBLE_CONTRACT_ADDRESS>", "isERC1155": <true_OR_false>, "amount":<AMOUNT> }'
```
