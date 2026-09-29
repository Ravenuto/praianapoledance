# Nova modalidade disponível na grade de horários

Ao criar uma modalidade no painel, ela também passará a aparecer automaticamente entre as opções de aula da grade. Isso não cria horários em todos os dias: você continua escolhendo em quais dias e horas oferecer a aula.

## O que muda

- O botão **Adicionar** em Modalidades criará, junto com a modalidade, seu tipo de aula correspondente na grade, com nome e abreviação inicial editáveis.
- Ao alterar o nome da nova modalidade, o nome correspondente na grade acompanhará a mudança; a cor e a abreviação continuarão ajustáveis na aba Grade de horários.
- Ao excluir uma modalidade ligada à grade, não deixar horários existentes apontando para uma aula inexistente. Preservar os tipos de aula antigos que não estejam ligados a modalidades, para não mexer na programação já cadastrada.
- Conferir no painel e na prévia que a nova opção fica disponível ao escolher uma aula em um horário, sem alterar a ordem manual dos horários.

## Detalhes técnicos

- Vincular modalidades novas a `classTypes` por identificador estável opcional no conteúdo, sem exigir alteração no banco de dados e sem reescrever modalidades antigas.
- Atualizar conjuntamente `modalities` e `classTypes` nos comandos de criação, renomeação e remoção em `src/routes/_authenticated/admin.tsx`; tratar remoção com horários em uso sem quebrar a grade.
- Ajustar a normalização do conteúdo em `src/lib/site-content.ts` para preservar o vínculo opcional ao recarregar o conteúdo salvo.
