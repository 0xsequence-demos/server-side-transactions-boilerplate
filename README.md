# template-nodejs-transactions-api-backend
a simple backend that relays transactions via an API from a restricted origin frontend

## Deploy a Template
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/ERJVm2)

## How To Run Locally
1. Install git following the steps here: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
2. Clone down the repo with: `$ git clone git@github.com:moskalyk/nodejs-transactions-api.git` and go into the folder with `$ cd nodejs-transactions-api`
3. Install node version manager (i.e. nvm) with the command `$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
4. Install a version of node: `$ nvm install v20.0.0`
5. Use the installed version of node in the terminal with the command `$ nvm use v20.0.0` 
6. `cd` into `/server` and change `.env.example` to `.env` with `mv .env.example .env`and complete fields
- `CHAIN_HANDLE`: Choose a network from [Sequence Builder](https://sequence.build)
- `EVM_PRIVATE_KEY`: Generate Ethereum private key as an Externally Owned Account (EOA), for demo purposes you can obtain a private key from [here](https://sequence-ethauthproof-viewer.vercel.app/)
- `PROJECT_ACCESS_KEY`: Use [this walkthrough](https://docs.sequence.xyz/solutions/builder/getting-started#claim-an-api-access-key) to acquire an access key 
- `COLLECTIBLE_CONTRACT_ADDRESS`: From Sequence Builder, deploy a contract using this [guide](https://docs.sequence.xyz/solutions/collectibles/contracts/deploy-an-item-collection/)
7. In the root directory (note: if you're still in the `/server` folder, run `cd ..` to go up a directory) and run: `$ npm run install`
8. Also in the root directory run:`$ npm run start`
