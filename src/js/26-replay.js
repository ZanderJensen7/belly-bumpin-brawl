// 26-replay.js: instant replay of the last seconds of a match
// ---- instant replay: last ~4s of a match, slow-mo at the end, before the champion screen
const RPL={buf:[],on:0,v:null,lastPh:null};
function unpackSnap(s){s.players=s.pk.map(a=>{const o={};PK.forEach((k,i)=>{o[k]=PKB.has(k)?!!a[i]:a[i]});return o});delete s.pk;s.ev=[...(s.ev||[])];return s}
function recFrame(s){if(!s||s.phase!=='play'||s.hub)return;RPL.buf.push({t:performance.now(),s});if(RPL.buf.length>150)RPL.buf.shift()}
function startReplay(){const b=RPL.buf;if(b.length<30)return;const tEnd=b[b.length-1].t;const fr=b.filter(f=>f.t>=tEnd-4200);RPL.buf=[];RPL.fr=fr;RPL.t0=fr[0].t;RPL.end=tEnd-fr[0].t;RPL.t=0;RPL.i=0;RPL.hold=0;RPL.armed=0;RPL.cam=null;rplPlan();RPL.on=1;document.body.classList.add('replay');SFX.whoosh&&SFX.whoosh(.9)}
function stopReplay(){RPL.on=0;RPL.v=null;RPL.fr=null;RPL.cam=null;document.body.classList.remove('replay')}
function replayTick(dt){const ph=V&&V.phase;if(ph==='over'&&RPL.lastPh&&RPL.lastPh!=='over'&&!RPL.on)startReplay();if(ph&&ph!=='over'&&ph!=='play'&&ph!=='results'&&RPL.buf.length&&ph==='lobby')RPL.buf=[];RPL.lastPh=ph;
 if(!RPL.on)return;if(ph!=='over'){stopReplay();return}
 const sp=rplSpeed(RPL.t);RPL.slow=sp<1;RPL.t+=dt*1000*sp;const fr=RPL.fr;
 while(RPL.i<fr.length-1&&fr[RPL.i+1].t-RPL.t0<=RPL.t){RPL.i++;for(const e of (fr[RPL.i].s.ev||[]))if(!['chat','say','champ','pzlv','pzwin','emote'].includes(e.k))try{onEv(e)}catch(_){}}
 const A=fr[RPL.i],B=fr[Math.min(RPL.i+1,fr.length-1)],span=Math.max(1,B.t-A.t),u=clamp((RPL.t-(A.t-RPL.t0))/span,0,1);
 const bm=new Map(B.s.players.map(p=>[p.id,p]));RPL.v=Object.assign({},A.s,{players:A.s.players.map(p=>{const q=bm.get(p.id);return q?Object.assign({},p,{x:p.x+(q.x-p.x)*u,y:p.y+(q.y-p.y)*u}):Object.assign({},p)}),phase:'play'});
 RPL.cam=rplCam(A,B,u);
 if(RPL.t>=RPL.end){RPL.hold+=dt;if(RPL.hold>.9)stopReplay()}}
addEventListener('keydown',e=>{if(RPL.on&&e.code!=='Escape'){stopReplay();e.stopPropagation()}},true);addEventListener('pointerdown',()=>{if(RPL.on)stopReplay()},true);
setInterval(()=>{if(!RPL.on||!navigator.getGamepads)return;for(const gp of navigator.getGamepads())if(gp&&gp.buttons.some(b=>b&&b.pressed)){if(RPL.armed)stopReplay();return}RPL.armed=1},100);
// slow-mo plan: find the final KO, the hit that caused it (tD), and if that hit was a thrown drink, the drink's flight (mug cam)
function rplPlan(){const fr=RPL.fr,rt=i=>fr[i].t-RPL.t0;RPL.tD=RPL.end;RPL.tK=RPL.end;RPL.vic=null;RPL.mug=null;RPL.tM=null;let iK=-1;
 for(let i=fr.length-1;i>=0&&iK<0;i--){const ev=fr[i].s.ev||[];if(ev.some(e=>e.k==='final')){iK=i;const sp=ev.find(e=>e.k==='splash'&&e.id);if(sp)RPL.vic=sp.id}}
 if(iK<0)return;RPL.tK=rt(iK);RPL.tD=RPL.tK;if(!RPL.vic)return;
 let iH=-1,hit=null;for(let i=iK;i>=0&&iH<0;i--)for(const e of (fr[i].s.ev||[]))if(e.k==='bonk'&&e.id===RPL.vic){iH=i;hit=e}
 if(iH<0||RPL.tK-rt(iH)>3000)return;RPL.tD=rt(iH);if(!hit.cork)return;
 // walk back from the hit, following the nearest flying drink each frame
 const mug=new Map();let x=hit.x,y=hit.y,i0=iH;mug.set(iH,[x,y]);
 for(let i=iH-1;i>=0;i--){let best=null,bd=170;for(const c of (fr[i].s.corks||[])){const d=hyp(c.x-x,c.y-y);if(d<bd){bd=d;best=c}}if(!best)break;x=best.x;y=best.y;mug.set(i,[x,y]);i0=i}
 if(iH-i0<2)return;RPL.mug=mug;RPL.tM=rt(i0)}
// playback speed: full speed, ease into slow-mo just before the decisive hit (or for the whole mug flight), slow again for the KO splash, then a slowish tail
function rplSpeed(t){const ez=v=>v*v*(3-2*v),lo=RPL.mug?.25:.3,zone=(a,b,c,d,l)=>t<a||t>=d?1:t<b?1-(1-l)*ez((t-a)/Math.max(1,b-a)):t<c?l:1-(1-l)*ez((t-c)/Math.max(1,d-c));
 const hit=RPL.mug?zone(RPL.tM-250,RPL.tM,RPL.tD+450,RPL.tD+950,lo):zone(RPL.tD-700,RPL.tD-150,RPL.tD+450,RPL.tD+950,lo),ko=zone(RPL.tK-500,RPL.tK-150,RPL.tK+250,RPL.tK+750,.35);
 return Math.min(hit,ko,t>RPL.tK+250?.55:1)}
// camera target during the replay (null = normal camera)
function rplCam(A,B,u){const pos=id=>{const p=A.s.players.find(q=>q.id===id),q=B.s.players.find(q=>q.id===id);if(!p)return null;return q?[p.x+(q.x-p.x)*u,p.y+(q.y-p.y)*u]:[p.x,p.y]};
 const t=RPL.t;if(RPL.mug&&t>=RPL.tM-250&&t<RPL.tD){const m=RPL.mug,ia=RPL.i,a=m.get(ia),b=m.get(ia+1);const at=a||b||m.get([...m.keys()].find(k=>k>ia));if(!at)return null;const c=a&&b?[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]:at;return {x:c[0],y:c[1],z:1.9}}
 if(RPL.vic&&t>=RPL.tD-(RPL.mug?0:500)){const v=pos(RPL.vic);if(v)return {x:v[0],y:v[1],z:RPL.mug?1.7:1.4}}
 return null}
