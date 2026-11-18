(() => {
 'use strict';
 const t=text=>window.InvitationLocale?.t(text)||text;
 const $=id=>document.getElementById(id);
 const ui={intro:$('intro'),main:$('invitation'),paper:$('paper'),wrap:$('paper-wrap'),introActor:$('intro-actor'),tug:$('tug-actor'),actor:$('reaction-actor'),clone:$('button-clone'),pending:$('pending'),restore:$('restore'),yes:$('attending'),envelope:$('envelope'),flight:$('flying-letter'),catch:$('chase-catch'),message:$('chase-message'),status:$('response-status')};
 const actors={intro:new WholeCharacter(ui.introActor),tug:new WholeCharacter(ui.tug),reaction:new WholeCharacter(ui.actor)};
 ui.layer=$('reaction-layer');ui.corner=$('paper-tug-corner');ui.hearts=$('happy-hearts');
 const mq=matchMedia('(prefers-reduced-motion: reduce)'),hasGSAP=Boolean(window.gsap);
 const state={scene:'loading',reduced:mq.matches,assetReady:false,tugSeen:false,biteSeen:false,optionReturned:false,response:null};
 const refusalURL='https://youtube.com/shorts/Pv645fPtThI?si=dRnYzzDbyedBHKfO';
 let redirectTimer=null,videoAway=false,returningFromVideo=false;
 const videoReturnKey='invitation-return-from-video';
 const chaseCompleteKey='invitation-chase-complete';
 try{returningFromVideo=sessionStorage.getItem(videoReturnKey)==='1';if(returningFromVideo)sessionStorage.removeItem(videoReturnKey);}catch{}
 try{if(returningFromVideo||sessionStorage.getItem(chaseCompleteKey)==='1'){state.biteSeen=true;state.optionReturned=true;}}catch{}
 const key='raccoon-invitation-prototype:v1';let active=null,request=0,dodges=0,lastDodge=0,readRemaining=3;
 let userPaused=false,tugActive=null,readActive=null,tugScene='idle';history.scrollRestoration='manual';
 const rsvpBusy=name=>name==='loading'||name.startsWith('intro.')||name.startsWith('rsvp.')||name.startsWith('decline.')||(name.startsWith('celebrate.')&&name!=='celebrate.rest');
 const scene=name=>{state.scene=name;document.body.dataset.scene=name;$('scene-label').textContent=name;ui.yes.disabled=ui.pending.disabled=rsvpBusy(name);};
 function completeChase(){state.biteSeen=true;state.optionReturned=true;try{sessionStorage.setItem(chaseCompleteKey,'1');}catch{}}
 const stop=()=>{active?.kill();active=null;};
 function timeline(options={}){stop();active=gsap.timeline({paused:document.hidden||userPaused,defaults:{ease:'power2.inOut'},...options});return active;}
 function tugTimeline(){tugActive?.kill();tugActive=gsap.timeline({paused:document.hidden||userPaused,defaults:{ease:'power2.inOut'}});return tugActive;}
 function tugPhase(name){tugScene=name;document.body.dataset.tugScene=name;if(state.scene==='reading'||state.scene.startsWith('tug.'))scene(name);}
 function pauseAll(){for(const tl of [active,tugActive,readActive])tl?.pause();}
 function resumeAll(){if(document.hidden||userPaused)return;for(const tl of [active,tugActive,readActive])tl?.resume();}
 function scheduleTug(){
  if(readActive||state.tugSeen||state.reduced||!state.assetReady||!hasGSAP)return;
  const clock={t:readRemaining};readActive=gsap.timeline({paused:document.hidden||userPaused});
  readActive.to(clock,{t:0,duration:readRemaining,ease:'none',onUpdate:()=>readRemaining=clock.t,onComplete:()=>{readActive=null;startTug();}});
 }
 function sample(tl,player,clip,start,duration,repeat=0){const clock={t:0};tl.call(()=>player.sample(clip,0,duration),null,start);tl.to(clock,{t:duration,duration,ease:'none',repeat,onUpdate:()=>player.sample(clip,clock.t,duration)},start);}
 function restoreButton(){ui.pending.style.visibility='visible';ui.pending.removeAttribute('aria-hidden');ui.pending.removeAttribute('tabindex');ui.restore.hidden=true;ui.clone.hidden=true;}
 function hideButton(){ui.pending.style.visibility='hidden';ui.pending.setAttribute('aria-hidden','true');ui.pending.tabIndex=-1;ui.restore.hidden=true;}
 function clean({resetTug=false}={}){
  clearTimeout(redirectTimer);redirectTimer=null;$('celebration-message').hidden=true;
  stop();actors.reaction.image.style.scale='1 1';ui.actor.hidden=true;ui.catch.hidden=true;ui.message.hidden=true;ui.clone.hidden=true;ui.hearts.hidden=true;
  if(resetTug){tugActive?.kill();readActive?.kill();tugActive=null;readActive=null;ui.tug.hidden=true;ui.tug.disabled=false;ui.tug.removeAttribute('aria-hidden');ui.tug.removeAttribute('tabindex');ui.corner.setAttribute('hidden','');tugPhase('idle');if(hasGSAP){gsap.killTweensOf([ui.paper,ui.tug]);gsap.set(ui.paper,{clearProps:'transform,opacity'});}}
  if(ui.actor.parentElement!==ui.layer)ui.layer.appendChild(ui.actor);
  if(hasGSAP){gsap.killTweensOf([ui.actor,ui.clone,ui.catch,$('celebration-message')]);gsap.set($('celebration-message'),{clearProps:'transform,opacity'});}
  restoreButton();if(hasGSAP)gsap.set(ui.pending,{scale:1});
 }
 function showLetter(){ui.intro.hidden=true;ui.main.hidden=false;$('replay').hidden=false;if(hasGSAP)gsap.set(ui.main,{clearProps:'transform,opacity'});}
 function reading(schedule=true){showLetter();scene('reading');if(schedule)scheduleTug();}
 function skip(){clean();reading();ui.main.focus({preventScroll:true});}
 function inspectIntro(time){
  if(state.reduced||!state.assetReady||!hasGSAP)return;
  $('play-tools').open=false;intro();active.pause(time,false);
  actors.intro.sample(time<4.05?'run':'fall',time<4.05?time:.96,time<4.05?4.05:.96);
  userPaused=true;$('pause-motion').textContent=t('繼續動畫');$('pause-motion').setAttribute('aria-pressed','true');
 }
 function intro(){
  state.tugSeen=false;readRemaining=3;
  clean({resetTug:true});if(state.reduced||!hasGSAP||!state.assetReady){reading();return;}
  window.scrollTo({top:0,behavior:'instant'});ui.intro.hidden=false;ui.main.hidden=true;$('replay').hidden=true;scene('intro.run');
  $('intro-caption').textContent=t('請稍等一下，信差有點忙。');$('intro-progress').textContent=t('01 / 03　送信途中');
  gsap.set(ui.introActor,{opacity:1,scale:.025,xPercent:-50,yPercent:-50,x:0,y:0,rotation:0});actors.intro.carrying(true);
  gsap.set(ui.envelope,{visibility:'hidden',opacity:1,scale:1,rotation:0,xPercent:-50,yPercent:-50});
  gsap.set('.intro-copy',{opacity:1});gsap.set('#extract-paper',{opacity:0});
  gsap.set(ui.flight,{visibility:'hidden',opacity:1,rotation:0,xPercent:-50,yPercent:-50});
  $('envelope-flap').parentElement.appendChild($('envelope-flap'));
  const flap=$('envelope-flap');flap.parentElement.appendChild(flap);
  gsap.set('#envelope-flap',{scaleY:1,svgOrigin:'120 20'});gsap.set('#envelope-seal',{opacity:1});gsap.set('#extract-paper',{y:0});
  const tl=timeline();sample(tl,actors.intro,'run',0,4.05);
  tl.to(ui.introActor,{scale:.96,y:12,duration:4.05,ease:'power1.in'},0);
  // Keep approaching during the stumble instead of freezing the depth motion.
  tl.to(ui.introActor,{scale:1.04,y:20,rotation:3,duration:.18,ease:'none'},4.05);
  tl.to(ui.introActor,{scale:1.15,y:60,rotation:0,duration:.486,ease:'none'},4.23);
  tl.to(ui.introActor,{y:55,duration:.10,ease:'power1.out'},4.716).to(ui.introActor,{y:60,duration:.15,ease:'power1.in'},4.816);
  tl.call(()=>{scene('intro.trip');$('intro-caption').textContent=t('等、等一下——');},null,4.05);sample(tl,actors.intro,'trip',4.05,.18);
  tl.call(()=>scene('intro.fall'),null,4.23);sample(tl,actors.intro,'fall',4.23,.90);
  const release=4.23+.90*.54;
  tl.call(()=>{
   // The carried envelope is painted into the head. Transfer it only once it leaves the mouth.
   const centre=actors.intro.point(163,208),left=actors.intro.point(77,208),right=actors.intro.point(249,208),stage=ui.intro.getBoundingClientRect();
   gsap.set(ui.envelope,{left:centre.x-stage.left,top:centre.y-stage.top,scale:Math.hypot(right.x-left.x,right.y-left.y)/130,rotation:-8,visibility:'visible'});
   actors.intro.carrying(false);scene('intro.envelope');$('intro-caption').textContent=t('信先到了，信差等一下。');$('intro-progress').textContent=t('02 / 03　拆開信封');
  },null,release);
  tl.to(ui.envelope,{left:'50%',top:'58%',scale:1.8,rotation:0,duration:1.1,ease:'power3.out'},release);
  tl.call(()=>{scene('intro.open');gsap.set('#extract-paper',{opacity:1});},null,5.95);
  tl.to('.intro-copy',{opacity:0,duration:.5},5.7);
  tl.to('#envelope-flap',{scaleY:-1,duration:.7,ease:'power2.inOut'},5.95);
  tl.to('#envelope-seal',{opacity:0,duration:.18,ease:'none'},5.95);
  // At the edge-on midpoint, the opened flap moves behind the letter.
  tl.call(()=>{const flap=$('envelope-flap'),slot=$('extract-paper').parentElement;flap.parentElement.insertBefore(flap,slot);},null,6.3);
  tl.call(()=>{$('intro-caption').textContent=t('這封信，是給你的。');},null,6.5);
  tl.to('#extract-paper',{y:-252,duration:1.05,ease:'power2.inOut'},6.6);
  tl.to(ui.introActor,{opacity:0,duration:.5},7.0);
  tl.call(()=>{
   const rect=$('extract-paper').getBoundingClientRect(),stage=ui.intro.getBoundingClientRect();
   gsap.set(ui.flight,{left:rect.left-stage.left+rect.width/2,top:rect.top-stage.top+rect.height/2,width:rect.width,height:rect.height,scale:1,visibility:'visible'});
   gsap.set('#extract-paper',{opacity:0});scene('intro.paper-flight');$('intro-progress').textContent=t('03 / 03　展開邀請函');
  },null,7.65);
  tl.to(ui.envelope,{top:'85%',opacity:0,scale:1.5,duration:.7},7.65);
  tl.to(ui.flight,{left:'50%',top:'48%',scale:()=>Math.max(innerWidth/180,innerHeight/220)*1.2,rotation:-2,duration:1.45,ease:'power2.in'},7.65);
  tl.call(()=>{ui.intro.hidden=true;ui.main.hidden=false;gsap.set(ui.main,{opacity:0,y:12});scene('intro.unfold');},null,9.1);
  tl.to(ui.main,{opacity:1,y:0,duration:.85,ease:'power2.out'},9.1);
  tl.call(()=>reading(),null,9.95);
 }
 function startTug(manual=false){
  if(!state.assetReady||state.reduced||!hasGSAP||(state.tugSeen&&!manual))return;
  showLetter();state.tugSeen=true;readRemaining=0;ui.tug.hidden=false;tugPhase('tug.enter');
  ui.tug.querySelector('.tug-hint').hidden=false;
  gsap.set(ui.tug,{x:0,y:0,opacity:1,rotation:0,clearProps:'clipPath',pointerEvents:'auto'});
  placeTug();
  const entryX=innerWidth-ui.tug.getBoundingClientRect().left+20;
  gsap.set(ui.tug,{x:entryX});actors.tug.image.style.scale='-1 1';
  const tl=tugTimeline();sample(tl,actors.tug,'run-free',0,1.5);
  tl.to(ui.tug,{x:0,duration:1.5,ease:'power1.out'},0);
  tl.to(ui.tug,{y:-5,duration:.10,repeat:13,yoyo:true,ease:'sine.inOut'},0);
  tl.set(ui.tug,{y:0},1.5);
  tl.call(()=>{actors.tug.image.style.scale='1 1';tugPhase('tug.grab');ui.corner.setAttribute('hidden','');},null,1.5);sample(tl,actors.tug,'grab',1.5,1.4);
  tl.call(()=>tugPhase('tug.pull'),null,2.9);sample(tl,actors.tug,'pull',2.9,.8,-1);
  
  tl.call(()=>tugPhase('tug.hold'),null,5.1);
  tl.to(ui.tug,{transformOrigin:'70% 94%',keyframes:[
   {rotation:17,duration:.18,ease:'power3.out'},
   {rotation:17,duration:.17},
   {rotation:0,duration:.28,ease:'power2.inOut'},
   {rotation:0,duration:.17}
  ],repeat:-1},2.9);
  tl.eventCallback('onUpdate',syncTug);
  // Deliberately no automatic release: the user asked to dismiss the raccoon by clicking.
 }
 let tugGrip=null;
 function placeTug(){
  const paper=ui.paper.getBoundingClientRect(),wrap=ui.wrap.getBoundingClientRect(),size=innerWidth<767?155:210;
  const mobile=innerWidth<1024||paper.right+size*.9>document.documentElement.clientWidth-12;
  const px=Number(gsap.getProperty(ui.paper,'x')),py=Number(gsap.getProperty(ui.paper,'y'));
  const right=paper.right-wrap.left-px,bottom=paper.bottom-wrap.top-py;
  // On narrow screens grip the lower edge before the curled corner; leave the full body inside the viewport.
  const gripX=mobile?Math.min(right-size*.98,wrap.width-size*.98-12):right-2;
  const gripY=mobile?bottom-5:bottom-paper.height*.17;
  tugGrip={x:gripX,y:gripY};
  gsap.set(ui.tug,{width:size,height:size,left:gripX-size*.24,top:gripY-size*.60,right:'auto',bottom:'auto'});
 }
 function syncTug(){
  if(ui.tug.hidden)return;
  if(['tug.grab','tug.pull','tug.hold'].includes(tugScene)){
   const hand=actors.tug.anchor?.hand||[.24,.60],size=parseFloat(ui.tug.style.width);
   const angle=Number(gsap.getProperty(ui.tug,'rotation'))*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
   // Pivot at the planted rear foot; the page follows the transformed grip.
   const hx=.70+c*(hand[0]-.70)-s*(hand[1]-.94);
   const hy=.94+s*(hand[0]-.70)+c*(hand[1]-.94);
   if(tugGrip)gsap.set(ui.paper,{x:parseFloat(ui.tug.style.left)+Number(gsap.getProperty(ui.tug,'x'))+hx*size-tugGrip.x,y:parseFloat(ui.tug.style.top)+Number(gsap.getProperty(ui.tug,'y'))+hy*size-tugGrip.y});
  }
  if(ui.corner.hasAttribute('hidden'))return;
  const paper=ui.paper.getBoundingClientRect(),wrap=ui.wrap.getBoundingClientRect(),hand=actors.tug.handPoint();
  const r=paper.right-wrap.left,b=paper.bottom-wrap.top,x=hand.x-wrap.left+3,y=hand.y-wrap.top;
  ui.corner.setAttribute('viewBox',`0 0 ${ui.wrap.clientWidth} ${ui.wrap.offsetHeight}`);
  $('paper-tug-flap').setAttribute('d',`M ${r} ${b-75} Q ${r-35} ${b-62} ${x} ${y-12} L ${x} ${y+12} Q ${r-28} ${b-5} ${r} ${b} Z`);
 }
 function releaseTug(){
  if(ui.tug.hidden||ui.tug.disabled)return;
  const focus=document.activeElement===ui.tug;ui.corner.setAttribute('hidden','');ui.tug.disabled=true;ui.tug.setAttribute('aria-hidden','true');ui.tug.tabIndex=-1;
  ui.tug.querySelector('.tug-hint').hidden=true;
  ui.corner.setAttribute('hidden','');
  actors.tug.image.style.scale='1 1';
  const tl=tugTimeline();tugPhase('tug.startled');tl.to(ui.paper,{x:0,y:0,rotation:0,duration:.65,ease:'sine.out'},0);tl.to(ui.tug,{opacity:1,y:8,rotation:0,duration:.65},0);
  sample(tl,actors.tug,'startled',0,.85);tl.call(()=>tugPhase('tug.sad'),null,.85);sample(tl,actors.tug,'sad',.85,1.1);
  tl.call(()=>tugPhase('tug.exit'),null,1.95);sample(tl,actors.tug,'exit',1.95,3.8);
  const distance=innerWidth-ui.tug.getBoundingClientRect().left+35;
  tl.to(ui.tug,{x:distance,duration:2.5,ease:'sine.in'},3.25);tl.to(ui.tug,{opacity:0,duration:.2},5.55);
  tl.call(()=>{const wasTug=state.scene.startsWith('tug.');ui.tug.hidden=true;tugActive=null;tugPhase('dismissed');if(wasTug)scene('reading');if(focus)ui.yes.focus({preventScroll:true});},null,5.75);
 }
 function updateResponse(){ui.yes.setAttribute('aria-pressed',String(state.response==='attending'));ui.pending.setAttribute('aria-pressed',String(state.response==='pending'));}
 async function submit(response){
  const current=++request;state.response=response;updateResponse();let saved=true;try{localStorage.setItem(key,JSON.stringify({response}));}catch{saved=false;}
  await Promise.resolve();if(current!==request)return;
  ui.status.textContent=window.InvitationLocale?.lang==='en'?`You picked “${t(response==='attending'?'好好好好好':'不要不要不要')}”. ${saved?'Saved only in this browser.':'Saved for this visit.'}`:`已選擇「${response==='attending'?'好好好好好':'不要不要不要'}」，${saved?'僅保存在此瀏覽器。':'本次頁面暫存。'}`;
 }
 function choose(response){
  if(rsvpBusy(state.scene))return;
  if(response==='pending'&&state.biteSeen&&!state.optionReturned)return;
  submit(response);
  if(response==='attending'&&state.biteSeen)state.optionReturned=true;
  clean();showLetter();scheduleTug();
  if(response==='pending'&&state.optionReturned){declineAgain();return;}
  if(state.reduced||!state.assetReady||!hasGSAP){
   if(response==='pending')completeChase();
   if(response==='attending')showCelebrationMessage(false);
   reading(false);return;
  }
  if(response==='pending')bite();else if(response==='attending')celebrate();else reading();
 }
 function reaction(){if(ui.actor.parentElement!==ui.layer)ui.layer.appendChild(ui.actor);ui.actor.hidden=false;gsap.set(ui.actor,{opacity:1,rotation:0,scale:1,clearProps:'left,right,top,bottom'});}
 function bite(){
  state.biteSeen=true;dodges=0;reaction();scene('rsvp.peek');
  const rect=ui.pending.getBoundingClientRect(),size=innerWidth<500?120:150;
  gsap.set(ui.actor,{width:size,height:size*1.125,x:innerWidth+size,y:Math.max(80,rect.top-size*.45)});
  const tl=timeline();sample(tl,actors.reaction,'run-free',0,1.2);tl.to(ui.actor,{x:Math.min(innerWidth-size-10,rect.right-size*.5),duration:1.1,ease:'sine.out'},0);
  sample(tl,actors.reaction,'bite',1.1,.55);tl.call(()=>{hideButton();startChase();},null,1.65);
 }
 function chaseBounds(){
  const vw=document.documentElement.clientWidth,vh=innerHeight,size=vw<500?112:145,buttonWidth=108;
  gsap.set(ui.actor,{width:size,height:size*1.125});gsap.set(ui.clone,{width:buttonWidth,height:34,minHeight:34,fontSize:12,padding:'5px 10px',rotation:-8});
  return {size,buttonWidth,minX:12,maxX:Math.max(24,vw-size*.89-buttonWidth-12),minY:Math.min(100,Math.max(55,vh*.2)),maxY:Math.max(110,vh-size*1.125-82)};
 }
 function syncChase(){
  const mouth=actors.reaction.point(),actor=ui.actor.getBoundingClientRect();
  gsap.set(ui.clone,{x:mouth.x-5,y:mouth.y-17});
  const option=ui.clone.getBoundingClientRect(),left=Math.min(actor.left,option.left),top=Math.min(actor.top,option.top);
  gsap.set(ui.catch,{x:left,y:top,width:Math.max(actor.right,option.right)-left,height:Math.max(actor.bottom,option.bottom)-top});
 }
 function startChase(shift=0){
  stop();scene('rsvp.chase');ui.actor.hidden=false;ui.clone.hidden=false;ui.catch.hidden=false;ui.message.hidden=false;
  ui.message.textContent=t('你這人怎麼這樣啊');hideButton();ui.clone.hidden=false;
  const b=chaseBounds(),clamp=(v,a,c)=>Math.max(a,Math.min(c,v));
  gsap.set(ui.actor,{x:clamp(Number(gsap.getProperty(ui.actor,'x')),b.minX,b.maxX),y:clamp(Number(gsap.getProperty(ui.actor,'y')),b.minY,b.maxY),opacity:1});
  const points=[{x:b.maxX,y:b.minY+16},{x:b.minX,y:b.maxY},{x:b.maxX,y:b.maxY-18},{x:b.minX,y:b.minY}];
  const tl=timeline({repeat:-1});
  for(let i=0;i<4;i++)tl.to(ui.actor,{...points[(i+shift)%4],duration:1.9,ease:'sine.inOut'},i*2.15);
  tl.eventCallback('onUpdate',()=>{actors.reaction.sample('drag',tl.totalTime(),1);syncChase();});syncChase();
  if(document.activeElement===ui.pending)ui.catch.focus({preventScroll:true});
 }
 function dodge(event){
  if(event.pointerType!=='mouse'||state.scene!=='rsvp.chase'||dodges>=3||performance.now()-lastDodge<1000)return;
  lastDodge=performance.now();startChase(++dodges);
 }
 function restoreOption(){
  if(['rsvp.return','rsvp.look','rsvp.disappointed','rsvp.exit'].includes(state.scene))return;
  const focus=document.activeElement===ui.restore||document.activeElement===ui.catch;
  const caught=ui.actor.getBoundingClientRect(),target=ui.pending.getBoundingClientRect();
  stop();ui.catch.hidden=true;ui.message.hidden=true;
  if(state.reduced||userPaused||!hasGSAP){clean();reading(false);if(focus)ui.pending.focus({preventScroll:true});return;}
  reaction();scene('rsvp.return');
  const size=caught.width,h=caught.height,x=caught.left,y=caught.top;
  gsap.set(ui.actor,{width:size,height:h,x,y,opacity:1});
  const lookRight=target.left+target.width/2>x+size/2;
  // The startled drawing faces left; the looking drawing faces right.
  // Set orientation before the first startled frame, without moving the actor.
  actors.reaction.image.style.scale=lookRight?'-1 1':'1 1';
  ui.clone.hidden=false;const tl=timeline();sample(tl,actors.reaction,'startled',0,1.4);
  tl.to(ui.clone,{x:target.left,y:target.top,width:target.width,height:target.height,rotation:0,duration:.8,ease:'power2.inOut'},.4);
  tl.call(()=>{state.optionReturned=true;restoreButton();gsap.set(ui.pending,{scale:1.1});scene('rsvp.return');},null,1.2);
  tl.to(ui.pending,{scale:1,duration:.2,ease:'back.out(1.5)'},1.2);
  tl.call(()=>{actors.reaction.image.style.scale='1 1';scene('rsvp.disappointed');},null,1.4);
  sample(tl,actors.reaction,'sad',1.4,1);
  tl.call(()=>scene('rsvp.exit'),null,2.4);sample(tl,actors.reaction,'exit',2.4,2.6);
  tl.to(ui.actor,{x:innerWidth+size,duration:1.7,ease:'sine.in'},3.2);
  tl.to(ui.actor,{opacity:0,duration:.1},4.9);
  tl.call(()=>{completeChase();clean();reading(false);if(focus)ui.pending.focus({preventScroll:true});},null,5);
 }
 function returnFromVideo(){
  videoAway=false;returningFromVideo=false;try{sessionStorage.removeItem(videoReturnKey);}catch{}
  clean();completeChase();userPaused=false;reading();resumeAll();
 }
 function goToVideo(){
  // Reset before handing off to the YouTube app: Safari may never unload this page.
  clean();completeChase();scene('reading');videoAway=true;
  try{sessionStorage.setItem(videoReturnKey,'1');}catch{}
  location.assign(refusalURL);
 }
 function declineAgain(){
  scene('decline.enter');
  if(!hasGSAP||!state.assetReady){redirectTimer=setTimeout(goToVideo,1500);return;}
  reaction();const size=innerWidth<500?160:190,h=size*1.125;
  const rect=ui.pending.getBoundingClientRect(),vw=document.documentElement.clientWidth;
  const x=Math.max(12,Math.min(vw-size-16,rect.left+(rect.width-size)/2));
  const y=Math.max(24,Math.min(innerHeight-h-90,rect.top-h-12));
  gsap.set(ui.actor,{width:size,height:h,x:state.reduced?x:vw+size,y,opacity:1});
  const tl=timeline();
  if(state.reduced){sample(tl,actors.reaction,'sad',0,1.5);tl.call(goToVideo,null,1.5);return;}
  actors.reaction.image.style.scale='-1 1';
  sample(tl,actors.reaction,'slow-walk',0,2.8);tl.to(ui.actor,{x,duration:2.8,ease:'none'},0);
  tl.call(()=>{actors.reaction.image.style.scale='1 1';scene('decline.sad');},null,2.8);
  sample(tl,actors.reaction,'turn-front',2.8,.5);sample(tl,actors.reaction,'sad',3.3,1.8);
  tl.call(()=>scene('decline.exit'),null,5.1);sample(tl,actors.reaction,'exit',5.1,3.7);
  tl.to(ui.actor,{x:vw+size,duration:2.5,ease:'none'},6.3);
  tl.call(goToVideo,null,8.85);
 }
 function happySpot(size){
  const h=size*1.125;let rect=ui.wrap.getBoundingClientRect(),top=rect.bottom-h-10;
  const comfortable=Math.max(16,Math.min(top,innerHeight-h-145));
  if(Math.abs(top-comfortable)>1)window.scrollBy({top:top-comfortable,behavior:'instant'});
  rect=ui.wrap.getBoundingClientRect();return {x:rect.right-size-12,y:rect.bottom-h-10,h};
 }
 function showCelebrationMessage(animate=true){
  const bubble=$('celebration-message');bubble.textContent=t('那我們不知道見，多喝熱水');bubble.hidden=false;
  if(animate&&hasGSAP&&!state.reduced)gsap.fromTo(bubble,{opacity:0,y:8},{opacity:1,y:0,duration:.45,ease:'power2.out'});
 }
 function settleHappy(size){
  stop();happySpot(size);scene('celebrate.rest');ui.wrap.appendChild(ui.actor);
  gsap.set(ui.actor,{clearProps:'transform',left:'auto',top:'auto',right:12,bottom:10,width:size,height:size*1.125,opacity:1});
  actors.reaction.sample('happy-rest',0,1);ui.hearts.hidden=true;gsap.set(ui.hearts,{bottom:85,opacity:1,scale:1});
  if($('celebration-message').hidden)showCelebrationMessage();
 }
 function celebrate(){
  reaction();scene('celebrate.enter');const size=innerWidth<500?170:190,spot=happySpot(size),entry=1.2;
  gsap.set(ui.actor,{width:size,height:spot.h,x:-size-20,y:spot.y,opacity:1});
  ui.hearts.hidden=true;gsap.set(ui.hearts,{bottom:180,opacity:0,scale:.7});
  const tl=timeline();sample(tl,actors.reaction,'run-free',0,entry);
  tl.to(ui.actor,{x:spot.x,duration:entry,ease:'power1.out'},0);
  const stumble=entry+1.2,fall=stumble+.85,rest=fall+.45;
  tl.call(()=>scene('celebrate.hops'),null,entry);sample(tl,actors.reaction,'happy-hop',entry,1.2);
  for(const moment of [entry,entry+.4,entry+.8]){tl.to(ui.actor,{y:spot.y-30,duration:.2,ease:'power2.out'},moment).to(ui.actor,{y:spot.y,duration:.2,ease:'power2.in'},moment+.2);}
  tl.call(()=>scene('celebrate.unbalanced'),null,stumble);sample(tl,actors.reaction,'happy-trip',stumble,.85);
  tl.to(ui.actor,{rotation:-6,duration:.22},stumble).to(ui.actor,{rotation:7,duration:.25},stumble+.22).to(ui.actor,{rotation:0,duration:.38},stumble+.47);
  tl.call(()=>scene('celebrate.fall'),null,fall);sample(tl,actors.reaction,'happy-fall',fall,.45);
  tl.to(ui.actor,{y:spot.y+5,duration:.12},fall+.23).to(ui.actor,{y:spot.y,duration:.15},fall+.35);
  sample(tl,actors.reaction,'happy-rest',rest,.75);
  tl.call(()=>showCelebrationMessage(),null,rest+.5);
  tl.call(()=>settleHappy(size),null,rest+.95);
 }
 function reduce(value){state.reduced=value;$('reduce-motion').checked=value;$('pause-motion').hidden=value;clean({resetTug:true});reading();}
 let layoutWidth=innerWidth;
 function layout(event){
  const widthChanged=event.type==='resize'&&innerWidth!==layoutWidth;if(event.type==='resize')layoutWidth=innerWidth;
  if(!ui.tug.hidden){if(event.type==='resize')placeTug();syncTug();}
  if(state.scene.startsWith('decline.'))return;
  if(state.scene==='rsvp.chase'){if(widthChanged)startChase(dodges);return;}
  if(widthChanged&&state.scene.startsWith('intro.'))skip();
 }
 for(const [name,value]of Object.entries(INVITATION_CONTENT)){if(!value)continue;const el=document.querySelector(`[data-field="${name}"]`);if(el){el.textContent=value;el.removeAttribute('aria-label');}}
 try{const saved=JSON.parse(localStorage.getItem(key));if(['pending','attending'].includes(saved?.response)){state.response=saved.response;ui.status.textContent=`上次選擇「${state.response==='attending'?'好好好好好':'不要不要不要'}」，僅保存在此瀏覽器。`;}}catch{}
 updateResponse();
 document.querySelector('.wordmark').addEventListener('click',event=>{event.preventDefault();userPaused=false;window.scrollTo({top:0,behavior:'instant'});intro();});
 $('skip').addEventListener('click',skip);$('replay').addEventListener('click',intro);ui.tug.addEventListener('click',releaseTug);
 $('inspect-carry').addEventListener('click',()=>inspectIntro(3.8));$('inspect-open').addEventListener('click',()=>inspectIntro(7.15));
 $('inspect-closed').addEventListener('click',()=>inspectIntro(5.7));
 $('inspect-closed').addEventListener('click',()=>inspectIntro(6.6));
 $('pause-motion').hidden=state.reduced;$('pause-motion').addEventListener('click',()=>{userPaused=!userPaused;active?.paused(userPaused||document.hidden);$('pause-motion').textContent=userPaused?t('繼續動畫'):t('暫停動畫');$('pause-motion').setAttribute('aria-pressed',String(userPaused));});
 ui.yes.addEventListener('click',()=>choose('attending'));ui.pending.addEventListener('click',()=>choose('pending'));ui.restore.addEventListener('click',restoreOption);
 ui.catch.addEventListener('click',restoreOption);ui.catch.addEventListener('pointerenter',dodge);ui.catch.addEventListener('focus',()=>{if(state.scene==='rsvp.chase')active?.pause();});ui.catch.addEventListener('blur',()=>{if(state.scene==='rsvp.chase'&&!document.hidden&&!userPaused)active?.resume();});
 $('test-tug').addEventListener('click',()=>{$('play-tools').open=false;startTug(true);});
 $('reset-demo').addEventListener('click',()=>{clean({resetTug:true});++request;state.response=null;state.tugSeen=false;state.biteSeen=false;state.optionReturned=false;readRemaining=3;try{localStorage.removeItem(key);sessionStorage.removeItem(chaseCompleteKey);sessionStorage.removeItem(videoReturnKey);}catch{}updateResponse();ui.status.textContent=t('尚未選擇回覆');$('play-tools').open=false;reading();});
 $('reduce-motion').checked=state.reduced;$('reduce-motion').addEventListener('change',e=>reduce(e.target.checked));mq.addEventListener('change',e=>reduce(e.matches));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAll();else if(videoAway)returnFromVideo();else resumeAll();});
 window.addEventListener('scroll',layout,{passive:true});window.addEventListener('resize',layout);window.addEventListener('pagehide',pauseAll);window.addEventListener('pageshow',e=>{if(videoAway||returningFromVideo)returnFromVideo();else if(e.persisted)resumeAll();});
 async function load(){const ok=await WholeCharacter.preload();state.assetReady=ok;$('asset-warning').hidden=ok;if(!ok){clean();reading(false);}return ok;}
 $('retry-assets').addEventListener('click',async()=>{if(await load())reading();});
 if(!hasGSAP){reading(false);$('asset-warning').hidden=false;}else{load().then(ok=>{if(ok&&returningFromVideo)returnFromVideo();else if(ok&&state.scene==='loading')intro();else if(ok&&state.scene==='reading')reading();});setTimeout(()=>{if(state.scene==='loading')reading(false);},8000);}
})();





