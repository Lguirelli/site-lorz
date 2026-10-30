# Correção das ilustrações dos serviços

A captura de tela mostrava três ícones de imagem quebrada na seção de serviços. Os SVGs originais estavam presentes e eram XML válido, mas a renderização publicada dependia de requisições externas a `assets/illustrations/*.svg`. A causa exata do erro de rede no ambiente publicado não foi verificada porque a URL pública não foi informada.

## Correção aplicada

- `build.mjs` passou a ler os SVGs originais e incorporá-los como SVG inline no HTML gerado, com classe `service-illustration`.
- A correção abrange a home, página de serviços e três subpáginas.
- Os SVGs originais permanecem em `public/assets/illustrations/` e em `assets/illustrations/` para manutenção e uso futuro.
- Os nove HTMLs seguem na raiz, compatíveis com GitHub Pages.

## Validação

- `npm run build`: aprovado.
- `npm run check`: aprovado.
- Validador interno dos nove HTMLs e dependências CSS: aprovado.
- Contagem de ilustrações SVG incorporadas: home 3, serviços 3, subpáginas 1 cada.
- Nenhuma ilustração de serviço permanece como `<img>` dependente de URL externa.

A correção resolve o problema visível de carregamento das três imagens no código entregue. O site já publicado precisa receber os arquivos atualizados para refletir a mudança.
