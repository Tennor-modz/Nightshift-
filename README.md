# Nightshift Pterodactyl Theme

Nightshift is a dark, responsive Pterodactyl Panel theme fork for Panel
version 1.15.1. It keeps the existing panel, server management, console,
authentication, and the existing sidebar functionality while applying
the Nightshift command-center visual system.

## Nightshift visual system

- Graphite and midnight-blue surfaces
- Mint status accents with cyan secondary highlights
- IBM Plex Sans typography with monospace system labels
- Frosted top navigation and compact command sidebar
- Dashboard greeting and system status banner
- Responsive mobile navigation and card layouts

## Installation

This archive is a full panel release. Back up the current panel before
replacing its files.

```bash
cd /var/www/pterodactyl
php artisan down

# Extract the Nightshift panel archive into this directory.
# Upload panel.tar.gz from the release output, then run:
tar -xzf panel.tar.gz

composer install --no-dev --optimize-autoloader
yarn install --frozen-lockfile
NODE_OPTIONS=--openssl-legacy-provider yarn build:production

chmod -R 755 storage/* bootstrap/cache
php artisan optimize:clear
php artisan queue:restart
php artisan up
```

Nightshift is pinned to Pterodactyl Panel 1.15.1. Do not apply this release to
another Panel version without first creating a compatible fork.

## Release builds

From the panel source directory:

```bash
chmod +x release.sh
./release.sh
```

The generated release files are:

- `release/panel.tar.gz`
- `release/panel.zip`

## Project links

- [Pterodactyl Panel documentation](https://pterodactyl.io/panel/1.0/getting_started.html)
- [Pterodactyl Wings documentation](https://pterodactyl.io/wings/1.0/installing.html)
- [Pterodactyl community guides](https://pterodactyl.io/community/about.html)

## License

Pterodactyl code is released under the [MIT License](./LICENSE.md).
Nightshift theme edits are released under the
[GNU GPLv3 License](./NightshiftLicense.md).

Nightshift is not affiliated with Pterodactyl Software or its contributors.