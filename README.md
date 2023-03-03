# This is a demo project for hackathon.

PokeVote is a proof-of-concept application that combines web3 technology with WebXR. Users can cast their votes for their favorite Pokemon using PokeVote's voting system, which is operated by a smart contract built with Stacks.

## Development Guide

### Start local Stacks 

1. Install Docker if not already done so

2. `> cd contracts && clarinet integrate`

### Start frontend

1. create .env (refer to .env.example)

set `VITE_XR_SERVE_URL` to an accessible URL from your local network, e.g.:  https://192.168.xxx.xxx:3001

2. start frontend app

`> cd frontend && yarn dev` 

It will start local vite dev server on port 5173

3. use local proxy to expose a https port with `local-ssl-proxy` ref: https://github.com/cameronhunter/local-ssl-proxy`

`> local-ssl-proxy --source 3001 --target 5173`
