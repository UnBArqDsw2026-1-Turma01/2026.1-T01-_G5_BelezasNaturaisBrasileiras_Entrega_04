import { User, UserRole } from './User';

const makeUser = (overrides: Partial<User> = {}): User =>
  new User(
    overrides.id ?? 'user-1',
    overrides.email ?? 'original@teste.com',
    overrides.nome ?? 'Original',
    overrides.role ?? UserRole.COMMON_USER,
    overrides.fotoPerfil ?? null,
    overrides.createdAt ?? new Date('2026-01-01'),
    overrides.updatedAt ?? new Date('2026-01-01'),
  );

describe('User — Prototype', () => {
  describe('clone() sem overrides', () => {
    it('deve retornar um novo objeto com os mesmos dados do original', () => {
      const original = makeUser();
      const clone = original.clone();

      expect(clone).not.toBe(original);
      expect(clone.id).toBe(original.id);
      expect(clone.email).toBe(original.email);
      expect(clone.nome).toBe(original.nome);
      expect(clone.role).toBe(original.role);
      expect(clone.fotoPerfil).toBe(original.fotoPerfil);
    });

    it('deve retornar uma instância de User', () => {
      const clone = makeUser().clone();
      expect(clone).toBeInstanceOf(User);
    });

    it('mutação no clone não deve afetar o original', () => {
      const original = makeUser();
      const clone = original.clone();
      clone.email = 'clone@teste.com';

      expect(original.email).toBe('original@teste.com');
    });
  });

  describe('clone() com overrides parciais', () => {
    it('deve sobrescrever apenas os campos fornecidos', () => {
      const original = makeUser();
      const clone = original.clone({ email: 'novo@teste.com', role: UserRole.ORGANIZER });

      expect(clone.email).toBe('novo@teste.com');
      expect(clone.role).toBe(UserRole.ORGANIZER);
      expect(clone.id).toBe(original.id);
      expect(clone.nome).toBe(original.nome);
    });

    it('deve permitir clonar com novo id para criar cópia promovida', () => {
      const original = makeUser({ role: UserRole.COMMON_USER });
      const promoted = original.clone({ id: 'user-2', role: UserRole.ORGANIZER });

      expect(promoted.id).toBe('user-2');
      expect(promoted.role).toBe(UserRole.ORGANIZER);
      expect(original.role).toBe(UserRole.COMMON_USER);
    });

    it('deve permitir sobrescrever fotoPerfil com null', () => {
      const original = makeUser({ fotoPerfil: 'https://foto.png' });
      const clone = original.clone({ fotoPerfil: null });

      expect(clone.fotoPerfil).toBeNull();
    });

    it('deve preservar fotoPerfil original quando override não inclui o campo', () => {
      const original = makeUser({ fotoPerfil: 'https://foto.png' });
      const clone = original.clone({ nome: 'Novo Nome' });

      expect(clone.fotoPerfil).toBe('https://foto.png');
    });
  });

  describe('múltiplos clones a partir do mesmo original', () => {
    it('cada clone deve ser independente', () => {
      const original = makeUser();
      const cloneA = original.clone({ email: 'a@teste.com' });
      const cloneB = original.clone({ email: 'b@teste.com' });

      expect(cloneA.email).toBe('a@teste.com');
      expect(cloneB.email).toBe('b@teste.com');
      expect(original.email).toBe('original@teste.com');
    });
  });
});
