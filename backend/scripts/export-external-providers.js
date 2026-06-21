#!/usr/bin/env node
/*
Script: export-external-providers.js
- Exports `external_providers.config` JSON to scripts/external-providers-secrets.json
- Clears the `config` field in the database (replacing with empty object)
USAGE: cd backend && node scripts/export-external-providers.js
Ensure DATABASE_URL is set in env.
*/

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const providers = await prisma.externalProvider.findMany();
    const secrets = {};
    providers.forEach((p) => {
      if (p.config && Object.keys(p.config).length > 0) {
        secrets[p.key] = p.config;
      }
    });

    const outPath = path.join(__dirname, 'external-providers-secrets.json');
    fs.writeFileSync(outPath, JSON.stringify(secrets, null, 2), { mode: 0o600 });
    console.log('Exported secrets to', outPath);

    // Clear config in DB (replace with empty JSON)
    for (const p of providers) {
      if (p.config && Object.keys(p.config).length > 0) {
        await prisma.externalProvider.update({ where: { id: p.id }, data: { config: {} } });
        console.log('Cleared config for provider', p.key);
      }
    }

    console.log('Migration complete. Review external-providers-secrets.json and move secrets to your Vault/Env.');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
