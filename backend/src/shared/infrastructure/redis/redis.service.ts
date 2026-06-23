import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private warned = false;

  onModuleInit() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(url, {
      // Falha rapido em vez de enfileirar/travar requisicoes quando o Redis esta fora.
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      // Para de tentar reconectar apos algumas tentativas (evita spam de ECONNREFUSED).
      retryStrategy: (times) => (times > 5 ? null : Math.min(times * 200, 2000)),
    });

    // Trata o evento de erro (senao o ioredis lanca "Unhandled error event").
    // Loga apenas uma vez para nao poluir o terminal quando o Redis nao esta disponivel.
    this.client.on('error', (err) => {
      if (!this.warned) {
        this.warned = true;
        const motivo = err.message || (err as { code?: string }).code || 'sem conexao';
        this.logger.warn(
          `Redis indisponivel (${motivo}). Cache desativado; seguindo direto para o banco.`,
        );
      }
    });
    this.client.on('ready', () => {
      this.warned = false;
      this.logger.log('Redis conectado.');
    });
  }

  onModuleDestroy() {
    return this.client?.quit();
  }

  getClient(): Redis {
    if (!this.client) throw new Error('Redis client not initialized');
    return this.client;
  }
}
