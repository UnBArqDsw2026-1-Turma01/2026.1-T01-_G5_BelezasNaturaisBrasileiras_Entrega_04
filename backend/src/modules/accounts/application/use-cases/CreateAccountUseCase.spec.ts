import { ConflictException } from '@nestjs/common';
import { CreateAccountUseCase } from './CreateAccountUseCase';
import { CreateAccountInput } from '../dtos/CreateAccountInput';
import { UserRole } from '../../domain/entities/User';

const makeInput = (): CreateAccountInput => ({
  email: 'user@test.com',
  password: 'Senha123',
  nome: 'Usuario Teste',
  aceitouTermos: true,
});

const makeSavedUser = () => ({
  id: 'uuid-123',
  email: 'user@test.com',
  nome: 'Usuario Teste',
  role: 'COMMON_USER',
  fotoPerfil: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('CreateAccountUseCase', () => {
  const mockUserRepo = {
    create: jest.fn(),
    update: jest.fn(),
    findByEmail: jest.fn(),
  };
  const mockSupabase = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
  };
  const mockFactoryRegistry = {
    get: jest.fn(),
  };

  let useCase: CreateAccountUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepo.create.mockResolvedValue(makeSavedUser());
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockSupabase.createUser.mockResolvedValue({ uid: 'uuid-123' });
    mockSupabase.deleteUser.mockResolvedValue(undefined);
    mockFactoryRegistry.get.mockReturnValue({
      create: jest.fn().mockReturnValue(makeSavedUser()),
    });
    useCase = new CreateAccountUseCase(
      mockUserRepo as any,
      mockSupabase as any,
      mockFactoryRegistry as any,
    );
  });

  it('should create account when all validations pass', async () => {
    const result = await useCase.execute(makeInput());
    expect(result.email).toBe('user@test.com');
    expect(mockSupabase.createUser).toHaveBeenCalledWith('user@test.com', 'Senha123');
    expect(mockFactoryRegistry.get).toHaveBeenCalledWith(UserRole.COMMON_USER);
  });

  it('should create account with requested role when provided', async () => {
    await useCase.execute({ ...makeInput(), role: UserRole.ORGANIZER });

    expect(mockFactoryRegistry.get).toHaveBeenCalledWith(UserRole.ORGANIZER);
  });

  it('should throw ConflictException when email already exists (chain stops before Supabase)', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 'existing' });
    await expect(useCase.execute(makeInput())).rejects.toThrow(ConflictException);
    expect(mockSupabase.createUser).not.toHaveBeenCalled();
  });

  it('should rollback Supabase user when DB save fails', async () => {
    mockUserRepo.create.mockRejectedValue(new Error('DB error'));
    await expect(useCase.execute(makeInput())).rejects.toThrow('Falha ao salvar usuário no banco de dados');
    expect(mockSupabase.deleteUser).toHaveBeenCalledWith('uuid-123');
  });
});
