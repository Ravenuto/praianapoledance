# Remover linha divisória da seção "O movimento"

## O que vamos fazer
Remover a linha horizontal (1 px) que aparece logo abaixo dos textos da nova seção "O movimento", pois ela cria uma quebra visual indesejada na página.

## Arquivo envolvido
- `src/components/site/PraianaSite.tsx` — linha do divisor `<div className="mt-14 h-px w-full bg-gradient-to-r ..." />` dentro do componente `Movimento()`.

## Mudança técnica
Apagar apenas esse elemento `div` divisor, mantendo o espaçamento e todo o restante da seção intacto.
