# Docker Setup — Banco de Dados Local

## Serviços

| Serviço   | Imagem              | Porta local | Descrição                        |
|-----------|---------------------|-------------|----------------------------------|
| postgres  | postgres:15-alpine  | 5432        | Banco de dados PostgreSQL        |
| pgadmin   | dpage/pgadmin4      | 5050        | Interface web de gerenciamento   |

## Volumes persistentes

| Volume              | Descrição                        |
|---------------------|----------------------------------|
| `bnb_postgres_data` | Dados do PostgreSQL              |
| `bnb_pgadmin_data`  | Configurações salvas do pgAdmin  |

Os dados **sobrevivem** a `docker-compose down`. Só são apagados com `docker-compose down -v`.

## Comandos

```bash
# Subir em background
docker-compose up -d

# Ver status dos containers
docker-compose ps

# Ver logs (todos os serviços)
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f postgres

# Parar (mantém dados)
docker-compose down

# Parar e apagar volumes (RESET TOTAL — irreversível)
docker-compose down -v
```

## Conectar ao banco pelo pgAdmin

1. Acesse `http://localhost:5050`
2. Login: `PGADMIN_DEFAULT_EMAIL` e `PGADMIN_DEFAULT_PASSWORD` do `.env.local`
3. Registrar servidor:
   - **Host**: `postgres` (nome do serviço no docker-compose, NÃO `localhost`)
   - **Port**: `5432`
   - **Database**: valor de `POSTGRES_DB`
   - **Username**: valor de `POSTGRES_USER`
   - **Password**: valor de `POSTGRES_PASSWORD`

> **Atenção:** Use `postgres` como host dentro da rede Docker. Para conectar de fora (ex: Prisma local), use `localhost`.

## Troubleshooting

**Porta 5432 já em uso**
```bash
# Verificar o processo usando a porta
lsof -i :5432
# Parar o PostgreSQL local (macOS)
brew services stop postgresql
```

**Porta 5050 já em uso**
Altere a porta no `docker-compose.yml`: `"5051:80"` e acesse `http://localhost:5051`.

**Container não sobe / health check falha**
```bash
docker-compose logs postgres
```
Verifique se o `.env.local` existe e as variáveis estão corretas.

**Apagar e recriar tudo do zero**
```bash
docker-compose down -v
docker-compose up -d
```
