import { Injectable } from '@nestjs/common';
import { IChatConnection } from './pool/interfaces/chat-connection.interface';

@Injectable()
export class ChatConnectionFactoryService {
  async createConnection(meta?: Record<string, any>): Promise<IChatConnection> {
    // Placeholder factory: concrete implementation will wrap WebSocket/Gateway connections
    return {
      id: `${Date.now()}-${Math.random()}`,
      open: async () => {},
      close: async () => {},
      send: async () => {},
      isAlive: () => true,
      meta,
    };
  }
}
