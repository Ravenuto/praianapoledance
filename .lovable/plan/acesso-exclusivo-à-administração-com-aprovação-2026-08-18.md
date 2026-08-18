# Acesso exclusivo à administração, com aprovação

Objetivo: só você (ravenutto@gmail.com) entra na administração. Qualquer outra pessoa que criar conta fica "pendente" e só passa a ter acesso se você aprovar no painel.

## Como vai funcionar

1. Você cria sua conta em `/auth` com **ravenutto@gmail.com** (e-mail e senha, ou Google). Esse e-mail já nasce como administradora principal.
2. Qualquer outra pessoa que se cadastrar entra numa lista de **pedidos de acesso** — ela vê a mensagem "aguardando aprovação" e não consegue editar nada.
3. No painel aparece uma nova aba **Acessos**: lista de pedidos pendentes com botões **Aprovar** e **Recusar**, e a lista de quem já tem acesso (com opção de remover).
4. Sua conta principal não pode ser removida nem rebaixada por ninguém.
5. A conta de teste `raissa@admin.com` é apagada assim que o seu e-mail real estiver funcionando.

## Detalhes técnicos

- Nova tabela `public.access_requests` (user_id, email, status pendente/aprovado/recusado, datas) com GRANTs, RLS: a pessoa vê só o próprio pedido; admin vê e altera todos (`has_role(auth.uid(),'admin')`).
- Substituir o gatilho `grant_first_user_admin` por um gatilho em novos usuários que: concede `admin` automaticamente se o e-mail for `ravenutto@gmail.com`; caso contrário cria um pedido pendente e nenhum papel.
- Aprovar = inserir `admin` (ou `user`) em `user_roles` e marcar o pedido como aprovado; recusar = marcar recusado (sem papel). Feito por funções `security definer` chamadas via `createServerFn` com `requireSupabaseAuth`, validando que quem chama é admin.
- Proteção da conta principal: gatilho/verificação impedindo remover o papel admin do e-mail principal.
- Tela `/auth` e `/admin`: mensagem clara de "acesso aguardando aprovação" em vez do erro genérico atual.
- Remover o usuário de teste `raissa@admin.com` (auth + user_roles) na mesma etapa final.
- Ajuste extra: corrigir o aviso de hidratação na página `/auth` (tema escuro forçado).
