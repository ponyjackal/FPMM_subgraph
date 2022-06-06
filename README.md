# uBet-subgraph

### Prerequisite

1. install node js and yarn

2. install graph cli

   `npm i @graphprotocol/graph-cli`

   `yarn global add @graphprotocol/graph-cli`

3. create account on the graph

   `https://thegraph.com/hosted-service`

### Deploy

1. Make changes to mappings, etc.

2. Run `yarn codegen` to generate schema

3. Run `yarn build` to build the subgraph

4. Run `graph auth` and copy/paste auth token on your hosted sevice dashboard.

   `https://thegraph.com/hosted-service`

5. Run `yarn deploy` to deploy subgraph on hosted service.

:tada: Celebrate graph deployment or debug deployment.
