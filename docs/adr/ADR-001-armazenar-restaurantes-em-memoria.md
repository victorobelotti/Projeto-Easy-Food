# ADR-001 — Armazenar restaurantes em memória

- **Status:** Substituída pelo ADR-002
- **Contexto:** A versão inicial da EasyFood precisava demonstrar GET e POST de restaurantes sem infraestrutura adicional.
- **Decisão:** Armazenar restaurantes em um array JavaScript durante a prototipação.
- **Alternativas:** Banco relacional, arquivo JSON ou armazenamento em memória.
- **Justificativa:** Configuração mínima e aprendizado das rotas HTTP.
- **Consequência positiva:** Implementação simples e rápida.
- **Trade-off:** Registros desaparecem ao reiniciar a aplicação e não são compartilhados entre processos.
- **Revisão:** Com a necessidade de persistência, substituir por PostgreSQL e Prisma (ADR-002).
