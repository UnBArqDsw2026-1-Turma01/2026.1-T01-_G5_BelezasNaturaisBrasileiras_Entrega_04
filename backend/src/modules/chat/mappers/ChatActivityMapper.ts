export class ChatActivityMapper {
  static toDomain(raw: any) {
    if (!raw) return null;
    const { id, chatSessionId, payload, createdAt } = raw;
    return {
      id,
      chatSessionId,
      payload,
      createdAt: createdAt ? new Date(createdAt) : undefined,
    } as any;
  }

  static toPersistence(domain: any) {
    if (!domain) return {};
    const { chatSessionId, payload } = domain;
    return { chatSessionId, payload };
  }
}
