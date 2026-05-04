import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { UserMapper } from '../mappers/UserMapper';
import { Prisma } from '@src/generated/prisma';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    try {
      const raw = await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          role: user.role,
          fotoPerfil: user.fotoPerfil,
        },
      });

      return UserMapper.toDomain(raw);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Failed to save user: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const raw = await this.prisma.user.findUnique({
        where: { email },
      });

      return raw ? UserMapper.toDomain(raw) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Failed to find user by email: ${error.message}`,
        );
      }
      throw error;
    }
  }
}
