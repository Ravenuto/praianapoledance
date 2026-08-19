# Por que as imagens sumiram

## O que aconteceu

O conteúdo do site é salvo no banco (tabela `site_content`). Hoje ele guarda para a logo e para a foto do studio os caminhos:

```text
/src/assets/logo-praiana.png
/src/assets/studio.png
```

Esses caminhos só funcionam no ambiente de desenvolvimento. No site publicado/preview compilado, as imagens ficam em endereços diferentes (com nome versionado), então esses dois caminhos não existem mais e o navegador não mostra nada.

Ou seja: as imagens não foram apagadas — o banco está apontando para um endereço que não existe no site publicado.

## Correção

1. **Ignorar caminhos inválidos**: ao carregar o conteúdo, se a imagem gravada começar com `/src/assets/`, usar automaticamente a imagem padrão embutida no site (logo e foto atuais). Isso já resolve a exibição imediatamente, sem precisar salvar nada.
2. **Impedir que volte a acontecer**: nunca gravar os caminhos das imagens padrão no banco. Ao salvar pelo painel, se a imagem for a padrão, guardar um marcador (`default`) em vez do caminho do arquivo.
3. **Imagens enviadas por você continuam iguais**: as trocadas pelo painel são enviadas para o armazenamento do backend e têm link estável — essas não são afetadas.

## Detalhes técnicos

- `src/lib/site-content.ts`: em `mergeContent`, sanear `images.hero` / `images.logo` — valores vazios, `"default"` ou que comecem com `/src/assets/` passam a usar os imports `studioImg` / `logoImg`. Em `saveSiteContent`, converter de volta para `"default"` quando o valor for igual ao import padrão.
- Nenhuma alteração de banco é necessária; o dado antigo passa a ser tratado como padrão.
- Verificação: abrir a home e o painel `/admin` e confirmar que logo (header, hero, rodapé) e foto do studio aparecem, e que trocar uma imagem pelo painel e salvar continua funcionando.
