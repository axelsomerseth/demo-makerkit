set -e

npm run test:remix & npm run stripe:mock-server &
npm run cypress:headless
sh scripts/kill-ports.sh
