# Deixar todos os números iguais ao "12 aulas"

## O que está acontecendo

O nome do plano ("12 aulas") usa a fonte serifada em **itálico** e negrito. Os preços, valores dos extras e horários da grade usam a mesma fonte, mas na versão **reta (não itálica)**. Na Cormorant Garamond, o algarismo "1" reto é só uma haste fininha — por isso parece um "i". O "1" itálico tem a base e o serifa que você achou bonito.

## Ajuste

Aplicar o mesmo estilo do nome do plano (serifada + itálico + negrito) a todos os números do site:

- Preços dos planos (mensal e semestral)
- Preços dos extras: aula avulsa, particular e experimental
- Horários da grade semanal
- Qualquer número solto restante (quantidade de aulas, valores em cartões)

Assim todos os algarismos ficam com o mesmo desenho do "12" que você gostou.

## Detalhes técnicos

Em `src/components/site/PraianaSite.tsx`, adicionar `italic` (e ajustar peso quando necessário) nos spans que hoje têm apenas `font-serif` para valores numéricos — linhas dos preços (`text-[28px] ... font-bold`), horários da grade (`font-serif font-semibold text-sm`) e os cartões de extras. Nenhuma mudança de conteúdo, cores ou layout.
