# Publicar o site Praiana

## Objetivo
Tornar o site acessível publicamente no domínio Lovable e nos domínios customizados já configurados.

## Verificações já feitas
- Build: OK (último build sem erros).
- Segurança: 2 avisos, nenhum crítico bloqueador:
  - Funções `SECURITY DEFINER` do Supabase acessíveis a usuários autenticados (esperado para o fluxo de aprovação de admins).
  - Vulnerabilidades reportadas em dependências TanStack (`react-router`, `react-start`, `router-plugin`).

## Ação
1. Executar a publicação via `preview_ui--publish`.
2. Informar a URL publicada e lembrar que domínios customizados já estão configurados.
