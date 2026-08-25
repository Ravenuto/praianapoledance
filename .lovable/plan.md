# Planos mais compactos com carrossel

A seção "Planos & Valores" fica bem menor no celular: em vez de cartões altos empilhados, os planos viram um carrossel que desliza para o lado, com os benefícios comuns listados uma única vez embaixo. Tudo mantém a mesma fonte, cores e fluidez do resto do site — sem o fundo azul nos cartões semestrais.

## Como vai ficar

- **Cabeçalho** igual ao de hoje (serif itálica, azul), só mais enxuto, com a legenda "Arraste para o lado e comparar".
- **Cartões deslizantes** de largura fixa (~260px) e altura reduzida: nome do plano, preço, forma de pagamento e botão. Encaixe suave ao deslizar, com indicadores de página embaixo.
- **Mesmo visual para todos os cartões**: fundo branco translúcido com o mesmo anel azul suave e sombra leve já usados no site. Os semestrais se diferenciam apenas por uma etiqueta "Plano semestral" em azul, sem fundo colorido.
- **Plano em destaque** (8 aulas) mantém o cartão azul e o selo dourado "Mais popular", como já é hoje.
- **Benefícios comuns** ("Todas as modalidades", "Todos os níveis", "Acesso ao app do estúdio") saem de dentro de cada cartão e aparecem uma vez só, em linha, abaixo do carrossel.
- **No desktop** não há carrossel: os planos ficam em grade, com espaçamentos e tamanhos um pouco menores que hoje.

## Planos e valores

Mensais (mantidos como estão):

- 4 aulas — R$ 230/mês
- 8 aulas — R$ 370/mês (mais popular)
- 12 aulas — R$ 490/mês

Semestrais (novos):

- 24 aulas — 6x de R$ 210
- 48 aulas — 6x de R$ 340
- 72 aulas — 6x de R$ 480

Avulsos (bloco abaixo do carrossel):

- Aula experimental — R$ 30
- Aula avulsa — R$ 70
- Aula particular — R$ 120

## O que continua funcionando

- Todos os planos, preços e textos seguem editáveis no painel de administração, inclusive os semestrais e a nova aula avulsa.
- Os botões continuam levando para o WhatsApp.

## Detalhes técnicos

- `src/lib/site-content.ts`: adicionar os três planos semestrais ao array `plans` (com um campo opcional de etiqueta/`per` indicando "6x no cartão") e a "Aula avulsa — R$ 70" ao array `extras`. Migração no Supabase para atualizar `site_content` com os novos itens, preservando os textos já editados.
- `src/components/site/PraianaSite.tsx`, componente `Valores`: mobile usa `flex overflow-x-auto snap-x snap-mandatory` com cartões `flex-shrink-0 w-[260px]`; a partir de `md:` volta a `grid` sem overflow.
- Cartões usam os tokens existentes (`bg-white/80`, `ring-ocean/10`, `text-ocean`, `text-mist`, `font-serif`) — nenhuma cor nova, nenhum `bg-[#f0f7ff]`.
- Padding da seção `py-24` → `py-16 md:py-24`; cartões `p-8` → `p-6`; preço `text-5xl` → `text-4xl`; raio `rounded-[36px]` → `rounded-[2rem]`.
- Benefícios por plano deixam de ser renderizados dentro de cada cartão no mobile e passam a um bloco único de chips abaixo do carrossel; os campos `plans.N.benefits` continuam existindo e editáveis.
- Utilitário `.no-scrollbar` adicionado via `@utility` em `src/styles.css`.
- Animações de entrada (`reveal`) e hover mantidas para preservar a fluidez atual.
