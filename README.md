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
- `EVM_PRIVATE_KEY`: Generate Ethereum private key as an Externally Owned Account (EOA) passed into a Relayer Wallet, for demo purposes you can obtain a private key from [here](https://sequence-ethauthproof-viewer.vercel.app/)
- `PROJECT_ACCESS_KEY`: Use [this walkthrough](https://docs.sequence.xyz/solutions/builder/getting-started#claim-an-api-access-key) to obtain an access key 
2. `Deploy Collectible`: Deploy an ERC721 contract with this [walkthrough](https://docs.sequence.xyz/solutions/collectibles/contracts/deploy-an-item-collection), and the obtained contract collectible contract address to be used in step 4
3. `Set Minter Role`: Navigate to the `Contracts` section in Sequence Builder and navigate to Settings > Permissions > Add Collarobator. Add the public address of the EOA wallet you provided as the signer and select "Minter" as the role permission.
4. `Install Packages`: Run in the project's root directory: `$ pnpm install`
5. `Run tx-manager`: Also in the project's root directory run: `$ pnpm start`
6. `Mint Token`: Use a command line interface to call using cURL to mint to a wallet address (could change the `walletAddress` to your own):
