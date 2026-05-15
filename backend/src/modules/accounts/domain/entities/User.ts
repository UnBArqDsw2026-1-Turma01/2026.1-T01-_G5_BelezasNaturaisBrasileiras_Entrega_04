import { IPrototype } from '../interfaces/IPrototype';

export enum UserRole {
  COMMON_USER = 'COMMON_USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export class User implements IPrototype<User> {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  fotoPerfil: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    nome: string,
    role: UserRole,
    fotoPerfil: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.email = email;
    this.nome = nome;
    this.role = role;
    this.fotoPerfil = fotoPerfil;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  clone(overrides?: Partial<User>): User {
    return new User(
      overrides?.id ?? this.id,
      overrides?.email ?? this.email,
      overrides?.nome ?? this.nome,
      overrides?.role ?? this.role,
      overrides?.fotoPerfil !== undefined
        ? overrides.fotoPerfil
        : this.fotoPerfil,
      overrides?.createdAt ?? this.createdAt,
      overrides?.updatedAt ?? this.updatedAt,
    );
  }
}
