## Getting Started

## Hosting

### Docker

1. You need to create your .env.production file with following configuration:
 - API_URL - Protocol host and port, example: API_URL="http://127.0.0.1:8084"

2. Build docker image:
docker image build . -t topcoder-ui-container

3. Run docker container
docker run --privileged --name topcoder-ui --network=topcoder-net -p 80:3000 -d topcoder-ui-container

## Deploy on Vercel

