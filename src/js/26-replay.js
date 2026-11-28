// 26-replay.js: instant replay of the last seconds of a match
// ---- instant replay: last ~4s of a match, slow-mo around the decisive hit, before the champion screen
// Frames are keyed by host sim time (snapshot st), so every player shares one timeline. The host picks the moment and runs the
// replay clock and sends it in the snapshot as S.rp; joined players follow that clock, so everyone sees the same frame at once.
const RPL={buf:[],on:0,v:null,lastPh:null};
function unpackSnap(s){s.players=s.pk.map(a=>{const o={};PK.forEach((k,i)=>{o[k]=PKB.has(k)?!!a[i]:a[i]});return o});delete s.pk;s.ev=[...(s.ev||[])];return s}
function recFrame(s){if(!s||s.phase!=='play'||s.hub)return;const t=Math.round((s.st||0)*1000),b=RPL.buf,l=b[b.length-1];if(l&&t<=l.t){if(t<l.t-2000)RPL.buf=[];else{if(t===l.t&&s.ev&&s.ev.length)l.s.ev=(l.s.ev||[]).concat(s.ev);return}}RPL.buf.push({t,s});if(RPL.buf.length>150)RPL.buf.shift()}
const rplHost=()=>NET.mode!=='client';
// host: start from its own buffer and pick the moment. client: start from the host's plan (rp)
function startReplay(rp){const b=RPL.buf;if(b.length<(rp?5:30))return;const tEnd=rp?rp.a+rp.e:b[b.length-1].t,t0=rp?rp.a:tEnd-4200;const fr=b.filter(f=>f.t>=t0-40&&f.t<=tEnd+40);if(fr.length<2)return;
 RPL.buf=[];RPL.fr=fr;RPL.t0=rp?rp.a:fr[0].t;RPL.end=rp?rp.e:tEnd-fr[0].t;RPL.t=rp?rp.t:0;RPL.i=0;RPL.hold=0;RPL.armed=0;RPL.cam=null;RPL.cD=RPL.cK=0;
 if(rp){RPL.tD=rp.d;RPL.tK=rp.k;RPL.vic=rp.v;RPL.tM=rp.m;RPL.mug=null;if(rp.m!=null)rplMug(rp.hx,rp.hy,rp.d)}else{rplPlan();if(S)S.rp={a:RPL.t0,e:Math.round(RPL.end),d:Math.round(RPL.tD),k:Math.round(RPL.tK),v:RPL.vic,m:RPL.mug?Math.round(RPL.tM):null,hx:RPL.hx|0,hy:RPL.hy|0,t:0}}
 while(RPL.i<fr.length-1&&fr[RPL.i+1].t-RPL.t0<=RPL.t)RPL.i++;RPL.on=1;document.body.classList.add('replay');SFX.whoosh&&SFX.whoosh(.9)}
function stopReplay(){if(RPL.on&&V&&V.phase==='over')SFX.crowd('cheer',2);RPL.on=0;RPL.v=null;RPL.fr=null;RPL.cam=null;document.body.classList.remove('replay');if(rplHost()&&S)S.rp=null}
function replayTick(dt){const ph=V&&V.phase,host=rplHost();
 if(host){if(ph==='over'&&RPL.lastPh&&RPL.lastPh!=='over'&&!RPL.on)startReplay()}else if(ph==='over'&&V.rp&&!RPL.on&&RPL.lastRp!==V.rp.a)startReplay(V.rp);
 if(!host)RPL.lastRp=V&&V.rp?V.rp.a:RPL.lastRp;if(ph==='lobby'){RPL.buf=[];RPL.lastRp=null}RPL.lastPh=ph;
 if(!RPL.on)return;if(ph!=='over'||(!host&&!V.rp)){stopReplay();return}
 const sp=rplSpeed(RPL.t);RPL.slow=sp<1;RPL.t+=dt*1000*sp;
 if(!host){const rp=V.rp,tg=rp.t+Math.min(200,performance.now()-(V._rx||performance.now()))*rplSpeed(rp.t),df=tg-RPL.t;if(Math.abs(df)>300)RPL.t=tg;else RPL.t+=df*Math.min(1,dt*4)}
 const fr=RPL.fr;RPL.t=Math.min(RPL.t,RPL.end);
 while(RPL.i<fr.length-1&&fr[RPL.i+1].t-RPL.t0<=RPL.t){RPL.i++;for(const e of (fr[RPL.i].s.ev||[]))if(!['chat','say','champ','pzlv','pzwin','emote','crowd'].includes(e.k))try{onEv(e)}catch(_){}}
 const A=fr[RPL.i],B=fr[Math.min(RPL.i+1,fr.length-1)],span=Math.max(1,B.t-A.t),u=clamp((RPL.t-(A.t-RPL.t0))/span,0,1);
 const bm=new Map(B.s.players.map(p=>[p.id,p]));RPL.v=Object.assign({},A.s,{players:A.s.players.map(p=>{const q=bm.get(p.id);return q?Object.assign({},p,{x:p.x+(q.x-p.x)*u,y:p.y+(q.y-p.y)*u}):Object.assign({},p)}),phase:'play'});
 RPL.cam=rplCam(A,B,u);
 // the crowd gasps as the slow-mo hit lands and roars at the splash. Everyone's replay clock follows the host's plan, so it lands together
 if(RPL.vic){if(!RPL.cD&&RPL.t>=RPL.tD-60&&RPL.tD<RPL.tK-200){RPL.cD=1;SFX.crowd('ooh',2)}if(!RPL.cK&&RPL.t>=RPL.tK&&RPL.t<RPL.tK+1500){RPL.cK=RPL.cD=1;SFX.crowd('cheer',3)}}
 if(host){if(S.rp)S.rp.t=Math.round(RPL.t);if(RPL.t>=RPL.end){RPL.hold+=dt;if(RPL.hold>.9)stopReplay()}}}
// only the host can skip (it ends the replay for everyone); offline that's you
addEventListener('keydown',e=>{if(RPL.on&&e.code!=='Escape'){if(rplHost())stopReplay();e.stopPropagation()}},true);addEventListener('pointerdown',()=>{if(RPL.on&&rplHost())stopReplay()},true);
setInterval(()=>{if(!RPL.on||!navigator.getGamepads)return;for(const gp of navigator.getGamepads())if(gp&&gp.buttons.some(b=>b&&b.pressed)){if(RPL.armed&&rplHost())stopReplay();return}RPL.armed=1},100);
// slow-mo plan (host): find the final KO, the hit that caused it (tD), and if that hit was a thrown drink, the drink's flight (mug cam)
function rplPlan(){const fr=RPL.fr,rt=i=>fr[i].t-RPL.t0;RPL.tD=RPL.end;RPL.tK=RPL.end;RPL.vic=null;RPL.mug=null;RPL.tM=null;let iK=-1;
 for(let i=fr.length-1;i>=0&&iK<0;i--){const ev=fr[i].s.ev||[];if(ev.some(e=>e.k==='final')){iK=i;const sp=ev.find(e=>e.k==='splash'&&e.id);if(sp)RPL.vic=sp.id}}
 if(iK<0)return;RPL.tK=rt(iK);RPL.tD=RPL.tK;if(!RPL.vic)return;
 let iH=-1,hit=null;for(let i=iK;i>=0&&iH<0;i--)for(const e of (fr[i].s.ev||[]))if(e.k==='bonk'&&e.id===RPL.vic){iH=i;hit=e}
 if(iH<0||RPL.tK-rt(iH)>3000)return;RPL.tD=rt(iH);if(!hit.cork)return;RPL.hx=hit.x;RPL.hy=hit.y;rplMug(hit.x,hit.y,RPL.tD);if(RPL.mug)RPL.tM=RPL.tM0}
// walk back from the hit, following the nearest flying drink each frame (each player traces it in their own frames)
function rplMug(x,y,tD){const fr=RPL.fr;let iH=0;for(let i=0;i<fr.length;i++)if(fr[i].t-RPL.t0<=tD+20)iH=i;const mug=new Map();let i0=iH;mug.set(iH,[x,y]);
 for(let i=iH-1;i>=0;i--){let best=null,bd=170;for(const c of (fr[i].s.corks||[])){const d=hyp(c.x-x,c.y-y);if(d<bd){bd=d;best=c}}if(!best)break;x=best.x;y=best.y;mug.set(i,[x,y]);i0=i}
 if(iH-i0<2){RPL.mug=null;return}RPL.mug=mug;RPL.tM0=fr[i0].t-RPL.t0}
// playback speed: full speed, ease into slow-mo just before the decisive hit (or for the whole mug flight), slow again for the KO splash, then a slowish tail
function rplSpeed(t){const ez=v=>v*v*(3-2*v),mug=RPL.tM!=null,lo=mug?.25:.3,zone=(a,b,c,d,l)=>t<a||t>=d?1:t<b?1-(1-l)*ez((t-a)/Math.max(1,b-a)):t<c?l:1-(1-l)*ez((t-c)/Math.max(1,d-c));
 const hit=mug?zone(RPL.tM-250,RPL.tM,RPL.tD+450,RPL.tD+950,lo):zone(RPL.tD-700,RPL.tD-150,RPL.tD+450,RPL.tD+950,lo),ko=zone(RPL.tK-500,RPL.tK-150,RPL.tK+250,RPL.tK+750,.35);
 return Math.min(hit,ko,t>RPL.tK+250?.55:1)}
// camera target during the replay (null = normal camera)
function rplCam(A,B,u){const pos=id=>{const p=A.s.players.find(q=>q.id===id),q=B.s.players.find(q=>q.id===id);if(!p)return null;return q?[p.x+(q.x-p.x)*u,p.y+(q.y-p.y)*u]:[p.x,p.y]};
 const t=RPL.t,mug=RPL.tM!=null;if(mug&&RPL.mug&&t>=RPL.tM-250&&t<RPL.tD){const m=RPL.mug,ia=RPL.i,a=m.get(ia),b=m.get(ia+1);const at=a||b||m.get([...m.keys()].sort((x,y)=>x-y).find(k=>k>ia));if(!at)return null;const c=a&&b?[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]:at;return {x:c[0],y:c[1],z:1.9}}
 if(RPL.vic&&t>=RPL.tD-(mug?0:500)){const v=pos(RPL.vic);if(v)return {x:v[0],y:v[1],z:mug?1.7:1.4}}
 return null}
