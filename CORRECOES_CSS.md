# Auditoria e correções de CSS — LORZ v0.4.1

## Diagnóstico
- O projeto possui dois CSSs com finalidades distintas: `public/styles.css` (fonte/preview) e `styles.css` (exportação para GitHub Pages).
- No CSS de desenvolvimento, fontes e imagens usam `/assets/...`, um endereço absoluto que falha quando copiado diretamente para um repositório publicado em subcaminho. O arquivo de publicação precisa converter esses endereços.
- Os links anteriores de CSS e JS não possuíam versão, o que pode manter CSS antigo em cache após uma atualização do GitHub Pages.
- A regra de fallback de máscara tinha uma verificação com URL vazia; foi substituída por um teste válido com gradiente.

## Correções
- O script `scripts/publish-root.mjs` gera o CSS relativo e calcula hashes do conteúdo para os links de CSS e JavaScript em todos os HTMLs.
- Os scripts da raiz e as fontes/imagens permanecem acessíveis por caminhos relativos.
- `scripts/verify-published.mjs` verifica links locais de todas as 9 páginas e referências `url(...)` do CSS, inclusive subpastas e links absolutos.
- O comando `npm run build` passa a realizar essa verificação automaticamente.

## Testes realizados
- `npm run build`: aprovado.
- `npm run check`: aprovado.
- `npm run verify:published`: aprovado, 9 páginas e assets referenciados.
- Parsing estático do CSS: sem erros de sintaxe.
- **Limitação:** teste visual via Chromium local não pôde ser executado: o navegador do ambiente bloqueou acesso a `127.0.0.1`. Portanto, a verificação não comprova ausência de diferenças visuais no domínio publicado.

## Publicação
Suba todos os arquivos da raiz e a pasta `assets/`. Para fazer alterações futuras, edite `public/styles.css` e rode `npm run build` antes de enviar os arquivos regenerados ao GitHub.
