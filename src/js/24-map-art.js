// 24-map-art.js: map textures (getTex) and drawing the table (drawArena)
const mapTex={};
function addShape(c,q,rev){if(q.t==='c'){c.moveTo(q.x+q.r,q.y);if(rev)c.arc(q.x,q.y,q.r,TAU,0,true);else c.arc(q.x,q.y,q.r,0,TAU)}else if(q.t==='r'){const x=q.x-q.w/2,y=q.y-q.h/2,w=q.w,h=q.h,r=22;c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
 else{const hw=q.w/2-q.h/2,R=q.h/2;c.moveTo(q.x+hw,q.y-R);c.arc(q.x+hw,q.y,R,-Math.PI/2,Math.PI/2);c.lineTo(q.x-hw,q.y+R);c.arc(q.x-hw,q.y,R,Math.PI/2,Math.PI*1.5);c.closePath()}}
function mapPath(c,m,holes){c.beginPath();m.solids.forEach(q=>addShape(c,q));if(holes)m.holes.forEach(h=>addShape(c,h,true))}
function stains(g,n,ext){for(let i=0;i<n;i++){const x=rnd(-ext,ext),y=rnd(-ext*.5,ext*.5);g.strokeStyle='rgba(60,25,5,.3)';g.lineWidth=4;g.beginPath();g.arc(x,y,rnd(16,24),rnd(0,1),rnd(4.5,6.2));g.stroke()}}
function coaster(g,x,y,r,bg,fg,txt){g.fillStyle=bg;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.strokeStyle=fg;g.lineWidth=r*.07;g.beginPath();g.arc(x,y,r*.8,0,TAU);g.stroke();
 g.setLineDash([r*.08,r*.06]);g.lineWidth=r*.04;g.beginPath();g.arc(x,y,r*.92,0,TAU);g.stroke();g.setLineDash([]);g.fillStyle=fg;g.font=Math.round(r*.3)+"px 'Luckiest Guy',Impact,sans-serif";g.textAlign='center';g.textBaseline='middle';
 g.globalAlpha=.28;const ws=txt.split(' ');ws.forEach((w,i)=>g.fillText(w,x,y+(i-(ws.length-1)/2)*r*.32));g.globalAlpha=1}
function getTex(id){if(mapTex[id])return mapTex[id];const m=MAPS[id],E=Math.ceil(m.ext+10),c=document.createElement('canvas');c.width=c.height=E*2;const g=c.getContext('2d');g.translate(E,E);
 if(id==='round'){const k=290/300;g.drawImage(raft,-320*k,-320*k,640*k,640*k)}
 else if(id==='belt'){g.fillStyle='#4a5060';g.fillRect(-E,-E,2*E,2*E);g.fillStyle='#6b3a1a';g.fillRect(-450,-37,900,74);g.strokeStyle='rgba(30,10,0,.45)';g.lineWidth=2;for(let x=-450;x<450;x+=40){g.beginPath();g.moveTo(x,-37);g.lineTo(x,37);g.stroke()}
  for(const b of MAPS.belt.belts){g.fillStyle='#262a33';g.fillRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h);g.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<30;i++)g.fillRect(rnd(-450,450),b.y+rnd(-70,70),rnd(20,60),2)}
  g.fillStyle='#9aa3b5';[-200,-37,37,200].forEach(y=>{g.fillRect(-450,y-3,900,6)});stains(g,4,380)}
 else if(id==='ice'){const gr=g.createRadialGradient(-60,-80,30,0,0,300);gr.addColorStop(0,'#f2fbff');gr.addColorStop(1,'#b9dff2');g.fillStyle=gr;g.fillRect(-E,-E,2*E,2*E);g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2;for(let i=0;i<26;i++){g.beginPath();const x=rnd(-250,250),y=rnd(-250,250),a=rnd(0,TAU),l=rnd(40,140);g.moveTo(x,y);g.quadraticCurveTo(x+Math.cos(a+.5)*l*.5,y+Math.sin(a+.5)*l*.5,x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
  g.strokeStyle='rgba(120,180,215,.35)';g.lineWidth=1.5;for(let i=0;i<14;i++){g.beginPath();let x=rnd(-220,220),y=rnd(-220,220);g.moveTo(x,y);for(let k=0;k<4;k++){x+=rnd(-40,40);y+=rnd(-40,40);g.lineTo(x,y)}g.stroke()}
  const cs=[['#f3e3c3','#c0392b','GRIP'],['#ffd23f','#2a1608',''],['#ff9fbf','#7a1040',''],['#d9f2c4','#2f7a2f',''],['#bfe6ff','#1f5fbf','']];MAPS.ice.grip.forEach((q,i)=>coaster(g,q.x,q.y,q.r,cs[i][0],cs[i][1],cs[i][2]))}
 else if(id==='seesaw'){const pc=['#b5733a','#a8672f','#bd7c40','#a05f2b'];for(let y=-105,i=0;y<105;y+=35,i++){g.fillStyle=pc[i%4];g.fillRect(-E,y,2*E,35);g.strokeStyle='rgba(60,25,5,.5)';g.lineWidth=2.5;g.beginPath();g.moveTo(-E,y);g.lineTo(E,y);g.stroke()}
  g.fillStyle='#5c3a1c';for(const x of [-480,-240,0,240,480])for(const y of [-88,88]){g.beginPath();g.arc(x,y,5,0,TAU);g.fill()}
  g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.moveTo(-36,105);g.lineTo(36,105);g.lineTo(0,40);g.closePath();g.fill();stains(g,5,420)}
 else if(id==='counter'||id==='hub'){const pc=['#6f3215','#622a10','#7a3a18','#5c2710'];for(let y=-E,i=0;y<E;y+=36,i++){g.fillStyle=pc[i%4];g.fillRect(-E,y,2*E,36);g.strokeStyle='rgba(25,8,0,.55)';g.lineWidth=2;g.beginPath();g.moveTo(-E,y);g.lineTo(E,y);g.stroke();
   for(let k=0;k<5;k++){g.strokeStyle='rgba(25,8,0,.2)';g.lineWidth=1.5;const oy=y+rnd(4,32);g.beginPath();g.moveTo(-E,oy);for(let x=-E;x<E;x+=40)g.quadraticCurveTo(x+20,oy+rnd(-3,3),x+40,oy+rnd(-1.5,1.5));g.stroke()}}
  stains(g,9,420);

  const gl=g.createLinearGradient(0,-125,0,125);gl.addColorStop(0,'rgba(255,255,255,.2)');gl.addColorStop(.25,'rgba(255,255,255,0)');gl.addColorStop(1,'rgba(0,0,0,.25)');g.fillStyle=gl;g.fillRect(-E,-E,2*E,2*E)}
 else if(id==='pong'){g.fillStyle='#1f5fbf';g.fillRect(-E,-E,2*E,2*E);g.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<40;i++){g.beginPath();g.arc(rnd(-430,430),rnd(-200,200),rnd(20,60),0,TAU);g.fill()}
  g.strokeStyle='#fff';g.lineWidth=6;g.strokeRect(-424,-194,848,388);g.beginPath();g.moveTo(0,-194);g.lineTo(0,194);g.stroke();
  
  for(let i=0;i<6;i++){g.fillStyle='rgba(255,210,80,.1)';const x=rnd(-200,200),y=rnd(-150,150);g.beginPath();for(let k=0;k<=12;k++){const a=k/12*TAU,rr2=rnd(14,28);g.lineTo(x+Math.cos(a)*rr2*1.4,y+Math.sin(a)*rr2)}g.fill()}}
 else if(id==='coasters'){const st=[['#f3e3c3','#c0392b','LAST CALL'],['#ffd23f','#2a1608','HOPS & CO'],['#ff9fbf','#7a1040','PINK PINT'],['#bfe6ff','#1f5fbf','SUDS'],['#d9f2c4','#2f7a2f','CHEERS']];
  m.solids.forEach((q,i)=>{coaster(g,q.x,q.y,q.r,st[i][0],st[i][1],st[i][2]);g.save();g.beginPath();g.arc(q.x,q.y,q.r,0,TAU);g.clip();stains(g,2,60);const vg=g.createRadialGradient(q.x,q.y,q.r*.6,q.x,q.y,q.r);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(60,30,0,.3)');g.fillStyle=vg;g.fillRect(q.x-q.r,q.y-q.r,q.r*2,q.r*2);g.restore()})}
 else if(id==='donut'){g.fillStyle='#d99a52';g.beginPath();g.arc(0,0,300,0,TAU);g.fill();g.fillStyle='#ff8fc0';g.beginPath();for(let i=0;i<=90;i++){const a=i/90*TAU,r=262+Math.sin(a*9)*12+Math.sin(a*4)*7;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();
  for(let i=0;i<=60;i++){const a=-i/60*TAU,r=128+Math.sin(a*7)*7;i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill('evenodd');
  const sc=['#fff','#3fa7ff','#ffd23f','#4cd964','#c77dff','#ff5a5f'];for(let i=0;i<170;i++){const a=rnd(0,TAU),r=rnd(140,250);g.save();g.translate(Math.cos(a)*r,Math.sin(a)*r);g.rotate(rnd(0,TAU));g.fillStyle=pick(sc);rr2(g,-7,-2.5,14,5,2.5);g.fill();g.restore()}
  g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=10;g.lineCap='round';g.beginPath();g.arc(0,0,215,Math.PI*1.1,Math.PI*1.45);g.stroke()}
 else if(id==='pool'){g.fillStyle='#5a2e12';g.fillRect(-E,-E,2*E,2*E);g.fillStyle='#1f7a45';g.fillRect(-430,-215,860,430);g.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<60;i++){g.beginPath();g.arc(rnd(-420,420),rnd(-200,200),rnd(20,50),0,TAU);g.fill()}
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=3;g.beginPath();g.moveTo(-215,-215);g.lineTo(-215,215);g.stroke();g.beginPath();g.arc(-215,0,70,Math.PI/2,Math.PI*1.5);g.stroke();
  const bc=['#ffd23f','#3fa7ff','#ff5a5f','#c77dff','#ff9f1c','#4cd964','#2a1608'];bc.forEach((col,i)=>{const x=180+(i%3)*34+(i>2?17:0)*(i<6?1:0),y=(i<3?-34:i<6?0:34);g.fillStyle=col;g.globalAlpha=.25;g.beginPath();g.arc(x,y,15,0,TAU);g.fill();g.globalAlpha=1});
  MAPS.pool.holes.forEach(h=>{g.fillStyle='#111';g.beginPath();g.arc(h.x,h.y,h.r+8,0,TAU);g.fill()})}
 else if(id==='dance'){g.fillStyle='#1a0f2e';g.fillRect(-E,-E,2*E,2*E);const tc=['#ff3cac','#2bd2ff','#fffb00','#00ff87','#ff7b00','#b14cff'];for(let x=-390;x<390;x+=55)for(let y=-290;y<290;y+=55){g.fillStyle=tc[(Math.abs(Math.round(x/55)*7+Math.round(y/55)*3))%tc.length];g.globalAlpha=.55;g.fillRect(x+3,y+3,49,49);g.globalAlpha=.25;g.fillStyle='#fff';g.fillRect(x+6,y+6,20,8)}g.globalAlpha=1}
 else if(id==='swiss'){g.fillStyle='#ffd04a';g.fillRect(-E,-E,2*E,2*E);g.fillStyle='rgba(200,140,20,.35)';for(let i=0;i<40;i++){g.beginPath();g.arc(rnd(-290,290),rnd(-290,290),rnd(5,14),0,TAU);g.fill()}g.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<12;i++){g.beginPath();g.ellipse(rnd(-250,250),rnd(-250,250),rnd(20,50),rnd(6,12),rnd(0,3),0,TAU);g.fill()}}
 else if(id==='bridge'||id==='donger'){const pc=['#b5733a','#a8672f','#bd7c40','#a05f2b'];for(let x=-E,i=0;x<E;x+=46,i++){g.fillStyle=pc[i%4];g.fillRect(x,-E,46,2*E);g.strokeStyle='rgba(60,25,5,.5)';g.lineWidth=3;g.beginPath();g.moveTo(x,-E);g.lineTo(x,E);g.stroke()}
  g.fillStyle='#8a5a2e';g.fillRect(-120,-42,240,84);g.strokeStyle='rgba(40,15,0,.5)';g.lineWidth=2;for(let x=-120;x<120;x+=30){g.beginPath();g.moveTo(x,-42);g.lineTo(x,42);g.stroke()}stains(g,6,300)}
 mapTex[id]=c;return c}
function rr2(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function drawArena(st,t){const m=MAPS[st.map]||MAPS.round,sc=st.arenaR/BASE_R,tex=getTex(MAPS[st.map]?st.map:'round');
 ctx.save();ctx.translate(CX+st.gx*.02,CY+st.gy*.02+18);ctx.rotate(st.rot);ctx.scale(sc,sc);mapPath(ctx,m,false);ctx.fillStyle='rgba(60,20,0,.35)';ctx.fill();ctx.restore();
 ctx.save();ctx.translate(CX,CY);ctx.rotate(st.rot);ctx.scale(sc,sc);
 mapPath(ctx,m,true);ctx.strokeStyle='rgba(255,246,224,.85)';ctx.lineWidth=34+Math.sin(t*3)*4;ctx.lineJoin='round';ctx.stroke();
 ctx.strokeStyle=m.rim;ctx.lineWidth=18;ctx.stroke();
 ctx.save();ctx.clip('nonzero');ctx.drawImage(tex,-tex.width/2,-tex.height/2);ctx.restore();
 if(st.map==='pong')for(const h of m.holes){const g=ctx.createRadialGradient(h.x,h.y,4,h.x,h.y,h.r);g.addColorStop(0,'#6b3208');g.addColorStop(1,'#c9781e');ctx.fillStyle=g;ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,TAU);ctx.fill();
  ctx.fillStyle='rgba(255,246,224,.55)';ctx.beginPath();ctx.arc(h.x-5,h.y-5,h.r*.4+Math.sin(t*3+h.x)*2,0,TAU);ctx.fill();ctx.strokeStyle='#d62828';ctx.lineWidth=9;ctx.beginPath();ctx.arc(h.x,h.y,h.r+3,0,TAU);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(h.x,h.y,h.r+7.5,0,TAU);ctx.stroke()}
 if(st.map==='belt')for(const b of m.belts){ctx.save();ctx.beginPath();ctx.rect(b.x-b.w/2,b.y-b.h/2,b.w,b.h);ctx.clip();ctx.strokeStyle='rgba(255,210,63,.35)';ctx.lineWidth=8;const sp=Math.sign(b.vx),off=((t*b.vx)%60+60)%60;for(let x=b.x-b.w/2-60+off;x<b.x+b.w/2+60;x+=60){ctx.beginPath();ctx.moveTo(x-sp*14,b.y-28);ctx.lineTo(x+sp*14,b.y);ctx.lineTo(x-sp*14,b.y+28);ctx.stroke()}ctx.fillStyle='rgba(0,0,0,.25)';for(let x=b.x-b.w/2+off*0;x<b.x+b.w/2;x+=30){ctx.fillRect(x+((t*b.vx)%30+30)%30,b.y-b.h/2,2,b.h)}ctx.restore()}
 if(st.map==='seesaw'){const g=st.gx||0,a=clamp(Math.abs(g)/320,0,1);if(a>.02){const gr=ctx.createLinearGradient(-500,0,500,0);gr.addColorStop(0,g>0?'rgba(255,255,255,'+(.25*a)+')':'rgba(0,0,0,'+(.4*a)+')');gr.addColorStop(.5,'rgba(0,0,0,0)');gr.addColorStop(1,g>0?'rgba(0,0,0,'+(.4*a)+')':'rgba(255,255,255,'+(.25*a)+')');ctx.fillStyle=gr;ctx.fillRect(-500,-105,1000,210)}
  ctx.fillStyle='#2a1608';ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(18,0);ctx.lineTo(0,-20);ctx.closePath();ctx.globalAlpha=.35;ctx.fill();ctx.globalAlpha=1}
 if(st.map==='donut'){const h=m.holes[0],g=ctx.createRadialGradient(0,0,20,0,0,h.r);g.addColorStop(0,'rgba(90,40,0,.45)');g.addColorStop(1,'rgba(90,40,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,h.r,0,TAU);ctx.fill()}
 ctx.restore();
 if(st.gx||st.gy){ctx.save();ctx.translate(CX,CY);ctx.rotate(Math.atan2(st.gy,st.gx));ctx.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<3;i++){const x=((t*120+i*90)%270)-135;ctx.beginPath();ctx.moveTo(x+30,0);ctx.lineTo(x,-24);ctx.lineTo(x,24);ctx.fill()}ctx.restore()}}
