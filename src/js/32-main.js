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
  if(p.id===NET.myId&&p.alive&&V.phase!=='intro'&&V.phase!=='results'&&V.phase!=='over'){const inp=lastInp||{x:0,y:0};let ix=inp.x||0,iy=inp.y||0;if(V.mut&&V.mut.includes('nolegs')&&V.phase==='play'){ix=0;iy=0}if(V.mut&&V.mut.includes('reverse')){ix=-ix;iy=-iy}
   const free=p.stun<=0&&p.dash<=0&&!(p.fall>0&&!p.alive);if(d.pvx==null){d.pvx=p.vx;d.pvy=p.vy}
   if(free){const sp=(p.charge>0?105:255)*(p.aiming?.5:1)*(p.wob>0?.35:1)*(p.parry>0?.3:1)*(p.r>30?.9:1),f=1-Math.exp(-7*dt);d.pvx+=(ix*sp-d.pvx)*f;d.pvy+=(iy*sp-d.pvy)*f}else{d.pvx=p.vx;d.pvy=p.vy}
   d.x+=d.pvx*dt;d.y+=d.pvy*dt;d.age+=dt;const tx=d.tx+d.vx*(L-Math.min(d.age,L)*0),ty=d.ty+d.vy*L,cr=free?4:14;d.x+=(d.tx+d.vx*L-d.x)*Math.min(1,dt*cr);d.y+=(ty-d.y)*Math.min(1,dt*cr);p.x=d.x;p.y=d.y;continue}
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
