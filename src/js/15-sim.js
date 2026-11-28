// 15-sim.js: simStep: the 60 Hz host simulation (movement, dashes, hits, mutators, maps)
function simStep(dt){
 if(S.nuts&&S.nuts.length){for(const n of S.nuts){n.t+=dt;if(n.t>=.5&&!n.done){n.done=1;for(const q of S.players){if(!q.alive||q.inv>0)continue;const dx=q.x-n.x,dy=q.y-n.y,d=hyp(dx,dy);if(d<q.r+30){const ux=d>1?dx/d:Math.cos(n.x),uy=d>1?dy/d:Math.sin(n.y);q.vx+=ux*240;q.vy+=uy*240;q.wob=Math.max(q.wob||0,.25);ev('nuthit',{id:q.id,by:n.by})}}ev('nut',{x:n.x|0,y:n.y|0})}}S.nuts=S.nuts.filter(n=>n.t<.75)}
 S.t+=dt;S.pt+=dt;const M=S.mut,ph=S.phase,playing=ph==='play',free=ph==='lobby';
 if(ph==='intro'){const n=S.pt<1.2?4:S.pt<2?3:S.pt<2.8?2:S.pt<3.6?1:0;if(n!==S.cd){S.cd=n;if(n>0&&n<4)ev('cd',{n})}
  if(S.pt>=3.6){S.phase='play';S.pt=0;S.players.forEach(p=>{if(p.alive)p.inv=1.2});ev('go')}}
 const cont=isCont();
 if(playing){S.rt+=dt;S.mutT+=dt;
  if(cont){S.matchT+=dt;S.nextMutT-=dt;if(S.nextMutT<=0){S.nextMutT=30;S.lastMut=S.mut.slice();S.mut=chooseMuts(false);S.mutT=0;S.bomb=null;S.bombNext=2;S.rotV=0;S.gx=S.gy=0;S.bumpers=makeBumpers();S.rails=makeRails();
    S.players.forEach(p=>p.r=S.mut.includes('big')?40:26);ev('chaos');ev('say',{text:'New chaos! '+S.mut.map(m=>MUTS[m].n).join(' plus '),force:1})}
   if(S.settings.mode==='koth'){let z=S.zone;if(!z||z.t<=0){const q=safePoints(1,75,alive().map(p=>[p.x,p.y]).concat(z?[[z.x,z.y]]:[]),150)[0];S.zone=z={lx:q[2],ly:q[3],x:q[0],y:q[1],r:72,t:13,own:null};ev('zone',{x:q[0]|0,y:q[1]|0})}
    z.t-=dt;const zw=toWorld(z.lx,z.ly,S);z.x=zw[0];z.y=zw[1];const inz=alive().filter(p=>hyp(p.x-z.x,p.y-z.y)<z.r);z.own=inz.length===1?inz[0].id:inz.length>1?'X':null;if(inz.length===1)inz[0].score+=dt;
    if(S.players.some(p=>p.score>=KOTH_T)||S.matchT>=KOTH_MAX)endMatchCont()}
   else if(S.matchT>=HAPPY_T)endMatchCont()}
  const ms=S.mapS||1,B0=BASE_R*ms;let R=M.includes('shrink')?lerp(B0,135*ms,clamp(S.mutT/35,0,1)):B0;
  if(!cont&&S.rt>45){if(!S.sudden){S.sudden=true;ev('say',{text:'Sudden death! The table is shrinking!',force:1});ev('sudden')}R=Math.min(R,B0-(S.rt-45)*17*ms)}
  S.arenaR=Math.max(R,40);
  if(M.includes('spin')){S.rotV=Math.min(.42,S.rotV+dt*.15)}S.rot+=S.rotV*dt;
  S.waveHit=Math.max(0,(S.waveHit||0)-dt);
  if(M.includes('slosh')){if(S.waveWarn>0){S.waveWarn-=dt;if(S.waveWarn<=0){S.waveWarn=0;S.waveHit=.5;const ca=Math.cos(S.waveA),sa=Math.sin(S.waveA);for(const p of alive()){p.vx+=ca*270;p.vy+=sa*270}ev('wave',{a:r2(S.waveA)})}}
   else{S.waveT=(S.waveT||3)-dt;if(S.waveT<=0){S.waveT=rnd(6,9);S.waveA=Math.random()*TAU;S.waveWarn=1.7;ev('wavewarn',{a:r2(S.waveA)})}}}
  if(S.map==='seesaw'&&S.phase==='play'){let tq=0;for(const q of S.players)if(q.alive&&!q.pz)tq+=(q.x-CX)*(q.r>30?1.5:1);const tg=clamp(tq/450*200,-320,320);S.gx+=(tg-S.gx)*Math.min(1,dt*1.4);S.gy=0}
  if(M.includes('tilt')){S.tiltA+=dt*.4;const g=210*clamp(S.mutT/2,0,1);S.gx=Math.cos(S.tiltA)*g;S.gy=Math.sin(S.tiltA)*g}
  if(M.includes('kegs')){S.kegT-=dt;if(S.kegT<=0){S.kegT=rnd(1.6,2.6)-(S.rt>20?.5:0);const a=Math.random()*TAU,sx=CX+Math.cos(a)*560*(S.mapS||1),sy=CY+Math.sin(a)*560*(S.mapS||1);
    const tx=CX+rnd(-120,120)*(S.mapS||1),ty=CY+rnd(-120,120)*(S.mapS||1),l=hyp(tx-sx,ty-sy),sp=rnd(300,400);S.kegs.push({x:sx,y:sy,vx:(tx-sx)/l*sp,vy:(ty-sy)/l*sp,a:0,warn:1,r:30})}}
  if(M.includes('bomb')){if(!S.bomb){S.bombNext-=dt;const a=alive();if(S.bombNext<=0&&a.length>1){S.bomb={h:pick(a).id,fuse:rnd(6.5,10.5),cd:.5};ev('pass',{id:S.bomb.h,first:1})}}
   else{const B=S.bomb;B.fuse-=dt;B.cd-=dt;if(B.fuse<=0){const H=P(B.h);S.bomb=null;S.bombNext=2.5;if(H){ev('boom',{x:H.x|0,y:H.y|0});
     for(const q of alive()){const dx=q.x-H.x,dy=q.y-H.y,d=hyp(dx,dy);if(q===H){const a=Math.atan2(CY-H.y,CX-H.x)+Math.PI+rnd(-.9,.9);q.vx=Math.cos(a)*1150;q.vy=Math.sin(a)*1150;q.stun=1.1;q.hitBy=null}
      else if(d<210){const f=((1-d/210)*950+250)*slosh(q);q.vx+=dx/(d||1)*f;q.vy+=dy/(d||1)*f;q.stun=.7;q.hitBy=H.id;q.hitT=S.t}}H.boomed=S.t}}}}
 }
 for(const b of S.bumpers){const w=toWorld(b.lx,b.ly,S);b.x=w[0];b.y=w[1]}
 // cork blaster pickups
 if(S.settings.guns&&(playing||free)){S.itemT-=dt;if(S.itemT<=0){S.itemT=rnd(5,8);if(S.items.length<2){const q=safePoints(1,45,alive().map(p=>[p.x,p.y]).concat(S.items.map(i=>[i.x,i.y])),120,hazards(20))[0];S.items.push({lx:q[2],ly:q[3],x:q[0],y:q[1]});ev('item',{x:q[0]|0,y:q[1]|0})}}}
 for(const it of S.items){const w=toWorld(it.lx,it.ly,S);it.x=w[0];it.y=w[1]}
 for(const r of S.rails){const a=toWorld(r.la[0],r.la[1],S),b=toWorld(r.lb[0],r.lb[1],S);r.ax=a[0];r.ay=a[1];r.bx=b[0];r.by=b[1];
  for(const k of S.kegs)if(k.warn<=0&&r.hp>0&&segDist(k.x,k.y,r)[0]<k.r+7){dmgRail(r,2);ev('glass',{x:(r.ax+r.bx)/2|0,y:(r.ay+r.by)/2|0,hp:0})}
  for(const c of S.corks)if(!c.dead&&r.hp>0&&segDist(c.x,c.y,r)[0]<12){const h=dmgRail(r,1);c.dead=1;ev('glass',{x:c.x|0,y:c.y|0,hp:h})}}
 if(S.rails.some(r=>r.hp<=0))S.rails=S.rails.filter(r=>r.hp>0);
 if(free){if(!S.rails.length){S.railT+=dt;if(S.railT>6){S.railT=0;S.rails=makeRails()}}}
 for(const c of S.corks){c.t+=dt;const fr=Math.exp(-1.1*dt);c.vx*=fr;c.vy*=fr;c.x+=c.vx*dt;c.y+=c.vy*dt;for(const q of S.players){if(!q.alive||(q.id===c.o&&c.t<.25)||c.dead)continue;if(hyp(q.x-c.x,q.y-c.y)<q.r+10){if(q.dash>0){const sp=hyp(q.vx,q.vy)||1,f=1250+(q.dc||0)*350;c.vx=q.vx/sp*f;c.vy=q.vy/sp*f;c.o=q.id;c.t=0;c.x=q.x+q.vx/sp*(q.r+14);c.y=q.y+q.vy/sp*(q.r+14);ev('deflect',{x:c.x|0,y:c.y|0,bat:1});S.hs=.06;continue}
   if(q.parry>0){q.blocked=1;q.parries=(q.parries||0)+1;if(.22-q.parry<.1&&q.gun<2){q.gun++;c.dead=1;ev('catch',{id:q.id,x:c.x|0,y:c.y|0})}else{const o=P(c.o);let ax=-c.vx,ay=-c.vy;if(o&&o.alive){ax=o.x-c.x;ay=o.y-c.y}const l=hyp(ax,ay)||1,sp2=Math.max(750,hyp(c.vx,c.vy))*1.1;c.vx=ax/l*sp2;c.vy=ay/l*sp2;c.o=q.id;c.t=0;ev('deflect',{x:c.x|0,y:c.y|0})}continue}
   const sp=hyp(c.vx,c.vy)||1,nx=c.vx/sp,ny=c.vy/sp,k=(q.inv>0?.35:1)*absorb(q)*slosh(q);
   q.vx=nx*1500*k+q.vx*.2;q.vy=ny*1500*k+q.vy*.2;q.stun=.75;q.rhit=1;q.taken=(q.taken||0)+1;S.hs=Math.max(S.hs||0,.12);{const th=P(c.o);if(th)th.glassed=(th.glassed||0)+1}q.dash=0;q.charging=0;q.charge=0;q.hitBy=c.o;q.hitT=S.t;c.dead=1;ev('glass',{x:c.x|0,y:c.y|0,hp:0,small:1});ev('bonk',{x:c.x|0,y:c.y|0,s:1.5,id:q.id,cork:1})}}
  for(const b of S.bumpers)if(!c.dead&&hyp(b.x-c.x,b.y-c.y)<b.r+8){const nx=(c.x-b.x),ny=(c.y-b.y),l=hyp(nx,ny)||1,d=(c.vx*nx+c.vy*ny)/l;c.vx-=2*d*nx/l;c.vy-=2*d*ny/l;ev('boing',{x:b.x|0,y:b.y|0,i:S.bumpers.indexOf(b)})}}
 for(const c of S.corks)if(!c.dead&&c.t>=1.1)dropCork(c);S.corks=S.corks.filter(c=>!c.dead&&c.t<1.1);
 for(const k of S.kegs){if(k.warn>0){k.warn-=dt;continue}k.x+=k.vx*dt;k.y+=k.vy*dt;k.a+=dt*8}
 if(free&&!S.hub){S.fl=S.fl||[];if(S.flT==null)S.flT=/[?&]deep/.test(location.search)?1:18;S.flT-=dt;
  if(S.flT<=0){S.flT=rnd(55,65);const ln=floatLane(84);S.fl.push(Object.assign(ln,{flip:0,gold:0,a:Math.random()*TAU}));ev('meme',{t:'🌊 ...what is that?',x:ln.vx?W-150:ln.x,y:ln.vx?ln.y-60:90})}
  for(const f of S.fl){f.y+=f.vy*dt;f.x+=(f.vx||0)*dt;f.a+=dt*.4;if(f.flip>0)f.flip+=dt*2.2;else if((f.vy>0&&f.y>H-46)||(f.vx<0&&f.x<f.ex)){f.flip=.01;for(const q of S.players){if(!q.alive||q.dash>0||q.pz||hyp(q.x-f.x,q.y-f.y)>f.r)continue;ev('flipped',{id:q.id,x:q.x|0,y:q.y|0});enterPz(q)}}}
  S.fl=S.fl.filter(f=>f.flip<1&&f.y<H+120&&f.x>-200)}else{if(S.fl&&S.fl.length)S.fl=[];for(const q of S.players)if(q.pz)q.pz=null}
 S.kegs=S.kegs.filter(k=>k.warn>0||hyp(k.x-CX,k.y-CY)<620);
 // players
 for(const p of S.players){
  if(p.bot)botThink(p,dt);
  p.emoteT=Math.max(0,p.emoteT-dt);p.emCd=Math.max(0,p.emCd-dt);p.inv=Math.max(0,p.inv-dt);
  if(p.alive&&p.ghx!=null)p.ghx=p.ghy=null;
  if(!p.alive&&!p.bot&&S.settings.ghosts&&S.phase==='play'&&!(p.respawn>0)){if(p.ghx==null){p.ghx=clamp(p.x,60,W-60);p.ghy=clamp(p.y,80,H-60);p.ghCd=.8}const i=p.inp||{};p.ghx=clamp(p.ghx+(i.x||0)*300*dt,40,W-40);p.ghy=clamp(p.ghy+(i.y||0)*300*dt,70,H-40);p.ghCd=(p.ghCd||0)-dt;if(i.d&&p.ghCd<=0){p.ghCd=1.6;(S.nuts=S.nuts||[]).push({x:p.ghx,y:p.ghy+4,t:0,by:p.id});ev('nutq',{id:p.id})}}
  if(!p.alive){if(p.fall>0)p.fall=Math.max(0,p.fall-dt*1.4);if(p.respawn>0){p.respawn-=dt;if(p.respawn<=0){p.alive=true;p.fall=0;placeRandom(p);p.stun=0;p.dash=0;p.inv=free?0:1.5;p.hitBy=null;p.gun=1+((p.pk&&p.pk.ammo)|0);p.aiming=0;p.slosh=0;p.r=S.mut.includes('big')?40:26}}continue}
  if(p.hand>0){p.hand-=dt;p.vx=p.vy=0;p.charging=0;p.charge=0;if(p.hand<=0){p.hand=0;handSlap(p)}continue}
  const inp=p.inp;let ix=inp.x||0,iy=inp.y||0;const il=hyp(ix,iy);if(il>1){ix/=il;iy/=il}
  if(M.includes('reverse')){ix=-ix;iy=-iy}
  if(ph==='intro'){ix=0;iy=0}
  const sw=(.16+p.buzz*.07)*Math.sin(S.t*2.3+p.ph)+(.08+p.buzz*.04)*Math.sin(S.t*5.3+p.ph*2),cs=Math.cos(sw),sn=Math.sin(sw);
  const jx=ix*cs-iy*sn,jy=ix*sn+iy*cs;ix=jx;iy=jy;
  p.pzv=p.pz?[p.pz.lv,p.pz.cp,Math.round(p.pz.t0*10)/10,p.pz.d]:0;
  if(p.dq==null)p.dq=2;if(p.dq<2&&p.dash<=0){p.dqT=(p.dqT||0)+dt;if(p.dqT>=.9){p.dq=2;p.dqT=0}}p.lag=Math.max(0,(p.lag||0)-dt);if(p.fly>0)p.fly-=dt;
  const canAct=(playing||free)&&p.stun<=0&&p.dash<=0&&p.lag<=0&&p.dq>0;
  const act=playing||free;p.pcd=Math.max(0,(p.pcd||0)-dt);
  if(inp.p&&!p.ppd&&p.pcd<=0&&p.stun<=0&&act){p.parry=.22;p.pcd=.9;p.blocked=0;ev('parry',{id:p.id,dodge:0})}
  p.dodge=Math.max(0,(p.dodge||0)-dt);p.ppd=inp.p;
  if(p.parry>0){p.parry-=dt;if(p.parry<=0){p.parry=0;if(!p.blocked){p.wob=.85;ev('whiff',{id:p.id})}}}p.wob=Math.max(0,(p.wob||0)-dt);
  const fP=inp.f&&!p.pf;p.pf=inp.f;
  if(p.aiming&&(p.stun>0||!act||p.gun<=0))p.aiming=0;
  if(!p.aiming&&fP&&p.gun>0&&p.stun<=0&&p.dash<=0&&act){p.aiming=1;p.thT=0;p.charging=0;p.charge=0;let c0=p.face;if(typeof inp.a==='number')c0=inp.a;else if(hyp(inp.x||0,inp.y||0)>.3){c0=Math.atan2(inp.y,inp.x);if(M.includes('reverse'))c0+=Math.PI}p.aimC=c0;p.aimA=c0;ev('drink',{id:p.id})}
  else if(p.aiming){p.thT+=dt;if(p.thT>.18){p.aimA=p.aimC+Math.sin((p.thT-.18)*6)*Math.PI/4;p.face=p.aimA;if(fP||p.thT>2.4){fireCork(p);p.aiming=0}}}
  if(p.aiming){}
  else if(inp.d&&canAct){p.charging=1;p.charge=Math.min(1,p.charge+dt*1.5*(p.courage>0?4:1)*pk(p,'quick',1.3));if(p.charge>=1&&!p.full){p.full=1;p.fullT=0;ev('full',{id:p.id})}
   if(p.full){p.fullT+=dt;if(p.fullT>1.4&&!(p.pk&&p.pk.iron)){p.charging=0;p.charge=0;p.full=0;p.fullT=0;p.stun=.55;p.vx*=.2;p.vy*=.2;ev('burp',{id:p.id,x:p.x|0,y:p.y|0})}}}
  else if(p.charging){if(!inp.d&&canAct){doDash(p,p.charge);p.perf=0}p.charging=0;p.charge=0;p.full=0;p.fullT=0}
  p.ctr=Math.max(0,(p.ctr||0)-dt);
  for(let ii=0;ii<S.items.length;ii++){const it=S.items[ii];if(hyp(it.x-p.x,it.y-p.y)<p.r+24){S.items.splice(ii,1);openCrate(p,it);break}}
  for(let li=0;li<S.loose.length;li++){const c=S.loose[li];if(hyp(c.x-p.x,c.y-p.y)<p.r+14&&(p.gun||0)<2){S.loose.splice(li,1);p.gun=(p.gun||0)+1;ev('corkup',{id:p.id,x:c.x|0,y:c.y|0});break}}
  p.courage=Math.max(0,(p.courage||0)-dt);if(p.gulp>0){p.gulp-=dt;if(p.gulp<=0){p.gulp=0;p.r=S.mut.includes('big')?40:26}}
  p.stun=Math.max(0,p.stun-dt);
  const ctrl=p.stun>0?.15:p.lag>0?.35:1,bombBoost=(S.bomb&&S.bomb.h===p.id)?1.12:1;
  const maxS=(p.charging?105:255)*bombBoost*(p.r>30?.9:1)*(p.aiming?.5:1)*(p.wob>0?.35:1)*(p.parry>0?.3:1)*pk(p,'kicks',1.1)*(M.includes('nolegs')&&playing?0:1);
  if(M.includes('nolegs')&&playing&&p.stun<=0&&p.dash<=0&&hyp(ix,iy)>.2)p.face=Math.atan2(iy,ix);
  let dvx=ix*maxS*ctrl,dvy=iy*maxS*ctrl;
  const rx=p.x-CX,ry=p.y-CY;
  if(S.rotV){dvx+=-ry*S.rotV;dvy+=rx*S.rotV}
  let k=p.dodge>0?1.2:p.dash>0?.8:(p.stun>0?1.5:7);if(M.includes('spill'))k=p.dash>0?.4:(p.stun>0?.8:2.6);
  const MP=MAPS[S.map];if(MP&&(MP.ice||MP.belts)&&!p.pz){const L=toLocal(p.x,p.y,S);if(MP.ice&&!MP.grip.some(g=>hyp(L[0]-g.x,L[1]-g.y)<g.r))k=p.dash>0?.35:(p.stun>0?.6:1.6);if(MP.belts&&p.alive&&S.phase!=='intro')for(const b of MP.belts)if(Math.abs(L[0]-b.x)<b.w/2&&Math.abs(L[1]-b.y)<b.h/2){p.x+=b.vx*(S.arenaR/BASE_R)*dt;break}}
  if(p.stun>0&&p.dash<=0){const sp0=hyp(p.vx,p.vy);if(sp0>1){const dot=-(ix*p.vx+iy*p.vy)/sp0;if(dot>.3)k+=4.5*dot;if(dot>.3&&Math.random()<dt*6)p.brace=1}}
  const f=1-Math.exp(-k*dt);p.vx+=(dvx-p.vx)*f;p.vy+=(dvy-p.vy)*f;
  if(playing&&(S.gx||S.gy)){p.vx+=S.gx*dt;p.vy+=S.gy*dt}
  if(S.rotV){p.vx+=rx*S.rotV*S.rotV*.6*dt;p.vy+=ry*S.rotV*S.rotV*.6*dt}
  p.x+=p.vx*dt;p.y+=p.vy*dt;{const wd=p.dash>0;p.dash=Math.max(0,p.dash-dt);if(wd&&p.dash<=0&&p.stun<=0)p.lag=.13;if(wd&&p.dash<=0&&p.pz&&pzAt(p,S.t)){p.vx*=.25;p.vy*=.25}}
  const pzp=p.pz?pzAt(p,S.t):null;if(pzp&&p.dash<=0){p.x+=pzp.vx*dt;p.y+=pzp.vy*dt}if(p.pz)pzProg(p);
  const flr=free&&!p.pz?floaterAt(p.x,p.y):null;if(flr&&p.dash<=0){p.x+=flr.vx*dt;p.y+=flr.vy*dt;if(flr.gold&&hyp(p.x-flr.x,p.y-flr.y)<flr.r*.8){flr.gold=0;ev('treasure',{id:p.id,x:flr.x|0,y:flr.y|0});ev('meme',{t:'🏆 SECRET MUG!',x:flr.x|0,y:flr.y|0,v:1})}}
  if(p.charging&&p.inp.m&&typeof p.inp.a==='number'&&p.stun<=0)p.face=p.inp.a+(S.mut.includes('reverse')?Math.PI:0);
  const sp=hyp(p.vx,p.vy);if(p.stun<=0&&sp>40&&p.dash<=0&&!p.aiming&&!(p.charging&&p.inp.m)){const ta=Math.atan2(p.vy,p.vx);let da=((ta-p.face+Math.PI*3)%TAU)-Math.PI;p.face+=da*Math.min(1,dt*10)}
  if(M.includes('hic')&&playing){p.hicT-=dt;if(p.hicT<=0){p.hicT=rnd(2.2,5);p.hics++;ev('hic',{id:p.id});if(p.stun<=0&&p.dash<=0){const a=Math.random()*TAU;const s=p.inp;const ox=s.x,oy=s.y;s.x=Math.cos(a);s.y=Math.sin(a);doDash(p,.3);s.x=ox;s.y=oy;p.charging=0;p.charge=0}}}
  const on=(p.pz?!!pzp:onArena(p.x,p.y))||!!flr;if(on){p.sx=p.x;p.sy=p.y;p.teeter=(flr||pzp)?0:clearAt(p.x,p.y,p.r*.7)?0:1}else p.teeter=1;
  if(playing||free){if(on)p.flT=0;if(!on&&p.dash<=0&&p.pk&&p.pk.floaty&&(p.flT||0)<.55*p.pk.floaty){p.flT=(p.flT||0)+dt;if(p.flT<dt*1.5)ev('meme',{t:'🎈',x:p.x|0,y:p.y|0})}else if(!on&&p.dash<=0){if(p.stun>0||S.t-p.hitT<.6||hyp(p.vx,p.vy)>300||hyp(p.x-p.sx,p.y-p.sy)>45)knockOut(p,'fall');else{p.edgeT=(p.edgeT||0)+dt*2;if(p.edgeT>.3){knockOut(p,'fall')}else{p.x=p.sx;p.y=p.sy;p.vx*=-.2;p.vy*=-.2;if(S.t-(p.whoaT||0)>1.2){p.whoaT=S.t;ev('whoa',{id:p.id})}}}}else if(on)p.edgeT=Math.max(0,(p.edgeT||0)-dt)}
  else if(!on){p.x=p.sx;p.y=p.sy;p.vx*=-.3;p.vy*=-.3}
 }
 // collisions
 const A=S.players.filter(p=>p.alive);
 for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=A[i],b=A[j];let dx=b.x-a.x,dy=b.y-a.y,d=hyp(dx,dy);const rr=a.r+b.r;if(d>=rr)continue;if(d<.01){dx=1;dy=0;d=1}
  const nx=dx/d,ny=dy/d,ov=rr-d;a.x-=nx*ov/2;a.y-=ny*ov/2;b.x+=nx*ov/2;b.y+=ny*ov/2;
  const vrel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
  if(S.bomb&&S.bomb.cd<=0&&(S.bomb.h===a.id||S.bomb.h===b.id)&&(playing)){S.bomb.h=S.bomb.h===a.id?b.id:a.id;S.bomb.cd=.6;ev('pass',{id:S.bomb.h})}
  if(vrel<=0)continue;
  let aD=a.dash>0,bD=b.dash>0;const mx=(a.x+b.x)/2|0,my=(a.y+b.y)/2|0;
  if(aD&&bD&&(a.parry>0)!==(b.parry>0)){if(a.parry>0)aD=false;else bD=false}
  if(aD&&bD&&Math.abs((a.dc||0)-(b.dc||0))>.3){const W=(a.dc||0)>(b.dc||0)?a:b,L=W===a?b:a;L.dash=0;if(W===a)bD=false;else aD=false;W.dc=Math.max(0,(W.dc||0)-.15);ev('over',{x:mx,y:my})}
  if(aD&&bD){const imp=vrel*.6+380;a.vx-=nx*imp;a.vy-=ny*imp;b.vx+=nx*imp;b.vy+=ny*imp;a.stun=b.stun=.4;a.dash=b.dash=0;a.hitBy=b.id;b.hitBy=a.id;a.hitT=b.hitT=S.t;ev('clang',{x:mx,y:my});S.hs=.07}
  else if(aD||bD){const Aa=aD?a:b,Bb=aD?b:a,sx=aD?nx:-nx,sy=aD?ny:-ny,pw=Aa.dpow;const dc=Aa.dc||0,kb=(190+880*dc*dc+380*dc+Math.abs(vrel)*.12)*(Bb.inv>0?.35:1)*pk(Aa,'punch',1.18)*(S.players.filter(q=>q.alive).length<=2?pk(Aa,'last',1.3)/pk(Bb,'last',1.3):1)*(Bb.parry>0?1:absorb(Bb)*slosh(Bb));Aa.inv=0;
   if(Bb.parry>0){Bb.blocked=1;const k2=(280+520*dc)*pk(Bb,'uno',1.6);if(Bb.pk&&Bb.pk.uno)ev('meme',{t:'🔄 UNO REVERSE',x:Bb.x|0,y:Bb.y|0});Aa.vx=-sx*k2;Aa.vy=-sy*k2;Aa.stun=.3+.4*dc;Aa.dash=0;Aa.charging=0;Aa.hitBy=Bb.id;Aa.hitT=S.t;Bb.parries=(Bb.parries||0)+1;Bb.vx*=.2;Bb.vy*=.2;Bb.pcd=0;Bb.wob=0;ev('deflect',{x:mx,y:my,bump:1,id:Bb.id});S.hs=.12}else{
   const butt=(Math.cos(Bb.face)*sx+Math.sin(Bb.face)*sy)>.55&&dc>.15,kbF=kb*(butt?1.7:1);Bb.vx=sx*kbF+Bb.vx*.15;Bb.vy=sy*kbF+Bb.vy*.15;Bb.stun=.12+.7*dc;Bb.hitBy=Aa.id;Bb.hitT=S.t;Bb.charging=0;Bb.charge=0;
   Aa.hits=(Aa.hits||0)+1;Bb.rhit=1;Bb.taken=(Bb.taken||0)+1;Aa.vx*=.2;Aa.vy*=.2;Aa.dash=0;ev('bonk',{x:mx,y:my,s:Math.round(pw*100)/100,id:Bb.id,butt:butt?1:0,perf:Aa.perf?1:0});S.hs=Math.max(S.hs||0,.02+.09*Math.min(1,dc)+(butt||Aa.perf?.04:0))}}
  else{const imp=vrel*1.15+90;a.vx-=nx*imp*.6;a.vy-=ny*imp*.6;b.vx+=nx*imp*.6;b.vy+=ny*imp*.6;if(vrel>110){ev('bump',{x:mx,y:my});a.hitBy=b.id;b.hitBy=a.id;a.hitT=b.hitT=S.t}}}
 for(const p of A){if(!(p.fly>0))railHit(p);for(let bi=0;bi<S.bumpers.length;bi++){const b=S.bumpers[bi];const dx=p.x-b.x,dy=p.y-b.y,d=hyp(dx,dy)||1;if(d<p.r+b.r){const nx=dx/d,ny=dy/d;p.x=b.x+nx*(p.r+b.r);p.y=b.y+ny*(p.r+b.r);
   const sp=Math.max(hyp(p.vx,p.vy)*1.1,650);p.vx=nx*sp;p.vy=ny*sp;p.stun=Math.max(p.stun,.25);p.dash=0;ev('boing',{x:b.x|0,y:b.y|0,i:bi})}}
  for(const k of S.kegs){if(k.warn>0)continue;const dx=p.x-k.x,dy=p.y-k.y,d=hyp(dx,dy)||1;if(d<p.r+k.r){const nx=dx/d,ny=dy/d;p.x=k.x+nx*(p.r+k.r);p.y=k.y+ny*(p.r+k.r);
   const ab=absorb(p)*slosh(p);p.vx=(k.vx*1.7+nx*380)*ab;p.vy=(k.vy*1.7+ny*380)*ab;p.stun=.55;p.dash=0;p.charging=0;p.charge=0;ev('bonk',{x:p.x|0,y:p.y|0,s:.9,id:p.id,keg:1})}}}
 // round end
 if(playing&&!cont&&S.phase==='play'){if(S.hydro?(S.hydroWin||S.rt>45):roundOver()){S.endT+=dt;if(S.endT>1.2)endRound()}}
 if(ph==='results'&&(S.settings.mode==='draft'&&S.offers?draftDone():S.pt>10))afterResults();
}
