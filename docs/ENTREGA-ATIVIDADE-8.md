# Atividade 8 — Evoluindo a EasyFood

## Parte 1 — Correção do cadastro de pratos
O cadastro foi alinhado à versão atual do repositório disponibilizado pelo professor, incluindo a validação de categoria e a associação do restaurante ao usuário proprietário. O Controller encaminha ao Service o ID do usuário autenticado. O Service valida nome, categoria, descrição, preço e identificadores, verifica se o restaurante existe e confirma se pertence ao usuário antes de cadastrar o prato. A regra de propriedade impede que outro usuário autenticado altere o cardápio de um restaurante que não é seu.

## Parte 2 — Upload da imagem do perfil
Foi adicionado o campo opcional `imageUrl` ao modelo `User`. A rota `POST /auth/me/image` exige JWT e recebe o arquivo com Multer. O ID usado para atualizar o perfil vem de `req.user.id`, definido pelo middleware de autenticação, e não de um identificador enviado livremente. A imagem é otimizada com Sharp, armazenada em `uploads/users` e seu caminho é salvo no PostgreSQL. O endpoint `GET /auth/me` retorna o caminho.

## Parte 3 — Upload de imagens dos pratos
A rota `POST /dishes/:dishId/image` exige JWT. O Service verifica se o prato existe e se pertence ao usuário autenticado, processa a imagem e atualiza `Dish.imageUrl`. A consulta do cardápio retorna a imagem associada ao prato.

## Parte 4 — Serviço compartilhado
`upload.middleware.js` centraliza o recebimento e a validação inicial. `image.service.js` concentra o processamento com Sharp e é reutilizado pelos módulos de autenticação e pratos. O serviço recebe um destino controlado (`users` ou `dishes`) para armazenar a imagem na pasta correta.

## Parte 5 — Tratamento de erros
A API trata JWT ausente/inválido com 401, recurso inexistente com 404, falta de propriedade com 403, arquivo inválido com 400 e arquivo acima de 5 MB com 413. Sharp valida o conteúdo real da imagem. Se o processamento ou a gravação falhar, o caminho não é atualizado e o arquivo recém-gerado é removido.

## Parte 6 — Reflexão arquitetural
- O serviço compartilhado evita duplicação e centraliza a lógica de imagens.
- O Controller coordena HTTP; o Service concentra regras de negócio e acesso ao banco.
- As rotas declaram caminhos e middlewares, sem processar arquivos ou acessar o Prisma diretamente.
- O middleware JWT identifica o usuário autenticado e protege a alteração do perfil.
- Falhas no processamento retornam erro adequado e não deixam referência inválida no banco.
- A arquitetura modular permite incluir novos módulos consumidores do serviço sem duplicar o processamento.

## Observação
O código e as verificações estáticas foram preparados no pacote. A execução da migration e os testes integrados dependem de PostgreSQL acessível e das credenciais locais no arquivo `.env`.
