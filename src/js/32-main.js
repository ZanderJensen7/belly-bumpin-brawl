// 32-main.js: the main loop (logic, frame) and the title preview
// ============================================================ MAIN LOOP
let last=performance.now(),acc=0,sendAcc=0;const STEP=1/60;
let lastL=performance.now();
function logic(){const n_=performance.now();let dt=Math.min(.1,(n_-lastL)/1000);lastL=n_;
 gpNav(dt);if(NET.mode)sendInput(dt);
 if(NET.mode==='host'&&S){let sdt=dt;if(S.hs>0){S.hs-=dt;sdt*=.08}else if(S.slowT>0){S.slowT-=dt;sdt*=.3}acc+=sdt;let n=0;while(acc>=STEP&&n<6){simStep(STEP);acc-=STEP;n++}if(n>=6)acc=0;
  sendAcc+=dt;if(sendAcc>=1/30){sendAcc=0;if(S.phase==='play'&&!S.hub)recFrame(unpackSnap(snapshot0()));if(NET.conns.size)broadcast();else S.evq=[]}V=S;Music.wob=Math.max(0,...S.players.map(p=>p.buzz))*.3}}
setInterval(()=>{if(document.hidden&&NET.mode==='host')logic()},16);
let fpsN=0,fpsT=0,FPS=60;function frame(now_){let dt=Math.min(.1,(now_-last)/1000);last=now_;gtime+=dt;fpsN++;fpsT+=dt;if(fpsT>=2){FPS=Math.round(fpsN/fpsT);fpsN=0;fpsT=0}
 if(toastT>0){toastT-=dt;if(toastT<=0)$('#toast').classList.remove('on')}
 logic();
 if(NET.mode==='client'&&V){const L=Math.min(.45,(NET.rtt||.08)/2+(NET.relay?.06:.03));for(const p of V.players){const d=disp[p.id];if(!d)continue;
  const predOk=p.alive&&V.phase!=='intro'&&V.phase!=='results'&&V.phase!=='over';
  // Forget a half-charged or still-running predicted dash while we're dead or between rounds, or it fires on its own when play resumes.
  if(p.id===NET.myId&&!predOk&&d.pd){const q=d.pd;q.h=q.t=q.w=q.lg=0;d.pvx=null}
  if(p.id===NET.myId&&predOk){const inp=lastInp||{x:0,y:0};let ix=inp.x||0,iy=inp.y||0;if(V.mut&&V.mut.includes('nolegs')&&V.phase==='play'){ix=0;iy=0}if(V.mut&&V.mut.includes('reverse')){ix=-ix;iy=-iy}
   // Predict our own dash the moment Space is released, instead of waiting a round trip for the host.
   // PD mirrors the host's rules: h = hold time, q = dash charges left (2, refill after .9s), t = predicted dash time left,
   // w = window in which the host's (late) copy of this dash is ignored so it isn't applied twice.
   const PD=d.pd||(d.pd={h:0,q:2,qt:0,t:0,w:0}),act=V.phase==='play'||V.phase==='lobby',rev=V.mut&&V.mut.includes('reverse');
   if(PD.q<2&&PD.t<=0){PD.qt+=dt;if(PD.qt>=.9){PD.q=2;PD.qt=0}}PD.w=Math.max(0,PD.w-dt);if(p.stun>0||!p.alive||p.hand>0){PD.t=0;PD.w=0;PD.h=0}
   const canDash=act&&p.stun<=0&&!(p.hand>0)&&PD.t<=0&&!(PD.lg>0)&&(p.dash<=0||PD.w>0)&&PD.q>0&&!p.aiming&&!p.pzv;
   if(inp.d&&canDash)PD.h+=dt;else if(PD.h>0){const cm=(p.courage>0?4:1)*Math.pow(1.3,p.pks?p.pks.split(PERKS.quick[0]).length-1:0),c=Math.min(1,PD.h*1.5*cm),burped=PD.h>(1/(1.5*cm))+1.4;
    if(!inp.d&&canDash&&!burped){let dx,dy;const l=hyp(inp.x||0,inp.y||0);if(inp.m&&typeof inp.a==='number'){dx=Math.cos(inp.a);dy=Math.sin(inp.a)}else if(l>.2){dx=inp.x/l;dy=inp.y/l}else{dx=Math.cos(p.face)*(rev?-1:1);dy=Math.sin(p.face)*(rev?-1:1)}
     if(rev){dx=-dx;dy=-dy}const sp=470+720*c;d.pvx=dx*sp;d.pvy=dy*sp;PD.t=.2+.25*c;PD.w=PD.t+L*2+.12;PD.q--;PD.qt=0}PD.h=0}
   // The host ends a dash when it hits something: a glass rail, a bumper or another player. Stop predicting at the same spot and
   // hold there (w keeps the correction gentle) until the host's answer arrives, instead of flying through and rubber-banding back.
   if(PD.t>0){let hit=0;const toward=(x,y)=>(x-d.x)*d.pvx+(y-d.y)*d.pvy>0;
    for(const r of V.rails||[]){if(r.hp<=0)continue;const q=segDist(d.x,d.y,r);if(q[0]<p.r+9&&toward(q[1],q[2])){hit=2;const dl=q[0]||1,nx=(d.x-q[1])/dl,ny=(d.y-q[2])/dl,vn=d.pvx*nx+d.pvy*ny;d.pvx-=1.5*vn*nx;d.pvy-=1.5*vn*ny;break}} // rails bounce you back at half speed, like the host does
    if(!hit)for(const b of V.bumpers||[])if(hyp(b.x-d.x,b.y-d.y)<p.r+b.r+2&&toward(b.x,b.y)){hit=1;break}
    if(!hit)for(const q of V.players)if(q!==p&&q.alive&&hyp(q.x-d.x,q.y-d.y)<p.r+q.r+2&&toward(q.x,q.y)){hit=1;break}
    if(hit){PD.t=0;PD.lg=0;PD.w=L*2+.15;if(hit===1){d.pvx*=.2;d.pvy*=.2}}}
   const mine=PD.t>0;if(mine){PD.t-=dt;if(PD.t<=0)PD.lg=.13}PD.lg=Math.max(0,(PD.lg||0)-dt); // lg: the host gives you weak steering for .13s after a dash
   const free=(p.stun<=0&&(p.dash<=0||PD.w>0)&&!(p.fall>0&&!p.alive))&&!mine;if(d.pvx==null){d.pvx=p.vx;d.pvy=p.vy}
   if(mine){let dk=V.mut&&V.mut.includes('spill')?.4:.8;const MP=MAPS[V.map];if(MP&&MP.ice){const Lc=toLocal(d.x,d.y,V);if(!MP.grip.some(g=>hyp(Lc[0]-g.x,Lc[1]-g.y)<g.r))dk=.35} // same dash drag as the host: less on ice and with the spill rule
    const f=1-Math.exp(-dk*dt);d.pvx+=(ix*255-d.pvx)*f;d.pvy+=(iy*255-d.pvy)*f}else
   if(free){const sp=(p.charge>0||PD.h>0?105:255)*(PD.lg>0?.35:1)*(p.aiming?.5:1)*(p.wob>0?.35:1)*(p.parry>0?.3:1)*(p.r>30?.9:1),f=1-Math.exp(-7*dt);d.pvx+=(ix*sp-d.pvx)*f;d.pvy+=(iy*sp-d.pvy)*f}else{d.pvx=p.vx;d.pvy=p.vy}
   d.x+=d.pvx*dt;d.y+=d.pvy*dt;d.age+=dt;const tx=d.tx+d.vx*(L-Math.min(d.age,L)*0),ty=d.ty+d.vy*L,cr=PD.w>0?(mine?.4:.8):free?4:14;d.x+=(d.tx+d.vx*L-d.x)*Math.min(1,dt*cr);d.y+=(ty-d.y)*Math.min(1,dt*cr);p.x=d.x;p.y=d.y;continue}
  d.age+=dt;if(d.age<.15){d.tx+=d.vx*dt;d.ty+=d.vy*dt}d.x+=(d.tx-d.x)*Math.min(1,dt*16);d.y+=(d.ty-d.y)*Math.min(1,dt*16);p.x=d.x;p.y=d.y}
  for(const k of V.kegs)if(k.warn<=0){k.x+=k.vx*dt;k.y+=k.vy*dt}for(const c of V.corks)c.x+=c.vx*dt,c.y+=c.vy*dt;if(V.phase==='play'){V.matchT+=dt;V.mutT+=dt}if(V.bomb&&V.phase==='play')V.bomb.fuse=Math.max(0,V.bomb.fuse-dt);V.pt+=dt;}
 replayTick(dt);updateFX(dt);if(RPL.on&&RPL.v){const live=V;V=RPL.v;try{render(dt)}finally{V=live}}else render(dt);syncUI();
 if(IS_TOUCH&&V){const mp=V.players.find(q=>q.id===NET.myId);$('#tThrow').classList.toggle('has',!!(mp&&mp.gun>0))}
 if(curScreen==='title')drawPreview(pvc,200);if($('#ward').classList.contains('on'))drawPreview(wpc,240);
 requestAnimationFrame(frame)}
const pvc=$('#pv').getContext('2d');
const wpc=$('#wpv').getContext('2d');function drawPreview(pvc,sz){pvc=pvc||window.pvc0;sz=sz||200;pvc.setTransform(1,0,0,1,0,0);pvc.clearRect(0,0,sz,sz);pvc.setTransform(1.8*sz/200,0,0,1.8*sz/200,sz/2,148*sz/200);
 const a=A_('pv');a.walk=0;a.k=Math.max(0,(a.k||0)-.03);a.sq=a.k*.9+.25+Math.sin(gtime*2.2)*.25;a.px=Math.sin(gtime*.7)*1.5;a.py=0;{const wn=$('#wname');if(wn){const ln=$('#lnm'),s=dispName({ic:me.ic|0,tag:me.tag,name:(ln&&ln.value)||me.name});const hs=esc(s)+lvB(myLv());if(wn.innerHTML!==hs)wn.innerHTML=hs;wn.style.color=COLORS[me.color]}}drawGuy(pvc,{x:0,y:0,vx:0,vy:0,gun:1,face:Math.PI/2+Math.sin(gtime*.5)*.12,r:26,alive:true,fall:1,charge:0,dash:0,stun:0,buzz:1,teeter:0,color:me.color,hat:me.hat,fc:me.fc,bk:me.bk,ph:0},a,gtime,{noTag:1})}
requestAnimationFrame(frame);
window.__dbg={get S(){return S},get V(){return V},NET,hostStart,joinStart,startMatch,addBot};
