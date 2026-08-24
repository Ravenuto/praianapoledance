# Logo sem borda

A imagem da logo em si já está correta: o círculo ocupa a moldura inteira, sem margem sobrando. A "borda" que aparece vem dos enfeites de CSS aplicados em volta dela — um anel branco, um fundo areia/branco e uma sombra que criam a impressão de moldura grossa, principalmente no modo escuro.

## O que muda

1. **Logo flutuante da home** — remover o anel branco (`ring-2`), o fundo areia/branco e o preenchimento atrás. A logo passa a aparecer inteira, direto sobre a foto do studio, mantendo apenas a animação de flutuação e uma sombra suave por baixo (sem contorno).
2. **Logo do cabeçalho** — remover o fundo branco e o contorno que aparecem no modo escuro. Fica só a imagem redonda.
3. **Logo do rodapé** — remover o fundo areia/branco atrás; exibir a logo completa.
4. **Ícone do site (favicon)** — gerar o ícone a partir da mesma logo, sem borda, redimensionado corretamente para 64x64 (hoje é uma cópia do arquivo de 512px em tamanho cheio) e apontado no cabeçalho do site.

Em todos os pontos a imagem passa a ser exibida por inteiro (sem recorte), então nada da ilustração fica cortado.

## Detalhes técnicos

- `src/components/site/PraianaSite.tsx`: remover `bg-sand`, `dark:bg-white`, `ring-2 ring-white/70` e `dark:shadow-[0_0_0_2px_white]` dos três invólucros da logo (navbar linha ~104, hero linha ~255, rodapé linha ~684) e trocar `object-cover` por `object-contain` no componente `Logo`.
- `public/favicon.png`: regerar a partir de `src/assets/logo-praiana.png` com `magick ... -resize 64x64 -background none -gravity center -extent 64x64`; o `<link rel="icon">` em `src/routes/__root.tsx` já aponta para esse arquivo.
