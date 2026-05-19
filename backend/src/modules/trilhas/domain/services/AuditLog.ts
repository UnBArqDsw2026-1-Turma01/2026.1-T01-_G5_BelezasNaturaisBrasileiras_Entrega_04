import { Injectable } from '@nestjs/common';

export interface AuditEntry {
  acao: 'created' | 'updated' | 'read' | 'readAll';
  trilhaId?: string;
  detalhes?: Record<string, unknown>;
  registradoEm: Date;
}

@Injectable()
export class AuditLog {
  private readonly entradas: AuditEntry[] = [];

  registrar(entry: AuditEntry): void {
    this.entradas.push(entry);
  }

  listarEntradas(): AuditEntry[] {
    return [...this.entradas];
  }
}
