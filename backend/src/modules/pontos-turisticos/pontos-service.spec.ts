import { PontosTuristicosService } from './application/PontosTuristicosService';
import { NotFoundException } from '@nestjs/common';

describe('PontosTuristicosService (in-memory)', () => {
  let service: PontosTuristicosService;

  beforeEach(() => {
    service = new PontosTuristicosService();
  });

  it('should create and fetch feed', async () => {
    const created = await service.criar({ titulo: 'X' }, 'u1');
    const feed = await service.buscarFeed({});
    expect(feed.find((f) => f.id === created.id)).toBeDefined();
  });

  it('should edit existing point', async () => {
    const created = await service.criar({ titulo: 'X' }, 'u1');
    const edited = await service.editar(created.id, { titulo: 'Y' }, 'u1');
    expect(edited.titulo).toBe('Y');
  });

  it('should throw when editing non-existing', async () => {
    await expect(service.editar('nope', { titulo: 'x' }, 'u1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should delete existing point', async () => {
    const created = await service.criar({ titulo: 'X' }, 'u1');
    await service.deletar(created.id, 'u1');
    await expect(service.editar(created.id, { titulo: 'Z' }, 'u1')).rejects.toBeInstanceOf(NotFoundException);
  });
});
