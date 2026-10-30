# Auditoria e mapeamento

## Estrutura inspecionada
Forma Studio 1.17.1: HTML, CSS e JavaScript nativos; catálogo inventariado em inventory-forma.json. O editor utiliza nodes, conexões e Prototype Preview. A exportação mantém somente a sequência ligada ao Preview e páginas alcançáveis. O site Lorz é independente do editor, que não foi alterado.
O export teste-criador-de-site-log-site confirma a composição de blocos Vellum, Gioia e Onion. Não foi usado como site Lorz pronto.
secoes-para-repositorio: seções HTML independentes, componentes reference-section/section-bridge e integração via iframe. Inspecionados manifesto e componente de isolamento. Conteúdos de lojas, checkout, agendamento e galerias não correspondem aos serviços atuais da Lorz; não incorporados. Reutilizar iframes inteiros importaria estilos e conteúdo alheios à identidade.

## Matriz
| Origem Forma | Função | Destino | Adaptação | Status |
|---|---|---|---|---|
| r20-statue-header | Navegação | Todas | Logo oficial, links reais, menu com Escape e aria-expanded | Adaptado |
| r20-statue-hero | Hero dividido | Home e serviços | H1, copy, ilustração vetorial, máscara oficial | Adaptado |
| r20-fulfillix-problems | Cards de problemas | Home e sobre | 3 itens; sem métricas ou claims fictícios | Adaptado |
| r20-vellum-services | Serviços em linhas | Home e /servicos | 3 soluções, ilustrações distintas, CTAs | Adaptado |
| r20-folio-about | Manifesto dividido | Integração e contexto | Texto institucional e fluxo responsivo | Adaptado |
| r20-onion-process | Quatro etapas | Home | Etapas do master; sem especificações de infraestrutura | Adaptado |
| r20-fulfillix-faq | Details/summary | Home | Uma coluna para leitura; FAQ do master | Adaptado |
| r20-fulfillix-cta | Conversão | Home, serviços e sobre | CTA contextual e retrato negativo | Adaptado |
| r20-fulfillix-solutions | Estrutura dividida | Contato | Formulário local novo, necessário sem backend | Adaptado |
| footer-solitude | Footer editorial | Todas | Links institucionais; remove redes e dados fictícios | Adaptado |

A reutilização é estrutural: containers e padrões de layout inspecionados foram adaptados. O CSS de marca e o conteúdo interno são específicos da Lorz. Não se afirma reaproveitamento integral do CSS/JS original. Folhas originais carregam fontes remotas, cores externas à paleta, seletores de tema e comportamento de editor; foram substituídas por tokens e estilos restritos ao site.

## Identidade
Demonic Red #BB2233 segue o HEX escrito na imagem. Atomic Orange #FB8603, Autumn White #FAE4CF e Firmament Blue #0A0F23 foram amostrados das áreas chapadas da imagem fornecida. Esses três valores são amostras da referência, não códigos escritos nela.
SVGs auditados: logo viewBox 0 0 1170 780, paths evenodd; retratos 0 0 1122 1402, paths evenodd, positivo preto e negativo branco. Arquivos originais preservados; máscaras alpha recebem os tokens oficiais. Logo inline mantém paths, com viewBox ajustado para reduzir espaço vazio, sem deformação. Máscaras têm fallback de imagem. Sem texturas ou rasterização.
Brandson: H1; Alte Haas: H2–H6; Advercase: corpo. Arquivos locais. Princípios Apple HIG considerados como referência complementar; a página oficial consultada exigia JavaScript e a versão Markdown falhou na ferramenta, portanto não se alega auditoria completa da HIG.


## Atualização v0.3
- Header e footer: mesmo SVG oficial, recorte expandido para incluir MARKETING; cor herdada do tema.
- Hero: conteúdo e tipografia responsiva atualizados, sem trocar o retrato oficial.
- Ilustrações: `public/assets/illustrations/social-media.svg`, `criacao-de-sites.svg`, `solucoes-personalizadas.svg`. A home, a listagem e as subpáginas usam os mesmos arquivos.
- Tema: inicialização em `public/theme.js`, interação em `public/site.js`, estados visuais em `public/styles.css`.

## Atualização v0.4
Os mesmos três arquivos em `public/assets/illustrations/` agora usam a referência angular enviada pelo usuário. A composição anterior com rostos foi substituída. `.art-label` em `public/styles.css` controla a borda do box da hero.
