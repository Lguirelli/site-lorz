/** Confere dependências locais da versão publicada na raiz, inclusive URLs em CSS. */
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
const pages = ['index.html','404.html','contato.html','politica-de-privacidade.html','servicos.html','sobre.html','servicos-criacao-de-sites.html','servicos-ferramentas-personalizadas.html','servicos-social-media.html'];
const css = await readFile('styles.css','utf8');
const problems=[];
const check=async(from,target)=>{
 if(!target||/^(?:https?:|data:|mailto:|tel:|#|\/\/)/i.test(target))return;
 const clean=target.split(/[?#]/,1)[0];
 if(!clean)return;
 if(clean.startsWith('/')){problems.push(`${from}: caminho absoluto incompatível com GitHub Pages em subpasta: ${target}`);return;}
 const dest=resolve(dirname(resolve(from)),clean);
 if(!dest.startsWith(resolve('.')+'/') && dest!==resolve('.')){problems.push(`${from}: caminho fora do repositório: ${target}`);return;}
 try{await access(dest);}catch{problems.push(`${from}: arquivo inexistente: ${target}`);}
};
for(const page of pages){
 const html=await readFile(page,'utf8');
 for(const m of html.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/gi)) await check(page,m[1]);
 for(const m of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) for(const candidate of m[1].split(',')) await check(page,candidate.trim().split(/\s+/)[0]);
 if(!html.includes('href="styles.css?v='))problems.push(`${page}: CSS sem versão de cache`);
}
for(const m of css.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi))await check('styles.css',m[1]);
if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}
else console.log(`OK: ${pages.length} HTMLs e dependências de CSS validados para GitHub Pages.`);
