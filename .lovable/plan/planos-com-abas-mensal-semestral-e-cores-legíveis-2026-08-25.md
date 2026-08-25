# Planos com abas Mensal/Semestral e cores legíveis

Duas correções na seção "Planos & Valores", mantendo o tamanho atual dos cartões (que você aprovou).

## Abas em vez de arrastar

- No celular, dois botões no topo: **Mensal** e **Semestral**. O ativo fica em azul cheio, o outro em contorno.
- Ao tocar, aparecem os 3 planos daquele grupo em grade de 2 colunas, sem arrastar nada.
- Some a legenda "Arraste para o lado e compare".
- No computador continua tudo em grade (os 6 planos), sem abas.

## Cor dos semestrais

- Cartão semestral passa a ter **fundo branco** (igual aos mensais), com **borda azul** um pouco mais marcada e etiqueta "Semestral" em azul.
- Isso resolve o modo escuro: hoje o fundo é azul transparente e fica apagado sobre o fundo escuro; com fundo branco sólido o texto fica sempre legível.
- Botão dos semestrais segue em contorno azul; mensais com botão azul sólido. O plano de 8 aulas continua destacado em dourado como "Mais popular".

## Detalhes técnicos

- `src/components/site/PraianaSite.tsx`, componente `Valores`: estado local `aba` ("Mensal" | "Semestral") usado só abaixo de `md`; lista filtrada por `tag` no mobile e completa em `md:`. Container troca de `flex overflow-x-auto snap-x` para `grid grid-cols-2 md:grid-cols-3`.
- Cartão semestral: `bg-white ring-1 ring-ocean/30` no lugar de `bg-horizon/10 ring-horizon/30`; mantém `theme-light-locked`.
- Abas usam tokens existentes (`bg-ocean`, `text-sand`, `border-ocean`, `text-ocean`) — nenhuma cor nova.
- Nenhuma mudança em textos, preços, dados ou no painel de administração.
