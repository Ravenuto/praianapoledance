# Remover o mapa da seção de Contato

Você escolheu o layout em mosaico (cards 2x2), mantendo exatamente o design atual: mesmas cores, mesmas fontes, mesmos cards.

## O que muda

- O mapa do Google que aparece abaixo dos cards de contato é removido do site.
- Os quatro cards (Endereço, WhatsApp, Instagram, E-mail) passam de uma linha de 4 colunas para um mosaico 2x2 em telas grandes, ficando maiores e mais equilibrados no espaço que sobrou.
- No celular continua um card embaixo do outro, como já está hoje.
- Nada mais muda: cores, fontes, ícones, textos, animações de entrada e o efeito de hover ficam iguais.

## O que continua igual

- O card de Endereço segue clicável e abre o local no Google Maps em uma nova aba.
- O campo "Link do mapa exibido no site" no painel do administrador deixa de ter efeito no site, mas o link do endereço continua editável normalmente.

## Detalhes técnicos

- `src/components/site/PraianaSite.tsx`, componente `Contato`: remover o bloco do `<iframe>` do mapa e o helper `mapSrc`.
- Trocar o grid de `sm:grid-cols-2 lg:grid-cols-4` para `sm:grid-cols-2` (mosaico 2x2), mantendo o `gap`, os `reveal` e os `animationDelay` existentes.
- Nenhuma classe de cor, fonte ou espaçamento interno dos cards é alterada.
