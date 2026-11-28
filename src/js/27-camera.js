// 27-camera.js: the render() frame, camera and auto-fit (fitCam)
function render(dt){const t=gtime;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#3b1d0a';ctx.fillRect(0,0,cv.width,cv.height);
 if(zoomT>0){zoomT-=dt;if(zoomT<=0)zoom=1}const FZ=fitCam();const rc=RPL.on&&RPL.cam;const zt=rc?rc.z*FZ[0]:zoomT>0?zoom*FZ[0]:FZ[0];camZ=lerp(camZ,zt,Math.min(1,dt*(rc||zoomT>0?6:3)));if(rc){camX=lerp(camX,rc.x,Math.min(1,dt*7));camY=lerp(camY,rc.y,Math.min(1,dt*7))}else{const mpz=V&&V.phase==='lobby'&&V.players.find(p=>p.id===NET.myId&&(p.pzv||(S&&S.hub)));if(mpz){const tx=S&&S.hub?mpz.x-120:mpz.x-lobbyShift()*.6+140,ty=mpz.y;if(hyp(camX-tx,camY-ty)>1500){camX=tx;camY=ty}else{camX=lerp(camX,tx,Math.min(1,dt*4));camY=lerp(camY,ty,Math.min(1,dt*4))}}else{
 if(hyp(camX-CX,camY-CY)>1500){camX=CX;camY=CY}camX=lerp(camX,zoomT>0?zx:(V&&V.phase==='lobby'?CX-lobbyShift():CX),Math.min(1,dt*5));camY=lerp(camY,zoomT>0?zy:FZ[1],Math.min(1,dt*5))}}
 shake=Math.max(0,shake-dt*40);const kd=Math.exp(-dt*14);kickX*=kd;kickY*=kd;const sk=SHK[shakeLv],sx=(rnd(-1,1)*shake+kickX)*sk,sy=(rnd(-1,1)*shake+kickY)*sk;
 const goggles=V&&V.mut&&V.mut.includes('goggles')&&(V.phase==='play'||V.phase==='intro');
 const world=()=>{ctx.translate(W/2+sx,H/2+sy);ctx.scale(camZ,camZ);ctx.translate(-camX,-camY);drawWorld(t)};
 ctx.setTransform(SC,0,0,SC,OX,OY);ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
 if(goggles){ctx.save();world();ctx.restore();ctx.globalAlpha=.42;ctx.save();ctx.translate(Math.sin(t*1.3)*18,Math.cos(t*.9)*8);world();ctx.restore();ctx.globalAlpha=1}
 else{ctx.save();world();ctx.restore()}
 if(V&&V.disco&&V.phase!=='lobby'&&flashOn)drawDisco(t);
 if(flash>0){if(flashOn){ctx.fillStyle='rgba(255,255,255,'+flash+')';ctx.fillRect(0,0,W,H)}flash=Math.max(0,flash-dt*1.5)}
 // vignette
 const vg=ctx.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,H*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(40,10,0,.5)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
 if(V)drawHUD(t);ctx.restore()}
const MAPBB={};function mapBB(id){if(MAPBB[id])return MAPBB[id];const m=MAPS[id]||MAPS.round;let a=1e9,b=-1e9,c=1e9,d=-1e9;for(const q of m.solids.concat(m.holes||[])){const hw=q.t==='c'?q.r:q.w/2,hh=q.t==='c'?q.r:q.h/2;a=Math.min(a,q.x-hw);b=Math.max(b,q.x+hw);c=Math.min(c,q.y-hh);d=Math.max(d,q.y+hh)}return MAPBB[id]=[a,b,c,d]}
function fitCam(){if(!V||V.hub||(S&&S.hub)||!MAPS[V.map])return [1,CY];const sc=(V.arenaR||BASE_R)/BASE_R,bb=mapBB(V.map),spin=V.mut&&V.mut.includes('spin');let y0=bb[2]*sc,y1=bb[3]*sc,x0=bb[0]*sc,x1=bb[1]*sc;if(spin){const r=Math.max(-x0,x1,-y0,y1);x0=y0=-r;x1=y1=r}const lob=V.phase==='lobby',top=58,bot=lob?H-34:H-74,mg=26;let z=Math.min(1,(bot-top)/(y1-y0+mg*2));if(!lob)z=Math.min(z,(W-24)/(x1-x0+mg*2));z=Math.max(.6,z);const my=CY+(y0+y1)/2;return [z,my-((top+bot)/2-H/2)/z]}
let camZ=1,camX=CX,camY=CY;function lobbyShift(){const pn=document.querySelector('#lobby .panel');if(!pn||pn.classList.contains('mini')||innerWidth<600)return 0;const w=pn.offsetWidth+16;if(w>innerWidth*.6)return 0;return (w/2)/(SC/DPR)/camZ}
