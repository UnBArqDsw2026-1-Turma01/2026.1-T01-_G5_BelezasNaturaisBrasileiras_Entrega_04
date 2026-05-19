import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { Trilha } from '../../domain/entities/Trilha';
import { AuditLog } from '../../domain/services/AuditLog';

export class AuditedTrilhaRepository implements ITrilhaRepository {
  constructor(
    private readonly wrapped: ITrilhaRepository,
    private readonly auditLog: AuditLog,
  ) {}

  async create(trilha: Trilha): Promise<Trilha> {
    const result = await this.wrapped.create(trilha);
    this.auditLog.registrar({
      acao: 'created',
      trilhaId: result.id,
      registradoEm: new Date(),
    });
    return result;
  }

  async save(trilha: Trilha): Promise<Trilha> {
    const result = await this.wrapped.save(trilha);
    this.auditLog.registrar({
      acao: 'updated',
      trilhaId: result.id,
      detalhes: { status: result.status },
      registradoEm: new Date(),
    });
    return result;
  }

  async findById(id: string): Promise<Trilha | null> {
    const result = await this.wrapped.findById(id);
    this.auditLog.registrar({
      acao: 'read',
      trilhaId: id,
      registradoEm: new Date(),
    });
    return result;
  }

  async findAll(): Promise<Trilha[]> {
    const result = await this.wrapped.findAll();
    this.auditLog.registrar({
      acao: 'readAll',
      registradoEm: new Date(),
    });
    return result;
  }
}
