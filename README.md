# CultSerigy

Rede social cultural dedicada aos artistas de Sergipe, desenvolvida com React, Vite e Supabase.

## Executar localmente

1. Instale o Node.js 22.
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local` e configure a URL do projeto e a chave **publishable** do Supabase. Nunca use `service_role` ou chaves secretas no cliente.
4. Execute `npm run dev`.

Comandos de verificacao: `npm run build` e `npm run preview`.

## Hospedagem

O `netlify.toml` define compilacao (`npm run build`), diretório `dist`, Node 22 e fallback SPA para rotas diretas. Configure as variaveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no painel do Netlify antes do deploy.

**Status:** projeto em desenvolvimento; não foi homologado para lançamento público. O `robots.txt` desaconselha indexacao, mas nao restringe acesso. A CSP encontra-se em modo `Report-Only`.

## Segurança

O frontend usa somente a chave publishable do Supabase. O acesso aos dados depende das regras RLS, do Storage e dos gatilhos de validacao configurados no projeto Supabase. Nao publique `.env.local`, senhas ou outras credenciais privadas.

## Funcionalidades

Landing cultural, feed de publicacoes, categorias, artistas, perfis, login, painel do artista, administracao, agenda cultural, notificacoes, perfis e solicitacoes de exclusao de dados. Algumas funcionalidades legais e de ciclo de vida da conta permanecem em revisao.
