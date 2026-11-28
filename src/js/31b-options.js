// 31b-options.js: the Settings panel (gear button or Esc menu) and keeping phone screens awake during a match
(function(){const O=$('#opts'),KN={up:'Move up',down:'Move down',left:'Move left',right:'Move right',bump:'Bump',parry:'Parry',throw:'Drink / throw'};let wait=null;
 const kname=keyName;
 const voiceLbl=()=>{const b=$('#bVoice');b.style.opacity=1;b.textContent=voiceOn?VOX[voxI].n:'Off'};$('#bVoice').addEventListener('click',()=>setTimeout(voiceLbl,0));
 function draw(){voiceLbl();$('#oShake').textContent=['Off','Less','Full'][shakeLv];$('#oFlash').textContent=flashOn?'On':'Off';$('#oCb').textContent=cbOn?'On  ●■▲':'Off';
  $('#oKeys').innerHTML=Object.keys(KEYDEF).map(k=>'<div class="orow"><span>'+KN[k]+'</span><button class="ghost'+(wait===k?' go':'')+'" data-k="'+k+'">'+(wait===k?'Press a key…':esc(kname(KB[k])))+'</button></div>').join('');
  $('#oKeys').querySelectorAll('button').forEach(b=>b.onclick=()=>{SFX.click();wait=wait===b.dataset.k?null:b.dataset.k;draw()})}
 const open=()=>{wait=null;draw();O.classList.add('on')},close=()=>{wait=null;O.classList.remove('on')};
 $('#bOpts').onclick=()=>{SFX.click();O.classList.contains('on')?close():open()};$('#eSet').onclick=()=>{SFX.click();open()};$('#oDone').onclick=()=>{SFX.click();close()};
 O.addEventListener('pointerdown',e=>{if(e.target===O)close()});
 $('#oShake').onclick=()=>{shakeLv=(shakeLv+2)%3;store.set('shake',shakeLv);shake=Math.max(shake,14);draw()};
 $('#oFlash').onclick=()=>{flashOn=flashOn?0:1;store.set('flash',!!flashOn);if(flashOn)flash=.2;draw()};
 $('#oCb').onclick=()=>{cbOn=cbOn?0:1;store.set('cb',!!cbOn);draw()};
 $('#oReset').onclick=()=>{SFX.click();KB=Object.assign({},KEYDEF);KBU=new Set(Object.values(KB));store.set('keys',{});wait=null;draw()};
 // capture phase, so a key pressed while rebinding never reaches the game
 addEventListener('keydown',e=>{if(!O.classList.contains('on'))return;if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(wait){wait=null;draw()}else close();return}if(!wait)return;e.preventDefault();e.stopImmediatePropagation();
  if(/^Digit[1-8]$|^Enter$|^KeyM$|^Tab$/.test(e.code)){toast('That key is taken (emotes, chat or mute). Pick another.',2.5);return}
  for(const k in KB)if(KB[k]===e.code&&k!==wait)KB[k]=KB[wait]; // swap with whatever had this key
  KB[wait]=e.code;KBU=new Set(Object.values(KB));store.set('keys',KB);wait=null;draw()},true);
 // screen wake lock: phones dim mid-match otherwise. Held only while in a room; the browser drops it when the tab hides.
 let wl=null;setInterval(()=>{try{if(!('wakeLock' in navigator))return;if(NET.mode&&!wl&&document.visibilityState==='visible')navigator.wakeLock.request('screen').then(l=>{wl=l;l.addEventListener('release',()=>{if(wl===l)wl=null})}).catch(()=>{});else if(!NET.mode&&wl){wl.release().catch(()=>{});wl=null}}catch(e){}},3000)})();
