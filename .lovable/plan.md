# Números em EB Garamond itálico alinhado

## O que muda

Todos os algarismos do site passam a usar **EB Garamond itálico com numerais alinhados** (Opção A do comparativo): mesmo tamanho e mesma linha de base, sem aquele efeito "intercalado" que os números têm hoje.

Vale para tudo, sem exceção:
- Preços dos planos mensais e semestrais (R$ 230, 6x R$ 210...)
- Preços dos extras (aula experimental, avulsa, particular)
- Horários da grade semanal
- Contatos: telefone/WhatsApp, endereço, CEP
- Rodapé (ano) e qualquer outro número em textos e cartões

Letras e títulos continuam exatamente como estão (Cormorant Garamond e Inter). Nenhuma mudança de layout, cor ou conteúdo.

## Detalhes técnicos

- Instalar `@fontsource/eb-garamond` e substituir a fonte "PraianaNums" já criada em `src/styles.css`: os `@font-face` passam a apontar para os arquivos EB Garamond itálico (peso 500 e 600/700), mantendo `unicode-range: U+0030-0039` para afetar apenas os dígitos.
- Aplicar `font-variant-numeric: lining-nums` globalmente (no `body`), garantindo os algarismos alinhados.
- Remover a dependência `@fontsource/cormorant-garamond` se não for mais usada.
- Ajustar o tamanho ótico se necessário (`size-adjust` no `@font-face`) para os dígitos ficarem harmônicos ao lado do texto.
