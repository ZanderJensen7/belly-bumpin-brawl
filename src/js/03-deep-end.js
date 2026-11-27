// 03-deep-end.js: the secret Deep End puzzle levels, and the lane the giant coaster floats along
// ---- The Deep End: secret lobby mini-game. Level i lives at world (PZX, i*PZY).
const PZX=9000,PZY=2200;
const PZL=[
 {n:'The Shallows',st:[0,0],p:[{c:[0,0,110]},{c:[260,0,70]},{c:[470,-40,70]},{c:[690,30,65]},{c:[950,0,100]},{r:[1200,0,260,60]},{c:[1460,0,70]},{c:[1680,-80,60]},{c:[1930,-80,110]}],cp:[[950,0]],g:[1930,-80]},
 {n:'Currents',st:[0,0],p:[{c:[0,0,110]},{c:[260,0,70],m:[0,160,3,0]},{c:[520,0,70],m:[0,160,3,.5]},{c:[780,0,95]},{r:[1060,0,200,60],m:[120,0,4,0]},{c:[1340,0,70]},{c:[1560,0,62],m:[0,200,2.4,0]},{c:[1800,0,110]}],cp:[[780,0]],g:[1800,0]},
 {n:'Blinkers',st:[0,0],p:[{c:[0,0,110]},{c:[240,0,70],b:[1.6,1,0]},{c:[460,0,70],b:[1.6,1,.45]},{c:[680,0,70],b:[1.6,1,0]},{c:[920,0,95]},{r:[1180,0,220,60],b:[2,1.2,.3]},{c:[1440,0,70],m:[0,140,3,0]},{c:[1660,-60,60],b:[1.2,.8,0]},{c:[1900,-60,110]}],cp:[[920,0]],g:[1900,-60]},
 {n:'Last Call',st:[0,0],p:[{c:[0,0,110]},{c:[250,0,72],m:[0,120,2.6,0]},{c:[480,0,72],m:[0,120,2.6,.5]},{c:[700,0,72],b:[1.6,.9,0]},{c:[940,0,95]},{r:[1190,0,200,64],m:[0,110,3,0]},{c:[1420,0,70],b:[1.5,.8,.4]},{c:[1640,0,70],m:[90,0,2.4,0]},{c:[1860,0,70],b:[1.5,.8,.9]},{c:[2090,0,120]}],cp:[[940,0]],g:[2090,0],mug:1}];
function pzPlat(q,T){const v=q.c||q.r;let x=v[0],y=v[1],vx=0,vy=0,on=1,warn=0;if(q.m){const w=TAU/q.m[2],a=w*T+q.m[3]*TAU;x+=q.m[0]*Math.sin(a);y+=q.m[1]*Math.sin(a);vx=q.m[0]*w*Math.cos(a);vy=q.m[1]*w*Math.cos(a)}
 if(q.b){const cy=q.b[0]+q.b[1],u=((T+q.b[2]*cy)%cy+cy)%cy;on=u<q.b[0]?1:0;warn=on&&q.b[0]-u<.45?1:0}return {x,y,vx,vy,on,warn}}
function pzAt(p,T){const L=PZL[p.pz.lv];if(!L)return null;const ox=PZX,oy=p.pz.lv*PZY,lx=p.x-ox,ly=p.y-oy;for(const q of L.p){const s=pzPlat(q,T);if(!s.on)continue;
  if(q.c?hyp(lx-s.x,ly-s.y)<q.c[2]:(Math.abs(lx-s.x)<q.r[2]/2&&Math.abs(ly-s.y)<q.r[3]/2))return s}return null}
function pzSpawn(p){const L=PZL[p.pz.lv],pt=p.pz.cp>=0?L.cp[p.pz.cp]:L.st;return [PZX+pt[0],p.pz.lv*PZY+pt[1]]}
function pzPut(p){const sp=pzSpawn(p);p.x=p.sx=sp[0];p.y=p.sy=sp[1];p.vx=p.vy=0;p.dash=0;p.stun=0;p.charging=0;p.charge=0;p.edgeT=0;p.inv=.4}
function enterPz(p){p.pz={lv:0,cp:-1,t0:S.t,d:0};pzPut(p);ev('pzin',{id:p.id});ev('meme',{t:'🌊 THE DEEP END',x:p.x|0,y:p.y|0})}
function pzProg(p){const L=PZL[p.pz.lv],ox=PZX,oy=p.pz.lv*PZY,lx=p.x-ox,ly=p.y-oy;
 L.cp.forEach((c,i)=>{if(i>p.pz.cp&&hyp(lx-c[0],ly-c[1])<70){p.pz.cp=i;ev('pzcp',{id:p.id,x:p.x|0,y:p.y|0})}});
 if(hyp(lx-L.g[0],ly-L.g[1])<70){if(p.pz.lv<PZL.length-1){p.pz.lv++;p.pz.cp=-1;pzPut(p);ev('pzlv',{id:p.id,lv:p.pz.lv})}else{const tm=S.t-p.pz.t0;ev('pzwin',{id:p.id,t:Math.round(tm*10)/10,d:p.pz.d});ev('say',{text:p.name+' conquered the Deep End!',force:1});p.pz=null;placeRandom(p);p.inv=1.5}}}
function floatLane(r){const pts=(x,y,rr,vert)=>{for(const o of [-rr-14,-rr*.5,0,rr*.5,rr+14])if(vert?onArena(x+o,y):onArena(x,y+o))return true;return false};
 const clearV=(x,rr)=>{for(let y=0;y<=H;y+=18)if(pts(x,y,rr,1))return false;return true},clearH=(y,rr,x0)=>{for(let x=x0-rr;x<=W+40;x+=18)if(pts(x,y,rr,0))return false;return true};
 for(const rr of [r,66,54]){for(let x=CX+BASE_R+20+rr;x<=1050;x+=8)if(clearV(x,rr))return {x,y:-100,vx:0,vy:52,r:rr};
  for(const ex of [600,760,900])for(const dir of [1,-1])for(let y=CY+dir*40;dir>0?y<=H-rr*.55:y>=rr*.6+50;y+=dir*8)if(clearH(y,rr,ex))return {x:W+120,y,vx:-52,vy:0,r:rr,ex}}
 return {x:1046,y:-100,vx:0,vy:52,r:54}}
