# Planos mais compactos + cor própria para os semestrais

Ajuste só da seção "Planos & Valores" (mobile e desktop). Nada de texto, preço ou benefício muda — só tamanho e cor.

## O que muda visualmente

**Textos menores nos cartões**
- Nome do plano menor e mais discreto.
- Descrição em texto pequeno, com menos espaço em volta.
- Valor continua sendo o destaque do cartão, mas um pouco menor que hoje.
- Botão mais baixo, com texto pequeno em maiúsculas.
- Resultado: cartões mais baixos e a seção inteira mais curta.

**Etiqueta Mensal / Semestral**
- No topo de cada cartão aparece uma etiqueta curta: "Mensal" ou "Semestral", no lugar do texto longo de "valor por aula" que aparece hoje.
- O valor por aula continua disponível, mas em letra miúda junto ao preço.

**Cor dos planos semestrais**
- Fundo azul bem claro e suave (azul horizonte com transparência), borda azul discreta, sem o azul cheio de hoje.
- Botão dos semestrais em contorno azul (fundo transparente), diferenciando dos mensais que seguem com botão azul sólido.
- O plano "8 aulas" continua como Mais Popular, com destaque em dourado.

**Extras e benefícios**
- Bloco de benefícios comuns e as três linhas de aulas extras seguem como estão, só com espaçamento um pouco menor.

## Detalhes técnicos

- `src/components/site/PraianaSite.tsx` — componente `Valores`: reduzir escalas tipográficas (nome, descrição, preço, botão), trocar o chip do topo pela etiqueta de periodicidade e aplicar variante de estilo para planos semestrais (`bg-horizon/10`, `ring-horizon/30`, botão outline).
- `src/lib/site-content.ts` — adicionar campo opcional `tag` no tipo `Plan` (valor "Mensal"/"Semestral"); quando ausente, deduzir pelo preço que começa com "6x". Normalizador atualizado.
- `src/routes/_authenticated/admin.tsx` — novo campo "Etiqueta (Mensal/Semestral)" no editor de planos, para você mudar depois.
- Banco: preencher `tag` nos 6 planos já salvos (3 mensais, 3 semestrais), sem alterar nome, preço ou descrição.
- Cores continuam vindo dos tokens existentes (ocean, horizon, gold, sand); nenhuma fonte ou paleta nova.
