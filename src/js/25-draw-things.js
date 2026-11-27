// 25-draw-things.js: drawing characters (drawGuy, hats, faces, backs), name tags, bombs, kegs, Deep End, floaters, bumpers
function drawTable(R,rot,gx,gy,t){const s=R/300;ctx.save();ctx.translate(CX+gx*.02,CY+gy*.02+18);ctx.fillStyle='rgba(60,20,0,.35)';ctx.beginPath();ctx.ellipse(0,0,R+12,R+6,0,0,TAU);ctx.fill();ctx.restore();
 // foam ring
 ctx.save();ctx.translate(CX,CY);ctx.fillStyle='rgba(255,246,224,.85)';ctx.beginPath();for(let i=0;i<=64;i++){const a=i/64*TAU,r=R+10+Math.sin(a*7+t*3)*4+Math.sin(a*11-t*2)*3;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.fill();
 ctx.rotate(rot);ctx.drawImage(raft,-320*s,-320*s,640*s,640*s);ctx.restore();
 ctx.save();ctx.translate(CX,CY);ctx.strokeStyle='#4a2810';ctx.lineWidth=12;ctx.beginPath();ctx.arc(0,0,R-2,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(255,220,160,.35)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R-6,Math.PI*1.1,Math.PI*1.7);ctx.stroke();
 if(gx||gy){const a=Math.atan2(gy,gx);ctx.rotate(a);ctx.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<3;i++){const x=((t*120+i*90)%270)-135;ctx.beginPath();ctx.moveTo(x+30,0);ctx.lineTo(x,-24);ctx.lineTo(x,24);ctx.fill()}}
 ctx.restore()}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function drawHat(c,hat,r,t){const rr=(x,y,w,h,q)=>rr2(c,x,y,w,h,q);c.save();c.lineWidth=3;c.strokeStyle='#2a1608';c.lineJoin='round';const w=r*1.1;
 switch(HATS[hat]){
 case 'lampshade':c.rotate(-.25);c.fillStyle='#fff1c9';c.beginPath();c.moveTo(-w*.95,0);c.lineTo(w*.95,0);c.lineTo(w*.55,-r*1.0);c.lineTo(-w*.55,-r*1.0);c.closePath();c.fill();c.stroke();
  c.strokeStyle='#e0a84a';c.lineWidth=2;for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(i*w*.27,0);c.lineTo(i*w*.27+Math.sin(t*6+i)*2,6);c.stroke()}c.fillStyle='rgba(255,230,120,.5)';c.beginPath();c.ellipse(0,-r*.1,w*.4,4,0,0,TAU);c.fill();break;
 case 'cone':c.rotate(.15);c.fillStyle='#ff7a1a';c.beginPath();c.moveTo(-w*.7,0);c.lineTo(w*.7,0);c.lineTo(w*.12,-r*1.5);c.lineTo(-w*.12,-r*1.5);c.closePath();c.fill();c.stroke();c.fillStyle='#fff';
  c.beginPath();c.moveTo(-w*.48,-r*.5);c.lineTo(w*.48,-r*.5);c.lineTo(w*.37,-r*.8);c.lineTo(-w*.37,-r*.8);c.fill();rr(-w*.85,-4,w*1.7,8,3);c.fillStyle='#ff7a1a';c.fill();c.stroke();break;
 case 'tophat':c.rotate(-.1);c.fillStyle='#222';rr(-w*.5,-r*1.2,w,r*1.2,4);c.fill();c.stroke();c.fillStyle='#c0392b';c.fillRect(-w*.5+1.5,-r*.42,w-3,r*.22);c.fillStyle='#222';c.beginPath();c.ellipse(0,0,w*.85,r*.18,0,0,TAU);c.fill();c.stroke();break;
 case 'party':c.rotate(.2);c.fillStyle='#3fa7ff';c.beginPath();c.moveTo(-w*.55,0);c.lineTo(w*.55,0);c.lineTo(0,-r*1.5);c.closePath();c.fill();c.stroke();c.fillStyle='#ffd23f';
  for(let i=0;i<3;i++){c.beginPath();c.arc(rnd(-1,1)*0+(-w*.2+i*w*.2),-r*.35-i*r*.3,3,0,TAU);c.fill()}c.fillStyle='#ff5a5f';c.beginPath();c.arc(0,-r*1.5,6,0,TAU);c.fill();c.stroke();break;
 case 'viking':c.fillStyle='#fff3d6';[-1,1].forEach(s=>{c.beginPath();c.moveTo(s*w*.55,-r*.2);c.quadraticCurveTo(s*w*1.15,-r*.4,s*w*1.0,-r*1.2);c.quadraticCurveTo(s*w*.85,-r*.55,s*w*.35,-r*.5);c.closePath();c.fill();c.stroke()});
  c.fillStyle='#9aa4ad';c.beginPath();c.ellipse(0,-r*.1,w*.72,r*.7,0,Math.PI,TAU);c.closePath();c.fill();c.stroke();c.fillStyle='#c9a227';c.fillRect(-w*.72,-r*.16,w*1.44,r*.18);c.strokeRect(-w*.72,-r*.16,w*1.44,r*.18);break;
 case 'cowboy':c.rotate(-.12);c.fillStyle='#a0612b';c.beginPath();c.ellipse(0,0,w*1.15,r*.26,0,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(-w*.5,-2);c.quadraticCurveTo(-w*.55,-r*.95,-w*.15,-r*.85);c.lineTo(0,-r*.7);c.lineTo(w*.15,-r*.85);c.quadraticCurveTo(w*.55,-r*.95,w*.5,-2);c.closePath();c.fill();c.stroke();
  c.fillStyle='#5a2e0e';c.fillRect(-w*.5,-r*.28,w,r*.16);break;
 case 'propeller':{const cols=['#ff5a5f','#ffd23f','#3fa7ff','#4cd964'];for(let i=0;i<4;i++){c.fillStyle=cols[i];c.beginPath();c.moveTo(0,0);c.arc(0,0,w*.68,Math.PI+i*Math.PI/4,Math.PI+(i+1)*Math.PI/4);c.closePath();c.fill()}
  c.beginPath();c.arc(0,0,w*.68,Math.PI,TAU);c.closePath();c.stroke();c.fillStyle='#555';c.fillRect(-1.5,-r*.9,3,r*.25);c.save();c.translate(0,-r*.9);c.scale(Math.cos(t*25),1);c.fillStyle='#ff5a5f';c.beginPath();c.ellipse(0,0,w*.7,4,0,0,TAU);c.fill();c.stroke();c.restore();break}
 case 'chef':c.fillStyle='#fff';rr(-w*.42,-r*.6,w*.84,r*.6,3);c.fill();c.stroke();[[-w*.3,-r*.85,r*.38],[w*.3,-r*.85,r*.38],[0,-r*1.05,r*.45]].forEach(([x,y,rr2])=>{c.beginPath();c.arc(x,y,rr2,0,TAU);c.fill();c.stroke()});c.fillRect(-w*.4,-r*.75,w*.8,r*.3);break;
 case 'beanie':c.fillStyle='#e8473f';c.beginPath();c.ellipse(0,-2,w*.7,r*.75,0,Math.PI,TAU);c.closePath();c.fill();c.stroke();c.fillStyle='#fff6e0';rr(-w*.74,-r*.18,w*1.48,r*.26,4);c.fill();c.stroke();c.beginPath();c.arc(0,-r*.82,r*.2,0,TAU);c.fill();c.stroke();break;
 case 'helmet':c.fillStyle='#ffd23f';c.beginPath();c.ellipse(0,-2,w*.72,r*.7,0,Math.PI,TAU);c.closePath();c.fill();c.stroke();rr(-w*.85,-5,w*1.7,7,3);c.fill();c.stroke();
  [-1,1].forEach(sd=>{c.fillStyle='#c0392b';rr(sd*w*.72-r*.17,-r*.75,r*.34,r*.55,4);c.fill();c.stroke();c.strokeStyle='#fff';c.lineWidth=2.5;c.beginPath();c.moveTo(sd*w*.72,-r*.75);c.quadraticCurveTo(sd*w*.6,-r*1.2,sd*w*.2,-r*.9);c.quadraticCurveTo(0,-r*.7,sd*w*.05,-r*.35);c.stroke();c.strokeStyle='#2a1608';c.lineWidth=3});break;
 case 'horns':c.fillStyle='#d0202a';[-1,1].forEach(sd=>{c.beginPath();c.moveTo(sd*w*.5,-2);c.quadraticCurveTo(sd*w*.95,-r*.5,sd*w*.7,-r*1.05);c.quadraticCurveTo(sd*w*.6,-r*.5,sd*w*.15,-r*.25);c.closePath();c.fill();c.stroke()});break;
 case 'pirate':c.rotate(-.08);c.fillStyle='#1d1d1d';c.beginPath();c.moveTo(-w*1.05,-r*.05);c.quadraticCurveTo(-w*.6,-r*1.25,0,-r*.95);c.quadraticCurveTo(w*.6,-r*1.25,w*1.05,-r*.05);c.quadraticCurveTo(0,-r*.35,-w*1.05,-r*.05);c.closePath();c.fill();c.stroke();
  c.fillStyle='#fff';c.beginPath();c.arc(0,-r*.6,r*.17,0,TAU);c.fill();c.fillRect(-r*.1,-r*.5,r*.2,r*.12);c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.moveTo(-r*.3,-r*.3);c.lineTo(r*.3,-r*.55);c.moveTo(r*.3,-r*.3);c.lineTo(-r*.3,-r*.55);c.stroke();break;
 case 'wizard':c.rotate(.1);c.fillStyle='#5b3bb5';c.beginPath();c.moveTo(-w*.62,0);c.lineTo(w*.62,0);c.quadraticCurveTo(w*.2,-r*1.1,w*.55,-r*1.75);c.quadraticCurveTo(-w*.05,-r*1.2,-w*.62,0);c.closePath();c.fill();c.stroke();
  drawStar(c,-w*.1,-r*.45,r*.18,'#ffd23f');drawStar(c,w*.2,-r*.95,r*.12,'#ffd23f');c.fillStyle='#5b3bb5';c.beginPath();c.ellipse(0,0,w*.95,r*.18,0,0,TAU);c.fill();c.stroke();break;
 case 'halo':{const y=-r*.7+Math.sin(t*3)*3;c.shadowColor='#ffe066';c.shadowBlur=14;c.strokeStyle='#ffd23f';c.lineWidth=6;c.beginPath();c.ellipse(0,y,w*.62,r*.2,0,0,TAU);c.stroke();c.shadowBlur=0;c.strokeStyle='#2a1608';c.lineWidth=1.5;c.beginPath();c.ellipse(0,y,w*.62+3,r*.2+3,0,0,TAU);c.stroke();break}
 case 'duck':{c.rotate(Math.sin(t*3)*.1);c.fillStyle='#ffd23f';c.beginPath();c.ellipse(0,-r*.3,w*.95,r*.3,0,0,TAU);c.fill();c.stroke();c.beginPath();c.arc(w*.35,-r*.72,r*.27,0,TAU);c.fill();c.stroke();c.fillStyle='#ff8c1a';c.beginPath();c.moveTo(w*.6,-r*.75);c.lineTo(w*.98,-r*.68);c.lineTo(w*.6,-r*.6);c.closePath();c.fill();c.stroke();c.fillStyle='#2a1608';c.beginPath();c.arc(w*.42,-r*.78,2.5,0,TAU);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.moveTo(-w*.9,-r*.36);c.lineTo(-w*1.15,-r*.6);c.lineTo(-w*.7,-r*.45);c.closePath();c.fill();c.stroke();break}
 case 'goldmug':{c.rotate(Math.sin(t*2)*.06);c.fillStyle='rgba(255,215,0,.3)';c.beginPath();c.arc(0,-r*.55,r*.75,0,TAU);c.fill();c.fillStyle='#ffd23f';rr(-w*.6,-r*.95,w*1.2,r*.8,6);c.fill();c.stroke();c.beginPath();c.arc(w*.72,-r*.55,r*.22,-1.4,1.4);c.lineWidth=4;c.stroke();c.lineWidth=3;c.fillStyle='#fff';c.beginPath();c.arc(-w*.35,-r*.95,r*.18,0,TAU);c.arc(0,-r*1.0,r*.21,0,TAU);c.arc(w*.35,-r*.95,r*.17,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.6)';c.fillRect(-w*.42,-r*.8,4,r*.5);break}
 case 'glizzy':{c.rotate(Math.sin(t*2.5)*.08);c.fillStyle='#e9b46a';rr(-w*.85,-r*.42,w*1.7,r*.42,r*.2);c.fill();c.stroke();c.fillStyle='#c0432a';rr(-w*1.05,-r*.5,w*2.1,r*.28,r*.14);c.fill();c.stroke();c.strokeStyle='#ffd23f';c.lineWidth=3;c.beginPath();for(let i=0;i<=10;i++)c.lineTo(-w*.8+i*w*.16,-r*.36+(i%2?-3:3));c.stroke();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(-w*.7,-r*.47,w*.5,2);break}
 case 'crown':c.fillStyle='#ffc61a';c.beginPath();c.moveTo(-w*.6,0);c.lineTo(-w*.68,-r*.85);c.lineTo(-w*.32,-r*.45);c.lineTo(0,-r*1.0);c.lineTo(w*.32,-r*.45);c.lineTo(w*.68,-r*.85);c.lineTo(w*.6,0);c.closePath();c.fill();c.stroke();
  [['#e8473f',0],['#3fa7ff',-w*.35],['#4cd964',w*.35]].forEach(([cl,x])=>{c.fillStyle=cl;c.beginPath();c.arc(x,-r*.2,r*.1,0,TAU);c.fill();c.stroke()});c.shadowColor='#fff';c.shadowBlur=8+Math.sin(t*4)*4;c.fillStyle='#fff8';c.beginPath();c.arc(0,-r*1.0,2.5,0,TAU);c.fill();break;
 }c.restore()}
function drawBack(c,k,r,t,vx,vy,col,dark,sp){c.save();c.lineWidth=2.5;c.strokeStyle='#2a1608';c.lineJoin='round';c.lineCap='round';const mv=clamp(sp/250,0,1),sw=Math.sin(t*(4+mv*6))*r*(.06+mv*.08)-clamp(vx/300,-1,1)*r*.25;
 const wing=(s,flap,fill,shape)=>{c.save();c.translate(s*r*.55,-r*.45);c.rotate(s*(-.35+flap));c.scale(s,1);c.fillStyle=fill;c.beginPath();
  if(shape==='bat'){c.moveTo(0,0);c.quadraticCurveTo(r*.6,-r*.9,r*1.45,-r*.55);c.quadraticCurveTo(r*1.2,-r*.15,r*1.3,r*.15);c.quadraticCurveTo(r*1.0,0,r*.95,r*.3);c.quadraticCurveTo(r*.7,r*.1,r*.55,r*.45);c.quadraticCurveTo(r*.35,r*.15,0,r*.3)}
  else if(shape==='fairy'){c.ellipse(r*.75,-r*.45,r*.7,r*.42,-.5,0,TAU);c.moveTo(r*.55,r*.2);c.ellipse(r*.55,r*.25,r*.45,r*.28,.4,0,TAU)}
  else{c.moveTo(0,0);c.quadraticCurveTo(r*.4,-r*1.1,r*1.35,-r*.95);c.quadraticCurveTo(r*1.25,-r*.6,r*1.1,-r*.5);c.quadraticCurveTo(r*1.25,-r*.25,r*.95,-r*.15);c.quadraticCurveTo(r*1.05,r*.1,r*.7,r*.15);c.quadraticCurveTo(r*.7,r*.35,0,r*.3)}
  c.closePath();c.fill();c.stroke();c.restore()};
 switch(BACKS[k]){
 case 'cape':{c.fillStyle='#d0202a';c.beginPath();c.moveTo(-r*.55,-r*.7);c.quadraticCurveTo(-r*1.25+sw*.5,r*.1,-r*1.05+sw,r*.95);for(let i=0;i<=4;i++){const x=-r*1.05+i*r*.525+sw,y=r*.95+Math.sin(t*7+i*1.7)*r*.06*(1+mv);c.lineTo(x,y)}c.quadraticCurveTo(r*1.25+sw*.5,r*.1,r*.55,-r*.7);c.closePath();c.fill();c.stroke();
  c.fillStyle='#ffd23f';[-1,1].forEach(s=>{c.beginPath();c.arc(s*r*.55,-r*.68,r*.12,0,TAU);c.fill();c.stroke()});break}
 case 'balloon':{const bx=r*1.25+Math.sin(t*1.7)*r*.15-clamp(vx/300,-1,1)*r*.4,by=-r*2.5+Math.sin(t*2.3)*r*.12;c.lineWidth=1.5;c.beginPath();c.moveTo(r*.75,-r*.3);c.quadraticCurveTo(r*1.3,-r*1.2,bx,by+r*.5);c.stroke();c.lineWidth=2.5;
  c.fillStyle='#ff4f9a';c.beginPath();c.ellipse(bx,by,r*.42,r*.5,Math.sin(t*1.7)*.15,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(bx-4,by+r*.5);c.lineTo(bx+4,by+r*.5);c.lineTo(bx,by+r*.42);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(bx-r*.15,by-r*.18,r*.08,r*.15,-.4,0,TAU);c.fill();break}
 case 'tail':{const w=Math.sin(t*5)*r*.25+sw;c.strokeStyle='#2a1608';c.lineWidth=7;c.beginPath();c.moveTo(r*.3,r*.55);c.bezierCurveTo(r*1.1,r*.9,r*1.3+w,r*.1,r*1.05+w,-r*.25);c.stroke();c.strokeStyle='#d0202a';c.lineWidth=4;c.stroke();
  c.save();c.translate(r*1.05+w,-r*.25);c.rotate(-1.2+Math.sin(t*5)*.3);c.fillStyle='#d0202a';c.lineWidth=2.5;c.strokeStyle='#2a1608';c.beginPath();c.moveTo(0,-r*.22);c.lineTo(r*.2,r*.1);c.lineTo(0,r*.02);c.lineTo(-r*.2,r*.1);c.closePath();c.fill();c.stroke();c.restore();break}
 case 'flag':{c.strokeStyle='#5a3a1a';c.lineWidth=4;c.beginPath();c.moveTo(-r*.6,r*.2);c.lineTo(-r*.95,-r*2.3);c.stroke();c.strokeStyle='#2a1608';c.lineWidth=2;c.fillStyle=col;c.beginPath();const fx=-r*.93,fy=-r*2.25;c.moveTo(fx,fy);
  for(let i=0;i<=6;i++){const u=i/6;c.lineTo(fx-u*r*1.1,fy+Math.sin(t*8-u*5)*r*.12*u+u*r*.1)}for(let i=6;i>=0;i--){const u=i/6;c.lineTo(fx-u*r*1.1-r*.02,fy+r*.65+Math.sin(t*8-u*5)*r*.12*u)}c.closePath();c.fill();c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(fx-r*.5,fy+r*.32+Math.sin(t*8-2.5)*r*.06,r*.12,0,TAU);c.fill();break}
 case 'jetpack':{[-1,1].forEach(s=>{const x=s*r*.92;const fl=r*(.35+Math.random()*.25+mv*.5);c.fillStyle='#ff9f1c';c.beginPath();c.moveTo(x-r*.16,r*.35);c.lineTo(x,r*.35+fl);c.lineTo(x+r*.16,r*.35);c.closePath();c.fill();c.fillStyle='#ffe066';c.beginPath();c.moveTo(x-r*.08,r*.35);c.lineTo(x,r*.35+fl*.6);c.lineTo(x+r*.08,r*.35);c.closePath();c.fill();
  c.fillStyle='#9aa4ad';rr2(c,x-r*.2,-r*.75,r*.4,r*1.1,r*.18);c.fill();c.stroke();c.fillStyle='#e8473f';c.fillRect(x-r*.2+1.5,-r*.5,r*.4-3,r*.12)});break}
 case 'wings':{const f=Math.sin(t*(5+mv*6))*.28;wing(-1,f,'#fff',0);wing(1,f,'#fff',0);break}
 case 'bat':{const f=Math.sin(t*(7+mv*6))*.35;wing(-1,f,'#4a2a6a','bat');wing(1,f,'#4a2a6a','bat');break}
 case 'fairy':{const f=Math.sin(t*14)*.18;c.globalAlpha=.75;wing(-1,f,'#9be7ff','fairy');wing(1,f,'#9be7ff','fairy');c.globalAlpha=1;for(let i=0;i<3;i++){const a=t*2+i*2.1;drawStar(c,Math.cos(a)*r*1.4,-r*.4+Math.sin(a*1.3)*r*.7,3+Math.sin(t*6+i)*1.5,'#fff7a8')}break}
 }c.restore()}
function drawFace(c,f,ex,ey,er,r,my,t,col){c.save();c.lineWidth=2.5;c.strokeStyle='#2a1608';c.lineJoin='round';c.lineCap='round';const L=ex-r*.32,Rx=ex+r*.32,rr=(x,y,w,h,q)=>rr2(c,x,y,w,h,q);
 const heart=(x,y,s)=>{c.beginPath();c.moveTo(x,y+s*.9);c.bezierCurveTo(x-s*1.6,y-s*.2,x-s*.7,y-s*1.3,x,y-s*.45);c.bezierCurveTo(x+s*.7,y-s*1.3,x+s*1.6,y-s*.2,x,y+s*.9);c.closePath()};
 switch(FACES[f]){
 case 'shades':c.fillStyle='#111';[L,Rx].forEach(x=>{rr(x-er*1.25,ey-er*.85,er*2.5,er*1.7,er*.5);c.fill();c.stroke()});c.beginPath();c.moveTo(L+er*1.2,ey-er*.3);c.lineTo(Rx-er*1.2,ey-er*.3);c.stroke();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=2;[L,Rx].forEach(x=>{c.beginPath();c.moveTo(x-er*.7,ey-er*.4);c.lineTo(x-er*.2,ey-er*.4);c.stroke()});break;
 case 'stache':{const y=my-r*.22;c.fillStyle='#4a2410';c.beginPath();c.moveTo(ex,y-r*.04);c.bezierCurveTo(ex-r*.2,y-r*.16,ex-r*.42,y-r*.06,ex-r*.5,y-r*.2);c.bezierCurveTo(ex-r*.5,y+r*.08,ex-r*.25,y+r*.12,ex,y+r*.04);c.bezierCurveTo(ex+r*.25,y+r*.12,ex+r*.5,y+r*.08,ex+r*.5,y-r*.2);c.bezierCurveTo(ex+r*.42,y-r*.06,ex+r*.2,y-r*.16,ex,y-r*.04);c.closePath();c.fill();c.stroke();break}
 case 'clown':c.fillStyle='#ff2d3d';c.beginPath();c.arc(ex,ey+r*.27,r*.17,0,TAU);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.arc(ex-r*.06,ey+r*.21,r*.05,0,TAU);c.fill();break;
 case 'monocle':c.strokeStyle='#c99a1e';c.lineWidth=3.5;c.beginPath();c.arc(Rx,ey,er*1.25,0,TAU);c.stroke();c.lineWidth=1.5;c.beginPath();c.moveTo(Rx+er*1.1,ey+er*.6);c.quadraticCurveTo(Rx+er*1.8,ey+r*.6,Rx+er*.6,ey+r*.9);c.stroke();c.fillStyle='rgba(200,230,255,.25)';c.beginPath();c.arc(Rx,ey,er*1.2,0,TAU);c.fill();break;
 case '3d':c.fillStyle='#fff';rr(L-er*1.35,ey-er*1.05,(Rx-L)+er*2.7,er*2.1,4);c.fill();c.stroke();c.fillStyle='rgba(255,40,60,.6)';rr(L-er*1.05,ey-er*.75,er*2.1,er*1.5,3);c.fill();c.fillStyle='rgba(40,200,255,.6)';rr(Rx-er*1.05,ey-er*.75,er*2.1,er*1.5,3);c.fill();break;
 case 'patch':c.beginPath();c.moveTo(-r*.95,-r*.95);c.lineTo(r*.9,-r*.15);c.stroke();c.fillStyle='#111';c.beginPath();c.ellipse(L,ey,er*1.2,er*1.05,0,0,TAU);c.fill();c.stroke();break;
 case 'beard':{c.fillStyle='#6b3a17';c.beginPath();c.moveTo(ex-r*.62,my-r*.25);for(let i=0;i<=6;i++){const a=Math.PI-i/6*Math.PI;c.quadraticCurveTo(ex+Math.cos(a+.25)*r*.78,my+r*.05+Math.sin(a+.25)*r*.62,ex+Math.cos(a)*r*.62,my-r*.05+Math.sin(a)*r*.55)}c.lineTo(ex+r*.62,my-r*.25);c.quadraticCurveTo(ex+r*.3,my-r*.02,ex,my+r*.1);c.quadraticCurveTo(ex-r*.3,my-r*.02,ex-r*.62,my-r*.25);c.closePath();c.fill();c.stroke();
  c.fillStyle='#5a1020';c.beginPath();c.arc(ex,my-r*.06,r*.13,.1,Math.PI-.1);c.fill();break}
 case 'hero':c.fillStyle='#d0202a';c.beginPath();rr2(c,L-er*1.7,ey-er*1.05,(Rx-L)+er*3.4,er*2.1,er*.9);c.moveTo(L+er*.95,ey);c.arc(L,ey,er*.95,0,TAU,true);c.moveTo(Rx+er*.95,ey);c.arc(Rx,ey,er*.95,0,TAU,true);c.fill('nonzero');c.stroke();break;
 case 'lucha':{c.save();c.beginPath();c.ellipse(0,-r*.2,r-1,r*1.1-1,0,0,TAU);c.clip();c.fillStyle='#1f6fe0';c.beginPath();c.rect(-r*1.2,-r*1.5,r*2.4,(ey+r*.3)+r*1.5);[L,Rx].forEach(x=>{c.moveTo(x+er*1.15,ey);c.ellipse(x,ey,er*1.15,er*1.05,0,TAU,0,true)});c.fill('nonzero');
  c.fillStyle='#ffd23f';c.beginPath();c.moveTo(ex,-r*1.3);c.lineTo(ex+r*.18,ey-er*1.2);c.lineTo(ex,ey-er*.4);c.lineTo(ex-r*.18,ey-er*1.2);c.closePath();c.fill();c.strokeStyle='#fff';c.lineWidth=2.5;[L,Rx].forEach(x=>{c.beginPath();c.ellipse(x,ey,er*1.2,er*1.1,0,0,TAU);c.stroke()});c.strokeStyle='#2a1608';c.lineWidth=2;c.beginPath();c.moveTo(-r*1.1,ey+r*.3);c.lineTo(r*1.1,ey+r*.3);c.stroke();c.restore();break}
 case 'hearts':c.fillStyle='#ff4f9a';[L,Rx].forEach(x=>{heart(x,ey,er*1.2);c.fill();c.stroke()});c.beginPath();c.moveTo(L+er*.9,ey-er*.4);c.lineTo(Rx-er*.9,ey-er*.4);c.stroke();break;
 case 'goggles':c.strokeStyle='#2a1608';c.lineWidth=6;c.beginPath();c.moveTo(-r*1.0,ey-er*.2);c.lineTo(r*1.0,ey-er*.2);c.stroke();c.strokeStyle='#ff9f1c';c.lineWidth=3.5;c.stroke();c.lineWidth=2.5;c.strokeStyle='#2a1608';
  c.fillStyle='rgba(120,90,255,.45)';rr2(c,L-er*1.4,ey-er*1.1,(Rx-L)+er*2.8,er*2.2,er*1.1);c.fill();c.lineWidth=4;c.strokeStyle='#eee';c.stroke();c.lineWidth=2;c.strokeStyle='#2a1608';c.stroke();c.strokeStyle='rgba(255,255,255,.8)';c.beginPath();c.moveTo(L-er*.8,ey-er*.6);c.lineTo(L-er*.1,ey-er*.6);c.stroke();break;
 }c.restore()}
function drawStar(c,x,y,r,col){c.fillStyle=col;c.beginPath();for(let i=0;i<10;i++){const rr2=i%2?r*.45:r,a=i/10*TAU-Math.PI/2;c.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2)}c.closePath();c.fill();c.strokeStyle='#2a1608';c.lineWidth=1.5;c.stroke()}
const S_hfx=[];function drawHandArm(c,x,y,u,t){const rise=Math.min(1,u/.22),e=1-Math.pow(1-rise,3),wob=Math.sin(t*9)*3*(u>.75?(u-.75)*12:0);const top=y+16+(1-e)*150,bx=x+wob*.3,by=y+190;
 c.save();c.lineJoin='round';c.lineCap='round';c.globalAlpha=.35*e;c.fillStyle='#fff6b0';c.beginPath();c.ellipse(x,top,95,45,0,0,TAU);c.fill();c.globalAlpha=1;
 c.strokeStyle='#2a1608';c.lineWidth=4;c.fillStyle='#f2c79b';c.beginPath();c.moveTo(bx-30,by);c.quadraticCurveTo(x-34,top+60,x-30+wob,top+6);c.lineTo(x+30+wob,top+6);c.quadraticCurveTo(x+34,top+60,bx+30,by);c.closePath();c.fill();c.stroke();
 c.fillStyle='#e0ab7a';c.beginPath();c.ellipse(bx,by-8,40,12,0,0,TAU);c.fill();c.fillStyle='#fff6e0';c.beginPath();c.ellipse(bx,by-2,58,14,0,0,TAU);c.fill();
 c.translate(x+wob,top);c.fillStyle='#f2c79b';c.beginPath();c.ellipse(0,0,56,26,0,0,TAU);c.fill();c.stroke();
 for(const [fx,fh] of [[-40,26],[-14,34],[12,34],[38,28]]){c.beginPath();c.ellipse(fx,-fh*.55,9,fh*.6,fx*.006,0,TAU);c.fill();c.stroke()}
 c.beginPath();c.ellipse(-56,8,10,20,-.9,0,TAU);c.fill();c.stroke();c.restore()}
function drawSlapFx(c,dt){for(const h of S_hfx){h.t+=dt;const u=h.t/.45;c.save();c.globalAlpha=Math.max(0,1-u);c.translate(h.x,h.y);c.rotate(h.a-Math.PI/2+(1-u)*1.4);c.strokeStyle='#2a1608';c.lineWidth=4;c.fillStyle='#f2c79b';c.beginPath();c.ellipse(0,-50,40,52,0,0,TAU);c.fill();c.stroke();
 for(const fx of [-28,-10,8,26]){c.beginPath();c.ellipse(fx,-110,9,24,0,0,TAU);c.fill();c.stroke()}c.restore()}for(let i=S_hfx.length-1;i>=0;i--)if(S_hfx[i].t>.45)S_hfx.splice(i,1)}
function drawGuy(c,p,a,t,opts){opts=opts||{};const r=p.r,col=COLORS[p.color]||'#fff',dark=shade(col,-.45),light=shade(col,.45);
 const sp=hyp(p.vx,p.vy),flail=p.stun>0||p.teeter||!p.alive||p.wob>0,charging=p.charge>0,em=(p.alive&&p.emoteT>0&&!flail)?p.emote:-1,dance=em===2,taunt=em===1||em===4||em===6;
 c.save();c.translate(p.x,p.y);
 let sc=1;if(!p.alive){sc=Math.max(0,p.fall);c.globalAlpha=clamp(p.fall*1.5,0,1);c.translate(0,(1-p.fall)*20)}
 if(p.alive&&!opts.noShadow){c.fillStyle='rgba(30,10,0,.3)';c.beginPath();c.ellipse(0,r*.55,r*.95,r*.38,0,0,TAU);c.fill()}
 c.scale(sc,sc);
 if(p.stun>0&&p.alive){c.rotate(Math.sin(t*14)*.25)}
 if(dance){c.translate(Math.sin(t*11)*6,-Math.abs(Math.cos(t*11))*9);c.rotate(Math.sin(t*11)*.24)}else if(taunt){c.translate(0,-Math.abs(Math.sin(t*15))*5);c.rotate(Math.sin(t*7.5)*.1)}
 if(charging){c.translate(rnd(-1,1)*p.charge*3,rnd(-1,1)*p.charge*3)}
 // squash & stretch
 const st=clamp(sp/1100,0,.3),va=Math.atan2(p.vy,p.vx);c.rotate(va);c.scale(1+st,1-st*.6);c.rotate(-va);
 const sq=charging?1-p.charge*.18:1+a.sq*.15;c.scale(2-sq,sq);
 const wk=Math.sin(a.walk),bob=Math.abs(wk)*3*clamp(sp/200,0,1);c.translate(0,-bob);
 // feet
 c.fillStyle=dark;c.strokeStyle='#2a1608';c.lineWidth=3;[-1,1].forEach(s=>{c.beginPath();c.ellipse(s*r*.42,r*.5+(s*wk*4*clamp(sp/150,0,1)),r*.3,r*.2,0,0,TAU);c.fill();c.stroke()});
 if(p.bk)drawBack(c,p.bk,r,t,p.vx||0,p.vy||0,col,dark,sp);
 // arms
 const fx=Math.cos(p.face),fy=Math.sin(p.face);
 const armA=s=>flail?(-Math.PI/2+s*.6+Math.sin(t*22+s)*.7):dance?(-Math.PI/2+.45+Math.sin(t*11+s*1.7)*.75):taunt?(-.35+Math.sin(t*15+s*.4)*.6):(Math.PI/2-s*.9+(s*wk*.6));
 c.lineCap='round';
 [-1,1].forEach(s=>{const shx=s*r*.82,shy=-r*.25,aa=armA(s)+(s>0?0:Math.PI)*0,len=r*.85;const hx=shx+Math.cos(aa)*len*s*(flail?.6:.7)+s*r*.15,hy=shy+Math.sin(aa)*len;
  c.strokeStyle='#2a1608';c.lineWidth=r*.3+4;c.beginPath();c.moveTo(shx,shy);c.quadraticCurveTo(shx+s*r*.4,(shy+hy)/2,hx,hy);c.stroke();
  c.strokeStyle=col;c.lineWidth=r*.3;c.beginPath();c.moveTo(shx,shy);c.quadraticCurveTo(shx+s*r*.4,(shy+hy)/2,hx,hy);c.stroke();
  if(s>0&&(p.gun==null||p.gun>0)){c.save();c.translate(hx,hy);c.rotate(flail?Math.sin(t*20)*.8:.2);c.strokeStyle='#2a1608';c.fillStyle='#f5b52e';rr2(c,-7,-9,14,17,3);c.fill();c.lineWidth=2.5;c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(-4,-9,4,0,TAU);c.arc(1,-10,4.5,0,TAU);c.arc(5,-9,3.5,0,TAU);c.fill();
   c.beginPath();c.arc(8,0,4.5,-Math.PI/2,Math.PI/2);c.stroke();c.restore()}else{c.fillStyle=col;c.strokeStyle='#2a1608';c.beginPath();c.arc(hx,hy,r*.2,0,TAU);c.fill();c.lineWidth=2.5;c.stroke()}});
 // body
 c.fillStyle=col;c.strokeStyle='#2a1608';c.lineWidth=3.5;c.beginPath();c.ellipse(0,-r*.2,r,r*1.1,0,0,TAU);c.fill();c.stroke();
 c.fillStyle=light;c.beginPath();c.ellipse(fx*r*.12,-r*.02,r*.6,r*.58,0,0,TAU);c.fill();
 c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(-r*.45,-r*.75,r*.18,r*.3,-.5,0,TAU);c.fill();
 // face
 const ex=fx*r*.28,ey=-r*.62+fy*r*.1;const er=r*.27;
 c.fillStyle='rgba(255,80,120,'+clamp(.18+p.buzz*.12,0,.75)+')';[-1,1].forEach(s=>{c.beginPath();c.ellipse(ex+s*r*.52,ey+r*.38,r*.17,r*.11,0,0,TAU);c.fill()});
 [-1,1].forEach(s=>{const x=ex+s*r*.32;c.fillStyle='#fff';c.strokeStyle='#2a1608';c.lineWidth=2.5;c.beginPath();c.arc(x,ey,er*(s>0?1.05:.95),0,TAU);c.fill();c.stroke();
  c.fillStyle='#111';c.beginPath();c.arc(x+clamp(a.px+fx*er*.35,-er*.5,er*.5),ey+clamp(a.py+fy*er*.35,-er*.5,er*.5),er*.45,0,TAU);c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(x+clamp(a.px+fx*er*.35,-er*.5,er*.5)-er*.15,ey+clamp(a.py+fy*er*.35,-er*.5,er*.5)-er*.15,er*.13,0,TAU);c.fill()});
 if(p.buzz>=2){c.strokeStyle='#2a1608';c.lineWidth=2.5;[-1,1].forEach(s=>{const x=ex+s*r*.32;c.beginPath();c.arc(x,ey,er*1.02,Math.PI*1.1,Math.PI*1.9);c.stroke()})}
 const my=ey+r*.45;c.strokeStyle='#2a1608';c.lineWidth=3;c.fillStyle='#5a1020';
 if(flail){c.beginPath();c.ellipse(ex,my+2,r*.16,r*.2,0,0,TAU);c.fill();c.stroke()}
 else if(p.dash>0||charging){c.beginPath();c.moveTo(ex-r*.3,my-2);c.quadraticCurveTo(ex,my+r*.35,ex+r*.3,my-2);c.closePath();c.fill();c.stroke();c.fillStyle='#fff';c.fillRect(ex-r*.2,my-1,r*.4,r*.08)}
 else{c.beginPath();c.arc(ex,my-r*.08,r*.22,.2,Math.PI-.2);c.stroke()}
 if(p.fc)drawFace(c,p.fc,ex,ey,er,r,my,t,col);
 // hat
 c.save();c.translate(ex*.5,-r*1.12);c.rotate(Math.sin(t*3+p.ph)*.06+(flail?Math.sin(t*15)*.2:0));drawHat(c,p.hat,r,t);c.restore();
 c.restore();
 if(!p.alive)return;
 // charge ring
 if(charging){c.save();c.translate(p.x,p.y);const fT=p.fullT||0;c.strokeStyle=p.charge>=1?((p.fullT||0)>.9?(Math.floor(t*20)%2?'#9be37a':'#ff5a5f'):(Math.floor(t*12)%2?'#fff':'#ff5a5f')):'#fff';if(c.lineWidth<6)c.lineWidth=5;c.beginPath();c.arc(0,-r*.2,r+10,-Math.PI/2,-Math.PI/2+TAU*p.charge);c.stroke();
  c.fillStyle='rgba(255,255,255,'+(p.charge*.25)+')';c.beginPath();c.arc(0,-r*.2,r+10,0,TAU);c.fill();
  if(false){const ch=Math.min(1,p.charge),RT=[171,248,346,458,501],ri_=Math.min(3,Math.floor(ch*4)),reach=RT[ri_]+(RT[ri_+1]-RT[ri_])*(ch*4-ri_);const li=p.id===NET.myId?lastInp:(LOC.get(+p.id.split('~')[1])||{}).inp;let fa=p.face;if(li){if(li.m&&typeof li.a==='number')fa=li.a;else if(hyp(li.x,li.y)>.2)fa=Math.atan2(li.y,li.x)}if(V.mut&&V.mut.includes('reverse'))fa+=Math.PI;c.save();c.rotate(fa);c.globalAlpha=.25+.3*ch;c.strokeStyle='#fff';c.lineWidth=3;c.setLineDash([4,9]);c.beginPath();c.moveTo(r+20,0);c.lineTo(reach,0);c.stroke();c.setLineDash([]);c.beginPath();c.arc(reach,0,8+6*ch,0,TAU);c.stroke();c.restore()}
  c.rotate(p.face);c.globalAlpha=.55+.45*p.charge;c.fillStyle=p.charge>=1?'#ff5a5f':'#fff';c.strokeStyle='#2a1608';c.lineWidth=3;const ar=r+18+p.charge*10;c.beginPath();c.moveTo(ar+16,-r*.2*0);c.lineTo(ar,-9);c.lineTo(ar,9);c.closePath();c.fill();c.stroke();c.restore()}
 if(p.dash>0){c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(p.vy,p.vx));c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=3;for(let i=0;i<4;i++){const y=(i-1.5)*r*.45;c.beginPath();c.moveTo(-r-10-rnd(0,20),y);c.lineTo(-r-40-rnd(0,40),y);c.stroke()}c.restore()}
 if(p.stun>0){for(let i=0;i<3;i++){const aa=t*6+i/3*TAU;drawStar(c,p.x+Math.cos(aa)*r*.9,p.y-r*1.9+Math.sin(aa)*r*.3,7,'#ffd23f')}}
 if(p.teeter&&!opts.noTag){c.fillStyle='#fff';c.font='22px '+FONT;c.textAlign='center';c.fillText('!!',p.x+Math.sin(t*20)*3,p.y-r*2.5)}
}
function drawTag(c,p,isMe,t,pre){if(!p.alive)return;const y=p.y-p.r*2.65-(isMe?6:0);c.font=(isMe?'18px ':'15px ')+FONT;c.textAlign='center';c.lineWidth=4;c.strokeStyle='#2a1608';const label=(isMe?'▼ ':'')+(pre||'')+(cbOn?CBS[p.color]+' ':'')+dispName(p);
 const lt=(p.lv&&!p.bot&&V&&(V.phase==='lobby'||V.hub))?'Lv '+p.lv:'';let x=p.x;if(lt){const big=c.font;c.font='12px '+FONT;const lw=c.measureText(lt).width+6;c.font=big;const w=c.measureText(label).width;x=p.x-lw/2;c.textAlign='left';c.font='12px '+FONT;c.lineWidth=3;c.strokeText(lt,x+w/2+6,y);c.fillStyle=p.lv>=69?'#ff7ac0':p.lv>=67?'#ffd23f':'#fff6e0';c.fillText(lt,x+w/2+6,y);c.font=big;c.textAlign='center';c.lineWidth=4}
 c.strokeText(label,x,y);c.fillStyle=isMe?'#fff':COLORS[p.color];c.fillText(label,x,y);
 if(false&&p.slosh>0){const pc=Math.round(p.slosh*100);c.font='13px '+FONT;c.lineWidth=3;c.strokeStyle='#2a1608';c.strokeText(pc+'% sloshed',p.x,y+28);c.fillStyle=pc>=90?'#ff5a5f':pc>=45?'#ffd23f':'#fff6e0';c.fillText(pc+'% sloshed',p.x,y+28)}
 if(V&&V.settings&&V.settings.mode==='stock'&&V.phase!=='lobby'&&p.lives>0){c.font='14px sans-serif';c.textAlign='center';c.fillStyle='#ff5a5f';c.fillText('♥'.repeat(p.lives),p.x,y-18)}
 const n=(p.gun||0)>1?p.gun:0;for(let i=0;i<n;i++){const x=p.x-(n-1)*6+i*12;c.save();c.translate(x,y+11);c.scale(.4,.4);drawPint(c,1);c.restore()}}
function drawBubble(c,p,t){if(!p.alive||p.emote<0||p.emoteT<=0)return;const txt=EMOTES[p.emote];const a=clamp(p.emoteT*3,0,1),s=p.emoteT>2?1+(p.emoteT-2)*2:1;
 c.save();c.globalAlpha=a;c.translate(p.x+p.r,p.y-p.r*2.6);c.scale(s,s);c.font='17px '+FONT;const w=c.measureText(txt).width+18;
 c.fillStyle='#fff';c.strokeStyle='#2a1608';c.lineWidth=3;rr2(c,0,-30,w,28,10);c.fill();c.stroke();c.beginPath();c.moveTo(6,-3);c.lineTo(-6,8);c.lineTo(16,-3);c.fill();
 c.fillStyle='#2a1608';c.textAlign='left';c.fillText(txt,9,-10);c.restore()}
function drawBomb(c,p,fuse,t){const x=p.x,y=p.y-p.r*2.3+Math.sin(t*8)*2;c.save();c.translate(x,y);const blink=fuse<2.5?Math.floor(t*(fuse<1?16:8))%2:0;
 c.fillStyle='rgba(255,255,255,.55)';c.strokeStyle='#2a1608';c.lineWidth=2.5;c.beginPath();c.moveTo(-11,-16);c.lineTo(11,-16);c.lineTo(8,10);c.lineTo(-8,10);c.closePath();c.fill();c.stroke();
 c.fillStyle=blink?'#fff':'#ff3b3b';c.beginPath();c.moveTo(-9.5,-6);c.lineTo(9.5,-6);c.lineTo(8,9);c.lineTo(-8,9);c.closePath();c.fill();
 c.strokeStyle='#555';c.lineWidth=2;c.beginPath();c.moveTo(0,-16);c.quadraticCurveTo(8,-26,4,-32);c.stroke();for(let i=0;i<3;i++)drawStar(c,4+rnd(-4,4),-33+rnd(-4,4),rnd(3,6),pick(['#ffd23f','#ff9f1c','#fff']));
 c.font='14px '+FONT;c.textAlign='center';c.fillStyle='#fff';c.strokeStyle='#2a1608';c.lineWidth=3;c.strokeText(Math.ceil(fuse),0,26);c.fillText(Math.ceil(fuse),0,26);c.restore()}
function drawKeg(c,k,t){if(k.warn>0){const a=Math.atan2(k.vy,k.vx);let ex=k.x,ey=k.y;for(let i=0;i<70;i++){if(ex>40&&ex<W-40&&ey>60&&ey<H-90&&onArena(ex+Math.cos(a)*50,ey+Math.sin(a)*50,V))break;ex+=Math.cos(a)*10;ey+=Math.sin(a)*10}
  if(Math.floor(t*10)%2){c.save();c.translate(ex,ey);c.rotate(a);c.fillStyle='#ff3b3b';c.strokeStyle='#2a1608';c.lineWidth=3;c.beginPath();c.moveTo(18,0);c.lineTo(-10,-16);c.lineTo(-10,16);c.closePath();c.fill();c.stroke();c.restore()}
  c.font='28px '+FONT;c.textAlign='center';c.fillStyle='#fff';c.strokeStyle='#2a1608';c.lineWidth=4;c.strokeText('!',ex,ey-20);c.fillText('!',ex,ey-20);return}
 c.save();c.translate(k.x,k.y);c.fillStyle='rgba(30,10,0,.3)';c.beginPath();c.ellipse(0,k.r*.6,k.r*1.1,k.r*.4,0,0,TAU);c.fill();c.rotate(Math.atan2(k.vy,k.vx)+Math.PI/2);
 c.fillStyle='#8a4b18';c.strokeStyle='#2a1608';c.lineWidth=3;rr2(c,-k.r*.9,-k.r,k.r*1.8,k.r*2,10);c.fill();c.stroke();
 c.save();rr2(c,-k.r*.9,-k.r,k.r*1.8,k.r*2,10);c.clip();c.strokeStyle='#555';c.lineWidth=5;for(let i=0;i<4;i++){const y=((k.a*14+i*k.r*.6)%(k.r*2.4))-k.r*1.2;c.beginPath();c.moveTo(-k.r,y);c.lineTo(k.r,y);c.stroke()}
 c.strokeStyle='rgba(60,25,5,.5)';c.lineWidth=2;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(i*k.r*.35,-k.r);c.lineTo(i*k.r*.35,k.r);c.stroke()}c.restore();c.restore()}
function pzTime(){return (NET.mode==='client'&&V&&V.st!=null)?V.st+(performance.now()-(V._rx||0))/1000:(S?S.t:0)}
function drawPz(c,t){const T=pzTime(),me=V.players.find(p=>p.id===NET.myId),mv=me&&me.pzv;
 PZL.forEach((L,li)=>{const ox=PZX,oy=li*PZY;if(Math.abs(camY-oy)>1400)return;c.save();c.translate(ox,oy);
  {const g=c.createLinearGradient(0,-1100,0,1100);g.addColorStop(0,'#1d4f7c');g.addColorStop(1,'#0c2238');c.fillStyle=g;c.fillRect(-1600,-1100,5400,2200);c.fillStyle='rgba(191,230,255,.18)';for(let i=0;i<40;i++){const bx=((i*397)%3600)-700,by=600-((t*(30+i%5*12)+i*211)%1300);c.beginPath();c.arc(bx,by,3+i%4*2,0,TAU);c.fill()}}
  c.font='34px "Luckiest Guy",Impact,sans-serif';c.textAlign='center';c.lineWidth=7;c.strokeStyle='#2a1608';c.lineJoin='round';c.fillStyle='#bfe6ff';c.strokeText((li+1)+' · '+L.n.toUpperCase(),0,-170);c.fillText((li+1)+' · '+L.n.toUpperCase(),0,-170);
  for(const q of L.p){const st=pzPlat(q,T);c.save();c.translate(st.x,st.y);let al=1;if(!st.on)al=.18;else if(st.warn)al=.45+.55*Math.abs(Math.sin(t*22));c.globalAlpha=al;
   c.fillStyle='rgba(0,0,0,.25)';if(q.c){c.beginPath();c.ellipse(5,9,q.c[2],q.c[2]*.85,0,0,TAU);c.fill()}else c.fillRect(-q.r[2]/2+5,-q.r[3]/2+9,q.r[2],q.r[3]);
   c.strokeStyle='#2a1608';c.lineWidth=4;c.fillStyle=q.b?'#ffe3f1':q.m?'#dff3ff':'#fff3d6';
   if(q.c){c.beginPath();c.arc(0,0,q.c[2],0,TAU);c.fill();c.stroke();c.strokeStyle=q.b?'#ff5ca8':q.m?'#2b8be0':'#d64545';c.lineWidth=3;c.setLineDash([7,6]);c.beginPath();c.arc(0,0,q.c[2]*.78,0,TAU);c.stroke();c.setLineDash([])}
   else{c.fillStyle='#b9783f';rr2(c,-q.r[2]/2,-q.r[3]/2,q.r[2],q.r[3],8);c.fill();c.stroke();c.strokeStyle='rgba(42,22,8,.35)';c.lineWidth=2;for(let i=1;i<4;i++){c.beginPath();c.moveTo(-q.r[2]/2+6,-q.r[3]/2+i*q.r[3]/4);c.lineTo(q.r[2]/2-6,-q.r[3]/2+i*q.r[3]/4);c.stroke()}}
   if(q.m){c.fillStyle='#2b8be0';c.font='18px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(q.m[0]?'⇆':'⇅',0,0)}
   c.restore()}
  L.cp.forEach((p,i)=>{const got=mv&&mv[0]===li&&mv[1]>=i;c.save();c.translate(p[0],p[1]-20);c.strokeStyle='#2a1608';c.lineWidth=4;c.beginPath();c.moveTo(0,30);c.lineTo(0,-40);c.stroke();c.fillStyle=got?'#5ee07a':'#ff5a5f';c.beginPath();c.moveTo(0,-40);c.lineTo(34,-28+Math.sin(t*6)*3);c.lineTo(0,-16);c.closePath();c.fill();c.stroke();c.restore()});
  {const g=L.g;c.save();c.translate(g[0],g[1]);const pu=1+Math.sin(t*4)*.06;c.scale(pu,pu);c.fillStyle='rgba(255,215,0,.28)';c.beginPath();c.arc(0,0,80,0,TAU);c.fill();
   if(L.mug){c.lineWidth=4;c.strokeStyle='#2a1608';c.fillStyle='#ffd23f';rr2(c,-22,-36,44,56,8);c.fill();c.stroke();c.beginPath();c.arc(26,-8,13,-1.3,1.3);c.stroke();c.fillStyle='#fff';c.beginPath();c.arc(-12,-36,10,0,TAU);c.arc(2,-40,12,0,TAU);c.arc(15,-36,9,0,TAU);c.fill()}
   else{c.font='30px "Luckiest Guy",Impact,sans-serif';c.textAlign='center';c.textBaseline='middle';c.lineWidth=6;c.strokeStyle='#2a1608';c.fillStyle='#ffd23f';c.strokeText('NEXT ➜',0,0);c.fillText('NEXT ➜',0,0)}c.restore()}
  c.restore()})}
function drawFloater(c,f,t){const [x,y,r,fl,gold,a]=Array.isArray(f)?f:[f.x,f.y,f.r,f.flip,f.gold,f.a];c.save();c.translate(x,y);c.fillStyle='rgba(30,10,0,.25)';c.beginPath();c.ellipse(4,8,r,r*.8,0,0,TAU);c.fill();
 const k=Math.cos(Math.min(1,fl)*Math.PI);c.scale(1,k);c.rotate(a);c.strokeStyle='#2a1608';c.lineWidth=4;c.fillStyle=k<0?'#1e4d7a':r>60?'#bfe6ff':'#fff3d6';if(r>60){c.save();c.globalAlpha=.3+.2*Math.sin(t*4);c.fillStyle='#bfe6ff';c.beginPath();c.arc(0,0,r+16,0,TAU);c.fill();c.restore();c.fillStyle=k<0?'#1e4d7a':'#bfe6ff'}c.beginPath();c.arc(0,0,r,0,TAU);c.fill();c.stroke();
 if(k>=0){c.strokeStyle='#d64545';c.lineWidth=3;c.setLineDash([7,6]);c.beginPath();c.arc(0,0,r*.78,0,TAU);c.stroke();c.setLineDash([]);c.fillStyle='rgba(214,69,69,.55)';c.font='22px "Luckiest Guy",Impact,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(r>60?'🌊':'?',0,2)}
 c.restore();if(gold&&fl<=0){c.save();c.translate(x,y-14+Math.sin(t*3)*3);c.fillStyle='rgba(255,215,0,.35)';c.beginPath();c.arc(0,4,26,0,TAU);c.fill();c.lineWidth=3;c.strokeStyle='#2a1608';c.fillStyle='#ffd23f';rr2(c,-11,-12,22,26,4);c.fill();c.stroke();c.beginPath();c.arc(13,1,7,-1.3,1.3);c.stroke();
  c.fillStyle='#fff';c.beginPath();c.arc(-6,-12,5,0,TAU);c.arc(1,-14,6,0,TAU);c.arc(7,-12,4.5,0,TAU);c.fill();c.restore()}}
function drawBumper(c,b,i,t){const sq=bumpSq[i]||0;c.save();c.translate(b.x,b.y);c.fillStyle='rgba(30,10,0,.3)';c.beginPath();c.ellipse(0,b.r*.5,b.r*1.05,b.r*.4,0,0,TAU);c.fill();
 const s=1+Math.sin(sq*20)*sq*.25;c.scale(s,2-s);c.fillStyle='#c9ced6';c.strokeStyle='#2a1608';c.lineWidth=3;c.beginPath();c.arc(0,0,b.r,0,TAU);c.fill();c.stroke();
 c.fillStyle='#e63946';c.beginPath();c.arc(0,-3,b.r*.78,0,TAU);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.ellipse(-b.r*.3,-b.r*.35,b.r*.25,b.r*.14,-.6,0,TAU);c.fill();
 c.fillStyle='#ffd23f';c.font='13px '+FONT;c.textAlign='center';c.fillText('BAR',0,2);c.restore()}

let gtime=0,surge=0,surgeA=0;
