// 11-couch.js: couch play: extra controllers join as local guests (PADS, LOC)
// ---- couch: extra local players on extra controllers. PADS[index] = 'p1' | guest slot k (1..3)
const PADS={};const LOC=new Map();const COUCH_N=['Couch Carl','Sofa Sam','Recliner Rita','Beanbag Bo','Futon Fred','Lazy Larry'];
function readPad(gp){let x=0,y=0;const ax=gp.axes[0]||0,ay=gp.axes[1]||0;if(hyp(ax,ay)>.2){x+=ax;y+=ay}const bt=i=>gp.buttons[i]&&gp.buttons[i].pressed;
 if(bt(14))x-=1;if(bt(15))x+=1;if(bt(12))y-=1;if(bt(13))y+=1;const l=hyp(x,y);if(l>1){x/=l;y/=l}
 return {x:Math.round(x*100)/100,y:Math.round(y*100)/100,d:bt(0)||bt(7)?1:0,f:bt(2)||bt(5)?1:0,p:bt(1)||bt(4)?1:0,a:null,m:0}}
function padActive(gp){const i=readPad(gp);return hyp(i.x,i.y)>.3||i.d||i.f||i.p}
function couchOk(){return NET.mode&&V&&!V.hub&&!(S&&S.hub)&&(NET.mode==='host'||NET.hostConn)}
function guestId(k){return NET.myId+'~'+k}
function couchJoin(gi){if(!couchOk())return;let k=1;while(LOC.has(k))k++;if(k>3)return;const nm=COUCH_N[(k-1+((Math.random()*2)|0)*3)%COUCH_N.length];const g={k,pad:gi,name:nm,color:ri(0,COLORS.length-1),hat:ri(0,8),inp:{x:0,y:0,d:0,f:0,p:0,a:null,m:0},bk:'',t:0};LOC.set(k,g);PADS[gi]=k;
 if(NET.mode==='host'){if(S.players.length>=6){LOC.delete(k);delete PADS[gi];toast('Room is full!',2);return}hostGuest('host',k,g)}else try{NET.hostConn.send({t:'lj',k,name:g.name,color:g.color,hat:g.hat})}catch(e){}
 SFX.pop&&SFX.pop();toast('🎮 P'+(k+1)+' joined: '+g.name+' (SELECT to leave)',3)}
function couchLeave(k){const g=LOC.get(k);if(!g)return;LOC.delete(k);for(const i in PADS)if(PADS[i]===k)delete PADS[i];if(NET.mode==='host'&&S)S.players=S.players.filter(p=>p.id!==guestId(k));else if(NET.hostConn)try{NET.hostConn.send({t:'ll',k})}catch(e){}toast('🎮 P'+(k+1)+' left',2)}
function couchReset(){LOC.clear();for(const i in PADS)if(PADS[i]!=='p1')delete PADS[i]}
function hostGuest(owner,k,m){if(!S||S.hub)return;const id=owner+'~'+k;if(P(id))return;if(S.players.length>=6)return;const p=newPlayer(id,String(m.name||'Guest').slice(0,24),uniqueColor(m.color|0),clamp(m.hat|0,0,HATS.length-1),false);p.guest=1;p.owner=owner;p.team=balTeam();placeRandom(p);if(S.phase!=='lobby'){p.alive=false;p.fall=0;if(S.phase==='play'&&isCont())p.respawn=1}S.players.push(p);ev('emote',{id:p.id,em:2})}
const padPrev2={};
function couchPads(dt){const pads=navigator.getGamepads?navigator.getGamepads():[];const seen=new Set();
 for(const gp of pads){if(!gp)continue;const i=gp.index;seen.add(i);const st=gp.buttons[9]&&gp.buttons[9].pressed,sel=gp.buttons[8]&&gp.buttons[8].pressed,stE=st&&!padPrev2[i+'s'],selE=sel&&!padPrev2[i+'b'];padPrev2[i+'s']=st;padPrev2[i+'b']=sel;
  const own=PADS[i];
  if(own===undefined){if(stE&&couchOk()&&Object.values(PADS).includes('p1')){couchJoin(i);continue}if(stE&&couchOk()&&curScreen==='lobby'&&performance.now()-(window.lastKbT||-1e9)<30000){couchJoin(i);continue}if(padActive(gp)&&!Object.values(PADS).includes('p1'))PADS[i]='p1'}
  else if(own==='p1'){if(stE&&NET.mode&&!navBox())padStart();if(selE&&NET.mode)toggleEsc()}
  else{const g=LOC.get(own);if(!g){delete PADS[i];continue}if(selE){couchLeave(own);continue}g.inp=readPad(gp);if(gp.buttons[3]&&gp.buttons[3].pressed&&!padPrev2[i+'y'])g.em=ri(0,3);padPrev2[i+'y']=gp.buttons[3]&&gp.buttons[3].pressed}}
 for(const i in PADS)if(!seen.has(+i)){const o=PADS[i];delete PADS[i];if(o!=='p1')couchLeave(o)}
 if(!couchOk()){if(LOC.size)couchReset();return}
 for(const [k,g] of LOC){if(NET.mode==='host'){const p=P(guestId(k));if(p){p.inp=g.inp;if(g.em>=0){emote(p,g.em)}}else if(S&&S.players.length<6&&!S.hub)hostGuest('host',k,g)}
  else{const q=v=>Math.round(v*20)/20,ii=g.inp,key=q(ii.x)+','+q(ii.y)+ii.d+ii.f+ii.p;g.t-=dt;if(key!==g.bk||g.t<=0){g.bk=key;g.t=.25;try{NET.hostConn.send({t:'gi',k,x:q(ii.x),y:q(ii.y),d:ii.d,f:ii.f,p:ii.p})}catch(e){}}if(g.em>=0)try{NET.hostConn.send({t:'ge',k,e:g.em})}catch(e){}}
  g.em=-1}}
addEventListener('keydown',()=>{window.lastKbT=performance.now()},true);setInterval(()=>{const el=$('#couchHint');if(!el)return;const n=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean).length:0;document.body.classList.toggle('haspad',n>0);el.style.display=n&&couchOk()&&LOC.size<3?'block':'none'},700);addEventListener('mousedown',()=>{window.lastKbT=performance.now()},true);
