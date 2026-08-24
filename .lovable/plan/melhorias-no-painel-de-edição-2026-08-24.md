# Melhorias no painel de edição

## Objetivo
Tornar a inserção de imagens e a formatação de textos mais práticas no painel administrativo do site Praiana.

## O que será feito

### 1. Redimensionar/cortar imagens antes de salvar
- Ao escolher uma imagem no computador, abrir um modal de corte antes do upload.
- Permitir arrastar e ajustar a área visível da imagem.
- Fazer o upload já com o tamanho e corte escolhidos.

### 2. Enter cria parágrafos com espaçamento
- Nos campos de texto longo (descrições, etc.), pressionar Enter insere uma quebra de parágrafo.
- O site renderiza esses parágrafos com espaçamento adequado entre eles.
- Shift+Enter pode ser usado para uma quebra de linha simples (sem novo parágrafo).
- Escape continua cancelando a edição.

## Arquivos envolvidos
- `src/lib/site-edit.tsx` — ajuste no campo de texto longo para preservar quebras de parágrafo.
- `src/components/site/PraianaSite.tsx` — renderização dos textos respeitando parágrafos e espaçamento.
- `src/routes/_authenticated/admin.tsx` — modal de crop e integração com o fluxo de upload de imagens.

## Biblioteca sugerida
- `react-image-crop` (leve, baseada em Canvas) ou solução nativa com Canvas para evitar dependências pesadas.
