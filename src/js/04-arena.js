// 04-arena.js: "is this spot on the table?" checks, glass railings, small helpers (esc, shade, toast)
function floaterAt(x,y){if(!S||!S.fl)return null;for(const f of S.fl)if(!f.flip&&hyp(x-f.x,y-f.y)<f.r)return f;return null}
function onArena(x,y,st){st=st||S;const m=MAPS[st.map]||MAPS.round;const l=toLocal(x,y,st);return m.solids.some(q=>inShape(q,l[0],l[1]))&&!m.holes.some(h=>inShape(h,l[0],l[1]))}
function clearAt(x,y,d,st){if(!onArena(x,y,st))return false;for(let i=0;i<8;i++){const a=i/8*TAU;if(!onArena(x+Math.cos(a)*d,y+Math.sin(a)*d,st))return false}return true}
function onLocal(m,lx,ly){return m.solids.some(q=>inShape(q,lx,ly))&&!m.holes.some(h=>inShape(h,lx,ly))}
function boundaryPts(q,isHole){const P=[],step=64;
 if(q.t==='c'){const n=Math.max(8,Math.round(TAU*q.r/step));for(let i=0;i<n;i++){const a=i/n*TAU;P.push([q.x+Math.cos(a)*q.r,q.y+Math.sin(a)*q.r,Math.cos(a),Math.sin(a)])}}
 else if(q.t==='r'){const hw=q.w/2,hh=q.h/2,E=[[-hw,-hh,hw,-hh,0,-1],[hw,-hh,hw,hh,1,0],[hw,hh,-hw,hh,0,1],[-hw,hh,-hw,-hh,-1,0]];for(const e of E){const n=Math.round(hyp(e[2]-e[0],e[3]-e[1])/step);for(let i=0;i<n;i++){const t=(i+.5)/n;P.push([q.x+lerp(e[0],e[2],t),q.y+lerp(e[1],e[3],t),e[4],e[5]])}}}
 else{const hw=q.w/2-q.h/2,R=q.h/2,nL=Math.round(2*hw/step),nA=Math.round(Math.PI*R/step);for(let i=0;i<nL;i++)P.push([q.x-hw+(i+.5)/nL*2*hw,q.y-R,0,-1]);
  for(let i=0;i<nA;i++){const a=-Math.PI/2+(i+.5)/nA*Math.PI;P.push([q.x+hw+Math.cos(a)*R,q.y+Math.sin(a)*R,Math.cos(a),Math.sin(a)])}for(let i=0;i<nL;i++)P.push([q.x+hw-(i+.5)/nL*2*hw,q.y+R,0,1]);
  for(let i=0;i<nA;i++){const a=Math.PI/2+(i+.5)/nA*Math.PI;P.push([q.x-hw+Math.cos(a)*R,q.y+Math.sin(a)*R,Math.cos(a),Math.sin(a)])}}
 if(isHole)P.forEach(p=>{p[2]=-p[2];p[3]=-p[3]});return P}
let railG=0;
function makeRails(){const m=MAPS[S.map]||MAPS.round;if(!(S.mut.includes('rails')||S.phase==='lobby')||(m.noMut||[]).includes('rails'))return[];const out=[];
 for(const q of m.solids){const P=boundaryPts(q,0),N=P.length,ok=P.map(p=>onLocal(m,p[0]-p[2]*14,p[1]-p[3]*14)&&!onLocal(m,p[0]+p[2]*14,p[1]+p[3]*14));
  const len=Math.max(2,Math.round(N/7)),off=ri(0,N-1);
  for(let w=0;w<4;w++){const g=++railG,st=off+Math.round(w*N/4);for(let k=0;k<len;k++){const i=(st+k)%N,j=(i+1)%N;if(!ok[i]||!ok[j])continue;const a=P[i],b=P[j];
   out.push({g,la:[a[0]-a[2]*9,a[1]-a[3]*9],lb:[b[0]-b[2]*9,b[1]-b[3]*9],hp:2,ax:0,ay:0,bx:0,by:0})}}}
 out.forEach(r=>{const a=toWorld(r.la[0],r.la[1],S),b=toWorld(r.lb[0],r.lb[1],S);r.ax=a[0];r.ay=a[1];r.bx=b[0];r.by=b[1]});return out}
function dmgRail(r,n){const h=Math.max(0,r.hp-n);for(const q of S.rails)if(q.g===r.g)q.hp=h;return h}
function segDist(px,py,r){const abx=r.bx-r.ax,aby=r.by-r.ay,l2=abx*abx+aby*aby||1,t=clamp(((px-r.ax)*abx+(py-r.ay)*aby)/l2,0,1),qx=r.ax+abx*t,qy=r.ay+aby*t;return [hyp(px-qx,py-qy),qx,qy]}
function railHit(p){for(const r of S.rails){if(r.hp<=0)continue;const [d0,qx,qy]=segDist(p.x,p.y,r),rr=p.r+7;if(d0>=rr)continue;let dx=p.x-qx,dy=p.y-qy,d=d0;if(d<.01){dx=CX-p.x;dy=CY-p.y;d=hyp(dx,dy)||1}
  const nx=dx/d,ny=dy/d;p.x=qx+nx*rr;p.y=qy+ny*rr;const vn=p.vx*nx+p.vy*ny;if(vn<0){const imp=-vn;p.vx-=1.5*vn*nx;p.vy-=1.5*vn*ny;
   if(imp>400||(p.stun>0&&imp>230)){const h=dmgRail(r,1);p.dash=0;ev('glass',{x:qx|0,y:qy|0,hp:h})}else if(imp>160)ev('bump',{x:qx|0,y:qy|0})}}}
function isCont(){return S.settings.mode==='happy'||S.settings.mode==='koth'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function shade(hex,amt){let n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;
 if(amt<0){r*=1+amt;g*=1+amt;b*=1+amt}else{r+=(255-r)*amt;g+=(255-g)*amt;b+=(255-b)*amt}
 return 'rgb('+(r|0)+','+(g|0)+','+(b|0)+')'}
let toastT=0;function toast(m,t=2.5){const e=$('#toast');e.textContent=m;e.classList.add('on');toastT=t}

