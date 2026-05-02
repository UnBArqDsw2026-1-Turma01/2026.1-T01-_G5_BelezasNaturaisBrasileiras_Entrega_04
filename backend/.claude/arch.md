# Estrutura Clean Architecture
1. **Domain**: Entidades puras e interfaces de repositórios. Zero dependências.
2. **Application**: Use Cases. Orquestra a lógica usando as interfaces do Domain.
3. **Infrastructure**: Implementações (Prisma, Mailer). Onde o framework e o DB vivem.
4. **Interface**: Controllers NestJS e DTOs. Portão de entrada dos dados.