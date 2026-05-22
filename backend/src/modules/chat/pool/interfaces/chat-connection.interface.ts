export interface IChatConnection {
  id: string;
  open(): Promise<void>;
  close(): Promise<void>;
  send(message: any): Promise<void>;
  isAlive(): boolean;
  meta?: Record<string, any>;
}
