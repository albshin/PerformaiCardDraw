import fs from 'fs';
import https from 'node:https';
import fetchImages from '../fetch-sega-images';

// https.globalAgent.options.ca = fs.readFileSync('node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem');

const GAME_CODE = 'maimai_dx_prism_plus';
const BASE_URL = 'https://maimaidx.jp/maimai-mobile/img/Music/';

async function run() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  const data = JSON.parse(
    fs.readFileSync(`src/songs/${GAME_CODE}.json`, 'utf-8'),
  );
  await fetchImages(BASE_URL, data.songs);
}

if (require.main === module) run();
