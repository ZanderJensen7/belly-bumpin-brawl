// 09-keyboard.js: keyboard and pointer listeners, touch flags
// ============================================================ INPUT
const keys={};let emoteQ=-1;
addEventListener('keydown',e=>{if(e.code==='Enter'&&e.target.tagName!=='INPUT'&&(curScreen==='lobby'||curScreen==='hub')&&!$('#ward').classList.contains('on')){e.preventDefault();for(const k in keys)keys[k]=false;$('#cin').focus();return}if(e.code==='Escape'){if($('#ward').classList.contains('on'))$('#ward').classList.remove('on');else toggleEsc();return}if(e.target.tagName==='INPUT')return;keys[e.code]=true;initAudio();
 if(/^Digit[1-4]$/.test(e.code)){if($('#draft').classList.contains('on')){pickPerk(+e.code.slice(5)-1);return}emoteQ=+e.code.slice(5)-1}
 if(e.code==='KeyM')toggleMute();
 if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false});
addEventListener('pointerdown',()=>initAudio());
let padPrev={};let mouseAim=store.get('maim',0)?1:0;const touch={x:0,y:0,d:0,f:0,p:0};
const IS_TOUCH=matchMedia('(pointer:coarse)').matches||/[?&]touch/.test(location.search);if(IS_TOUCH)document.body.classList.add('touch');
const TUT={cur:null,a:0,on:0,held:0,dn:0,dev:"k",was:0};if(IS_TOUCH)setTimeout(()=>{const ci=$('#cin');if(ci)ci.placeholder='Tap to chat'},0);
