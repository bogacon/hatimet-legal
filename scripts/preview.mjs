import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { handleRequest } from '../worker/index.mjs';
const root = resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.wasm':'application/wasm','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain'};
const env={ASSETS:{async fetch(request){const url=new URL(request.url); let path;
 try{path=resolve(root, '.'+decodeURIComponent(url.pathname));}catch{return new Response('Bad request',{status:400});}
 if(path!==root&&!path.startsWith(root+'/'))return new Response('Not found',{status:404});
 for(const candidate of [path,join(path,'index.html'),path+'.html']){try{if(!(await stat(candidate)).isFile())continue;return new Response(request.method==='HEAD'?null:await readFile(candidate),{headers:{'Content-Type':types[extname(candidate)]||'application/octet-stream'}});}catch{}}
 return new Response('Not found',{status:404});}}};
const server=http.createServer(async(req,res)=>{try{const response=await handleRequest(new Request(`http://127.0.0.1:4173${req.url}`,{method:req.method}),env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(error){console.error(error);res.writeHead(500);res.end('Preview failed');}});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
