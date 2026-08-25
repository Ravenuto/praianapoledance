# Ajuste da imagem "O movimento" no celular

## Contexto
A foto da seção **"O movimento"** está cortada no mobile. Atualmente o container força a proporção `aspect-[4/3]` (relativamente quadrada) com `object-cover`, o que descarta as laterais/topos da imagem original.

## Objetivo
Fazer a imagem caber inteira no celular, sem cortar a silhueta/pole, e mostrar uma prévia mobile antes de confirmar.

## O que será feito

1. **Proporção mobile mais alta**
   - Trocar no mobile (`< sm`) o aspect ratio do container de `aspect-[4/3]` para algo mais vertical, próximo da foto original (ex.: `aspect-[3/4]` ou `aspect-[2/3]`).
   - Manter `aspect-[21/9]` em `sm:` e `aspect-[3/1]` em `md:` para desktop/tablet.

2. **Object-fit e posicionamento**
   - Usar `object-cover` com `object-center` (ou `object-top`, dependendo do foco da foto) para manter a imagem preenchendo sem distorcer.
   - Se ainda houver corte visível, alternar para `object-contain` no mobile, exibindo a imagem completa com um fundo sutil (gradiente do próprio tema).

3. **Prévia mobile**
   - Gerar screenshot do site em viewport mobile (`375x812` ou similar) focando na seção "O movimento".
   - Apresentar a prévia para aprovação antes de publicar.

## Arquivos envolvidos
- `src/components/site/PraianaSite.tsx` — ajuste do container e da imagem da seção `Movimento`.
- `src/styles.css` — apenas se for necessário adicionar uma classe utilitária extra.

## Critério de aceite
- A imagem da seção "O movimento" aparece completa no celular, sem cortar a silhueta.
- O layout dos textos abaixo continua equilibrado e legível.
- A prévia mobile é aprovada antes da publicação.
