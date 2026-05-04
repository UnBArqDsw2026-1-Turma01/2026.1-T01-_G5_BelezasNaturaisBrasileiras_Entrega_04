import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { UserMapper } from '../mappers/UserMapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const raw = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        fotoPerfil: user.fotoPerfil,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return UserMapper.toDomain(raw);
  }

  async findByEmail(email: string): Promise<User | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const raw = await this.prisma.user.findUnique({
      where: { email },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return raw ? UserMapper.toDomain(raw) : null;
  }
}
