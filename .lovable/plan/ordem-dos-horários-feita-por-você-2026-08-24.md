# Ordem dos horários feita por você

A ordenação automática está atrapalhando: ao adicionar um horário novo, a lista se reorganiza e parece que os outros mudaram. Vou tirar a ordenação automática e deixar você definir a ordem manualmente, arrastando.

## O que muda no painel (aba Horários)

- Cada horário ganha uma alça de arrastar (⠿) à esquerda. Você arrasta o horário para a posição que quiser dentro do dia.
- Setas ▲ / ▼ ao lado da alça, para reordenar com um toque — funciona bem no celular, onde arrastar é impreciso.
- "+ Horário" adiciona a nova aula **no fim da lista**, sem mexer nas outras.
- Mudar o horário de uma aula existente **não** reordena mais nada.
- Botão opcional por dia: "Ordenar por horário" — só reordena quando você pedir.

## No site

A grade passa a exibir exatamente a ordem que você definiu no painel (nada de reordenar sozinho).

## Detalhes técnicos

- `src/lib/site-content.ts`: `normalizeSchedule` deixa de aplicar `sortSlots` (mantém a ordem salva); `sortSlots` continua exportada para o botão manual.
- `src/routes/_authenticated/admin.tsx`: no bloco "Dias e horários", remover `sortSlots` dos handlers de time e de "+ Horário"; adicionar reordenação por drag (HTML5 `draggable` + `onDragOver`/`onDrop` com índice de origem em estado local), setas ▲/▼ e o botão "Ordenar por horário" por dia.
- `src/components/site/PraianaSite.tsx`: remover a ordenação aplicada na renderização da grade.

Nada de layout, cores ou textos muda.
