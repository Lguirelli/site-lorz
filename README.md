# LORZ · Site v0.4 · GitHub Pages

Site estático preparado para publicação direta no **GitHub Pages**, inclusive em repositórios do tipo `usuario.github.io/NOME-DO-REPOSITORIO/`. Os 9 arquivos HTML publicáveis ficam na **raiz do repositório**. Não é necessário servidor, npm ou etapa de build para publicar a versão já exportada.

## Publicar no GitHub

1. Crie um repositório e envie **o conteúdo desta pasta**, de modo que `index.html` esteja diretamente na raiz do repositório (não dentro de uma pasta `lorz-site` ou `dist`).
2. Em **Settings → Pages**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta **`/(root)`** e salve.
4. Acesse `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`. Para um repositório chamado `SEU-USUARIO.github.io`, o endereço padrão é `https://SEU-USUARIO.github.io/`.

A publicação pode levar alguns minutos para ficar disponível. URLs das páginas usam a extensão `.html`, garantindo navegação sem configurações de reescrita no GitHub Pages.

## Páginas na raiz

| Página | Arquivo |
| --- | --- |
| Início | `index.html` |
| Serviços | `servicos.html` |
| Social Media | `servicos-social-media.html` |
| Criação de Sites | `servicos-criacao-de-sites.html` |
| Soluções Personalizadas | `servicos-ferramentas-personalizadas.html` |
| Sobre | `sobre.html` |
| Contato | `contato.html` |
| Privacidade | `politica-de-privacidade.html` |
| Erro 404 | `404.html` |

## Estrutura

```text
/                           HTMLs publicáveis, CSS e JS
├── index.html               Entrada do site
├── *.html                   Demais páginas e 404
├── styles.css               Estilos publicáveis
├── site.js / theme.js       Interações publicáveis
├── assets/                  Fontes, imagens e ilustrações SVG
├── .nojekyll                Desativa processamento Jekyll no Pages
├── public/                  Fontes dos arquivos estáticos
├── src/                     Textos e configurações do gerador
├── references/              Blocos de design e regras originais
├── scripts/                 Exportação e verificações
├── docs/                    Documentação e capturas de QA
├── build.mjs                Montagem do conteúdo das páginas
└── server.mjs               Preview Node local (pasta dist)
```

## Alterar e regenerar

Requer Node.js 20+ **apenas para editar/regenerar**. Depois de modificar `src/content.mjs`, `src/config.mjs`, `build.mjs` ou `public/`:

```sh
npm run build
npm run check
npm run verify:published
```

O `build` primeiro recria `dist/` para preview e em seguida exporta os arquivos compatíveis com GitHub Pages novamente para a **raiz**, convertendo os links entre páginas e os links de recursos. Execute `npm run dev` para testar localmente a versão em `dist/`; para testar exatamente a versão publicada, use um servidor HTTP estático na raiz (por exemplo, `python -m http.server 8000`). **Não edite somente os HTMLs gerados**, pois o próximo build irá substituí-los.

Para exportar novamente a partir de `dist/` já existente: `npm run publish:root`.

## Observações

- Contato: o formulário atual prepara um briefing local, mas **não envia dados ao servidor**. Preencha dados reais em `src/config.mjs`, se for implementar integração depois.
- SEO: `src/config.mjs` mantém `siteUrl` vazio. A versão de raiz tem `robots.txt` permissivo e nenhum canonical/sitemap de URL fictícia. Configure o domínio definitivo e regenere para construir os metadados correspondentes. Se usar GitHub Pages em uma subpasta, revise o `siteUrl` e o caminho do sitemap conforme o endereço real.
- Não é necessário publicar `references/`, `docs/`, `src/`, `public/`, `build.mjs` ou `scripts/` para o site funcionar, mas eles foram preservados para manutenção e histórico do projeto.
- A versão `dist/` com rotas de diretório é mantida como artefato local de preview e **não** precisa ser enviada ao GitHub.

## Correção de estilos e cache (v0.4.1)

- `public/styles.css` é a fonte usada na geração; `styles.css` na raiz é o CSS publicado, com URLs relativas para o GitHub Pages em subdiretório.
- `npm run build` atualiza HTML, CSS e JavaScript na raiz e adiciona hashes de versão aos links de CSS/JS, evitando a reutilização dos arquivos antigos em cache após o deploy.
- `npm run verify:published` confere todos os links locais de HTML e as URLs de assets em CSS, e interrompe o build se encontrar referências ausentes ou absolutas.
- Depois de atualizar o GitHub Pages, faça uma atualização forçada do navegador se houver conteúdo antigo já em cache.
- **Importante:** modifique `public/styles.css`, não apenas `styles.css`, para que a próxima compilação preserve as alterações.
