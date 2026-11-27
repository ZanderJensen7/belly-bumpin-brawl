// 29-touch.js: on-screen touch controls
// ============================================================ UI
(function(){const st=$('#tstick'),base=$('#tbase'),knob=$('#tknob');let sid=null,ox=0,oy=0;
 st.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();if(sid!==null)return;sid=e.pointerId;st.setPointerCapture(e.pointerId);ox=e.clientX;oy=e.clientY;base.style.display='block';base.style.left=ox+'px';base.style.top=oy+'px';knob.style.transform='';touch.x=touch.y=0});
 st.addEventListener('pointermove',e=>{if(e.pointerId!==sid)return;let dx=e.clientX-ox,dy=e.clientY-oy;const l=hyp(dx,dy),R=58;if(l>R){ox+=dx/l*(l-R);oy+=dy/l*(l-R);base.style.left=ox+'px';base.style.top=oy+'px';dx=dx/l*R;dy=dy/l*R}
  knob.style.transform='translate('+dx+'px,'+dy+'px)';const m=Math.min(1,l/R);touch.x=m>.18?dx/R:0;touch.y=m>.18?dy/R:0});
 const end=e=>{if(e.pointerId!==sid)return;sid=null;base.style.display='none';touch.x=touch.y=0};st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
 const btn=(id,k)=>{const b=$(id);const on=e=>{e.preventDefault();initAudio();b.setPointerCapture(e.pointerId);b.classList.add('on');if(k)touch[k]=1;else emoteQ=ri(0,3);if(navigator.vibrate)try{navigator.vibrate(12)}catch(_){}};
  const off=e=>{b.classList.remove('on');if(k)touch[k]=0};b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',e=>{if(e.target===b)off(e)})};
 btn('#tBump','d');btn('#tParry','p');btn('#tThrow','f');btn('#tEmote',null);
 $('#touch').addEventListener('contextmenu',e=>e.preventDefault());
 $('#bMini').onclick=()=>{const p=$('#lobby .panel');p.classList.toggle('mini');$('#bMini').textContent=p.classList.contains('mini')?'▼ Show menu':'▲ Hide menu (practice)'}})();
