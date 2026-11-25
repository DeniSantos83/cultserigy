# Preparação de produção (sem deploy)
Aplicar sobre o projeto atual. A base Vite passa a /, para hospedagem na raiz do domínio Netlify, não em subdiretório GitHub Pages.

1. npm install; npm run build; npm run preview. Testar acesso direto e recarga de /feed, /artistas, /agenda, /login, /minha-conta e /admin.
2. Conferir .gitignore: incluir .env, .env.*, !.env.example, node_modules/ e dist/. Não versionar chaves secretas. A chave publishable do Supabase é pública por natureza; nunca usar service_role no Vite.
3. Versionar package-lock.json após npm install. Criar repositório privado, revisar git status e conteúdo antes de push.
4. No Netlify, importar repositório somente quando autorizado. Definir VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY com os valores atuais de .env.local. Não publicar segredos.
5. No Supabase Auth URL Configuration, configurar Site URL e redirects exatos para o domínio escolhido, incluindo /feed e /nova-senha (confirmar fluxos no código atual). Preservar localhost para desenvolvimento.
6. robots.txt bloqueia rastreamento provisoriamente, mas não controla acesso. Para beta fechado, configurar proteção de acesso na hospedagem conforme plano e manter RLS. Não publicar até aprovação.
7. CSP está em Report-Only para identificar incompatibilidades sem bloquear recursos. Revisar console, ajustar e ativar política efetiva antes do lançamento. Testar embeds, imagens e autenticação.
8. Após aprovação pública, revisar robots.txt, sitemap, domínio, SEO e documentos legais.

Nenhum deploy foi executado. Build completo não verificado neste pacote.
