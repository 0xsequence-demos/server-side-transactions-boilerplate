# template-nodejs-transactions-api-backend
a simple backend that relays transactions via an API from a restricted origin frontend

## how to
1. install pnpm with the command `curl -fsSL https://get.pnpm.io/install.sh | sh -`

2. change `.env.example` to `.env` and complete fields
- `CHAIN_HANDLE`: choose a network from [sequence builder](https://sequence.build)
- `PKEY`: obtain a private key from [here](https://73eql-hyaaa-aaaad-qf5bq-cai.ic.fleek.co/)
- `PROJECT_ACCESS_KEY`: use [this walkthrough](https://docs.sequence.xyz/solutions/builder/getting-started#claim-an-api-access-key) to acquire an access key 
- `COLLECTIBLE_CONTRACT_ADDRESS`: from sequence builder deployed contract using this [guide](https://docs.sequence.xyz/solutions/collectibles/contracts/deploy-an-item-collection/)

3. `pnpm run start`
