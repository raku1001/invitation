/* Language changes update copy and the letter artwork without restarting any animation. */
(() => {
 const translations={
  '本人親送':'Hand-delivered by me',
  '這是什麼？':"What's this?",
  '我這樣算正式發邀請給你了吧，怎麼說？':'This counts as an official invite from me now, right? So, what do you say?',
  '好好好好好':'Okay okay okay okay okay',
  '不要不要不要':'No, no, no',
  '如有任何疑問，請自行想像。':'Got questions? Use your imagination.',
  '你這人怎麼這樣啊':'Why are you like this?',
  '那我們不知道見，多喝熱水':"See you at I Don't Know. Just get some rest.",
  '回到首頁並重播開場':'Back to the start and replay',
  '浣熊送信開場':'A raccoon delivering your invitation',
  '邀請函':'Invitation',
  '請浣熊放手':'Ask the raccoon to let go',
  '輕點，請牠放手':'Tap to ask the raccoon to let go',
  '抓住浣熊，拿回選項':'Catch the raccoon and get your option back',
  '拿回選項':'Get the option back',
  '尚未選擇回覆':'No answer yet',
  '示範回覆，尚未送交主辦人。':"Just a demo. Your reply hasn't been sent to the host.",
  '暫停動畫':'Pause animation','繼續動畫':'Keep going','重播開場':'Replay the intro',
  '略過動畫':'Skip the intro','小信差 · 互動邀請函':'Little courier · Interactive invitation',
  '試玩工具':'Try-it-out tools','看清送信造型':'See the delivery pose',
  '看清閉合信封':'See the closed envelope','看清拆信動作':'See the envelope open',
  '再看偷扯信紙':'Watch the paper tug again','重設彩蛋與回覆':'Reset the surprises and your reply',
  '減少動態':'Less motion','載入中':'Loading',
  '角色素材載入失敗，邀請函仍可使用。':"The raccoon couldn't load. The invitation still works.",
  '重試素材':'Try loading again',
  '請稍等一下，信差有點忙。':"Hang on, the courier's a little busy.",
  '等、等一下——':'Wait, wait—',
  '信先到了，信差等一下。':"The letter's here. The courier needs a moment.",
  '這封信，是給你的。':"This one's for you.",
  '01 / 03　送信途中':'01 / 03  On the way',
  '02 / 03　拆開信封':'02 / 03  Opening the envelope',
  '03 / 03　展開邀請函':'03 / 03  Opening your invitation',
  '聚會名稱，留白':'Event name, left blank','邀請文案，留白':'Invitation text, left blank',
  '日期，留白':'Date, left blank','時間，留白':'Time, left blank','地點，留白':'Place, left blank',
  '日期':'Date','時間':'Time','地點':'Place','聚會資料留白，等候填入。':'Event details are waiting to be filled in.'
 };
 let lang='zh';
 try{localStorage.removeItem('invitation-language');const url=new URL(location.href);url.searchParams.delete('lang');history.replaceState(null,'',url);}catch{}
 lang=lang==='en'?'en':'zh';
 const t=text=>lang==='en'?(translations[text]||text):text;
 window.InvitationLocale={t,get lang(){return lang;}};
 const records=[];
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(node.parentElement.closest('script,style,noscript,#language-toggle'))continue;
  const original=node.nodeValue,trim=original.trim();
  if(translations[trim])records.push({node,original,trim});
 }
 const attributes=[];
 for(const el of document.querySelectorAll('[aria-label],[alt]'))for(const name of ['aria-label','alt']){
  const original=el.getAttribute(name);if(original&&translations[original])attributes.push({el,name,original});
 }
 const toggle=document.querySelector('#language-toggle');
 const letterAlt={zh:'邀請函。親愛的[對方稱呼]：鑑於您本人強烈要求收到一份正式邀請函，並特別強調「親手交付比較有誠意」，本人現鄭重向您提出以下邀請。活動名稱、活動日期、活動時間、活動地點、活動內容：不知道。特別注意事項：01.本邀請函僅於您恢復健康後生效。02.在此之前，除醫院及必要行程外，暫不核准其他行程。03.邀請函運送過程中如發生跌倒、信件飛出或其他意外，恕不負責。※ 本邀請函不保證任何活動一定會發生，但誠意應該是有的。',en:"Invitation. Dear [Recipient's Name]. since you insisted on getting a proper invitation and made a point of saying, ‘Handing it over in person feels more sincere,’ here's my official invite. Event name, date, time, place, activity: I Don't Know. A few things to know: 01. This invite only kicks in once you're healthy again. 02. Until then, no other plans except hospital visits and anything you really need to do. 03. If the courier trips, the letter goes flying, or anything else goes wrong on the way, I'm not taking the blame. This invite doesn't promise anything will actually happen, but the sincerity is (probably) real."};
 function apply(){
  document.documentElement.lang=lang==='en'?'en':'zh-Hant';
  document.title=lang==='en'?"An invitation, delivered by a raccoon":'浣熊送來的邀請函 · 互動原型';
  for(const r of records)if(r.node.isConnected)r.node.nodeValue=r.original.replace(r.trim,t(r.trim));
  for(const r of attributes)r.el.setAttribute(r.name,t(r.original));
  // These nodes can have been replaced by an animation's textContent update.
  document.querySelector('#chase-message').textContent=t('你這人怎麼這樣啊');
  document.querySelector('#celebration-message').textContent=t('那我們不知道見，多喝熱水');
  const path=lang==='en'?'assets/invitation-typeset-en.svg':'assets/invitation-typeset.svg';
  document.querySelector('#extract-paper image').setAttribute('href',path);
  for(const el of document.querySelectorAll('#flying-letter>img,.invitation-art'))el.src=path;
  document.querySelector('.invitation-art').alt=letterAlt[lang];
  toggle.textContent=lang==='en'?'Too much English':'中文太多了';
  toggle.setAttribute('aria-label',lang==='en'?'Switch to Chinese':'切換成英文');
  toggle.setAttribute('lang',lang==='en'?'en':'zh-Hant');
  window.dispatchEvent(new CustomEvent('invitation:language',{detail:{lang,path,alt:letterAlt[lang]}}));
 }
 toggle.addEventListener('click',async()=>{
  if(toggle.disabled)return;
  const next=lang==='en'?'zh':'en';
  toggle.disabled=true;toggle.setAttribute('aria-busy','true');
  const image=new Image();image.src=next==='en'?'assets/invitation-typeset-en.svg':'assets/invitation-typeset.svg';
  try{await image.decode();lang=next;apply();
   try{const url=new URL(location.href);if(lang==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');history.replaceState(null,'',url);}catch{}
  }catch{toggle.title=lang==='en'?"Couldn't load that. Please try again.":'載入失敗，請再試一次。';}
  finally{toggle.disabled=false;toggle.removeAttribute('aria-busy');}
 });
 apply();
})();
