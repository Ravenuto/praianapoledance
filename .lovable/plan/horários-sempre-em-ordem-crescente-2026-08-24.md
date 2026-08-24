# Horários sempre em ordem crescente

Hoje os horários ficam na ordem em que foram adicionados, então uma aula nova das 17h entra depois da de 19h. Vou fazer a ordenação por horário acontecer automaticamente.

## O que muda

- **No painel (aba Horários):** ao adicionar uma aula ou alterar o horário de uma existente, a lista do dia se reordena na hora, da mais cedo para a mais tarde.
- **No site:** a grade de horários também exibe cada dia ordenado por horário, mesmo para conteúdos já salvos fora de ordem.
- **Conteúdo antigo:** ao carregar o conteúdo salvo, os horários de cada dia são normalizados em ordem crescente.

Nada de layout, cores ou textos muda.

## Detalhes técnicos

- `src/lib/site-content.ts`: adicionar `sortSlots` (comparação pelo campo `time`, formato HH:MM) e aplicá-la em `normalizeSchedule` para cada dia.
- `src/routes/_authenticated/admin.tsx`: aplicar a ordenação nos handlers do bloco "Dias e horários" (mudança de horário e "+ Horário") antes de chamar `update("schedule", ...)`.
- `src/components/site/PraianaSite.tsx`: ordenar `day.slots` na renderização da grade (linha ~358) para garantir a ordem mesmo sem re-salvar.
