# EasyFood — Atividade 8

API acadêmica construída com Node.js, Express, Prisma e PostgreSQL. Inclui autenticação JWT, cadastro e consulta de restaurantes e pratos, upload de imagem de perfil e upload de imagem dos pratos.

## Preparação
1. Instale Node.js LTS e PostgreSQL.
2. Execute `npm install`.
3. Copie `.env.example` para `.env`, informe a senha correta do PostgreSQL e gere um `JWT_SECRET` aleatório com pelo menos 32 caracteres.
4. Execute `npx prisma generate`.
5. Aplique a migration com `npx prisma migrate dev --name atividade_8_uploads`.
6. Inicie com `npm start` e abra `http://localhost:3000`.

> O arquivo `.env` não acompanha este pacote. A migration é aditiva e usa colunas nullable para preservar registros existentes. Se o banco tiver histórico de migrations diferente, confira o estado do banco e da pasta `prisma/migrations` antes de aplicar.

## Endpoints
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Não | Cadastra usuário |
| POST | `/auth/login` | Não | Retorna JWT |
| GET | `/auth/me` | JWT | Consulta usuário autenticado e `imageUrl` |
| POST | `/auth/me/image` | JWT | Upload de foto de perfil (`image`) |
| GET | `/restaurants` | Não | Lista restaurantes |
| POST | `/restaurants` | JWT | Cadastra restaurante vinculado ao usuário |
| POST | `/restaurants/:restaurantId/dishes` | JWT | Cadastra prato do restaurante |
| GET | `/restaurants/:restaurantId/dishes` | Não | Lista cardápio |
| GET | `/dishes/:dishId` | Não | Consulta prato |
| POST | `/dishes/:dishId/image` | JWT | Upload de imagem do prato (`image`) |
| PUT | `/dishes/:dishId` | JWT | Atualiza prato do proprietário |
| DELETE | `/dishes/:dishId` | JWT | Exclui prato do proprietário |
| GET | `/uploads/users/:arquivo.webp` | Não | Acessa imagem de perfil |
| GET | `/uploads/dishes/:arquivo.webp` | Não | Acessa imagem de prato |

## Upload de imagens
- Campo multipart/form-data: `image`.
- Formatos aceitos: JPEG, PNG e WebP.
- Tamanho máximo: 5 MB.
- Sharp corrige orientação, redimensiona para caber em 800 × 800 px e converte para WebP (qualidade 80).
- Os arquivos são salvos em `uploads/users` ou `uploads/dishes`; o caminho é persistido no PostgreSQL.

Exemplos de requisição:
```http
POST /auth/me/image
Authorization: Bearer SEU_TOKEN
Content-Type: multipart/form-data
```
```http
POST /dishes/1/image
Authorization: Bearer SEU_TOKEN
Content-Type: multipart/form-data
```

## Cadastro de prato
A versão atual do repositório do professor exige nome, categoria, descrição e preço. Exemplo:
```json
{
  "name": "Pizza Margherita",
  "category": "Pizza",
  "description": "Molho de tomate, queijo e manjericão",
  "price": 49.90
}
```
O Service valida os dados, verifica a existência do restaurante e confere se ele pertence ao usuário autenticado antes de cadastrar o prato.

## Tratamento de erros
- `401`: JWT ausente, inválido ou expirado.
- `400`: arquivo ausente, formato não permitido ou imagem inválida.
- `403`: usuário autenticado não é proprietário do restaurante/prato.
- `404`: usuário, restaurante ou prato inexistente.
- `413`: arquivo maior que 5 MB.

Se a persistência da imagem falhar depois do processamento, o arquivo recém-criado é removido. A falha do upload não exclui o usuário ou o prato.

## Arquitetura
- **Routes:** definem endpoints e middlewares.
- **Middleware JWT:** identifica o usuário pelo token.
- **Upload middleware:** recebe arquivos em memória e valida tipo/tamanho.
- **Controller:** coordena requisição e resposta HTTP.
- **Service:** concentra regras de negócio e persistência via Prisma.
- **Image service:** concentra processamento com Sharp e armazenamento compartilhado.

## Testes
`npm test` executa verificações estáticas de estrutura, rotas e regras de segurança. Testes de integração com PostgreSQL e upload real dependem do banco e das credenciais locais.

### Restaurantes antigos sem proprietário
A migration mantém `Restaurant.ownerId` nullable para não apagar nem bloquear registros já existentes. Esses registros antigos não podem ter o cardápio alterado até que um administrador associe cada restaurante a uma conta existente. Exemplo (substitua o e-mail e o ID):
```sql
UPDATE "Restaurant"
SET "ownerId" = (SELECT id FROM "User" WHERE email = 'dono@exemplo.com')
WHERE id = 1;
```
Novos restaurantes cadastrados pela API já recebem automaticamente o ID do usuário autenticado.
