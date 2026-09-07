#!/usr/bin/env bash
set -Eeuo pipefail

start="$(date +%s)"
root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "${root}"
yarn build:production

rm -rf release
mkdir -p release

tar -czf release/panel.tar.gz \
    --exclude='./release' \
    --exclude='./node_modules' \
    --exclude='./.git' \
    --exclude='./tmp' \
    -C "${root}" .

zip -qr release/panel.zip . \
    -x 'release/*' 'node_modules/*' '.git/*' 'tmp/*'

end="$(date +%s)"
echo "Nightshift panel release built in $((end - start)) seconds."
