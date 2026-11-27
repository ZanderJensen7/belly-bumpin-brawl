// 22-events-fx.js: client-side effects (particles, pops, rumble) and onEv, which reacts to game events
// ============================================================ FX (client-side visuals)
let kickX=0,kickY=0;function rumble(id,st,ms){if(!navigator.getGamepads)return;const own=id===NET.myId?'p1':(typeof id==='string'&&id.startsWith(NET.myId+'~'))?+id.split('~')[1]:null;if(own==null)return;const hasP1=Object.values(PADS).includes('p1');for(const gp of navigator.getGamepads()){if(!gp)continue;const o=PADS[gp.index];if(own==='p1'?(o==='p1'||(!hasP1&&o===undefined)):o===own){try{gp.vibrationActuator&&gp.vibrationActuator.playEffect('dual-rumble',{duration:ms,strongMagnitude:st,weakMagnitude:Math.min(1,st+.2)})}catch(_){}}}}
let parts=[],pops=[],rings=[],shake=0,zoom=1,zoomT=0,zx=CX,zy=CY,flash=0;const anim={};const bumpSq={};
function A_(id){return anim[id]||(anim[id]={walk:0,px:0,py:0,pvx:0,pvy:0,lvx:0,lvy:0,sq:0})}
function vp(id){return V&&V.players.find(p=>p.id===id)}
function addPop(x,y,text,col,size,life,pr){size=size||34;pr=pr||1;if(size>=26){const big=pops.filter(q=>q.size>=26&&q.t<q.life-.12);if(big.some(q=>(q.pr||1)>pr))return;for(const q of big)q.life=q.t+.12}pops.push({x,y,text,col:col||'#fff',size,t:0,life:life||.9,rot:rnd(-.3,.3),pr});return;pops.push({x,y,text,col:col||'#fff',size:size||34,t:0,life:life||.9,rot:rnd(-.3,.3)})}
function burst(x,y,n,cols,spd,sz,grav){for(let i=0;i<n;i++){const a=Math.random()*TAU,s=rnd(.3,1)*spd;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,z:0,vz:rnd(100,350)*(grav?1:0),t:0,life:rnd(.4,.9),sz:rnd(.5,1)*sz,col:pick(cols),g:grav?1:0})}}
function onEv(e){const p=e.id?vp(e.id):null;if(NET.myId&&(e.id===NET.myId||e.kid===NET.myId)){if(e.k==='hand')achEv('hand');else if(e.k==='flipped')achEv('stow');else if(e.k==='treasure')achEv('treasure');else if(e.k==='pzwin'){achEv('deep');achEv('treasure');if(e.t<120)achEv('deepfast')}else if(e.k==='slap'&&e.at)achEv('slap');else if(e.k==='burp')achEv('burp');else if(e.k==='emote'&&e.em===2){achEv('dance');danceChain()}else if(e.k==='meme'&&e.kid&&/TRIPLE|RAMPAGE|UNSTOPPABLE/.test(e.t))achEv('triple')}const pitch=p?.8+((p.color*7)%8)/10:1;
 switch(e.k){
 case 'dash':SFX.whoosh(e.c);burst(e.x,e.y,6+e.c*8,['#fff','#f0e0c0'],180,8,0);break;
 case 'bonk':{rumble(e.id,Math.min(1,.35+e.s*.4),90+e.s*90);const vq=vp(e.id);if(vq){const l=hyp(vq.vx,vq.vy)||1;const k=Math.min(16,4+e.s*9);kickX+=vq.vx/l*k;kickY+=vq.vy/l*k}if(e.s>1.1)flash=Math.max(flash,.06+.05*e.s)}if(e.id===NET.myId&&navigator.vibrate)try{navigator.vibrate(e.s>1.2?[40,30,60]:35)}catch(_){}if(e.s>1.3&&Math.random()<.5)SFX.airhorn();if(e.perf)addPop(e.x,e.y-70,'PERFECT!','#ffd23f',30,.8);SFX.bonk(e.s);if(e.id)SFX.oof(pitch,e.s);if(e.s>1.25)SFX.ooh(Math.min(1.4,e.s*.7));shake=Math.max(shake,6+e.s*12);burst(e.x,e.y,14+e.s*10,['#fff','#ffd23f','#ff9f1c'],420+e.s*200,7,0);rings.push({x:e.x,y:e.y,t:0,life:.35,r:20+e.s*60,col:'#fff'});
  addPop(e.x,e.y-30,e.butt?'BUTT BUMP!':e.cork?pick(['GLASSED!','BULLSEYE!','CLONK!']):e.keg?pick(['KEGGED!','BARREL\'D!','THUNK!']):(e.s>1.3?pick(['EMOTIONAL DAMAGE','YEET!','CRITICAL HIT','SENT TO THE SHADOW REALM','BONK!']):pick(['BONK!','WHAM!','OOF!','BLAM!','THWUMP!','BOOP!','SMACK!','bonk'])),pick(['#ffd23f','#fff','#ff9f1c']),26+e.s*22);if(e.s>1.05)flash=.12;
  if(e.id){const a=A_(e.id);a.pvx+=rnd(-300,300);a.pvy+=rnd(-300,300)}break;
 case 'clang':SFX.clang();shake=Math.max(shake,14);burst(e.x,e.y,24,['#fff','#cfe8ff'],520,6,0);addPop(e.x,e.y-30,'CLANG!','#cfe8ff',48);rings.push({x:e.x,y:e.y,t:0,life:.4,r:90,col:'#cfe8ff'});break;
 case 'bump':SFX.bump();break;
 case 'hand':SFX.splash();SFX.choir();shake=Math.max(shake,10);burst(e.x,e.y+30,34,['#fff6e0','#ffe9a8','#fff'],320,9,1);rings.push({x:e.x,y:e.y,t:0,life:1,r:120,col:'#fff2a8'});addPop(e.x,e.y-110,'!?','#fff',54,1);break;
 case 'slap':SFX.slap();shake=Math.max(shake,26);S_hfx.push({x:e.x,y:e.y,a:e.a,t:0});burst(e.x,e.y,22,['#fff','#ffd23f','#f2c79b'],420,8,0);rings.push({x:e.x,y:e.y,t:0,life:.35,r:110,col:'#fff'});addPop(e.x,e.y-70,'SLAP!','#fff',56,.9);break;
 case 'pzin':SFX.choir();SFX.splash();shake=Math.max(shake,12);break;
 case 'pzcp':SFX.pop&&SFX.pop();if(p)addPop(e.x,e.y-60,'CHECKPOINT','#5ee07a',26,.9);break;
 case 'pzlv':SFX.choir();if(e.id===NET.myId)toast('🌊 Level '+(e.lv+1)+': '+PZL[e.lv].n,2.5);break;
 case 'pzfall':SFX.splash();burst(e.x,e.y,16,['#bfe6ff','#fff'],200,7,1);break;
 case 'pzwin':SFX.choir();SFX.airhorn&&SFX.airhorn();if(e.id===NET.myId){const b=+store.get('pzbest',0);if(!b||e.t<b)store.set('pzbest',e.t);lbPublish();toast('🏆 Deep End cleared in '+Math.floor(e.t/60)+':'+String(Math.floor(e.t%60)).padStart(2,'0')+' with '+e.d+' falls'+(!b||e.t<b?' · NEW BEST!':''),5)}break;
 case 'nut':burst(e.x,e.y,10,['#c98a4b','#8a5a2b','#fff6e0'],220,5);SFX.bonk&&SFX.bonk(.5);break;
 case 'nuthit':if(p)addPop(p.x,p.y-50,'🥜',null,28,.8);break;
 case 'nutq':SFX.whoosh&&SFX.whoosh(.3);break;
 case 'chat':{const lg=$('#clog');if(lg){const d=document.createElement('div');d.innerHTML='<b style="color:'+shade(COLORS[e.c]||'#2a1608',-.35)+'">'+esc(e.n)+'</b>'+lvB(clamp(e.lv|0,0,69))+'<b>:</b> '+esc(e.x);lg.appendChild(d);while(lg.children.length>30)lg.firstChild.remove();lg.scrollTop=lg.scrollHeight}if(p&&p.alive)addPop(p.x,p.y-60,e.x.length>22?e.x.slice(0,21)+'…':e.x,'#fff',18,2.2);SFX.pop&&SFX.pop();break}
 case 'treasure':SFX.pop&&SFX.pop();SFX.choir();burst(e.x,e.y,30,['#ffd23f','#fff','#ffe9a8'],320,8,0);break;
 case 'flipped':SFX.whoosh(.9);shake=Math.max(shake,10);break;
 case 'splash':if(e.id)rumble(e.id,.8,260);SFX.splash();if(V&&V.phase==='play')SFX.crowd(e.self?.5:1);if(e.self)setTimeout(()=>SFX.sad(),350);shake=Math.max(shake,8);burst(e.x,e.y,30,['#fff6e0','#ffe9a8','#f5a623','#fff'],260,9,1);rings.push({x:e.x,y:e.y,t:0,life:.8,r:80,col:'#fff6e0'});
  addPop(e.x,e.y-40,e.self?pick(['WHOOPS','SKILL ISSUE','???','WHY','TRIPPED ON NOTHING','MAIN CHARACTER MOMENT','IT WAS LAG']):pick(['SPLOOSH!','F IN CHAT','GLUG GLUG','BYE!','TOUCH GRASS','RATIO\'D','NOT LIKE THIS','CERTIFIED SOAKED','GG GO NEXT']),'#fff',36,1.1);break;
 case 'boing':SFX.boing();bumpSq[e.i]=1;addPop(e.x,e.y-40,'BOING!','#ff7eb6',32);break;
 case 'boom':SFX.boom();shake=30;flash=.35;burst(e.x,e.y,60,['#ff5a5f','#ffd23f','#ff9f1c','#fff','#444'],700,12,0);rings.push({x:e.x,y:e.y,t:0,life:.6,r:220,col:'#ffd23f'});addPop(e.x,e.y-40,'KABOOM!','#ff5a5f',64,1.3);break;
 case 'pass':SFX.pass();if(p)addPop(p.x,p.y-70,e.first?'HOT SHOT!':'TAG!','#ff5a5f',26);break;
 case 'hic':SFX.hic(pitch);if(p)addPop(p.x+rnd(-20,20),p.y-60,'*hic*','#fff',22);break;
 case 'emote':if(e.em===3)SFX.burp();else if(e.em===0)SFX.hic(pitch);else if(e.em===4)SFX.laugh(pitch);else if(e.em===7)SFX.ding(0);
  else if(e.em===5){SFX.sob(pitch);if(p)for(let i=0;i<10;i++)parts.push({x:p.x+(i%2?1:-1)*p.r*.35,y:p.y-p.r*.6,vx:(i%2?1:-1)*rnd(40,120),vy:rnd(-20,20),z:0,vz:rnd(120,260),t:-i*.08,life:rnd(.5,.8),sz:rnd(3,4.5),col:'#7fd0ff',g:1})}
  else if(e.em===6){SFX.clink();if(p)burst(p.x+p.r,p.y-p.r*1.2,10,['#fff6e0','#ffd23f','#fff'],160,5,1)}else SFX.babble(160*pitch,e.em===2?6:4);break;
 case 'say':say(e.text,e.force);break;
 case 'cd':SFX.ding(e.n);break;
 case 'go':SFX.horn();setTimeout(()=>SFX.cheer(),100);flash=.15;break;
 case 'final':zoom=1.55;zoomT=1.2;zx=e.x;zy=e.y;break;
 case 'win':if(e.id){SFX.fanfare();SFX.cheer()}else SFX.sad();break;
 case 'champ':SFX.fanfare();setTimeout(()=>SFX.cheer(),400);setTimeout(()=>SFX.fanfare(),900);break;
 case 'full':if(e.id===NET.myId)SFX.full();break;
 case 'sudden':SFX.horn();flash=.2;break;
 case 'glass':{const big=e.hp<=0&&!e.small;SFX.glass(e.hp<=0);shake=Math.max(shake,big?9:4);burst(e.x,e.y,big?26:8,['#d8f3ff','#ffffff','#a8dcf5'],big?420:200,big?6:4,1);addPop(e.x,e.y-30,big?pick(['SMASH!','SHATTER!','CRASH!']):'CRACK!',big?'#d8f3ff':'#fff',big?36:24);break}
 case 'whoa':SFX.ooh(.6);if(p){addPop(p.x,p.y-60,pick(['WHOA!','NOPE!','CLOSE ONE']),'#fff',20,.7);const a=A_(p.id);a.pvx+=200}break;
 case 'wavewarn':SFX.horn();break;
 case 'wave':SFX.splash();shake=Math.max(shake,22);surge=1;surgeA=e.a;burst(CX+Math.cos(e.a)*-300,CY+Math.sin(e.a)*-300,40,['#fff6e0','#ffe9a8','#fff'],500,10,1);addPop(CX,CY-120,'SLOOOSH!','#fff6e0',72,1.1);break;
 case 'pts':if(p)addPop(p.x,p.y-60,e.v>0?'+1':'-1',e.v>0?'#5be37d':'#ff5a5f',34);break;
 case 'zone':SFX.ding(0);addPop(e.x,e.y-40,'NEW THRONE!','#ffd23f',30);rings.push({x:e.x,y:e.y,t:0,life:.6,r:110,col:'#ffd23f'});break;
 case 'chaos':SFX.horn();flash=.2;shake=Math.max(shake,8);break;
 case 'item':SFX.pop();rings.push({x:e.x,y:e.y,t:0,life:.5,r:60,col:'#fff'});break;
 case 'drink':if(p){addPop(p.x,p.y-60,'*glug glug*','#ffe9a8',20,.6);const t0=AC?now():0;if(AC)for(let i=0;i<4;i++)tone('sine',rnd(180,260),rnd(90,140),.09,.25,t0+i*.1)}break;
 case 'parry':SFX.whoosh(e.dodge?.6:.2);if(p&&e.dodge)burst(p.x,p.y,8,['#fff','#e8f4ff'],160,6,0);if(p&&!e.dodge)rings.push({x:p.x,y:p.y-8,t:0,life:.22,r:55,col:'#ffd23f'});break;
 case 'catch':SFX.pickup();if(p)addPop(p.x,p.y-60,'CAUGHT IT!','#5be37d',30);shake=Math.max(shake,5);break;
 case 'deflect':SFX.clang();addPop(e.x,e.y-30,e.bat?pick(['RETURN TO SENDER!','BELLY SMASH!','HOME RUN!']):e.bump?pick(['PARRIED!','NO U','NOT TODAY','DENIED']):'DEFLECTED!','#ffd23f',e.bump?36:30);burst(e.x,e.y,16,['#ffd23f','#fff'],380,5,0);shake=Math.max(shake,8);flash=.08;break;
 case 'burp':SFX.bonk(.2);tone('sawtooth',90,55,.35,.25);if(p){addPop(p.x,p.y-60,pick(['*BUUURP*','OVERCOOKED','HELD IT TOO LONG','excuse me','SKILL ISSUE']),'#9be37a',26,.9);burst(p.x,p.y-10,14,['#c8f0a0','#9be37a','#fff'],200,7,0)}break;
 case 'perfect':tone('square',880,1320,.12,.18);if(p)rings.push({x:p.x,y:p.y-8,t:0,life:.25,r:70,col:'#ffd23f'});break;
 case 'over':SFX.clang();shake=Math.max(shake,12);addPop(e.x,e.y-34,'OVERPOWERED!','#ff9f1c',36);burst(e.x,e.y,20,['#ff9f1c','#fff'],460,6,0);break;
 case 'lifelost':if(p&&e.n>0)addPop(p.x,p.y-70,e.n===1?'LAST LIFE!':e.n+' LIVES LEFT','#ff5a5f',24,1.1);else if(p)addPop(p.x,p.y-70,'OUT!','#ff5a5f',30,1.2);break;
 case 'meme':addPop(e.x,e.y-90,e.t,pick(['#ffd23f','#ff7eb6','#2bd2ff','#fff']),e.t.length>12?28:38,1.3,2);if(e.v)say(e.t.toLowerCase().replace(/!/g,''));shake=Math.max(shake,6);break;
 case 'whiff':tone('triangle',300,150,.15,.2);if(p)addPop(p.x,p.y-55,pick(['whiff','air ball','swing and a miss','parried the air']),'#ccc',18,.6);break;
 case 'crate':SFX.pickup();burst(e.x,e.y,18,['#c98a4a','#8a5a2e','#ffd23f'],320,6,1);addPop(e.x,e.y-40,e.n,pick(['#ffd23f','#5be37d','#ff7eb6']),28,1.1);break;
 case 'corkup':SFX.pop();addPop(e.x,e.y-30,'+1 PINT','#ffe9a8',18,.6);break;
 case 'armor':SFX.clang();addPop(e.x,e.y-50,'ARMOR SAVED YOU!','#ffd23f',22);burst(e.x,e.y,16,['#ffd23f','#fff'],350,5,0);break;
 case 'pickup':SFX.pickup();addPop(e.x,e.y-40,'CORK BLASTER!','#ffd23f',26);break;
 case 'shot':SFX.whoosh(.5);shake=Math.max(shake,5);burst(e.x,e.y,10,['#fff','#ffe9a8','#fff6e0'],300,6,0);addPop(e.x,e.y-20,e.last?'LAST ONE!':'YEET!','#fff',e.last?24:28,.6);break;
 }}

