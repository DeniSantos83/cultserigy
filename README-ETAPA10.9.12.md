# Etapa 10.9.12 — primeiro envio ao GitHub

Repositório: https://github.com/DeniSantos83/cultserigy (encontrado vazio e público em 25/11/2026).

Este pacote contém o projeto React completo, com as atualizações das etapas 10.9.7, 10.9.8 e 10.9.11 aplicadas. Não contém `.env.local`, `dist/` ou `node_modules/`.

## Instalação no Windows

1. Faça backup do seu diretório local. Extraia este ZIP para a raiz do projeto (`cultserigy`).
2. Verifique que `.env.local` existente continua salvo localmente (este pacote não traz esse arquivo); caso esteja ausente, copie `.env.example` para `.env.local` e configure sua chave publishable.
3. Execute `npm install`, `npm run build` e `npm run dev`. Se `npm install` gerar `package-lock.json`, mantenha-o no repositório.
4. Execute `git status` e confira a lista antes do commit.
5. Envie ao GitHub com os comandos indicados na conversa.

O GitHub Actions valida a compilação em `main` sem realizar deploy. Assim que houver `package-lock.json` testado, recomenda-se substituir `npm install` por `npm ci` no workflow.

**Não publicar ainda**: dados reais estão no Supabase, o Netlify ainda não foi conectado, a CSP está em `Report-Only`, e o `robots.txt` não impede acesso público.

## Validação

Verificação estrutural e de sintaxe JSX executada no ambiente de preparação; compilação real do Vite ainda não executada por indisponibilidade das dependências no ambiente. Não houve modificação no Supabase nem envio de código ao GitHub a partir deste pacote.
