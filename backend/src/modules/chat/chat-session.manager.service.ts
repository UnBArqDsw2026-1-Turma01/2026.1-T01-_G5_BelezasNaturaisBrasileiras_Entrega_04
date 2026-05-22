import { Injectable } from '@nestjs/common';
import { ChatObjectPoolService } from './pool/chat-object-pool.service';
import { IChatConnection } from './pool/interfaces/chat-connection.interface';

@Injectable()
export class ChatSessionManagerService {
  constructor(private readonly pool: ChatObjectPoolService) {}

  async withConnection<T>(callback: (conn: IChatConnection) => Promise<T>): Promise<T> {
    const conn = await this.pool.acquire();
    try {
      return await callback(conn);
    } finally {
      await this.pool.release(conn);
    }
  }
}
