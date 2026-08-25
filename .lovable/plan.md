# Planos mais compactos (carrossel deslizante)

A seção "Planos & Valores" fica bem menor no celular: em vez de três cartões altos empilhados, os planos viram um carrossel que se desliza para o lado, com os benefícios comuns listados uma única vez embaixo.

## Como vai ficar

- **Cabeçalho** igual ao de hoje (mesma fonte serif itálica, mesmas cores), só um pouco mais enxuto, com a legenda "Arraste para o lado e comparar".
- **Cartões dos planos** lado a lado, cada um com largura fixa (~260px) e altura bem menor: nome do plano, preço, valor por aula e o botão. Deslizam com encaixe suave (snap) e indicadores de página embaixo.
- **Plano em destaque** (8 aulas) mantém a borda dourada e o selo "Mais popular".
- **Cartão "Outros"** no fim do carrossel reunindo Aula particular (R$ 120) e Aula experimental (R$ 30) em duas linhas.
- **Benefícios comuns** ("Todas as modalidades", "Todos os níveis", "Acesso ao app do estúdio") saem de dentro de cada cartão e aparecem uma vez só, em linha, abaixo do carrossel.
- **No desktop** nada de carrossel: os planos continuam em grade de 3 colunas, só com espaçamentos e tamanhos um pouco reduzidos para não ficarem tão grandes.

Nenhum plano, preço ou texto é alterado — apenas a apresentação. As cores, fontes e o modo claro/escuro continuam iguais.

## O que continua funcionando

- Todos os textos e preços seguem editáveis no painel de administração, exatamente como hoje.
- Os botões continuam levando para o WhatsApp.

## Detalhes técnicos

- Alteração restrita ao componente `Valores` em `src/components/site/PraianaSite.tsx`.
- Mobile: contêiner `flex overflow-x-auto snap-x snap-mandatory` com cartões `flex-shrink-0 w-[260px]`; a partir de `md:` volta para `grid md:grid-cols-3` sem overflow.
- Padding da seção reduzido (`py-24` → `py-16 md:py-24`), cartões com `p-8` → `p-6`, preço `text-5xl` → `text-4xl`, raio `rounded-[36px]` → `rounded-[2rem]`.
- Lista de benefícios por plano deixa de ser renderizada dentro do cartão no mobile; passa a ser um bloco único de chips abaixo, derivado dos benefícios do plano em destaque. Os campos `plans.N.benefits` seguem existindo e editáveis (renderizados na grade do desktop e no bloco compartilhado).
- Extras (`extras`) ganham um cartão próprio no fim do carrossel no mobile e mantêm a grade 2x1 atual no desktop.
- Regra utilitária `.no-scrollbar` adicionada em `src/styles.css`.
