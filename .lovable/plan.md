# Ajustes nos planos, contato e fonte dos preços

## 1. Travamento ao voltar de Semestral para Mensal
Os cartões usam animação de entrada (`reveal`) que só é liberada quando o cartão é visto pela primeira vez. Ao trocar de aba, os cartões escondidos voltam sem essa liberação e ficam invisíveis — dando a sensação de "travar".
Correção: os cartões da seção de planos deixam de depender dessa animação de entrada (a animação da seção como um todo continua), então trocar de aba mostra os cartões instantaneamente, quantas vezes quiser.

## 2. Botão "Quero esse plano" dos semestrais
Passa a ser azul sólido, igual ao dos mensais (hoje é só contorno azul com fundo branco).

## 3. Caixas de contato menores
Os quatro cartões (Endereço, WhatsApp, Instagram, E-mail) ficam mais compactos: menos espaçamento interno, ícone um pouco menor e títulos levemente reduzidos. Mesmo layout 2x2, mesmas cores e textos.

## 4. Fonte dos números (preços)
Os valores passam a usar **Sora**, uma fonte geométrica moderna, no lugar da serifada atual. Aplicada aos preços dos planos e aos valores das aulas extras. O restante do site mantém as fontes atuais.

## Detalhes técnicos
- `src/components/site/PraianaSite.tsx` (`Valores`): remover `reveal` dos `article` dos planos; botão semestral usa `bg-ocean text-sand`; preços usam nova classe `font-display`.
- `Contato`: `p-7` → `p-5`, ícone `w-12 h-12` → `w-10 h-10`, título `text-xl` → `text-lg`, `gap-5` → `gap-4`.
- `src/routes/__root.tsx`: `<link>` do Google Fonts para Sora.
- `src/styles.css`: token `--font-display: "Sora", ...` no `@theme`.
- Nenhuma mudança em dados, preços ou painel de administração.
