# Server Side Transactions Boilerplate
A simple nodejs backend that relays transactions via the Sequence Transactions API from a restricted origin frontend. Server can be generalized for any type of transaction beyond just collectible minting (e.g. distributing ERC20 tokens to wallets).

## Prerequisites
- git installed
- node version v22.6.0 installed and in use
- Project cloned with `git clone https://github.com/0xsequence-demos/server-side-transactions-boilerplate/`

## Quickstart with Sequence CLI
To quickly start using the Sequence CLI you can use the following command locally on your machine or on a server using the default environment variables for `EVM_PRIVATE_KEY` & `PROJECT_ACCESS_KEY`:

```shell
npx sequence-cli boilerplates create-server-side-transactions
```

Then mint an ERC721 collectible to your wallet by swapping out the `walletAddress` with your address in the following command:
```shell
curl -X POST http://localhost:3001/mint \
-H "Content-Type: application/json" \
-d '{"walletAddress": "0x0365e0BcAd6D799b732ADB9673cB4C43688Bb450"}'
```

## How to run locally with source
1. `Update Server Configuration`: Copy `.env.example` to `.env` with `cp .env.example .env` and complete fields
- `EVM_PRIVATE_KEY`: Generate Ethereum private key as an Externally Owned Account (EOA) passed into a Sequence Wallet as a signer. For demo purposes you can obtain a private key from [here](https://sequence-ethauthproof-viewer.vercel.app/)
- `PROJECT_ACCESS_KEY`: Use [this walkthrough](https://docs.sequence.xyz/solutions/builder/getting-started#claim-an-api-access-key) to obtain an access key 
2. `Deploy Collectible`: Deploy an ERC721 contract with this [walkthrough](https://docs.sequence.xyz/solutions/collectibles/contracts/deploy-an-item-collection), and the obtained contract collectible contract address to be used in step 4.
3. `Get Sequence Wallet Address`: This can be obtained by going the [Transactions API page](https://sequence.build/project/default/transactions-api) and pasting in your EOA Private Key generated in Step 1, elicited as the Wallet Address.
4. `Set Minter Role`: Go to the `Contracts` section in Sequence Builder and navigate to Settings > Permissions > Add Collaborator. Add the public address of your generated Sequence Wallet and give the Minter role permissions from step 4.
5. `Install Packages`: Run in the project's root directory: `$ pnpm install`
6. `Run tx-manager`: Also in the project's root directory run: `$ pnpm start`
7. `Mint Token`: Use a command line interface to call using cURL to mint to a wallet address (could change the `walletAddress` to your own):
