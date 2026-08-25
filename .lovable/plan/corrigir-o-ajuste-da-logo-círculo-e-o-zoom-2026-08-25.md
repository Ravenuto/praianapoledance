# Corrigir o ajuste da logo (círculo) e o zoom

## Problemas encontrados

1. **Depois de confirmar, a logo vira um quadrado grande.** O recorte é salvo sempre como JPEG quadrado, sem o formato redondo: o círculo só existia como enfeite visual no modal. Como o site mostra a logo inteira (sem máscara redonda), aparece o quadrado com fundo.
2. **O zoom "cresce pra baixo".** A imagem é ampliada a partir do canto superior esquerdo, então tudo escorrega para baixo/direita em vez de aproximar pelo centro do enquadramento. Também não há limite, então a imagem pode sair da área e deixar cantos vazios.

## O que muda

- **Logo sai realmente redonda**: ao confirmar, o recorte é salvo em PNG com fundo transparente e a área fora do círculo apagada. O que você enquadrou no círculo é exatamente o que aparece no site, sem quadrado nem fundo.
- **Zoom pelo centro**: ao mover o slider, a imagem aproxima/afasta a partir do centro da área de ajuste, sem escorregar para baixo.
- **Zoom também pela rolagem/pinça** dentro da área de ajuste, além do slider.
- **Sem cantos vazios**: o arrasto e o zoom passam a ser limitados para a imagem sempre cobrir toda a área de ajuste.
- Imagens quadradas/retangulares (hero, "O movimento") continuam com o mesmo comportamento, só ganhando o zoom pelo centro e o limite de arrasto.

## Detalhes técnicos

Arquivo: `src/routes/_authenticated/admin.tsx` (`CropModal`)

- Substituir o `zoom` direto por um `setZoomAnchored(next)` que recalcula `pos` mantendo o centro do container fixo: `pos = c - (c - pos) * (next/zoom)`.
- Adicionar `clampPos(pos, zoom)` (limites `min = cropSize - imgSize`, `max = 0`) aplicado no arrasto, no zoom e ao abrir.
- Listener `wheel` nativo não-passivo no container (`passive: false`, `e.preventDefault()`), com `zoom * Math.exp(-dy * 0.0015)` e o mesmo ancoramento, agora no ponteiro.
- Em `handleConfirm`, quando `isRoundImage(state.which)`: desenhar a imagem, aplicar `ctx.globalCompositeOperation = "destination-in"` com um `arc` centralizado e exportar com `canvas.toBlob(cb, "image/png")`; caso contrário manter JPEG 0.92.
- O upload precisa usar a extensão/`contentType` conforme o tipo do blob (`blob.type`) em vez de assumir `.jpg`.
- Nenhuma mudança no site público nem no banco.
