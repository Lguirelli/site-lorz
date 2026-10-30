/** Exporta HTMLs planos para a raiz, compatíveis com GitHub Pages em / ou /repo/. */
import { readFile, writeFile, cp, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const routes = new Map([
  ['/', 'index.html'],
  ['/servicos', 'servicos.html'],
  ['/sobre', 'sobre.html'],
  ['/contato', 'contato.html'],
  ['/politica-de-privacidade', 'politica-de-privacidade.html'],
  ['/servicos/social-media', 'servicos-social-media.html'],
  ['/servicos/criacao-de-sites', 'servicos-criacao-de-sites.html'],
  ['/servicos/ferramentas-personalizadas', 'servicos-ferramentas-personalizadas.html'],
  ['/404', '404.html'],
]);

const convert = html => html.replace(/\b(href|src)="(\/[^"]*)"/g, (match, attr, target) => {
  const found = /^([^?#]*)([?#].*)?$/.exec(target);
  const pathname = found[1].replace(/\/$/, '') || '/';
  const queryHash = found[2] || '';
  if (routes.has(pathname)) return `${attr}="${routes.get(pathname)}${queryHash}"`;
  if (pathname.startsWith('/assets/')) return `${attr}="${pathname.slice(1)}${queryHash}"`;
  if (['/site.js', '/theme.js', '/styles.css'].includes(pathname)) return `${attr}="${pathname.slice(1)}${queryHash}"`;
  throw new Error(`Link absoluto não mapeado: ${target}`);
});

// Hash das versões publicadas: evita carregar CSS/JS antigos após novo deploy.
const digest = data => createHash('sha256').update(data).digest('hex').slice(0, 12);
const styleSource = await readFile('public/styles.css', 'utf8');
const stylePublished = styleSource.replace(/url\((['"]?)\/assets\//g, 'url($1assets/');
const versionCSS = digest(stylePublished);
const versionJS = digest(await readFile('public/site.js', 'utf8'));
const versionTheme = digest(await readFile('public/theme.js', 'utf8'));

for (const [route, filename] of routes) {
  const input = route === '/404' ? 'dist/404.html' : join('dist', route === '/' ? '' : route.slice(1), 'index.html');
  let html = convert(await readFile(input, 'utf8'));
  html = html.replace(/href="styles\.css"/g, `href="styles.css?v=${versionCSS}"`)
    .replace(/src="site\.js"/g, `src="site.js?v=${versionJS}"`)
    .replace(/src="theme\.js"/g, `src="theme.js?v=${versionTheme}"`);
  await writeFile(filename, html);
}
for (const filename of ['site.js', 'theme.js']) await cp(join('public', filename), filename);
await writeFile('styles.css', stylePublished);
await rm('assets', { recursive: true, force: true });
await cp('public/assets', 'assets', { recursive: true });
await writeFile('.nojekyll', '');
// Sem domínio configurado, não publicar um robots.txt de desenvolvimento que bloqueie o site.
const robots = await readFile('dist/robots.txt', 'utf8');
await writeFile('robots.txt', robots.includes('Disallow: /') ? 'User-agent: *\nAllow: /\n' : robots);
try { await cp('dist/sitemap.xml', 'sitemap.xml'); } catch { await rm('sitemap.xml', { force: true }); }
console.log(`GitHub Pages: ${routes.size} HTMLs planos + assets exportados para a raiz.`);
