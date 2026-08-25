# Foto de "O Pole Dance" inteira no celular

## O que acontece hoje
No celular, a foto da seção é forçada a um formato quase quadrado e o recorte corta os pés e a mão esticada da aluna.

## O que muda
No celular, a foto passa a aparecer **inteira**, na proporção original da imagem — nada de recorte. A silhueta completa fica visível e a seção fica um pouco mais compacta.

No tablet e no computador nada muda: continua a faixa panorâmica larga como está hoje.

## Detalhes técnicos
- `src/components/site/PraianaSite.tsx`, seção `Movimento`:
  - No container da imagem, remover a proporção fixa no mobile (`aspect-[4/3]`) e deixar a altura automática abaixo de `sm`; manter `sm:aspect-[21/9]` e `md:aspect-[3/1]`.
  - Na `img`: altura automática e `object-contain` no mobile, voltando a `sm:h-full sm:object-cover` para preservar o comportamento atual em telas maiores.
  - Manter o gradiente sobreposto, os cantos arredondados, o anel e o zoom no hover.
