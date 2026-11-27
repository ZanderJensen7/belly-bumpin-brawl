// 12-gamepad.js: gamepad menu navigation (gpNav) and readInput for player 1
// ---- gamepad menu navigation (P1's controller)
const NAV={el:null,t:0,held:0,prev:{}};
function vis(e){if(!e||e.disabled)return false;const r=e.getBoundingClientRect();if(r.width<4||r.height<4)return false;const cs=getComputedStyle(e);return cs.visibility!=='hidden'&&cs.display!=='none'&&e.offsetParent!==null}
function navBox(){if($('#ward').classList.contains('on'))return $('#ward');if($('#esc').classList.contains('on'))return $('#esc');for(const id of ['over','results','stats','lb','browse','title']){const e=$('#'+id);if(e&&e.classList.contains('on'))return e}return null}
function navItems(box){return [...box.querySelectorAll('button,input:not([type=range]),select,[data-nav]')].filter(e=>vis(e)&&!e.closest('[hidden]'))}
function navMark(e){document.querySelectorAll('.gpf').forEach(x=>x.classList.remove('gpf'));NAV.el=e;if(e){e.classList.add('gpf');e.scrollIntoView({block:'nearest',inline:'nearest'})}}
function navMove(dx,dy){const box=navBox();if(!box)return;const it=navItems(box);if(!it.length)return;if(!NAV.el||!it.includes(NAV.el)){navMark((box.id!=='ward'&&box.id!=='esc'&&it.find(e=>e.classList.contains('go')))||it[0]);return}
 const a=NAV.el.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2;let best=null,bs=1e9;
 for(const e of it){if(e===NAV.el)continue;const r=e.getBoundingClientRect();const along=dx>0?r.left-a.right:dx<0?a.left-r.right:dy>0?r.top-a.bottom:a.top-r.bottom;const ac=dx?(r.left+r.width/2-ax)*dx:(r.top+r.height/2-ay)*dy;if(ac<=4||along<-a.height*.5)continue;const gap=dx?Math.max(0,r.top-a.bottom,a.top-r.bottom):Math.max(0,r.left-a.right,a.left-r.right);const al=Math.max(0,along);if(gap>Math.max(al,30)*1.5)continue;const sc=al+gap*2+Math.abs(dx?(r.top+r.height/2-ay):(r.left+r.width/2-ax))*.05;if(sc<bs){bs=sc;best=e}}
 if(best){navMark(best);SFX.click&&SFX.click()}}
function navBack(box){const ids={ward:'#bWard',esc:'#eRes',stats:'#bStBack',lb:'#bLBBack',browse:'#bBrBack'};const b=ids[box.id]&&$(ids[box.id]);if(b&&vis(b))b.click()}
function padStart(){const b=$('#bStart');if(curScreen==='lobby'&&b&&vis(b)){b.click();return}toggleEsc()}
function gpNav(dt){const pads=navigator.getGamepads?navigator.getGamepads():[];const box=navBox();
 if(!box){if(NAV.el)navMark(null);let st=0,a=0,b=0;for(const gp of pads){if(!gp)continue;const o=PADS[gp.index];if(o!==undefined&&o!=='p1')continue;st|=!!(gp.buttons[9]&&gp.buttons[9].pressed);a|=!!(gp.buttons[0]&&gp.buttons[0].pressed);b|=!!(gp.buttons[1]&&gp.buttons[1].pressed)}NAV.prev={a,b,st};return}
 if(document.activeElement&&document.activeElement.tagName==='INPUT'&&NAV.el===document.activeElement){}
 let x=0,y=0,a=0,b=0,st=0,any=0;
 for(const gp of pads){if(!gp)continue;const o=PADS[gp.index];if(o!==undefined&&o!=='p1')continue;const i=readPad(gp);x+=i.x;y+=i.y;const bt=k=>gp.buttons[k]&&gp.buttons[k].pressed;a|=bt(0);b|=bt(1);st|=bt(9);if(padActive(gp)||bt(9))any=1;if(any&&o===undefined&&!Object.values(PADS).includes('p1'))PADS[gp.index]='p1'}
 const dir=Math.abs(x)>.5||Math.abs(y)>.5?(Math.abs(x)>Math.abs(y)?[Math.sign(x),0]:[0,Math.sign(y)]):null;
 if(dir){const k=dir.join();if(k!==NAV.dk){NAV.dk=k;NAV.t=.35;navMove(dir[0],dir[1])}else{NAV.t-=dt;if(NAV.t<=0){NAV.t=.13;navMove(dir[0],dir[1])}}}else NAV.dk=null;
 const P_=NAV.prev;
 if(a&&!P_.a){if(!NAV.el||!navItems(box).includes(NAV.el))navMove(0,1);else{const e=NAV.el;if(e.tagName==='INPUT'||e.tagName==='SELECT')e.focus();else{e.click();SFX.click&&SFX.click()}}}
 if(b&&!P_.b){if(document.activeElement&&document.activeElement.tagName==='INPUT')document.activeElement.blur();else navBack(box)}
 if(st&&!P_.st&&box.id==='esc')$('#eRes').click();
 NAV.prev={a,b,st}}
function readInput(){let x=0,y=0,d=false,f=false,pa=false;
 if(keys.KeyA||keys.ArrowLeft)x-=1;if(keys.KeyD||keys.ArrowRight)x+=1;if(keys.KeyW||keys.ArrowUp)y-=1;if(keys.KeyS||keys.ArrowDown)y+=1;
 if(keys.Space||keys.KeyJ||keys.Enter)d=true;if(keys.KeyF||keys.KeyL)f=true;if(keys.ShiftLeft||keys.ShiftRight||keys.KeyK)pa=true;
 const pads=navigator.getGamepads&&!navBox()?navigator.getGamepads():[];
 for(const gp of pads){if(!gp||(PADS[gp.index]!==undefined&&PADS[gp.index]!=='p1')||(PADS[gp.index]===undefined&&Object.values(PADS).includes('p1')))continue;const ax=gp.axes[0]||0,ay=gp.axes[1]||0;if(hyp(ax,ay)>.2){x+=ax;y+=ay}
  if(gp.buttons[14]&&gp.buttons[14].pressed)x-=1;if(gp.buttons[15]&&gp.buttons[15].pressed)x+=1;if(gp.buttons[12]&&gp.buttons[12].pressed)y-=1;if(gp.buttons[13]&&gp.buttons[13].pressed)y+=1;
  const bt=i=>gp.buttons[i]&&gp.buttons[i].pressed;if(bt(0)||bt(7))d=true;if(bt(2)||bt(5))f=true;if(bt(1)||bt(4))pa=true;
  {const p=bt(3);if(p&&!padPrev[gp.index+'_3'])emoteQ=ri(0,3);padPrev[gp.index+'_3']=p}}
 if(touch.x||touch.y){x+=touch.x;y+=touch.y}if(touch.d)d=true;if(touch.f)f=true;if(touch.p)pa=true;
 const l=hyp(x,y);if(l>1){x/=l;y/=l}
 if(mouseAim&&!IS_TOUCH){if(mouse.l)d=true}else if(mouse.l)f=true;if(mouse.r)pa=true;let a=null;if((mouseAim&&!IS_TOUCH||performance.now()-mouse.t<5000)&&V){const mp=V.players.find(q=>q.id===NET.myId);if(mp){const w=mouseWorld();a=Math.round(Math.atan2(w[1]-(mp.y-6),w[0]-mp.x)*100)/100}}
 return {x:Math.round(x*100)/100,y:Math.round(y*100)/100,d:d?1:0,f:f?1:0,p:pa?1:0,a,m:mouseAim&&!IS_TOUCH?1:0}}

