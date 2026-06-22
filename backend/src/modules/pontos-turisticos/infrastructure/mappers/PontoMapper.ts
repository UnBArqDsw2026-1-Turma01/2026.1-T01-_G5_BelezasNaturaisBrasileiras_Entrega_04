export class PontoMapper {
  static toDomain(raw: any) {
    if (!raw) return null;
    const { id, titulo, descricao, criadoPor, createdAt, updatedAt } = raw;
    return {
      id,
      titulo,
      descricao,
      criadoPor,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      updatedAt: updatedAt ? new Date(updatedAt) : undefined,
    } as any;
  }

  static toPersistence(domain: any) {
    if (!domain) return {};
    const { titulo, descricao, criadoPor } = domain;
    return { titulo, descricao, criadoPor };
  }
}
