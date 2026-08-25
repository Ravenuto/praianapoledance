# Deixar todos os números iguais ao "12 aulas"

## O que está acontecendo

O nome do plano ("12 aulas") usa a fonte serifada em **itálico** e negrito. Os preços, valores dos extras e horários da grade usam a mesma fonte, mas na versão **reta (não itálica)**. Na Cormorant Garamond, o algarismo "1" reto é só uma haste fininha — por isso parece um "i". O "1" itálico tem a base e o serifa que você achou bonito.

## Ajuste

Aplicar o mesmo estilo do nome do plano (serifada + itálico + negrito) a **todos** os números do site, sem exceção:

- Preços dos planos (mensal e semestral)
- Preços dos extras: aula avulsa, particular e experimental
- Horários da grade semanal
- Seção de contato: telefone/WhatsApp, número do endereço, CEP
- Rodapé: ano do copyright e qualquer número exibido
- Números em textos e cartões (quantidade de aulas, níveis, etc.)

Assim todos os algarismos ficam com o mesmo desenho do "12" que você gostou.

## Detalhes técnicos

Em `src/components/site/PraianaSite.tsx`, aplicar `font-serif italic` (com peso adequado) a todos os elementos que exibem dígitos — preços, horários, cartões de contato, endereço e rodapé. Para textos mistos (ex.: "Rua X, 123"), envolver apenas os números num `<span>` estilizado, ou usar um pequeno helper que formata a string destacando os dígitos. Nenhuma mudança de conteúdo, cores ou layout.

