# ADR-002 — Persistência com PostgreSQL e Prisma

- **Status:** Aceita
- **Contexto:** Dados de restaurantes em memória eram perdidos a cada reinicialização.
- **Decisão:** Usar PostgreSQL para persistência e Prisma como camada de acesso e migrações.
- **Alternativas:** SQLite, MySQL e armazenamento em arquivo.
- **Justificativa:** Banco relacional, integridade referencial e evolução de modelos Restaurant, User e Dish.
- **Benefícios:** Persistência, relações 1:N, consultas e migrações versionáveis.
- **Trade-offs:** Exige banco operacional, gestão de credenciais, backups e migrations.
- **Reavaliação:** Caso requisitos de escala, infraestrutura ou operação mudem.
