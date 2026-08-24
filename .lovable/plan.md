# Mapa com o endereço certo

Hoje o mapa no fim da página não usa o link que você cadastra: ele é montado automaticamente a partir do texto do endereço ("Endereço"), por isso cai num ponto aproximado. O campo "Link do mapa" só é usado no clique do cartão de endereço.

## O que muda

1. **Novo campo no painel**: "Link do mapa (incorporado)" no bloco de Contato, junto de Endereço e Link do mapa.
2. **O mapa passa a seguir esse link**: você cola o link do Google Maps do seu ponto exato (o link de compartilhamento, o link de incorporar, ou até coordenadas) e o mapa exibido no site mostra exatamente esse local.
3. **Se o campo ficar vazio**, o mapa continua funcionando como hoje (busca pelo texto do endereço), então nada quebra.
4. Texto de ajuda curto no painel explicando onde pegar o link no Google Maps (Compartilhar > Incorporar um mapa, ou apenas copiar o link).

## Detalhes técnicos

- `src/lib/site-content.ts`: novo campo `studio.mapEmbedUrl` (string, padrão vazio) em `SiteContent` e `DEFAULT_CONTENT`; o merge já cobre campos novos.
- `src/components/site/PraianaSite.tsx`: helper que normaliza o valor — se for `<iframe ...>` colado, extrai o `src`; se for URL `google.com/maps/embed`, usa direto; se for link comum do Maps ou coordenadas, converte para `https://www.google.com/maps?q=...&output=embed`; senão, cai no comportamento atual com `addressLabel`.
- `src/routes/_authenticated/admin.tsx`: novo `Field` para `studio.mapEmbedUrl` na aba Contato.
- Sem mudanças no banco de dados — o conteúdo já é salvo como JSON.
