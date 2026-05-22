import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;

  onModuleInit() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(url);
  }

  onModuleDestroy() {
    return this.client?.quit();
  }

  getClient(): Redis {
    if (!this.client) throw new Error('Redis client not initialized');
    return this.client;
  }
}
