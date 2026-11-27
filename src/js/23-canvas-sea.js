// 23-canvas-sea.js: canvas setup, mouse, and the sea background with floating props
// ============================================================ RENDER
const cv=$('#c'),ctx=cv.getContext('2d');let DPR=1,SC=1,OX=0,OY=0;
function resize(){DPR=Math.min(window.devicePixelRatio||1,2);cv.width=innerWidth*DPR;cv.height=innerHeight*DPR;SC=Math.min(cv.width/W,cv.height/H);OX=(cv.width-W*SC)/2;OY=(cv.height-H*SC)/2}
addEventListener('resize',resize);resize();
const mouse={x:0,y:0,t:-1e9,l:0,r:0};
cv.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.t=performance.now()});
cv.addEventListener('pointerdown',e=>{if(duckClick(e.clientX,e.clientY)&&(!V||V.phase!=='play'))return;if(e.pointerType==='touch')return;mouse.x=e.clientX;mouse.y=e.clientY;mouse.t=performance.now();if(e.button===0)mouse.l=1;if(e.button===2)mouse.r=1});
addEventListener('pointerup',e=>{if(e.button===0)mouse.l=0;if(e.button===2)mouse.r=0});
addEventListener('blur',()=>{mouse.l=mouse.r=0});
cv.addEventListener('contextmenu',e=>e.preventDefault());
function mouseWorld(){const vx=(mouse.x*DPR-OX)/SC,vy=(mouse.y*DPR-OY)/SC;return [(vx-W/2)/camZ+camX,(vy-H/2)/camZ+camY]}
const FONT="'Luckiest Guy',Impact,sans-serif";
// --- pre-rendered table
const raft=(()=>{const c=document.createElement('canvas');c.width=c.height=640;const g=c.getContext('2d');const R=300;g.translate(320,320);
 g.save();g.beginPath();g.arc(0,0,R,0,TAU);g.clip();const pc=['#b5733a','#a8672f','#bd7c40','#a05f2b'];
 for(let x=-R,i=0;x<R;x+=46,i++){g.fillStyle=pc[i%4];g.fillRect(x,-R,46,2*R);g.strokeStyle='rgba(60,25,5,.55)';g.lineWidth=3;g.beginPath();g.moveTo(x,-R);g.lineTo(x,R);g.stroke();
  g.strokeStyle='rgba(70,30,8,.18)';g.lineWidth=1.5;for(let k=0;k<5;k++){g.beginPath();const ox=x+rnd(6,40);g.moveTo(ox,-R);for(let y=-R;y<R;y+=30)g.quadraticCurveTo(ox+rnd(-5,5),y+15,ox+rnd(-3,3),y+30);g.stroke()}
  const ky=rnd(-R,R);g.fillStyle='rgba(70,30,8,.35)';g.beginPath();g.ellipse(x+23,ky,6,10,0,0,TAU);g.fill();
  g.fillStyle='#4a2a12';[-R+40,R-40,0].forEach(y=>{g.beginPath();g.arc(x+8,y,2.5,0,TAU);g.arc(x+38,y,2.5,0,TAU);g.fill()})}
 for(let i=0;i<7;i++){const a=Math.random()*TAU,d=rnd(40,230),x=Math.cos(a)*d,y=Math.sin(a)*d;g.strokeStyle='rgba(80,40,5,.35)';g.lineWidth=4;g.beginPath();g.arc(x,y,rnd(16,24),rnd(0,1),rnd(4.5,6.2));g.stroke()}
 for(let i=0;i<5;i++){const a=Math.random()*TAU,d=rnd(30,240),x=Math.cos(a)*d,y=Math.sin(a)*d;g.fillStyle='rgba(255,200,70,.12)';g.beginPath();for(let k=0;k<=12;k++){const aa=k/12*TAU,rr=rnd(18,34);g.lineTo(x+Math.cos(aa)*rr*1.4,y+Math.sin(aa)*rr)}g.fill()}
 
 const vg=g.createRadialGradient(0,0,R*.5,0,0,R);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(40,15,0,.45)');g.fillStyle=vg;g.fillRect(-R,-R,2*R,2*R);g.restore();return c})();
// floating sea props
const props=[...Array(14)].map((_,i)=>({x:rnd(0,W),y:rnd(0,H),vx:rnd(-8,8),vy:rnd(-5,5),a:rnd(0,TAU),va:rnd(-.4,.4),k:i===0?1:i<3?5:[0,2,3,4][i%4],s:rnd(.8,1.2),q:0}));
function duckClick(cx,cy){mouse.x=cx;mouse.y=cy;const w=mouseWorld();for(const p of props){if(p.k!==1)continue;if(hyp(p.x-w[0],p.y-w[1])<34){p.q=1;p.va=rnd(-6,6);p.vx=rnd(-40,40);p.vy=rnd(-40,40);initAudio();SFX.quack();achEv('duck');addPop(p.x,p.y-30,pick(['QUACK','quack.','QUAAACK','*quack*']),'#ffd23f',24,.8);return true}}return false}
const foam=[...Array(38)].map(()=>({x:rnd(0,W),y:rnd(0,H),r:rnd(20,70),v:rnd(4,14),ph:rnd(0,TAU)}));
const bubbles=[...Array(40)].map(()=>({x:rnd(0,W),y:rnd(0,H),t:rnd(0,1),s:rnd(2,6)}));
function drawSea(t){surge=Math.max(0,surge-1/60);if(surge>0){ctx.translate(Math.cos(surgeA)*surge*30,Math.sin(surgeA)*surge*30)}const g=ctx.createLinearGradient(0,0,0,H);const hy=V&&V.hydro&&V.phase!=='lobby';g.addColorStop(0,hy?'#8fd8ff':'#f2b33d');g.addColorStop(1,hy?'#2a86d0':'#c46d17');ctx.fillStyle=g;ctx.fillRect(-700,-500,W+1400,H+1000);
 ctx.fillStyle='rgba(255,246,224,.28)';for(const f of foam){const x=(f.x+t*f.v)%(W+200)-100,y=f.y+Math.sin(t*.6+f.ph)*8;ctx.beginPath();ctx.ellipse(x,y,f.r,f.r*.45,0,0,TAU);ctx.fill()}
 for(const b of bubbles){const u=(t*.5+b.t)%1;ctx.strokeStyle='rgba(255,255,255,'+(.6*(1-u))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(b.x,b.y,b.s*(.4+u),0,TAU);ctx.stroke()}
 for(const p of props){p.x+=p.vx/60;p.y+=p.vy/60;p.a+=p.va/60;if(p.x<-40)p.x=W+40;if(p.x>W+40)p.x=-40;if(p.y<-40)p.y=H+40;if(p.y>H+40)p.y=-40;
  if(V?(onArena(p.x,p.y,V)||onArena(p.x+35,p.y,V)||onArena(p.x-35,p.y,V)||onArena(p.x,p.y+35,V)||onArena(p.x,p.y-35,V)):hyp(p.x-CX,p.y-CY)<BASE_R+40)continue;ctx.save();ctx.translate(p.x,p.y+Math.sin(t*2+p.a)*2-(p.q||0)*18);ctx.rotate(p.a);ctx.scale(p.s*(1+(p.q||0)*.4),p.s*(1+(p.q||0)*.4));if(p.q){p.q=Math.max(0,p.q-1/40);p.va*=.97;p.vx*=.98;p.vy*=.98}drawProp(p.k,t);ctx.restore()}}
function drawProp(k,t){ctx.lineWidth=2.5;ctx.strokeStyle='#2a1608';
 if(k===0){ctx.fillStyle='#9be15d';ctx.beginPath();ctx.arc(0,0,16,0,Math.PI);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#e8ffd0';ctx.beginPath();ctx.arc(0,2,11,0,Math.PI);ctx.fill();ctx.strokeStyle='#9be15d';for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,2);ctx.lineTo(Math.cos(i*Math.PI/4)*11,2+Math.sin(i*Math.PI/4)*11);ctx.stroke()}}
 else if(k===1){ctx.fillStyle='#ffd23f';ctx.beginPath();ctx.ellipse(0,0,16,12,0,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(10,-10,9,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#ff9f1c';ctx.beginPath();ctx.ellipse(19,-9,6,3,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(12,-12,2,0,TAU);ctx.fill()}
 else if(k===2){ctx.fillStyle='#d8d8d8';ctx.beginPath();for(let i=0;i<20;i++){const r=i%2?11:14;ctx.lineTo(Math.cos(i/20*TAU)*r,Math.sin(i/20*TAU)*r)}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#c0392b';ctx.beginPath();ctx.arc(0,0,7,0,TAU);ctx.fill()}
 else if(k===3){const P=()=>{ctx.beginPath();ctx.moveTo(2,-14);ctx.bezierCurveTo(10,-21,21,-12,17,-1);ctx.bezierCurveTo(14,8,6,12,0,12);ctx.bezierCurveTo(-6,12,-14,8,-17,-1);ctx.bezierCurveTo(-21,-12,-10,-21,-2,-14);
  ctx.moveTo(2,-14);ctx.bezierCurveTo(1,-4,-4,4,-11,7);ctx.moveTo(-2,-14);ctx.bezierCurveTo(-1,-4,4,4,11,7)};ctx.lineCap='round';ctx.lineJoin='round';
  P();ctx.strokeStyle='#2a1608';ctx.lineWidth=10;ctx.stroke();P();ctx.strokeStyle='#a8581c';ctx.lineWidth=6.5;ctx.stroke();P();ctx.strokeStyle='rgba(240,160,80,.55)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#fff';[[-15,-6],[14,-7],[0,10],[-8,-16],[7,-16],[-9,9]].forEach(([x,y])=>ctx.fillRect(x-1,y-1,2.5,2.5))}
 else if(k===5){ctx.lineJoin='round';ctx.fillStyle='#e9b46a';rr2(ctx,-22,-7,44,14,7);ctx.fill();ctx.stroke();ctx.fillStyle='#c0432a';rr2(ctx,-26,-4.5,52,9,4.5);ctx.fill();ctx.stroke();ctx.strokeStyle='#ffd23f';ctx.lineWidth=2.5;ctx.beginPath();for(let i=0;i<=8;i++)ctx.lineTo(-20+i*5,(i%2?-2:2));ctx.stroke()}
 else{ctx.fillStyle='#ffef9a';ctx.beginPath();ctx.arc(0,0,13,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-3,-3,6,0,TAU);ctx.fill()}}
