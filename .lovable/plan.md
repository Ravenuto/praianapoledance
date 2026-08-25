# Ajuste na visualização dos planos

## Objetivo
Fazer com que a etiqueta "Mensal" / "Semestral" e o nome do plano fiquem na **mesma linha** dentro do card, evitando a quebra estranha que acontece hoje no mobile.

## O que será alterado
- No componente `Valores` (`src/components/site/PraianaSite.tsx`), o `span` da etiqueta (`plans.*.tag`) será movido para dentro do cabeçalho do card, ao lado do nome do plano (`plans.*.name`).
- A etiqueta ficará como um "badge" inline (arredondado, pequeno, com fundo sutil) e o nome do plano ao lado, tudo em uma única linha.
- Mantém-se a tipografia e paleta atuais; apenas muda o posicionamento.

## Resultado esperado
- No mobile, os cards de plano mostram algo como:  
  `[MENSAL] 24 aulas` em uma linha só.  
  `[SEMESTRAL] 48 aulas` em uma linha só.  
- Sem alterar dados, admin ou funcionalidade de troca de abas Mensal/Semestral.
