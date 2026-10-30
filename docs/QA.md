# Revisão v0.4 · 30/10/2026

- Três SVGs substituídos pela linguagem angular da referência mais recente, mantendo paleta e transparência. Usados na home, serviços e três subpáginas.
- Box da hero com borda de 2 px e sombra sólida de 3 px: azul sobre creme no claro, creme sobre azul no escuro.
- Capturas inspecionadas da seção de serviços no desktop e da hero nos dois temas. XML dos SVGs e cores validados.
- Playwright/Edge: 30 combinações (cinco páginas × dois temas × 320, 390 e 1440 px), sem overflow horizontal e com todas as ilustrações carregadas. Evidências em `angular-qa/`.
- A sessão lateral teve uma interrupção de navegação; a verificação foi concluída em navegador isolado com Playwright.

---

# Revisão v0.3 · 30/10/2026

## Hero, identidade e modo escuro
- Hero: “Sua marca em destaque e seu negócio em movimento.” Texto de apoio reescrito; quatro linhas por grupos de sentido no celular e composição própria no desktop.
- O SVG oficial `lorz-retro-preto-branco.svg` já existia no projeto, mas o recorte anterior ocultava MARKETING. Novo viewBox inclui todos os paths, confirmado com getBBox no Playwright. Nenhum path do original foi redesenhado.
- Três ilustrações novas: conversa, site e peças conectadas. Mesma tela 260 × 200, traço de 6 unidades com pontas arredondadas, expressões e proporções comuns; apenas as quatro cores oficiais. Retratos oficiais preservados.
- Modo escuro em todas as páginas, com controle acessível no header e preferência inicial do sistema. Persistência entre páginas e recargas; fallback sem armazenamento; troca por teclado; mudança de preferência do sistema verificados.
- A política de privacidade informa o armazenamento local da preferência de aparência.

## Validação
- 162 verificações no navegador lateral: 9 páginas × 2 temas × 9 larguras (280, 320, 390, 599, 760, 999, 1000, 1440 e 1920 px), sem overflow horizontal. Ilustrações carregadas.
- Contraste dos textos visíveis calculado a partir das cores renderizadas e do fundo ancestral sólido em todas as páginas nos dois temas: mínimo 5,03:1; nenhuma medição abaixo de 4,5:1. Elementos decorativos com aria-hidden foram excluídos da varredura de texto.
- Capturas da hero nos dois temas em 320, 390 e 1440 px. Revisão visual dos novos SVGs na lista de serviços; header/footer com logo completo.
- Menu abre e fecha via Escape; botão de tema funciona via Enter; formulário vazio exibe erros legíveis no tema escuro.
- Teste isolado com Playwright/Edge: preferência do sistema, atualização automática, escolha manual, persistência, logo sem corte, reduced motion e armazenamento bloqueado passaram; nenhum erro de aplicação ou console.
- Na sessão automatizada lateral apareceu uma exceção sem URL de origem. A reprodução isolada não apresentou essa exceção; logs e resultados do teste estão separados em `theme-qa/behavior.json`.
- Build e sintaxe passaram. Paleta dos SVGs validada no XML.

## Evidências e limites
Arquivos em `theme-qa/`: `layout.json`, `contrast.json`, `behavior.json`, `preview-light.jpg`, `preview-dark.jpg`, capturas completas e estado de erros do formulário. As capturas em `visual-qa/` abaixo pertencem à versão v0.2.

Não constitui certificação completa de acessibilidade; não foram usados leitores de tela ou aparelhos físicos. Contato oficial e publicação continuam pendentes conforme decisão anterior do usuário.

---

# Revisão visual e funcional · 29/10/2026 · v0.2

## Escopo e resultado
Revisão das oito páginas e da página 404 com Playwright no navegador lateral do Codex. Capturas completas inspecionadas em 375 e 1440 px; home também inspecionada em 820 px. A hierarquia ficou mais direta e a copy passou a conectar melhor as ideias, mantendo o posicionamento e as condições provisórias dos serviços.

## Alterações
- Removidas as chamadas auxiliares em caixa alta acima dos títulos. Os nomes dos serviços continuam visíveis, em texto normal.
- Reescritos os trechos fragmentados na home, listagem, serviços, sobre, contato e FAQ. Mantida a frase principal aprovada da marca.
- Mantida a identificação dos exemplos como possibilidades, sem apresentá-los como cases.
- Cards de serviços passam a organizar ícone e palavra na vertical conforme o espaço do próprio card.
- Hero usa uma coluna em tablets; etapas e integração usam grades de 1, 2 ou 4 colunas.
- Corrigida quebra inadequada do link Explore a Lorz; botões e links respeitam a largura disponível.
- Acrescentado respiro entre a abertura e a lista de soluções na página de serviços.

## Evidências e verificações
- 126 combinações: 9 páginas × 14 larguras (280, 320, 375, 430, 600, 759, 760, 820, 999, 1000, 1100, 1440, 1920 e 2560 px).
- Nenhuma rolagem horizontal do documento ou caixa de texto/controle ultrapassando a largura útil nas medições. Um H1 por página; zero elementos eyebrow.
- Capturas completas desktop/mobile revisadas em todas as páginas; as capturas finais estão na galeria visual-qa/index.html.
- Menu abre e fecha com Escape; FAQ abre com Enter.
- Contato vindo de Soluções Personalizadas seleciona o serviço correspondente.
- Formulário vazio mostra erros específicos e posiciona o foco no nome. Preenchido, prepara download e informa que nada foi enviado à Lorz.
- Console: nenhum erro ou aviso registrado na sequência observada.
- Build e verificações de sintaxe passaram; 173 referências internas no HTML gerado, sem arquivos ou destinos ausentes.
- Tokens de cor preservados. Contrastes calculados na entrega anterior: vermelho/creme 5,03:1, azul/creme 15,43:1 e azul/laranja 7,70:1.

## Rastreabilidade visual
- before-home-desktop.jpg: chamadas auxiliares repetidas e frases fragmentadas antes da revisão.
- before-solutions-mobile.jpg: corpo dividido em muitos parágrafos curtos.
- home-375.jpg e home-1440.jpg: resultado final da hierarquia e dos cards.
- home-tablet.jpg: conferência da composição em 820 px.
- contact-validation.jpg e faq-open.jpg: estados de interação.
- responsive-sweep.json e interaction-results.json: resultados das verificações.

## Limites e dependências
A cobertura usa larguras representativas e mudanças ao redor dos pontos de quebra; não certifica todos os dispositivos ou tamanhos possíveis. Não foram testados aparelhos físicos, Safari/Firefox, leitor de tela, zoom nativo 200%, emulação de reduced motion ou Core Web Vitals. O CSS mantém suporte a reduced motion e foco visível.

Contato oficial continua adiado pelo usuário: o formulário prepara um arquivo local, sem envio. Domínio e publicação não configurados. A política descreve esta versão e deve ser completada ao ativar o contato. O prompt master original foi recuperado parcialmente pelo limite do leitor, conforme README.
