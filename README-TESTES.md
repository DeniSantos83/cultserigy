# CultSerigy — testes locais
Encerre o Vite antes de executar. Preserve .env.local. Instale com `npm install -D @playwright/test` e `npx playwright install chromium`. Execute `npx playwright test` ou `npx playwright test --headed`. Relatório: `npx playwright show-report`.
Adicione playwright-report/ e test-results/ ao .gitignore. Não envie ao GitHub nem faça deploy agora.
Sete testes públicos não fazem gravações. O oitavo é opcional e autentica uma conta de teste, sem publicar ou apagar conteúdo. Use variáveis CULT_TEST_EMAIL e CULT_TEST_PASSWORD apenas no terminal local, nunca no código. Login/logout altera a sessão de autenticação. Não use conta administrativa real. Não há testes de RLS, criação de obras ou moderação neste pacote.
