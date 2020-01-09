import { resolve } from 'path';

export default function(config, env, helpers) {
  // Use any `index` file, not just index.js
  const entry = resolve(process.cwd(), 'src', 'index');
  config.resolve.alias['preact-cli-entrypoint'] = entry;

  return config;
}
