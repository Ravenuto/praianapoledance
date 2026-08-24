# Melhorias no painel de edição

## Objetivo
Tornar a inserção de imagens e a edição de textos mais práticas no painel administrativo do site Praiana.

## O que será feito

### 1. Redimensionar/cortar imagens antes de salvar
- Ao escolher uma imagem no computador, abrir um modal de corte antes do upload.
- Permitir arrastar e ajustar a área visível da imagem.
- Fazer o upload já com o tamanho e corte escolhidos.

### 2. Enter confirma a edição de texto
- Campos de uma linha: Enter salva e fecha o campo (mantém comportamento atual).
- Campos de várias linhas: Enter cria nova linha; **Shift+Enter** salva e fecha o campo.
- Escape continua cancelando a edição.

## Arquivos envolvidos
- `src/lib/site-edit.tsx` — ajuste no comportamento do Enter nos campos editáveis.
- `src/routes/_authenticated/admin.tsx` — modal de crop e integração com o fluxo de upload de imagens.

## Biblioteca sugerida
- `react-image-crop` (leve, baseada em Canvas) ou solução nativa com Canvas para evitar dependências pesadas.
