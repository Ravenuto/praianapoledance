# Corrigir a imagem da página inicial que sumiu

## O que aconteceu

A foto do estúdio no topo do site não desapareceu do projeto — o endereço salvo no banco aponta para um arquivo que não existe mais.

No banco, o campo da imagem inicial está gravado como `/assets/studio-CE6XZneZ.png`. Esse é um endereço temporário gerado por uma versão antiga do site; a cada nova versão publicada esse nome muda, então o link antigo quebra e o navegador não encontra a imagem (o espaço aparece vazio). A logo e a foto de "O movimento" continuam aparecendo porque foram enviadas pelo painel e estão guardadas no armazenamento do site, com link permanente.

Confirmado: o arquivo original da foto do estúdio segue no projeto e carrega normalmente; apenas o link salvo está inválido.

## Correção

1. Voltar a imagem inicial para a foto padrão do estúdio (limpar o link inválido no banco).
2. Tornar isso à prova de falha: qualquer link de imagem que aponte para arquivos internos de build (`/assets/...`) passa a ser tratado como inválido e cai automaticamente na foto embutida no projeto.
3. Evitar que o problema volte: ao salvar no painel, se a imagem for a padrão do projeto, gravar o marcador `default` em vez de um endereço temporário.

## Detalhes técnicos

- `src/lib/site-content.ts`: em `fixImg`, adicionar `/assets/` (além de `/src/assets/`) à lista de valores considerados inválidos, para logo, hero e movimento.
- `src/routes/_authenticated/admin.tsx` / `src/lib/site-edit.tsx`: ao gravar imagens, normalizar caminhos servidos pelo bundle para `"default"`, gravando URL apenas quando vier do armazenamento.
- Atualizar a linha `site_content` (`key = site`) definindo `images.hero = "default"`.
- Verificar no preview mobile e desktop que a foto do topo volta a aparecer e que logo/movimento continuam intactos.
