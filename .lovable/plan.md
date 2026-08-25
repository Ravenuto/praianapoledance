# Escolha da fonte dos números

Hoje os algarismos usam EB Garamond itálico, mas em pesos 500/700 — por isso aparecem mais grossos/negritos que os textos ao redor, e destoam das fontes escritas do site.

## O que vou fazer

1. **Página de prévia temporária** (`/fontes-numeros`, acessível só por link direto, sem entrar no menu) com uma lista de opções de fonte só para números. Cada opção mostra:
   - a mesma amostra em números grandes: `12 · 24 · 48 · 490 · 120 · 30 · 19:30 · 2026`
   - um cartão de plano simulado (nome + preço) para ver o número junto do texto real do site
   - o nome da fonte e o peso usado

2. **Opções apresentadas** (todas itálicas, com numerais alinhados — mesma altura e mesma linha de base, sem "i" nem números que descem):
   - A: EB Garamond itálico, peso leve (400) — igual ao atual, só mais fino
   - B: Cormorant Garamond itálico 400 — mais delicado, combina com os títulos
   - C: Playfair Display itálico 400 — serifa com mais contraste, elegante
   - D: Lora itálico 400 — serifa mais neutra e legível
   - E: Fonte do próprio texto (sem fonte especial para números) — números herdam a fonte de cada trecho

3. Você escolhe uma; eu aplico em todo o site (preços, extras, horários, contato, rodapé) e removo a página de prévia e as fontes não usadas.

## Detalhes técnicos

- As prévias usam `@font-face` com `unicode-range: U+0030-0039` (mesma técnica já usada em `PraianaNums`), com `font-variant-numeric: lining-nums`.
- Peso reduzido para 400 em todos os casos, e nos trechos em negrito o algarismo passa a usar a variante 500 no máximo — nunca 700 — para não ficar mais grosso que a letra.
- Fontes candidatas via `@fontsource`; instalo só as necessárias para a prévia e removo as descartadas depois.
