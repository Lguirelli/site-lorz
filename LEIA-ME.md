# Loading Lorz

Abra `index.html` diretamente no navegador para testar. A demonstração é independente, com modelo, textura e renderizador incorporados. Não exige npm, internet ou servidor.

## Integrar em uma página

Copie `loader.css` e `lorz-loader.js` para seu site. Insira o CSS no head e o componente logo após a abertura do body:

```html
<link rel="stylesheet" href="./loader.css">
<lorz-loader min-duration="1800" focus-target="#conteudo"></lorz-loader>
<main id="conteudo">Conteúdo da sua página</main>
<script src="./lorz-loader.js"></script>
```

O componente espera o evento `window.load` e a textura do cartão. O tempo mínimo (em milissegundos) apenas permite visualizar a entrada; não representa progresso fictício. A peça separada inicia trancada e permanece assim durante a espera. A rotação ocorre exclusivamente no eixo Z original do modelo (giro no plano do cartão), desacelera e para com o cartão na posição vertical, exibe “Clique no cartão para entrar” e habilita o clique. Ao clicar, a trava lateral sobe em 650 ms. Depois de uma pausa de 200 ms, o cartão inteiro desliza por cima durante 900 ms, em um canvas que cobre toda a tela. Só após o último quadro com o cartão totalmente fora da tela, o fundo desaparece e o conteúdo é liberado.

Para dados assíncronos, registre as promessas imediatamente depois do script, antes do fim do loading:

```html
<script>
const loading = document.querySelector('lorz-loader');
loading.waitFor(carregarDadosDaPagina());
</script>
```

Para controle totalmente manual:

```html
<lorz-loader manual min-duration="1800"></lorz-loader>
<script src="./lorz-loader.js"></script>
<script>
// Chame quando a aplicação estiver pronta:
document.querySelector('lorz-loader').ready();
</script>
```

Uma promessa rejeitada libera a espera e emite `lorz:error`; trate o erro na aplicação. Em modo manual, é necessário chamar `ready()`. `window.load` não cobre automaticamente imagens lazy, fontes ou requisições posteriores: use `waitFor()` para esses recursos.

Eventos no componente: `lorz:ready`, `lorz:unlock`, `lorz:exit`, `lorz:complete`, `lorz:error`. `destroy()` remove o bloqueio e libera os recursos do renderizador.

```css
lorz-loader { --lorz-bg: #090a0c; --lorz-text: #fae4cf; }
```

Suporta toque, clique, Enter/Espaço, foco por teclado e preferência por movimento reduzido. Durante a abertura, o conteúdo atrás fica inerte. Sem WebGL, usa uma versão 2D com a etiqueta e a trava, preservando o acesso ao conteúdo.

## Conteúdo

- `index.html`: demonstração independente.
- `lorz-loader.js` + `loader.css`: componente para integração, sem dependências externas.
- `SDCard-Lorz.glb`: modelo convertido para uso em outros projetos 3D; a peça `LockSlider` é independente e foi exportada na posição trancada. A sequência de loading é controlada pelo JavaScript, não pelo GLB.
- `loader-source.js`, `model.json`, `label.webp`, `fallback.webp`, `vendor/`: fontes e recursos de referência.

Geometria extraída do SDCard.blend fornecido. Etiqueta proveniente do lorz.png fornecido. O arquivo Blender original não foi alterado. Three.js r170, licença MIT em `THREE-LICENSE.txt`. Os direitos do modelo e da arte continuam sujeitos às suas licenças originais.
