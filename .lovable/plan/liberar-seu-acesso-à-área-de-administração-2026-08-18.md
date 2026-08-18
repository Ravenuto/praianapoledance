# Liberar seu acesso à área de administração

Hoje o cadastro exige confirmação por e-mail antes de entrar, então ao criar a conta você fica travada na tela de login. Vamos destravar isso.

## O que será feito

1. Ativar a confirmação automática de e-mail no login por e-mail/senha, para que a conta criada já entre direto (sem esperar e-mail).
2. Você cria o acesso em `/auth` (aba "Criar acesso") com `raissa@admin.com` e uma senha de pelo menos 6 caracteres.
3. Se por algum motivo a conta não receber o papel de administradora automaticamente, eu concedo o papel de admin a esse e-mail direto no banco.
4. Adicionar um link discreto para a administração (no rodapé) para você acessar sem digitar a URL.

## Observações

- Como o e-mail `@admin.com` é fictício, recuperação de senha por e-mail não vai funcionar nele. Depois trocamos pelo seu e-mail real.
- Só quem tiver o papel de administradora consegue salvar alterações; as regras de segurança do banco continuam iguais.

## Detalhes técnicos

- `configure_auth` com `auto_confirm_email` ativo.
- O gatilho `grant_first_user_admin` já concede admin ao primeiro usuário; caso já exista outro admin, aplico um `INSERT` em `public.user_roles` para o `user_id` correspondente.
- Nenhuma mudança nas políticas RLS de `site_content` ou `user_roles`.
