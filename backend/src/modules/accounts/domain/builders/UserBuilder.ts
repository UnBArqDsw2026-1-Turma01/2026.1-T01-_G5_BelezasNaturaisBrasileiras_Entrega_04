import { User, UserRole } from '../entities/User';

export class UserBuilder {
  private id!: string;
  private email!: string;
  private nome!: string;
  private role: UserRole = UserRole.COMMON_USER;
  private fotoPerfil: string | null = null;
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  withId(id: string): UserBuilder {
    this.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  withNome(nome: string): UserBuilder {
    this.nome = nome;
    return this;
  }

  withRole(role: UserRole): UserBuilder {
    this.role = role;
    return this;
  }

  withFotoPerfil(fotoPerfil: string | null): UserBuilder {
    this.fotoPerfil = fotoPerfil;
    return this;
  }

  withCreatedAt(createdAt: Date): UserBuilder {
    this.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): UserBuilder {
    this.updatedAt = updatedAt;
    return this;
  }

  build(): User {
    if (!this.id || !this.email || !this.nome) {
      throw new Error('Campos obrigatórios ausentes no UserBuilder');
    }
    return new User(
      this.id,
      this.email,
      this.nome,
      this.role,
      this.fotoPerfil,
      this.createdAt,
      this.updatedAt,
    );
  }
}
