// 28-world-hud.js: drawing the world, disco, the HUD, and updating effects
function drawWorld(t){drawSea(t);if(!V){drawArena({map:'round',arenaR:BASE_R,rot:t*.05,gx:0,gy:0},t);return}
 drawArena(V,t);
 if(V.zone){const z=V.zone,own=z.own,op=own&&own!=='X'?V.players.find(p=>p.id===own):null,col=own==='X'?'#ff5a5f':op?COLORS[op.color]:'#ffd23f',pul=1+Math.sin(t*6)*.05;ctx.save();ctx.translate(z.x,z.y);
  ctx.globalAlpha=.3;ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,z.r*pul,0,TAU);ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=7;ctx.setLineDash([16,10]);ctx.lineDashOffset=-t*50;ctx.beginPath();ctx.arc(0,0,z.r*pul,0,TAU);ctx.stroke();ctx.setLineDash([]);
  ctx.save();ctx.globalAlpha=.6;ctx.scale(2.2,2.2);drawCrown(0,0);ctx.restore();
  const lab=own==='X'?'CONTESTED!':z.t<3?'MOVING!':'';if(lab&&Math.floor(t*5)%2){ctx.font='22px '+FONT;ctx.textAlign='center';ctx.lineWidth=5;ctx.strokeStyle='#2a1608';ctx.strokeText(lab,0,-z.r-12);ctx.fillStyle='#fff';ctx.fillText(lab,0,-z.r-12)}ctx.restore()}
 for(const r of (V.rails||[])){ctx.lineCap='round';const ln=(o,w,c)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(r.ax,r.ay+o);ctx.lineTo(r.bx,r.by+o);ctx.stroke()};
  ln(9,14,'rgba(30,10,0,.25)');ln(0,14,r.hp>1?'rgba(185,232,255,.9)':'rgba(185,232,255,.55)');ln(-3,3,'rgba(255,255,255,.95)');ln(-14,7,r.hp>1?'rgba(185,232,255,.55)':'rgba(185,232,255,.3)');
  if(r.hp===1){const mx=(r.ax+r.bx)/2,my=(r.ay+r.by)/2,dx=(r.bx-r.ax)/8,dy=(r.by-r.ay)/8;ctx.strokeStyle='#2a1608';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(mx-dx*2,my-dy*2-6);ctx.lineTo(mx-dx*.5,my-dy*.5+4);ctx.lineTo(mx+dx*.6,my+dy*.6-7);ctx.lineTo(mx+dx*2,my+dy*2+3);ctx.moveTo(mx-dx*.5,my-dy*.5+4);ctx.lineTo(mx-dx*1.2,my-dy*1.2+9);ctx.stroke()}}
 for(const it of (V.items||[])){const bob=Math.abs(Math.sin(t*4+it.x))*5;ctx.save();ctx.translate(it.x,it.y);ctx.fillStyle='rgba(30,10,0,.25)';ctx.beginPath();ctx.ellipse(0,14,20,7,0,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(255,236,140,'+(.45+Math.sin(t*8)*.3)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-4,29,0,TAU);ctx.stroke();ctx.translate(0,-6-bob);ctx.rotate(Math.sin(t*3+it.y)*.08);
  ctx.fillStyle='#b8783a';ctx.strokeStyle='#2a1608';ctx.lineWidth=3;rr2(ctx,-17,-17,34,34,4);ctx.fill();ctx.stroke();ctx.strokeStyle='#7a4a1e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-17,-6);ctx.lineTo(17,-6);ctx.moveTo(-17,6);ctx.lineTo(17,6);ctx.stroke();
  ctx.font='24px '+FONT;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='#2a1608';ctx.strokeText('?',0,2);ctx.fillStyle='#ffd23f';ctx.fillText('?',0,2);ctx.restore()}
 for(const c of (V.loose||[])){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(1.57+c.x*.01);ctx.scale(.8,.8);drawPint(ctx,0);ctx.restore();
  if(Math.floor(t*4+c.x)%3===0)drawStar(ctx,c.x+8,c.y-10,4,'#fff')}
 if(V.fl)for(const f of V.fl)drawFloater(ctx,f,t);
 if(S&&S.hub&&V===S)drawHubPads(ctx,t);
 if(V.phase==='lobby'&&V.players.some(p=>p.pzv))drawPz(ctx,t);
 V.bumpers.forEach((b,i)=>drawBumper(ctx,b,i,t));
 const list=[...V.players].sort((a,b)=>a.y-b.y);
 for(const p of list)if(!p.alive&&p.fall>0)drawGuy(ctx,p,A_(p.id),t);
 for(const k of V.kegs)if(k.warn<=0)drawKeg(ctx,k,t);
 const teams=V.settings.mode==='teams'&&V.phase!=='lobby';
 for(const p of list)if(p.alive&&p.hand>0)drawHandArm(ctx,p.x,p.y,1-p.hand/1.15,t);
 for(const p of list)if(p.alive){if(teams){ctx.strokeStyle=TEAMS[p.team].c;ctx.lineWidth=5;if(cbOn&&p.team)ctx.setLineDash([9,7]);ctx.beginPath();ctx.ellipse(p.x,p.y+p.r*.55,p.r*1.15,p.r*.5,0,0,TAU);ctx.stroke();ctx.setLineDash([])}
  if(p.courage>0&&Math.random()<.5)parts.push({x:p.x+rnd(-p.r,p.r),y:p.y+rnd(-p.r,p.r*.3),vx:0,vy:-60,z:0,vz:0,t:0,life:.5,sz:rnd(3,6),col:pick(['#ff5a5f','#ff9f1c','#ffd23f']),g:0});
  ctx.save();if(p.inv>0)ctx.globalAlpha=Math.floor(t*12)%2?.45:.9;drawGuy(ctx,p,A_(p.id),t);ctx.restore();
  if(p.armor>0){ctx.strokeStyle='rgba(255,210,63,'+(.55+Math.sin(t*6)*.25)+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y-p.r*.2,p.r+14,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y-p.r*.2,p.r+14,t*3,t*3+1);ctx.stroke()}
  if(p.ctr>0){ctx.strokeStyle='rgba(255,210,63,'+(.5+.5*Math.sin(t*30))+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y-p.r*.2,p.r+14,0,TAU);ctx.stroke()}
  if(p.parry>0){const u=1-p.parry/.22;ctx.strokeStyle='rgba(255,210,63,'+(1-u)+')';ctx.lineWidth=7;ctx.beginPath();ctx.arc(p.x,p.y-p.r*.2,p.r+8+u*16,0,TAU);ctx.stroke();ctx.fillStyle='rgba(255,236,150,'+(.35*(1-u))+')';ctx.fill()}
  if(p.aiming&&p.thT>.18){const c=COLORS[p.color];ctx.save();ctx.globalAlpha=.16;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(p.x,p.y-6);ctx.arc(p.x,p.y-6,230,p.aimC-Math.PI/4,p.aimC+Math.PI/4);ctx.closePath();ctx.fill();ctx.restore()}
  if(p.aiming&&p.thT>.18){const a=p.aimA,c=COLORS[p.color];ctx.save();ctx.setLineDash([10,9]);ctx.lineDashOffset=-t*60;ctx.strokeStyle=c;ctx.lineWidth=4;ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(p.x+Math.cos(a)*(p.r+10),p.y-6+Math.sin(a)*(p.r+10));ctx.lineTo(p.x+Math.cos(a)*260,p.y-6+Math.sin(a)*260);ctx.stroke();ctx.setLineDash([]);
   ctx.translate(p.x+Math.cos(a)*268,p.y-6+Math.sin(a)*268);ctx.rotate(a);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-8);ctx.lineTo(-6,8);ctx.fill();ctx.restore()}
  if(p.aiming){const drinking=p.thT<=.45,a=p.face;ctx.save();if(drinking){ctx.translate(p.x+p.r*.4,p.y-p.r*1.05);ctx.rotate(-1.9+Math.sin(t*20)*.1)}else{ctx.translate(p.x+Math.cos(a)*p.r*1.1,p.y-p.r*.5+Math.sin(a)*p.r*.5);ctx.rotate(a+Math.PI/2)}drawPint(ctx,drinking?1-p.thT/.45:0);ctx.restore()}}
 for(const c of (V.corks||[])){const a=Math.atan2(c.vy,c.vx);ctx.save();ctx.translate(c.x,c.y);ctx.save();ctx.rotate(a);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-16,0);ctx.lineTo(-48,0);ctx.stroke();ctx.restore();
  ctx.fillStyle='rgba(30,10,0,.25)';ctx.beginPath();ctx.ellipse(0,18,10,4,0,0,TAU);ctx.fill();ctx.rotate(gtime*14);drawPint(ctx,0);ctx.restore()}
 for(const k of V.kegs)if(k.warn>0)drawKeg(ctx,k,t);
 // particles
 for(const q of parts){const a=1-q.t/q.life;ctx.globalAlpha=clamp(a*1.5,0,1);ctx.fillStyle=q.col;ctx.beginPath();ctx.arc(q.x,q.y-q.z,q.sz*(q.d?1.6-a*.8:.5+a*.5),0,TAU);ctx.fill()}ctx.globalAlpha=1;
 for(const g of rings){const u=g.t/g.life;ctx.strokeStyle=g.col;ctx.globalAlpha=1-u;ctx.lineWidth=8*(1-u)+1;ctx.beginPath();ctx.arc(g.x,g.y,g.r*(.3+u),0,TAU);ctx.stroke()}ctx.globalAlpha=1;
 for(const p of list){const lg=LOC.size&&typeof p.id==='string'&&p.id.startsWith(NET.myId+'~');drawTag(ctx,p,p.id===NET.myId||lg,t,lg?'P'+(+p.id.split('~')[1]+1)+' ':LOC.size&&p.id===NET.myId?'P1 ':'');drawBubble(ctx,p,t)}
 if(V.settings&&V.settings.ghosts)for(const p of list)if(!p.alive&&p.ghx!=null){const bob=Math.sin(t*3+p.color)*6;ctx.save();ctx.globalAlpha=.45;const gp={...p,x:p.ghx,y:p.ghy+bob,alive:true,fall:1,stun:0,charge:0,dash:0,vx:0,vy:0,teeter:0,emote:-1,emoteT:0,hand:0,gun:0};drawGuy(ctx,gp,A_('g'+p.id),t);ctx.globalAlpha=.8;ctx.font='13px '+FONT;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('👻 '+p.name,p.ghx,p.ghy+bob-p.r*2.3);ctx.restore()}
 for(const n of (V.nuts||[])){const u=clamp(n[2]/.5,0,1);if(u<1){ctx.fillStyle='rgba(30,10,0,'+(.15+u*.25)+')';ctx.beginPath();ctx.ellipse(n[0],n[1],8+u*8,4+u*4,0,0,TAU);ctx.fill();const yy=n[1]-(1-u)*(1-u)*260;ctx.save();ctx.translate(n[0],yy);ctx.rotate(t*12);ctx.fillStyle='#c98a4b';ctx.strokeStyle='#2a1608';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(-4,0,7,6,0,0,TAU);ctx.ellipse(5,0,7,6,0,0,TAU);ctx.fill();ctx.stroke();ctx.restore()}}
 if(S&&S.hub&&V===S)drawHubPeers(ctx,t);
 if(V.bomb){const h=V.players.find(p=>p.id===V.bomb.h);if(h&&h.alive)drawBomb(ctx,h,V.bomb.fuse,t)}
 for(const q of pops){const u=q.t/q.life,s=u<.15?u/.15*1.3:1.3-(u-.15)*.4;ctx.save();ctx.translate(q.x,q.y-u*40);ctx.rotate(q.rot);ctx.scale(s,s);ctx.globalAlpha=u>.7?(1-u)/.3:1;
  ctx.font=q.size+'px '+FONT;ctx.textAlign='center';ctx.lineWidth=7;ctx.strokeStyle='#2a1608';ctx.lineJoin='round';ctx.strokeText(q.text,0,0);ctx.fillStyle=q.col;ctx.fillText(q.text,0,0);ctx.restore()}}
const DCOL=['#ff3cac','#2bd2ff','#fffb00','#00ff87','#ff7b00','#b14cff'];
function drawDisco(t){ctx.save();ctx.fillStyle='rgba(14,0,34,.55)';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
 const beat=Math.floor(t*2.5);
 for(let i=0;i<5;i++){const ox=W*(.1+.2*i),a=Math.PI/2+Math.sin(t*(.7+i*.13)+i*2)*.55,col=DCOL[(i+beat)%DCOL.length];const L=H*1.3,w=.16;
  const g=ctx.createLinearGradient(ox,0,ox+Math.cos(a)*L,Math.sin(a)*L);g.addColorStop(0,col+'aa');g.addColorStop(1,col+'00');ctx.fillStyle=g;ctx.globalAlpha=.26;
  ctx.beginPath();ctx.moveTo(ox,-10);ctx.lineTo(ox+Math.cos(a-w)*L,Math.sin(a-w)*L);ctx.lineTo(ox+Math.cos(a+w)*L,Math.sin(a+w)*L);ctx.closePath();ctx.fill()}
 ctx.globalAlpha=.45;for(let i=0;i<70;i++){const u=(i*137.5)%360,ang=u*Math.PI/180+t*.35,rr=90+((i*53)%420);const x=W/2+Math.cos(ang)*rr*1.5,y=H/2+Math.sin(ang)*rr*.8;
  ctx.fillStyle=DCOL[i%DCOL.length];ctx.beginPath();ctx.arc(x,y,3+(i%3),0,TAU);ctx.fill()}
 ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
 // mirror ball
 const bx=80,by=70+Math.sin(t*1.5)*3;ctx.strokeStyle='#ccc';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,0);ctx.lineTo(bx,by-26);ctx.stroke();
 ctx.save();ctx.translate(bx,by);ctx.beginPath();ctx.arc(0,0,26,0,TAU);ctx.fillStyle='#9aa4b5';ctx.fill();ctx.clip();
 for(let yy=-26;yy<26;yy+=7)for(let xx=-26;xx<26;xx+=7){const k=Math.sin(xx*.3+t*6+yy)*.5+.5;ctx.fillStyle=k>.8?'#fff':k>.5?'#dfe6f0':'#7d8799';ctx.fillRect(xx+((yy/7|0)%2?3:0)+((t*20)%7)-3,yy,6,6)}
 ctx.restore();ctx.strokeStyle='#2a1608';ctx.lineWidth=3;ctx.beginPath();ctx.arc(bx,by,26,0,TAU);ctx.stroke();
 for(let i=0;i<4;i++){const a=t*2+i*1.57;drawStar(ctx,bx+Math.cos(a)*40,by+Math.sin(a)*18,3+Math.sin(t*9+i)*2,'#fff')}
 ctx.restore()}
function bigText(txt,x,y,size,col,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.font=size+'px '+FONT;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
 ctx.lineWidth=size*.18;ctx.strokeStyle='#2a1608';ctx.strokeText(txt,0,size*.08);ctx.strokeText(txt,0,0);ctx.fillStyle=col;ctx.fillText(txt,0,0);ctx.restore()}
function drawHUD(t){const ph=V.phase;
 // player cards
 if(ph!=='lobby'){const n=V.players.length,cw=Math.min(200,(W-40)/n-10),x0=W/2-(n*(cw+10)-10)/2;
  V.players.forEach((p,i)=>{const x=x0+i*(cw+10),y=H-62;ctx.globalAlpha=p.alive||ph!=='play'?1:.55;ctx.fillStyle='rgba(255,243,214,.95)';ctx.strokeStyle='#2a1608';ctx.lineWidth=3;rr(x,y,cw,52,12);ctx.fill();ctx.stroke();
   ctx.fillStyle=COLORS[p.color];ctx.beginPath();ctx.arc(x+24,y+26,15,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+19,y+22,4.5,0,TAU);ctx.arc(x+29,y+22,4.5,0,TAU);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(x+20,y+23,2,0,TAU);ctx.arc(x+30,y+23,2,0,TAU);ctx.fill();
   if(!p.alive&&ph==='play'){ctx.strokeStyle='#c0392b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+12,y+14);ctx.lineTo(x+36,y+38);ctx.moveTo(x+36,y+14);ctx.lineTo(x+12,y+38);ctx.stroke()}
   ctx.fillStyle='#2a1608';{let fs=15;ctx.font=fs+'px '+FONT;while(fs>9&&ctx.measureText(p.name).width>146){fs--;ctx.font=fs+'px '+FONT}}ctx.textAlign='left';const stk=V.settings.mode==='stock'&&V.phase!=='lobby';ctx.fillText(p.name,x+46,y+20,stk?104:148);if(stk){ctx.save();ctx.textAlign='right';ctx.font='15px sans-serif';ctx.fillStyle=p.lives>0?'#ff5a5f':'#bbb';ctx.fillText(p.lives>0?'♥'.repeat(p.lives):'💀',x+192,y+20);ctx.restore()}
   if(V.settings.mode==='teams'){ctx.fillStyle=TEAMS[p.team].c;ctx.fillRect(x+12,y+46,cw-24,4)}
   const md=V.settings.mode;if(md==='happy'||md==='koth'){ctx.font='20px '+FONT;ctx.fillStyle=p.score<0?'#c0392b':'#2a1608';ctx.fillText(md==='koth'?Math.floor(p.score)+' / '+KOTH_T:(p.score>0?'+':'')+p.score+' pts',x+46,y+42)}
   else{const tg=V.settings.target;for(let s=0;s<tg;s++){const mx=x+48+s*Math.min(17,(cw-56)/tg),my=y+28;ctx.fillStyle=s<p.score?'#f5a623':'rgba(42,22,8,.15)';ctx.fillRect(mx,my,11,14);if(s<p.score){ctx.fillStyle='#fff';ctx.fillRect(mx,my-3,11,4)}}}
   ctx.font='11px Fredoka,sans-serif';ctx.fillStyle='rgba(42,22,8,.7)';if(V.hydro&&V.phase==='play'){ctx.font='12px sans-serif';ctx.fillText('💦 '+(p.spl|0)+'/3 splashes',x+46,y+50-1,cw-52)}else if(V.settings.mode==='draft'){if(p.pks){ctx.font='12px sans-serif';ctx.fillText(p.pks,x+46,y+50-1,cw-52)}}else if(V.settings.mode!=='happy'&&V.settings.mode!=='koth')ctx.fillText(BUZZ[Math.min(p.buzz,7)],x+46,y+50-2);
   if(V.lastWinner===p.id||(p.score>0&&p.score===Math.max(...V.players.map(q=>q.score)))){drawCrown(x+24,y+8)}ctx.globalAlpha=1})}
 if(ph==='play'||ph==='intro'){const names=V.mut.map(m=>MUTS[m].n).join(' + ');ctx.font='18px '+FONT;const md=V.settings.mode,cont=md==='happy'||md==='koth';const label=(cont?MODES[md].n.toUpperCase():'ROUND '+V.round)+' · '+(MAPS[V.map]||MAPS.round).n+' · '+names;const w=ctx.measureText(label).width+30;
  ctx.fillStyle='rgba(42,22,8,.8)';rr(W/2-w/2,12,w,34,17);ctx.fill();ctx.fillStyle='#fff6e0';ctx.textAlign='center';ctx.fillText(label,W/2,36);
  if(ph==='play'&&cont){const left=Math.max(0,(md==='happy'?HAPPY_T:KOTH_MAX)-V.matchT),mm=Math.floor(left/60),ss=Math.floor(left%60);ctx.font='24px '+FONT;ctx.fillStyle=left<15?'#ff5a5f':'#fff6e0';ctx.lineWidth=4;ctx.strokeStyle='#2a1608';const tx=mm+':'+(ss<10?'0':'')+ss;ctx.strokeText(tx,W/2,78);ctx.fillText(tx,W/2,78);
   if(V.mutT<2.6&&V.matchT>5){const s2=clamp(V.mutT*5,0,1);bigText('NEW CHAOS!',W/2,H/2-60,56*s2,'#ff5a5f',Math.sin(t*9)*.08);bigText(V.mut.map(m=>MUTS[m].n.toUpperCase()).join(' + '),W/2,H/2+5,40*s2,'#ffd23f',0)}}
  else if(ph==='play'){const left=Math.max(0,45-V.rt);if(V.sudden){bigText('SUDDEN DEATH',W/2,74,26,Math.floor(t*6)%2?'#ff5a5f':'#fff')}else{ctx.font='22px '+FONT;ctx.fillStyle=left<10?'#ff5a5f':'#fff6e0';ctx.lineWidth=4;ctx.strokeStyle='#2a1608';ctx.strokeText(Math.ceil(left),W/2,76);ctx.fillText(Math.ceil(left),W/2,76)}}}
 if(V.waveWarn>0&&ph==='play'){const a=V.waveA,b=Math.floor(t*8)%2;ctx.save();ctx.translate(W/2,H/2);ctx.rotate(a);ctx.globalAlpha=.45;ctx.fillStyle=b?'#fff6e0':'#ff5a5f';ctx.strokeStyle='#2a1608';ctx.lineWidth=6;
  ctx.beginPath();ctx.moveTo(150,0);ctx.lineTo(40,-70);ctx.lineTo(40,-30);ctx.lineTo(-150,-30);ctx.lineTo(-150,30);ctx.lineTo(40,30);ctx.lineTo(40,70);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();bigText('SLOSH INCOMING!',W/2,130,40,'#fff6e0',Math.sin(t*10)*.05)}
 if(V.mut&&V.mut.includes('slosh')&&(ph==='play'||ph==='intro')){const sw=Math.sin(t*1.3)*12;ctx.save();ctx.translate(-30+sw,0);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(0,0,70,H);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(56,0,6,H);
  for(let i=0;i<4;i++){const y=150+i*120+Math.sin(t*2+i)*4;ctx.fillStyle='#f1c27d';ctx.strokeStyle='#2a1608';ctx.lineWidth=4;rr(-40,y,120,70,34);ctx.fill();ctx.stroke();ctx.fillStyle='#ffe0e6';rr(54,y+12,24,42,10);ctx.fill();ctx.stroke()}ctx.restore()}
 if(ph==='intro'){const pt=V.pt;const sIn=clamp(pt*4,0,1),wob=Math.sin(t*5)*.04;
  ctx.fillStyle='rgba(42,22,8,'+(.45*sIn)+')';ctx.fillRect(0,0,W,H);
  if(V.hydro)bigText('💧 HYDRATION BREAK 💧',W/2,H/2-225,34*sIn,'#7fd3ff',-wob);
  if(V.disco)bigText('🪩 DISCO ROUND 🪩',W/2,H/2-225,34*sIn,DCOL[Math.floor(t*6)%DCOL.length],-wob);
  const md2=V.settings.mode,cont2=md2==='happy'||md2==='koth';bigText(cont2?MODES[md2].n.toUpperCase():'ROUND '+V.round,W/2,H/2-175,44*sIn,'#fff6e0',wob);
  ctx.font='20px Fredoka,sans-serif';ctx.fillStyle='#ffe9a8';ctx.textAlign='center';ctx.fillText('on '+(MAPS[V.map]||MAPS.round).n+(MAP_TIPS[V.map]?'  ·  '+MAP_TIPS[V.map]:''),W/2,H/2-138);
  if(cont2){ctx.font='22px Fredoka,sans-serif';ctx.fillStyle='#fff6e0';ctx.fillText(MODES[md2].d,W/2,H/2-40)}
  else V.mut.forEach((m,i)=>{const y=H/2-70+i*110;bigText(MUTS[m].n.toUpperCase(),W/2,y,70*sIn,['#f5a623','#ff7eb6'][i],-wob);ctx.font='22px Fredoka,sans-serif';ctx.fillStyle='#fff6e0';ctx.textAlign='center';ctx.fillText(MUTS[m].d,W/2,y+50)});
  const n=pt<1.2?0:pt<2?3:pt<2.8?2:pt<3.6?1:0;if(n){const f=((pt-1.2)%.8)/.8;bigText(String(n),W/2,H/2+170,120*(1.4-f*.5),'#fff',0)}}
 if(ph==='play'&&V.pt<.6){const k=V.pt/.6;ctx.save();ctx.globalAlpha=clamp(1-k*k*1.2,0,1);bigText('BRAWL!',W/2,H*.16+k*-30,90*(1-k*.25),'#ff5a5f',Math.sin(t*8)*.06);ctx.restore()}
 if(ph==='lobby'){const mz=V.players.find(p=>p.id===NET.myId&&p.pzv);if(mz){const v=mz.pzv,tm=Math.max(0,pzTime()-v[2]),best=+store.get('pzbest',0);ctx.font='22px "Luckiest Guy",Impact,sans-serif';ctx.textAlign='center';ctx.lineWidth=6;ctx.strokeStyle='#2a1608';ctx.lineJoin='round';ctx.fillStyle='#bfe6ff';const tx='🌊 THE DEEP END · LEVEL '+(v[0]+1)+'/'+PZL.length+' · '+Math.floor(tm/60)+':'+String(Math.floor(tm%60)).padStart(2,'0')+' · 💀'+v[3]+(best?' · BEST '+Math.floor(best/60)+':'+String(Math.floor(best%60)).padStart(2,'0'):'');ctx.strokeText(tx,W/2+150,H-22);ctx.fillText(tx,W/2+150,H-22)}
  else{ctx.font='16px Fredoka,sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(255,246,224,.85)';ctx.fillText(S&&S.hub?'🍻 The Hub':'Practice area',W/2+150,H-20)}}
 const mp=V.players.find(p=>p.id===NET.myId);if(mp&&!mp.alive&&ph==='play'&&V.settings.mode==='stock'&&mp.lives>0){bigText('BACK IN A SEC',W/2,140,40,'#fff',Math.sin(t*2)*.05);ctx.font='18px Fredoka,sans-serif';ctx.fillStyle='#fff6e0';ctx.textAlign='center';ctx.fillText(mp.lives===1?'Last life. Make it count!':mp.lives+' lives left',W/2,172)}
 else if(mp&&!mp.alive&&ph==='play'&&!RPL.on){bigText('YOU\'RE FISH FOOD',W/2,140,40,'#fff',Math.sin(t*2)*.05);ctx.font='18px Fredoka,sans-serif';ctx.fillStyle='#fff6e0';ctx.textAlign='center';ctx.fillText(V.settings&&V.settings.ghosts?'👻 You\'re a ghost! Move and bump to drop peanuts':'Press 1-4 to heckle',W/2,172)}}
function drawBlaster(c,ammo){c.lineWidth=2;c.strokeStyle='#2a1608';c.fillStyle='#2f7a3a';rr2(c,-6,-6,22,12,5);c.fill();c.stroke();c.fillStyle='#d9b44a';c.fillRect(14,-4,9,8);c.strokeRect(14,-4,9,8);
 c.fillStyle='#d9a066';rr2(c,22,-4.5,7,9,2);c.fill();c.stroke();c.fillStyle='#8a5a2e';rr2(c,-4,4,7,11,2);c.fill();c.stroke();c.fillStyle='#fff';c.fillRect(-2,-3,8,5);
 for(let i=0;i<3;i++){c.fillStyle=i<ammo?'#ffd23f':'rgba(0,0,0,.3)';c.beginPath();c.arc(-1+i*6,-11,2.5,0,TAU);c.fill()}}
function drawPint(c,fill){c.lineWidth=2.5;c.strokeStyle='#2a1608';c.fillStyle='rgba(215,240,255,.75)';c.beginPath();c.moveTo(-9,-13);c.lineTo(9,-13);c.lineTo(7,13);c.lineTo(-7,13);c.closePath();c.fill();c.stroke();
 if(fill>0){c.fillStyle='#f5a623';c.beginPath();const y=13-26*fill;c.moveTo(-7+(-2*(13-y)/26),y);c.lineTo(7+(2*(13-y)/26),y);c.lineTo(7,13);c.lineTo(-7,13);c.closePath();c.fill()}c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=2;c.beginPath();c.moveTo(-5,-9);c.lineTo(-4,9);c.stroke()}
function drawCrown(x,y){ctx.fillStyle='#ffd23f';ctx.strokeStyle='#2a1608';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-11,y+6);ctx.lineTo(x-11,y-4);ctx.lineTo(x-5,y+1);ctx.lineTo(x,y-7);ctx.lineTo(x+5,y+1);ctx.lineTo(x+11,y-4);ctx.lineTo(x+11,y+6);ctx.closePath();ctx.fill();ctx.stroke()}

function updateFX(dt){for(const q of parts){q.t+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=Math.exp(-3*dt);q.vy*=Math.exp(-3*dt);if(q.g){q.vz-=900*dt;q.z=Math.max(0,q.z+q.vz*dt)}}parts=parts.filter(q=>q.t<q.life);if(parts.length>600)parts.splice(0,parts.length-600);
 for(const q of pops)q.t+=dt;pops=pops.filter(q=>q.t<q.life);for(const g of rings)g.t+=dt;rings=rings.filter(g=>g.t<g.life);for(const k in bumpSq)bumpSq[k]=Math.max(0,bumpSq[k]-dt*2);
 if(!V)return;for(const p of V.players){const a=A_(p.id);const sp=hyp(p.vx,p.vy);a.walk+=dt*sp*.06;
  // dust: puffs at the feet when running, dashing, skidding after a hit, or teetering on an edge
  if(p.alive&&!p.pzv&&V.phase!=='results'){a.dT=(a.dT||0)-dt;const skid=p.stun>0&&sp>180,dsh=p.dash>0,run=sp>170&&p.stun<=0&&!dsh;if(a.dT<=0&&(skid||dsh||run||(p.teeter&&sp>25))){a.dT=skid?.035:dsh?.03:run?.15:.13;for(let i=skid?2:1;i--;)parts.push({x:p.x+rnd(-p.r*.5,p.r*.5),y:p.y+p.r*.55+rnd(-3,3),vx:-p.vx*.12+rnd(-25,25),vy:-p.vy*.12+rnd(-22,4),z:0,vz:0,t:0,life:rnd(.28,.5),sz:rnd(3,skid?8:6)*(dsh?1.2:1),col:'rgba(255,246,224,.5)',g:0,d:1})}}
  const ax=(p.vx-a.lvx),ay=(p.vy-a.lvy);a.lvx=p.vx;a.lvy=p.vy;a.pvx-=ax*.25;a.pvy-=ay*.25;
  a.pvx+=(-a.px*160-a.pvx*5)*dt;a.pvy+=(-a.py*160-a.pvy*5)*dt;if(p.stun>0){a.pvx+=Math.cos(gtime*15)*400*dt;a.pvy+=Math.sin(gtime*15)*400*dt}a.px+=a.pvx*dt;a.py+=a.pvy*dt;
  a.px=clamp(a.px,-8,8);a.py=clamp(a.py,-8,8);a.sq=Math.max(0,a.sq-dt*3);
  if(p.dash>0&&Math.random()<.4)parts.push({x:p.x+rnd(-8,8),y:p.y+rnd(-5,5),vx:rnd(-40,40),vy:rnd(-40,40),z:10,vz:rnd(50,150),t:0,life:.5,sz:4,col:'#ffe9a8',g:1})}
 if(V.bomb&&(V.phase==='play')){const f=V.bomb.fuse,rate=f<2?8:f<4?4:2;const k=Math.floor(f*rate);if(k!==tickK){tickK=k;SFX.tick()}}}
let tickK=0;

