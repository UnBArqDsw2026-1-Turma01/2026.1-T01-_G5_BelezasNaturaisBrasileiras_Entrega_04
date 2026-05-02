# Estilo de Código
- **Dependency Inversion**: Use `abstract class` no domain e `providers` no NestJS.
- **Mappers**: Toda entidade de banco deve ser convertida para entidade de domínio na camada de Infra.
- **Validation**: Use `class-validator` nos DTOs da camada de Interface.