import { PontosAuthProxy } from './interface/proxies/PontosAuthProxy';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../accounts/domain/entities/User';

// Note: path to UserRole in this repo is '../accounts/domain/entities/User'
import { User } from '../accounts/domain/entities/User';

describe('PontosAuthProxy', () => {
  const mockService = {
    buscarFeed: jest.fn().mockResolvedValue([]),
    criar: jest.fn().mockResolvedValue({ id: '1' }),
    editar: jest.fn().mockResolvedValue({ id: '1' }),
    deletar: jest.fn().mockResolvedValue(undefined),
  } as any;

  it('should allow creating/editing when user exists', async () => {
    const mockUserRepo = { findByEmail: jest.fn().mockResolvedValue(new User('u1','a@b','Nome', UserRole.COMMON_USER)) } as any;
    const proxy = new PontosAuthProxy(mockService, mockUserRepo);

    await expect(proxy.criar({ titulo: 'x' }, 'a@b')).resolves.toBeDefined();
    await expect(proxy.editar('1', { titulo: 'y' }, 'a@b')).resolves.toBeDefined();

    expect(mockService.criar).toHaveBeenCalled();
    expect(mockService.editar).toHaveBeenCalled();
  });

  it('should throw when user not found', async () => {
    const mockUserRepo = { findByEmail: jest.fn().mockResolvedValue(null) } as any;
    const proxy = new PontosAuthProxy(mockService, mockUserRepo);

    await expect(proxy.criar({ titulo: 'x' }, 'nope')).rejects.toBeInstanceOf(ForbiddenException);
    await expect(proxy.editar('1', { titulo: 'y' }, 'nope')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should only allow deletar for ADMIN', async () => {
    const nonAdminRepo = { findByEmail: jest.fn().mockResolvedValue(new User('u2','b@b','Nome', UserRole.COMMON_USER)) } as any;
    const proxyNonAdmin = new PontosAuthProxy(mockService, nonAdminRepo);

    await expect(proxyNonAdmin.deletar('1', 'b@b')).rejects.toBeInstanceOf(ForbiddenException);

    const adminRepo = { findByEmail: jest.fn().mockResolvedValue(new User('u3','c@c','Admin', UserRole.ADMIN)) } as any;
    const proxyAdmin = new PontosAuthProxy(mockService, adminRepo);

    await expect(proxyAdmin.deletar('1', 'c@c')).resolves.toBeUndefined();
    expect(mockService.deletar).toHaveBeenCalled();
  });
});
