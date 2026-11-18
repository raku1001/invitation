/* Display native vector lettering; the invitation itself is not a control. */
(() => {
 const paper=document.getElementById('paper'),cache=new Map();let generation=0;
 const protectedArt='#paper,#extract-paper,#flying-letter';
 document.addEventListener('contextmenu',event=>{if(event.target.closest?.(protectedArt))event.preventDefault();});
 document.addEventListener('dragstart',event=>{if(event.target.closest?.(protectedArt))event.preventDefault();});
 document.querySelectorAll(`${protectedArt} img,.invitation-art`).forEach(image=>image.setAttribute('draggable','false'));
 window.addEventListener('invitation:language',async event=>{
  const {lang,path,alt}=event.detail,token=++generation;paper.classList.remove('vector-ready');
  paper.removeAttribute('tabindex');paper.removeAttribute('role');paper.removeAttribute('aria-haspopup');
  paper.setAttribute('aria-label',lang==='en'?'Invitation':'邀請函');
  try{
   if(!cache.has(path))cache.set(path,fetch(path).then(response=>{if(!response.ok)throw Error('Letter unavailable');return response.text();}));
   const source=await cache.get(path);if(token!==generation)return;
   const doc=new DOMParser().parseFromString(source,'image/svg+xml'),svg=doc.documentElement;
   if(svg.localName!=='svg')throw Error('Invalid letter');
   const family=lang==='en'?'InvitationLetterEN':'InvitationLetterZH';
   svg.querySelector('style').textContent=svg.querySelector('style').textContent.replaceAll('font-family:SourceHan',`font-family:${family}`);
   svg.querySelectorAll('[filter]').forEach(node=>node.removeAttribute('filter'));
   svg.querySelectorAll('defs').forEach(node=>node.remove());
   svg.classList.add('invitation-vector');svg.setAttribute('role','img');svg.setAttribute('aria-label',alt);
   const next=document.importNode(svg,true);next.style.visibility='hidden';next.style.position='absolute';paper.appendChild(next);
   await document.fonts.load(`700 24px "${family}"`);
   if(token!==generation){next.remove();return;}
   paper.querySelectorAll('.invitation-vector').forEach(node=>{if(node!==next)node.remove();});
   next.style.removeProperty('visibility');next.style.removeProperty('position');paper.classList.add('vector-ready');
  }catch{cache.delete(path);}
 });
})();
