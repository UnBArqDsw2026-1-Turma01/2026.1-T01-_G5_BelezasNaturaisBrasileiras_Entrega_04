import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { Trilha } from '../../domain/entities/Trilha';
import { RedisService } from '../../../../shared/infrastructure/redis/redis.service';

export class CachedTrilhaRepository implements ITrilhaRepository {
  private readonly prefix = 'trilhas:';
  private readonly ttlSeconds = 60 * 5; // 5 minutes

  // If redisService is not provided we fallback to in-memory cache to keep backward compatibility with tests
  private readonly inMemoryCacheById = new Map<string, Trilha>();
  private inMemoryCacheAll: Trilha[] | null = null;

  constructor(private readonly wrapped: ITrilhaRepository, private readonly redis?: RedisService) {}

  private getClient() {
    if (!this.redis) throw new Error('RedisService not available');
    return this.redis.getClient();
  }

  async findById(id: string): Promise<Trilha | null> {
    if (!this.redis) {
      if (this.inMemoryCacheById.has(id)) return this.inMemoryCacheById.get(id)!;
      const trilha = await this.wrapped.findById(id);
      if (trilha) this.inMemoryCacheById.set(id, trilha);
      return trilha;
    }

    const client = this.getClient();
    const key = `${this.prefix}id:${id}`;
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached) as Trilha;
    }
    const trilha = await this.wrapped.findById(id);
    if (trilha) {
      await client.set(key, JSON.stringify(trilha), 'EX', this.ttlSeconds);
    }
    return trilha;
  }

  async findAll(): Promise<Trilha[]> {
    if (!this.redis) {
      if (this.inMemoryCacheAll !== null) return this.inMemoryCacheAll;
      this.inMemoryCacheAll = await this.wrapped.findAll();
      return this.inMemoryCacheAll;
    }

    const client = this.getClient();
    const key = `${this.prefix}all`;
    const cached = await client.get(key);
    if (cached) return JSON.parse(cached) as Trilha[];
    const all = await this.wrapped.findAll();
    await client.set(key, JSON.stringify(all), 'EX', this.ttlSeconds);
    return all;
  }

  async create(trilha: Trilha): Promise<Trilha> {
    const created = await this.wrapped.create(trilha);
    if (!this.redis) {
      this.inMemoryCacheAll = null;
      return created;
    }
    const client = this.getClient();
    await client.del(`${this.prefix}all`);
    return created;
  }

  async save(trilha: Trilha): Promise<Trilha> {
    const saved = await this.wrapped.save(trilha);
    if (!this.redis) {
      this.inMemoryCacheById.delete(trilha.id);
      this.inMemoryCacheAll = null;
      return saved;
    }
    const client = this.getClient();
    await client.del(`${this.prefix}id:${trilha.id}`);
    await client.del(`${this.prefix}all`);
    return saved;
  }
}
