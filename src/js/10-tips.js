// 10-tips.js: first-time control tips during matches (TUT / HINTS)
function tutKeys(){const g=TUT.dev,K=t=>'<kbd>'+t+'</kbd>';return g==='t'?{mv:'the joystick',bp:'Hold '+K('BUMP')+', let go',pa:K('PARRY'),dr:K('THROW')}:g==='g'?{mv:'the stick',bp:'Hold '+K('A')+', let go',pa:K('B'),dr:K('X')}:{mv:K([KB.up,KB.left,KB.down,KB.right].map(keyName).join(KB.up==='KeyW'&&KB.left==='KeyA'&&KB.down==='KeyS'&&KB.right==='KeyD'?'':' ').toUpperCase()),bp:'Hold '+K(mouseAim?'LEFT CLICK':keyName(KB.bump).toUpperCase())+', let go',pa:K(mouseAim?'RIGHT CLICK':keyName(KB.parry).toUpperCase()),dr:K(keyName(KB.throw).toUpperCase())}}
// FTUE: one contextual hint at a time, in matches. Bits in store 'ftue': 1 bump, 2 parry, 4 drink.
const HINTS={b:[1,k=>k.mv+' to move · '+k.bp+' to <b>bump</b>'],p:[2,k=>'Tap '+k.pa+' right as someone bumps you to <b>parry</b> it back'],d:[4,k=>'Got a drink? '+k.dr+' chugs it, '+k.dr+' again <b>throws</b> it']};
function tutShow(){const el=$('#tut');const h=HINTS[TUT.cur];if(!h)return;el.querySelector('.ttx').innerHTML=h[1](tutKeys());el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')}
function tutHide(){if(TUT.on){TUT.on=0;$('#tut').classList.remove('on')}}
function tutDone(ok){if(!TUT.cur)return;store.set('ftue',(store.get('ftue',0)|0)|HINTS[TUT.cur][0]);if(ok){SFX.pop&&SFX.pop();$('#tut').classList.add('ok')}const c=TUT.cur;TUT.cur=null;setTimeout(()=>{if(!TUT.cur){$('#tut').classList.remove('ok');tutHide()}},ok?700:0)}
function tutTick(inp,dt){const bits=store.get('ftue',0)|0,ph=V&&V.phase,inMatch=V&&!V.hub&&!(S&&S.hub)&&(ph==='play'||ph==='intro'||ph==='results');
 if(!inMatch||bits===7){tutHide();TUT.was=0;return}
 const mp=V.players.find(q=>q.id===NET.myId);if(!mp){tutHide();return}
 const alive=!!mp.alive&&ph==='play';
 if(TUT.was&&!mp.alive&&ph==='play'){TUT.deaths=(TUT.deaths|0)+1;if(TUT.cur&&TUT.cur!=='b'){store.set('ftue',bits|HINTS[TUT.cur][0]);TUT.cur=null}const nb=store.get('ftue',0)|0;const nx=!(nb&2)?'p':!(nb&4)?'d':null;if(nx){if(TUT.cur==='b')store.set('ftue',nb|1);TUT.cur=nx;TUT.a=0}}
 TUT.was=alive;
 if(!TUT.cur&&!(bits&1)&&ph!=='results'){TUT.cur='b';TUT.a=0}
 if(!TUT.cur){if(!$('#tut').classList.contains('ok'))tutHide();return}
 const pads=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[];const dv=IS_TOUCH?'t':pads.length?'g':'k';
 if(!TUT.on||dv!==TUT.dev||TUT.shown!==TUT.cur){TUT.on=1;TUT.dev=dv;TUT.shown=TUT.cur;$('#tut').classList.add('on');tutShow()}
 if(alive)TUT.a+=dt;
 const c=TUT.cur;let ok=0;
 if(c==='b'){if(inp.d)TUT.held+=dt;else{if(TUT.held>.2&&alive)ok=1;TUT.held=0}}
 else if(c==='p')ok=alive&&inp.p&&!TUT.dn;
 else if(c==='d')ok=alive&&inp.f&&!TUT.dn&&mp.gun>0;
 TUT.dn=inp.p||inp.f;
 if(ok)tutDone(1);else if(TUT.a>20)tutDone(0)}
