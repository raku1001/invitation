(() => {
 const origin=document.currentScript.src;
 const key=new Uint8Array([137,117,7,193,152,105,185,238,81,238,103,131,107,245,53,147,43,83,4,32,255,173,234,28,128,214,48,237,170,108,2,71]);
 const fallback=()=>{const node=document.getElementById('asset-warning');if(node){node.hidden=false;node.firstChild.textContent='網站檔案未載入完整，請重新整理。';document.getElementById('retry-assets')?.addEventListener('click',()=>location.reload());}};
 (async()=>{
  const response=await fetch(new URL('2c627a5280f79095e4.dat',origin));
  if(!response.ok)throw Error('Unable to load page data');
  const bytes=new Uint8Array(await response.arrayBuffer());
  for(let i=0;i<bytes.length;i++)bytes[i]^=key[i%key.length];
  const size=new DataView(bytes.buffer).getUint32(0,true);
  if(size<2||size>1000000||size+4>bytes.length)throw Error('Incomplete page data');
  const decode=new TextDecoder(),meta=JSON.parse(decode.decode(bytes.subarray(4,4+size))),urls=new Map(),texts=new Map();
  for(const entry of meta.entries){
   const start=4+size+entry.offset,end=start+entry.size;
   if(end>bytes.length)throw Error('Incomplete page data');
   const part=bytes.subarray(start,end);
   urls.set(entry.path,URL.createObjectURL(new Blob([part],{type:entry.type})));
   if(/\.(?:js|css)$/.test(entry.path))texts.set(entry.path,decode.decode(part));
  }
  const url=path=>{if(!urls.has(path))throw Error('Missing page resource');return urls.get(path);};
  window.__p=url;
  const paths=[...urls.keys()].sort((a,b)=>b.length-a.length);
  const replace=source=>{for(const path of paths)source=source.replaceAll(path,url(path));return source;};
  const style=document.getElementById('p0');style.textContent=replace(texts.get(meta.style));
  for(const [token,path]of Object.entries(meta.dom))for(const attr of ['src','href']){
   for(const node of document.querySelectorAll(`[data-x${attr}="${token}"]`)){node.setAttribute(attr,url(path));node.removeAttribute(`data-x${attr}`);}
  }
  for(const path of meta.scripts){
   let source=texts.get(path);
   source=source.replace('const src=kind=>`assets/cursors/${kind}.png`;','const src=kind=>window.__p("assets/cursors/"+kind+".png");');
   // Runtime lookup keys remain inside the binary, while literal resource URLs become Blobs.
   source=replace(source);
   await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));script.onload=resolve;script.onerror=reject;document.head.appendChild(script);});
  }
 })().catch(error=>{console.error('Unable to start this page.',error);fallback();});
})();
