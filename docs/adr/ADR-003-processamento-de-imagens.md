# ADR-003 — Processar imagens dentro do servidor EasyFood

- **Status:** Aceita
- **Contexto:** Pratos precisam de fotos, e imagens originais podem ser grandes. O projeto é acadêmico, com baixa demanda.
- **Decisão:** Receber multipart com Multer (limite 5 MB) e processar no próprio servidor Express, em memória, com Sharp. Redimensionar até 800 px e converter para WebP (qualidade 80), armazenando em uploads/dishes e registrando imageUrl no PostgreSQL.
- **Alternativas:** Armazenar sem processamento, processamento Serverless/FaaS, serviço separado ou fila de processamento.
- **Justificativa:** Simplicidade e reaproveitamento da infraestrutura atual. Não serão usados microsserviços nem filas.
- **Vantagens:** Menos infraestrutura, implantação local direta e código modular via image.service.js.
- **Trade-offs:** CPU e armazenamento local do servidor, limitações em escala horizontal e risco de perda dos arquivos em hospedagens efêmeras.
- **Falhas:** Upload inválido não exclui o prato já existente. Arquivos somente são salvos após validação e processamento.
- **Reavaliação:** Caso o volume cresça ou haja múltiplas instâncias, avaliar object storage e processamento assíncrono.
