# tx-manager-boilerplate
a simple backend that relays transactions via an API from a restricted origin frontend

## 1. Deploy a Template
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/EzeuAo)

## 2. How To Run Locally
1. Install git following the steps here: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
2. Clone down the repo with: `$ git clone git@github.com:0xsequence-demos/tx-manager.git` and go into the folder with `$ cd tx-manager`
3. Install node version manager (i.e. nvm) with the command `$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
4. Install a version of node: `$ nvm install v20.0.0`
5. Use the installed version of node in the terminal with the command `$ nvm use v20.0.0` 
6. `cd` into `/server` and change `.env.example` to `.env` with `mv .env.example .env`and complete fields
- `CHAIN_HANDLE`: Choose a network from [Sequence Builder](https://sequence.build)
- `EVM_PRIVATE_KEY`: Generate Ethereum private key as an Externally Owned Account (EOA), for demo purposes you can obtain a private key from [here](https://sequence-ethauthproof-viewer.vercel.app/)
- `PROJECT_ACCESS_KEY`: Use [this walkthrough](https://docs.sequence.xyz/solutions/builder/getting-started#claim-an-api-access-key) to acquire an access key 
7. In the root directory (note: if you're still in the `/server` folder, run `cd ..` to go up a directory) and run: `$ npm run install`
8. Also in the root directory run:`$ npm run start`
9. Using a command line interface, call using cURL to mint to a wallet address:

Note: `tokenID` is passed to the call only if the contract address is an ERC1155

```shell
curl -X POST http://localhost:3000/mint \
-H "Content-Type: application/json" \
-d '{"evmAddress": "<EVM_WALLET_ADDRESS>", "tokenID": "<TOKEN_ID>", "contractAddress":"<COLLECTIBLE_CONTRACT_ADDRESS>", "isERC1155": "<true_OR_false>", "amount":<AMOUNT> }'
```

## 3. How to Run with Docker
1. Install git following the steps here: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
2. Clone down the repo with: `$ git clone git@github.com:0xsequence-demos/tx-manager.git` and go into the folder with `$ cd tx-manager`
3. Install node version manager (i.e. nvm) with the command `$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
4. Install a version of node: `$ nvm install v20.0.0`
5. Use the installed version of node in the terminal with the command `$ nvm use v20.0.0` 
6. Ensure Docker is installed following [these instructions to install](https://docs.docker.com/engine/install/)
7. Open and run the Docker Desktop application
8. Create an environment file with: `cp server/.env.example server/.env` and update the `.env` file with various configuration values:
- `CHAIN_HANDLE`: Choose a network from [Sequence Builder](https://sequence.build)
- `EVM_PRIVATE_KEY`: Generate Ethereum private key as an Externally Owned Account (EOA), for demo purposes you can obtain a private key from [here](https://sequence-ethauthproof-viewer.vercel.app/)
- `PROJECT_ACCESS_KEY`: Use [this walkthrough](https://docs.sequence.xyz/solutions/builder/getting-started#claim-an-api-access-key) to acquire an access key 
9. Run inside the root of the project: `npm start:docker` to start docker
10. Run a test curl command to mint a token:

Note: `tokenID` is passed to the call only if the contract address is an ERC1155

```shell
curl -X POST http://localhost:3000/mint \
-H "Content-Type: application/json" \
-d '{"evmAddress": "<EVM_WALLET_ADDRESS>", "tokenID": "<TOKEN_ID>", "contractAddress":"<COLLECTIBLE_CONTRACT_ADDRESS>", "isERC1155": "<true_OR_false>", "amount":<AMOUNT> }'
```