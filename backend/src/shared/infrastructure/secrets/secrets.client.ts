import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecretsClient {
  private readonly logger = new Logger('SecretsClient');

  // Simple secrets client: read from ENV with prefix PROVIDER_{KEY}_SECRET or from a local file (dev)
  getSecret(providerKey: string): string | null {
    const envName = `PROVIDER_${providerKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_SECRET`;
    const val = process.env[envName];
    if (val) return val;

    // fallback to DEV_LOCAL_SECRETS JSON file (only for local development)
    if (process.env.DEV_USE_LOCAL_SECRETS === 'true') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const f = require('../../../../scripts/external-providers-secrets.json');
        return f?.[providerKey] ?? null;
      } catch (err) {
        this.logger.warn('Local secrets file not found or invalid');
      }
    }
    return null;
  }
}
