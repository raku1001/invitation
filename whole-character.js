/* Complete painted frames only. No limb rotation, mesh, or head/body assembly. */
(() => {
 class WholeCharacter {
  constructor(element){
   this.element=element;this.manifest=WHOLE_FRAME_MANIFEST;this.clip='idle';this.released=false;
   element.querySelectorAll('svg').forEach(e=>e.remove());
   this.image=element.querySelector('img');
   if(!this.image){this.image=document.createElement('img');this.image.alt='';element.prepend(this.image);}
   this.sample('idle',0,1);
  }
  carrying(value){this.released=!value;if(!value&&this.clip==='fall')this.paint('fall',2);}
  paint(clip,index){
   const data=this.manifest.clips[clip],src=data.frames[index];
   if(this.image.getAttribute('src')!==src){
    const bridge=this.element.id==='intro-actor'&&((this.clip==='trip'&&this.lastPaintClip==='run')||(this.clip==='fall'&&this.lastPaintClip==='trip'));
    if(bridge&&this.image.animate){
     this.element.querySelectorAll('.pose-bridge').forEach(node=>node.remove());
     const previous=this.image.cloneNode();previous.className='pose-bridge';previous.style.cssText+=';position:absolute;inset:0;pointer-events:none;';this.element.appendChild(previous);
     previous.animate([{opacity:1},{opacity:0}],{duration:70,fill:'forwards'}).onfinish=()=>previous.remove();
     this.image.animate([{opacity:0},{opacity:1}],{duration:70,fill:'forwards'});
    }
    this.image.src=src;
   }
   this.lastPaintClip=clip;
   this.anchor=data.anchors[index];this.element.dataset.clip=clip;this.element.dataset.frame=index;this.element.dataset.renderer='whole-character-frames';
  }
  sample(clip,seconds=0,duration=1){
   const data=this.manifest.clips[clip]||this.manifest.clips.idle;
   if(!this.manifest.clips[clip])clip='idle';
   this.clip=clip;const p=Math.max(0,Math.min(1,seconds/duration));let index;
   if(data.mode==='fall')index=p<.54&&!this.released?1:p<.72?2:3;
   else if(clip==='run')index=Math.floor(seconds*data.fps+7)%data.frameCount;
   else if(data.mode==='tug'){const phase=seconds%.8;index=phase<.07||phase>.50?0:1;}
   else if(data.mode==='hop'){const phase=seconds%.4;index=phase<.045||phase>.36?0:1;}
   else if(data.mode==='exit')index=p<.13?0:p<.34?1:2+Math.floor((p-.34)*duration*3)%2;
   else index=data.loop?Math.floor(seconds*data.fps)%data.frameCount:Math.min(data.frameCount-1,Math.floor(p*data.frameCount));
   this.paint(clip,index);
   // Small whole-body offsets accompany drawn contact/pass poses; anatomy stays intact.
   const offset=clip==='run'?[0,-1.5,-2.5,-1,0,-1.5,-2.5,-1][index]:clip==='exit'&&p>.34?-Math.abs(Math.sin(seconds*9))*.8:clip==='fall'&&p<.54?-Math.sin(p/.54*Math.PI)*3:0;
   const forward=0;
   this.image.style.transform=`translate(${forward}px,${offset}px)`;
  }
  point(x=162,y=161){
   const rect=this.image.getBoundingClientRect(),size=Math.min(rect.width,rect.height),mouth=this.anchor?.mouth||[.57,.52];
   return {x:rect.left+(rect.width-size)/2+size*(mouth[0]+(x-162)/430),y:rect.top+(rect.height-size)/2+size*(mouth[1]+(y-161)/470)};
  }
  handPoint(){
   const rect=this.image.getBoundingClientRect(),size=Math.min(rect.width,rect.height),hand=this.anchor?.hand||[.062,.585];
   return {x:rect.left+(rect.width-size)/2+size*hand[0],y:rect.top+(rect.height-size)/2+size*hand[1]};
  }
  static async preload(){
   const paths=[...new Set(Object.values(WHOLE_FRAME_MANIFEST.clips).flatMap(c=>c.frames))];
   return(await Promise.all(paths.map(src=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(true);image.onerror=()=>resolve(false);image.src=src;})))).every(Boolean);
  }
 }
 window.WholeCharacter=WholeCharacter;
})();
