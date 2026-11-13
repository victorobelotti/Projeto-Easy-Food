# ADR-004 — Reutilização do serviço de imagens para perfil e cardápio

- **Status:** Aceita
- **Data:** 12/11/2026

## Contexto
A EasyFood precisa permitir que usuários autenticados adicionem uma foto ao próprio perfil e que pratos do cardápio recebam imagens. As imagens devem ser validadas, otimizadas e armazenadas, e seus caminhos persistidos no PostgreSQL.

## Alternativas consideradas
1. Repetir a lógica de Multer e Sharp dentro dos módulos de autenticação e pratos.
2. Criar um serviço compartilhado de processamento de imagens.
3. Criar um serviço externo ou utilizar Serverless/FaaS.

## Decisão
Reutilizar `upload.middleware.js` para receber arquivos e `image.service.js` para otimizar e armazenar imagens. O serviço compartilhado recebe um destino controlado (`users` ou `dishes`), redimensiona, converte para WebP e devolve o caminho público. Os módulos de autenticação e pratos persistem esse caminho em seus registros.

## Justificativa
A solução mantém o monólito modular, evita duplicação e atende ao volume e ao contexto acadêmico atuais. Multer limita o tamanho a 5 MB e aceita JPEG, PNG e WebP. Sharp valida e processa o conteúdo real do arquivo.

## Consequências
**Vantagens:** menor duplicação, manutenção centralizada, controllers focados no HTTP, services focados nas regras e persistência, autenticação vinculada ao usuário do JWT.

**Limitações:** armazenamento local exige persistência do diretório `uploads`; múltiplas instâncias podem exigir object storage; o processamento consome CPU e memória da API.
