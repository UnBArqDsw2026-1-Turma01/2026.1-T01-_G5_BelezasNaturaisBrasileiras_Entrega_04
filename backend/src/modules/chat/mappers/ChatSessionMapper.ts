export class ChatSessionMapper {
  static toDomain(raw: any) {
    if (!raw) return null;
    const { id, userAId, userBId, connectionId, startedAt, endedAt } = raw;
    return {
      id,
      userAId,
      userBId,
      connectionId: connectionId ?? null,
      startedAt: startedAt ? new Date(startedAt) : undefined,
      endedAt: endedAt ? new Date(endedAt) : null,
    } as any;
  }

  static toPersistence(domain: any) {
    if (!domain) return {};
    const { userAId, userBId, connectionId, startedAt, endedAt } = domain;
    return { userAId, userBId, connectionId, startedAt, endedAt };
  }
}
