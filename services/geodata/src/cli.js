import { buildGeodataApp } from './app.js';
import { loadConfig } from './config.js';

async function main() {
  const config = loadConfig();
  const app = await buildGeodataApp({ config });
  let closing = false;
  const close = async () => {
    if (closing) return;
    closing = true;
    await app.close();
  };
  process.once('SIGINT', close);
  process.once('SIGTERM', close);

  await app.listen({ host: config.host, port: config.port });
  console.log(`PeerCompute geodata listening on http://${config.host}:${config.port} (${config.overpass.mode}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Geodata startup failed.');
  process.exitCode = 1;
});
