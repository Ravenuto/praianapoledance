# Ajustar os cartões de planos

Os cartões ficaram com fundo semitransparente e degradê, o que deixou o visual "lavado" e diferente da prévia aprovada. A correção é deixar todos os cartões com fundo branco sólido e limpo, com o destaque vindo só da borda e do texto.

## O que muda

- **Fundo sólido**: todos os cartões passam a ter branco 100% (sem transparência, sem desfoque, sem degradê dourado por baixo).
- **Cartão "Mais popular"**: destaque apenas pela borda dourada mais forte, etiqueta dourada no topo e sombra suave — sem fundo colorido.
- **Semestral**: branco sólido com borda azul e botão de contorno azul, como estava na prévia.
- **Extras (aula avulsa, particular, experimental)**: também ficam brancos sólidos, sem transparência.
- **Texto**: nome do plano em serif itálico negrito, descrição menor e discreta, preço em negrito — exatamente como na prévia aprovada.
- **Legibilidade no escuro**: mantém o bloco travado em tema claro, então o contraste fica igual nos dois modos.

## Detalhes técnicos

Em `src/components/site/PraianaSite.tsx`, no componente `Valores`:
- trocar as classes `bg-white/85`, `bg-gradient-to-b from-gold/...` e `backdrop-blur` por `bg-white` sólido nos três estados de cartão (destaque, semestral, mensal);
- ajustar o destaque para `ring-2 ring-gold` + sombra dourada suave, sem fundo em degradê;
- mesma limpeza nos cartões de `extras` (`bg-white/70 backdrop-blur` → `bg-white`).

Nenhuma mudança em dados, planos ou painel de administração.
