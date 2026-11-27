// 26-replay.js: instant replay of the last seconds of a match
// ---- instant replay: last ~4s of a match, slow-mo at the end, before the champion screen
const RPL={buf:[],on:0,v:null,lastPh:null};
function unpackSnap(s){s.players=s.pk.map(a=>{const o={};PK.forEach((k,i)=>{o[k]=PKB.has(k)?!!a[i]:a[i]});return o});delete s.pk;s.ev=[...(s.ev||[])];return s}
function recFrame(s){if(!s||s.phase!=='play'||s.hub)return;RPL.buf.push({t:performance.now(),s});if(RPL.buf.length>150)RPL.buf.shift()}
function startReplay(){const b=RPL.buf;if(b.length<30)return;const tEnd=b[b.length-1].t;const fr=b.filter(f=>f.t>=tEnd-4200);RPL.buf=[];RPL.fr=fr;RPL.t0=fr[0].t;RPL.end=tEnd-fr[0].t;RPL.t=0;RPL.i=0;RPL.hold=0;RPL.armed=0;RPL.on=1;document.body.classList.add('replay');SFX.whoosh&&SFX.whoosh(.9)}
function stopReplay(){RPL.on=0;RPL.v=null;RPL.fr=null;document.body.classList.remove('replay')}
function replayTick(dt){const ph=V&&V.phase;if(ph==='over'&&RPL.lastPh&&RPL.lastPh!=='over'&&!RPL.on)startReplay();if(ph&&ph!=='over'&&ph!=='play'&&ph!=='results'&&RPL.buf.length&&ph==='lobby')RPL.buf=[];RPL.lastPh=ph;
 if(!RPL.on)return;if(ph!=='over'){stopReplay();return}
 const left=RPL.end-RPL.t,sp=left>1500?1:.4;RPL.slow=sp<1;RPL.t+=dt*1000*sp;const fr=RPL.fr;
 while(RPL.i<fr.length-1&&fr[RPL.i+1].t-RPL.t0<=RPL.t){RPL.i++;for(const e of (fr[RPL.i].s.ev||[]))if(!['chat','say','champ','pzlv','pzwin','emote'].includes(e.k))try{onEv(e)}catch(_){}}
 const A=fr[RPL.i],B=fr[Math.min(RPL.i+1,fr.length-1)],span=Math.max(1,B.t-A.t),u=clamp((RPL.t-(A.t-RPL.t0))/span,0,1);
 const bm=new Map(B.s.players.map(p=>[p.id,p]));RPL.v=Object.assign({},A.s,{players:A.s.players.map(p=>{const q=bm.get(p.id);return q?Object.assign({},p,{x:p.x+(q.x-p.x)*u,y:p.y+(q.y-p.y)*u}):Object.assign({},p)}),phase:'play'});
 if(RPL.t>=RPL.end){RPL.hold+=dt;if(RPL.hold>.9)stopReplay()}}
addEventListener('keydown',e=>{if(RPL.on&&e.code!=='Escape'){stopReplay();e.stopPropagation()}},true);addEventListener('pointerdown',()=>{if(RPL.on)stopReplay()},true);
setInterval(()=>{if(!RPL.on||!navigator.getGamepads)return;for(const gp of navigator.getGamepads())if(gp&&gp.buttons.some(b=>b&&b.pressed)){if(RPL.armed)stopReplay();return}RPL.armed=1},100);
