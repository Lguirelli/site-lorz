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
```

O `build` primeiro recria `dist/` para preview e em seguida exporta os arquivos compatíveis com GitHub Pages novamente para a **raiz**, convertendo os links entre páginas e os links de recursos. Execute `npm run dev` para testar localmente a versão em `dist/`; para testar exatamente a versão publicada, use um servidor HTTP estático na raiz (por exemplo, `python -m http.server 8000`). **Não edite somente os HTMLs gerados**, pois o próximo build irá substituí-los.

Para exportar novamente a partir de `dist/` já existente: `npm run publish:root`.

## Observações

- Contato: o formulário atual prepara um briefing local, mas **não envia dados ao servidor**. Preencha dados reais em `src/config.mjs`, se for implementar integração depois.
- SEO: `src/config.mjs` mantém `siteUrl` vazio. A versão de raiz tem `robots.txt` permissivo e nenhum canonical/sitemap de URL fictícia. Configure o domínio definitivo e regenere para construir os metadados correspondentes. Se usar GitHub Pages em uma subpasta, revise o `siteUrl` e o caminho do sitemap conforme o endereço real.
- Não é necessário publicar `references/`, `docs/`, `src/`, `public/`, `build.mjs` ou `scripts/` para o site funcionar, mas eles foram preservados para manutenção e histórico do projeto.
- A versão `dist/` com rotas de diretório é mantida como artefato local de preview e **não** precisa ser enviada ao GitHub.
