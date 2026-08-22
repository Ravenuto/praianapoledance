# Editar o link da Área da Aluna

Hoje o link do app existe no painel, mas está escondido no fim da aba **Contato** (campo "Link do app das alunas"), longe de onde você edita os textos da Área da Aluna. Na prévia clicável dá para trocar o texto, mas não o endereço do botão — por isso a sensação de que o link não é editável.

## O que muda

1. **Bloco próprio no painel**: criar um cartão "Área da Aluna" com os campos de texto (etiqueta, título, descrição, texto do botão) e, junto deles, o campo **Link do app**. Ficará na aba Contato, no topo, em vez do campo solto no meio dos dados de contato.
2. **Edição pela prévia**: no modo de edição, clicar no botão "Acessar o app" (na seção Área da Aluna, no topo do site e no rodapé) abre um pequeno campo para colar/alterar o link, em vez de navegar para fora.
3. **Comportamento do link no site**: o link do app passa a abrir em nova aba, e se estiver vazio o botão não navega para "#".

## Detalhes técnicos

- `src/routes/_authenticated/admin.tsx`: mover/duplicar o `Field` de `studio.appUrl` para um novo grupo "Área da Aluna" junto dos campos de `content.areaAluna`.
- `src/lib/site-edit.tsx`: novo componente `EdLink` (padrão do `Ed`, mas edita um caminho de URL e intercepta o clique quando `editing` está ativo).
- `src/components/site/PraianaSite.tsx`: envolver os três links que usam `studio.appUrl` com `EdLink` e adicionar `target="_blank" rel="noreferrer"`.
- Nenhuma mudança de banco de dados: `appUrl` já faz parte do conteúdo salvo.
