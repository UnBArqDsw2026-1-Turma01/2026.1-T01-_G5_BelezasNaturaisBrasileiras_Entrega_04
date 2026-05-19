import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { Trilha } from '../../domain/entities/Trilha';

export class CachedTrilhaRepository implements ITrilhaRepository {
  private readonly cacheById = new Map<string, Trilha>();
  private cacheAll: Trilha[] | null = null;

  constructor(private readonly wrapped: ITrilhaRepository) {}

  async findById(id: string): Promise<Trilha | null> {
    if (this.cacheById.has(id)) {
      return this.cacheById.get(id)!;
    }
    const trilha = await this.wrapped.findById(id);
    if (trilha) {
      this.cacheById.set(id, trilha);
    }
    return trilha;
  }

  async findAll(): Promise<Trilha[]> {
    if (this.cacheAll !== null) {
      return this.cacheAll;
    }
    this.cacheAll = await this.wrapped.findAll();
    return this.cacheAll;
  }

  async create(trilha: Trilha): Promise<Trilha> {
    const created = await this.wrapped.create(trilha);
    this.cacheAll = null;
    return created;
  }

  async save(trilha: Trilha): Promise<Trilha> {
    const saved = await this.wrapped.save(trilha);
    this.cacheById.delete(trilha.id);
    this.cacheAll = null;
    return saved;
  }
}
