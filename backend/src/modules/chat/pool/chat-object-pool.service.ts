import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IObjectPool } from './interfaces/chat-pool.interface';
import { IChatConnection } from './interfaces/chat-connection.interface';
import { ChatConnectionFactoryService } from '../chat-connection.factory.service';

@Injectable()
export class ChatObjectPoolService implements IObjectPool<IChatConnection>, OnModuleInit {
  private readonly logger = new Logger(ChatObjectPoolService.name);
  private pool: IChatConnection[] = [];
  private max = 50;

  constructor(private readonly factory: ChatConnectionFactoryService) {}

  async onModuleInit() {
    // Optionally pre-warm pool
    this.logger.log('ChatObjectPoolService initialized');
  }

  async acquire(): Promise<IChatConnection> {
    const conn = this.pool.pop();
    if (conn && conn.isAlive()) return conn;
    return this.factory.createConnection();
  }

  async release(obj: IChatConnection): Promise<void> {
    if (!obj || !obj.isAlive()) {
      try { await obj?.close(); } catch (e) {}
      return;
    }
    if (this.pool.length >= this.max) {
      await obj.close();
      return;
    }
    this.pool.push(obj);
  }

  size(): number {
    return this.pool.length;
  }

  async cleanIdle(): Promise<void> {
    while (this.pool.length) {
      const c = this.pool.pop();
      if (c) try { await c.close(); } catch (e) {}
    }
  }
}
