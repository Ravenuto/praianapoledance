# Ajuste redondo para a logo no painel

## O que muda

Hoje o modal "Ajustar imagem" sempre mostra a área de corte em retângulo/quadrado. Como a logo aparece redonda no site, o ajuste será feito dentro de um círculo:

- **Logo (imagem redonda)**: a área de ajuste aparece como um círculo. Você arrasta e aproxima e vê exatamente o que vai ficar dentro da bolinha, com a parte de fora escurecida.
- **Hero e "O movimento" (imagens quadradas/retangulares)**: continuam como estão, com ajuste dentro do retângulo.

O recorte salvo continua quadrado por baixo (para não perder qualidade), mas centralizado exatamente no que você enquadrou no círculo — o site já exibe a logo em máscara redonda.

## Detalhes técnicos

- `src/routes/_authenticated/admin.tsx`:
  - adicionar helper `isRoundImage(which)` (true para `logo`);
  - no `CropModal`, quando redondo: manter `aspectRatio: 1`, aplicar overlay com máscara circular (anel + escurecimento fora do círculo) e `rounded-full` na área visível;
  - textos do modal indicando "Ajuste dentro do círculo" quando redondo;
  - lógica de canvas/`handleConfirm` permanece igual (quadrado 1:1).
- Nenhuma mudança no site público nem no banco.
