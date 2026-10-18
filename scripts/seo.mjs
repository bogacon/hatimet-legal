export const domain='https://hatimet.net';
export function breadcrumbSchema(body,path) {
 const nav=body.match(/<nav class="crumb"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
 if(!nav)return null;
 const decode=s=>s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
 const entries=[...nav.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(m=>({name:decode(m[2]),item:new URL(decode(m[1]),domain).href}));
 const current=[...nav.matchAll(/<span>([^<]+)<\/span>/g)].at(-1)?.[1];
 if(current)entries.push({name:decode(current),item:domain+path});
 return {'@context':'https://schema.org','@type':'BreadcrumbList','@id':domain+path+'#breadcrumb',itemListElement:entries.map((e,i)=>({'@type':'ListItem',position:i+1,...e}))};
}
export function catalogSchema(path,name,items){
 return {'@context':'https://schema.org','@type':'CollectionPage','@id':domain+path+'#collection',name,url:domain+path,inLanguage:'tr-TR',mainEntity:{'@type':'ItemList',numberOfItems:items.length,itemListElement:items.map((e,i)=>({'@type':'ListItem',position:i+1,name:e.name,url:domain+e.path}))}};
}
export const searchSurahName=name=>name.replaceAll('â','a').replaceAll('î','i').replaceAll('û','u');
