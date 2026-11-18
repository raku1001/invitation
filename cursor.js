(() => {
 const fine=matchMedia('(any-pointer:fine)');
 const cursor=document.createElement('div');cursor.className='glove-cursor';cursor.hidden=true;cursor.setAttribute('aria-hidden','true');
 const image=document.createElement('img');image.alt='';image.className='cursor-hand';image.draggable=false;cursor.appendChild(image);
 document.body.appendChild(cursor);
 const targets='button:not(:disabled),a[href],summary,input:not(:disabled),label,[role="button"],[tabindex="0"]';
 let x=0,y=0,down=false,visible=false,red=false,blink=null,releaseTimer=null;
 const src=kind=>`assets/cursors/${kind}.png`;
 for(const kind of ['general-default','general-down','interactive-up-white','interactive-up-red','interactive-down-white','interactive-down-red']){const preload=new Image();preload.src=src(kind);}
 function paint(){
  const hit=document.elementFromPoint(x,y),interactive=Boolean(hit?.closest(targets));
  if(interactive&&visible){
   if(blink===null)blink=setInterval(()=>{red=!red;paint();},800);
  }else{if(blink!==null)clearInterval(blink);blink=null;red=false;}
  // Original point_click frames align at the wrist after shifting frame 1 by (-1,+2).
  // Hint color and finger press are independent, so hovering never moves the hand.
  const path=src(interactive?`interactive-${down?'down':'up'}-${red?'red':'white'}`:(down?'general-down':'general-default'));
  if(image.getAttribute('src')!==path)image.src=path;
  cursor.classList.toggle('is-pressed',down);cursor.style.left=`${x}px`;cursor.style.top=`${y}px`;
 }
 function hide(){clearTimeout(releaseTimer);releaseTimer=null;if(blink!==null)clearInterval(blink);blink=null;red=false;visible=false;down=false;cursor.hidden=true;document.documentElement.classList.remove('glove-cursor-ready');}
 function move(event){
  if(event.pointerType!=='mouse'||!fine.matches){hide();return;}
  x=event.clientX;y=event.clientY;visible=true;cursor.hidden=false;document.documentElement.classList.add('glove-cursor-ready');paint();
 }
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerover',event=>{if(event.pointerType==='mouse'&&visible){x=event.clientX;y=event.clientY;paint();}},{passive:true});
 document.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button===0){clearTimeout(releaseTimer);releaseTimer=null;move(event);down=true;paint();}},{passive:true});
 document.addEventListener('pointerup',event=>{if(event.pointerType==='mouse'&&event.button===0){releaseTimer=setTimeout(()=>{down=false;releaseTimer=null;paint();},110);}},{passive:true});
 document.addEventListener('pointercancel',hide);document.documentElement.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);
 window.addEventListener('scroll',()=>{if(visible)paint();},{passive:true});
 fine.addEventListener('change',hide);
 image.addEventListener('error',hide);
})();
