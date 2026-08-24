# Nova seção "O movimento" na home

Direção escolhida: **Editorial v2** — título grande à esquerda, foto em faixa panorâmica larga (sem cortar a imagem) e dois blocos curtos de texto abaixo.

## Onde entra
Entre o Hero e a seção Modalidades, mantendo a transição fluida de cor para o azul.

## O que aparece
- Título `O movimento` (serif, "movimento" em itálico dourado) com um selo lateral discreto: linha dourada + "Sinfonia das Marés".
- A foto enviada (silhueta no pole contra o céu) em faixa larga, cantos arredondados, leve zoom suave no hover e um véu azul sutil na base.
- Dois parágrafos curtos lado a lado sobre a essência do studio.
- Linha-horizonte fina fechando a seção e a onda de transição para Modalidades.

## Editável no painel
Todos os textos (selo, título, dois parágrafos) e a imagem entram no conteúdo editável, então você pode alterá-los clicando direto na prévia do admin, igual às outras seções.

## Detalhes técnicos
- Foto adicionada em `src/assets/` (PNG/JPG real, não pointer) e usada como fallback padrão em `src/lib/site-content.ts`.
- Nova seção em `src/components/site/PraianaSite.tsx` usando os tokens de cor existentes e componentes `Ed`/`EdImage` para edição visual.
- Suporte a modo claro/escuro e responsividade mobile (foto passa para proporção mais alta e textos empilham).
