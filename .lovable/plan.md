# Destaque visual nos cartões de planos

Manter a estrutura atual (abas Mensal/Semestral no mobile, grade no desktop, cartões compactos), mas deixar os planos mais chamativos e o nome do plano mais bonito de ler.

## Ajustes visuais nos cartões

- **Nome do plano em negrito e maior**: passar de `font-serif text-lg italic text-ocean` para `font-serif text-xl font-bold italic text-ocean` (ou equivalente), garantindo que seja o elemento mais forte do cartão.
- **Tipografia mais refinada**: aumentar levemente o contraste entre nome, descrição e preço; ajustar line-height para evitar texto espremido.
- **Quebra de linha do nome**: garantir que nomes como "12 Aulas (plano mensal)" não quebrem de forma feia. Se o nome contiver parênteses, separar visualmente em duas linhas controladas (nome principal + subtítulo) ou impedir a quebra no meio do parêntese com `whitespace-nowrap` nos parênteses.
- **Preço com mais peso**: manter `font-serif` no valor, mas aumentar o peso e ajustar o alinhamento para que o valor "pise" com firmeza no cartão.
- **Botão mais integrado**: manter variação sólida para mensais e contorno para semestrais, mas com leve sombra no hover para dar vida.

## Cartão destacado (Mais popular)

- Manter o selo dourado e o ring dourado.
- Opcionalmente adicionar um leve gradiente sutil no fundo do card popular (`bg-gradient-to-b from-gold/5 to-white`) para reforçar o destaque sem sair da paleta.

## Dados

- Não alterar nomes, preços, descrições ou benefícios.
- Se necessário, ajustar apenas o campo `name` no banco para remover ambiguidades de quebra (ex.: "12 Aulas" com `desc` contendo "plano mensal"), mas só se o usuário aprovar — a implementação prioriza CSS.

## Arquivos

- `src/components/site/PraianaSite.tsx` — componente `Valores`, estilos dos cartões.
