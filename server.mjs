import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.otf':'font/otf','.json':'application/json','.png':'image/png','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{try{
 let requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname); let file=path.resolve(root,'.'+requested);
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
 try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');await stat(file);}catch{file=path.join(root,'404.html');res.statusCode=404;}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(await readFile(file));
 }catch{res.writeHead(400).end('Solicitação inválida');}});
server.listen(4173,'127.0.0.1',()=>console.log('LORZ preview: http://127.0.0.1:4173'));
