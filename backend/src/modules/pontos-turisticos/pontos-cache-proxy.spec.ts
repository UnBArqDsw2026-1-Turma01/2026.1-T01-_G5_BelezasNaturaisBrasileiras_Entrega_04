import { PontosCacheProxy } from './interface/proxies/PontosCacheProxy';

describe('PontosCacheProxy', () => {
  it('should cache buscarFeed results for the TTL duration', async () => {
    const mockService = {
      buscarFeed: jest.fn().mockResolvedValue([{ id: '1', titulo: 'A' }]),
      criar: jest.fn(),
      editar: jest.fn(),
      deletar: jest.fn(),
    } as any;

    const cacheProxy = new PontosCacheProxy(mockService);

    const filtros = { cidade: 'X' };

    const first = await cacheProxy.buscarFeed(filtros);
    const second = await cacheProxy.buscarFeed(filtros);

    expect(first).toEqual(second);
    expect(mockService.buscarFeed).toHaveBeenCalledTimes(1);
  });

  it('should clear cache on criar/editar/deletar', async () => {
    const mockService = {
      buscarFeed: jest.fn().mockResolvedValue([{ id: '1' }]),
      criar: jest.fn().mockResolvedValue({ id: '2' }),
      editar: jest.fn().mockResolvedValue({ id: '1', titulo: 'B' }),
      deletar: jest.fn().mockResolvedValue(undefined),
    } as any;

    const cacheProxy = new PontosCacheProxy(mockService);
    const filtros = {};

    await cacheProxy.buscarFeed(filtros);
    expect(mockService.buscarFeed).toHaveBeenCalledTimes(1);

    await cacheProxy.criar({ titulo: 'novo' }, 'u1');
    await cacheProxy.buscarFeed(filtros);
    expect(mockService.buscarFeed).toHaveBeenCalledTimes(2);

    await cacheProxy.editar('1', { titulo: 'x' }, 'u1');
    await cacheProxy.buscarFeed(filtros);
    expect(mockService.buscarFeed).toHaveBeenCalledTimes(3);

    await cacheProxy.deletar('1', 'u1');
    await cacheProxy.buscarFeed(filtros);
    expect(mockService.buscarFeed).toHaveBeenCalledTimes(4);
  });
});
