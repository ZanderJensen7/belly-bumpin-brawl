// 14-bots.js: bot AI (botThink) and difficulty levels
const BOTLV=[{re:.42,pp:.3,tr:3.5,att:.55,aim:.55,dz:.14,thr:.07,br:.3,lead:0,edge:.35},{re:.26,pp:.55,tr:6,att:1,aim:.3,dz:.05,thr:.14,br:.55,lead:.06,edge:.1},{re:.16,pp:.82,tr:11,att:1.45,aim:.13,dz:.012,thr:.24,br:.85,lead:.16,edge:0}];
function botThink(b,dt){if(b.ai&&b.ai.fire){b.inp.d=0;b.ai.fire=0}if(S.phase==='intro'||S.phase==='results'||S.phase==='over'){b.inp.x=b.inp.y=0;b.inp.d=0;return}const ai=b.ai||(b.ai={t:0,tg:null,hold:0,wx:0,wy:0,sx:0,sy:0,pq:0,dz:0});ai.t-=dt;const L=BOTLV[S.settings.bots==null?1:S.settings.bots]||BOTLV[1];const others=S.players.filter(q=>q.alive&&q!==b&&!q.pz&&!(S.settings.mode==='teams'&&q.team===b.team&&S.phase!=='lobby'));
 const dcx=CX-b.x,dcy=CY-b.y,dc=hyp(dcx,dcy)||1;
 if(ai.t<=0){ai.t=rnd(.25,.7);let best=null,bd=1e9;for(const q of others){const d=hyp(q.x-b.x,q.y-b.y)*(q.bot?1.3:1)*rnd(.7,1.3);if(d<bd){bd=d;best=q}}ai.tg=best?best.id:null;ai.wx=rnd(-.7,.7);ai.wy=rnd(-.7,.7)}
 const T=others.find(q=>q.id===ai.tg);let mx=0,my=0;
 const bomb=S.bomb;
 if(bomb&&bomb.h!==b.id){const H=P(bomb.h);if(H&&H.alive&&hyp(H.x-b.x,H.y-b.y)<260){mx=b.x-H.x;my=b.y-H.y;const l=hyp(mx,my)||1;mx/=l;my/=l}else if(T){mx=T.x-b.x;my=T.y-b.y}}
 else if(T){mx=T.x+T.vx*L.lead-b.x;my=T.y+T.vy*L.lead-b.y}
 const ml=hyp(mx,my)||1;mx=mx/ml+ai.wx;my=my/ml+ai.wy;
 if(S.settings.mode==='koth'&&S.zone&&S.phase==='play'){const z=S.zone,dz=hyp(z.x-b.x,z.y-b.y);if(dz>z.r*.5||!T||hyp(T.x-z.x,T.y-z.y)>z.r*1.6){mx=z.x-b.x;my=z.y-b.y}}
 if(S.items.length||(b.gun<2&&S.loose.length)){let it=null,bd=260;for(const i of S.items.concat(b.gun<2?S.loose:[])){const d=hyp(i.x-b.x,i.y-b.y);if(d<bd){bd=d;it=i}}if(it){mx=it.x-b.x;my=it.y-b.y}}
 let blocked=false;if(ai.care===undefined||Math.random()<dt*.8)ai.care=Math.random()>=L.edge;if(ai.care){const l2=hyp(mx,my)||1,base=Math.atan2(my/l2,mx/l2);let ok=null;for(let k=0;k<12;k++){const a=base+(k%2?1:-1)*Math.ceil(k/2)*.45,c=Math.cos(a),sn=Math.sin(a);
  if(onArena(b.x+c*45,b.y+sn*45)&&onArena(b.x+c*90,b.y+sn*90)){ok=[c,sn];if(k>2)blocked=true;break}}if(ok){mx=ok[0];my=ok[1]}else{blocked=true;mx=b.sx-b.x;my=b.sy-b.y}}
 if(S.mut.includes('nolegs')&&S.phase==='play'&&!ai.hold&&b.dash<=0&&b.stun<=0&&Math.random()<dt*1.3*L.att){ai.hold=rnd(.15,.45);ai.hop=[mx,my]}
 if(ai.hop&&ai.hold>0){mx=ai.hop[0];my=ai.hop[1]}
 if(blocked&&T&&!ai.hold&&b.dash<=0&&b.stun<=0&&(S.phase==='play'||S.phase==='lobby')&&hyp(T.x-b.x,T.y-b.y)<340&&Math.random()<dt*1.5){ai.hold=.5;ai.hop=[T.x-b.x,T.y-b.y]}
 b.inp.p=0;if(ai.pq>0){ai.pq-=dt;if(ai.pq<=0){ai.pq=0;if(b.stun<=0)b.inp.p=1}}else if(ai.pq<0)ai.pq=Math.min(0,ai.pq+dt);
 else if((b.pcd||0)<=0&&b.stun<=0){let th=false;for(const c of S.corks){if(c.o===b.id)continue;const dx=b.x-c.x,dy=b.y-c.y,d=hyp(dx,dy);if(d<260&&(c.vx*dx+c.vy*dy)>0){th=true;break}}
  if(!th)for(const q of S.players){if(q===b||!q.alive||q.dash<=0)continue;const dx=b.x-q.x,dy=b.y-q.y,d=hyp(dx,dy);if(d<200&&(q.vx*dx+q.vy*dy)>0){th=true;break}}
  if(th)ai.pq=Math.random()<L.pp?L.re*rnd(.75,1.35):-rnd(.4,.8)}
 b.inp.f=0;b.inp.a=null;
 if(b.gun>0&&T&&(S.phase==='play'||S.phase==='lobby')&&!(ai.hold>0)){const d=hyp(T.x-b.x,T.y-b.y);
  if(b.aiming){if(b.thT>.18){const ta=Math.atan2(T.y-b.y,T.x-b.x),da=Math.abs(((ta-b.aimA+Math.PI*3)%TAU)-Math.PI);if(da<ai.tol)b.inp.f=1}}
  else if(d>140&&d<420&&Math.random()<dt*L.thr){b.inp.f=1;b.inp.a=Math.atan2(T.y-b.y,T.x-b.x)+rnd(-.4,.4);ai.tol=L.aim*rnd(.6,1.4)}}
 if(S.phase==='play'||S.phase==='lobby'){
  if(ai.hold>0){ai.hold-=dt;b.inp.d=ai.hold>0?1:0;if(ai.hold<=0)setTimeout(()=>{ai.hop=null},300)}
  else{b.inp.d=0;if(T&&b.dash<=0&&b.stun<=0){const d=hyp(T.x-b.x,T.y-b.y);const tEdge=hyp(T.x-CX,T.y-CY)/S.arenaR;if(d<240&&Math.random()<dt*L.att*(.55+tEdge*1.4))ai.hold=clamp(d/320+rnd(-.15,.25),.1,.8)}}}
 else b.inp.d=0;
 if(S.mut.includes('reverse')){ai.rt=(ai.rt||0)-dt;if(ai.rt<=0){ai.rt=rnd(1,2.5);ai.wise=Math.random()<.4}if(ai.wise){mx=-mx;my=-my}} // bots are genuinely confused most of the time
 if(ai.dz>0){ai.dz-=dt;mx*=.15;my*=.15;b.inp.d=0;if(ai.hold>0)ai.hold=0}else if(S.phase==='play'&&Math.random()<dt*L.dz)ai.dz=rnd(.35,.9);
 const l=hyp(mx,my);if(l>1){mx/=l;my/=l}const kk=1-Math.exp(-L.tr*dt);ai.sx+=(mx-ai.sx)*kk;ai.sy+=(my-ai.sy)*kk;b.inp.x=ai.sx;b.inp.y=ai.sy;if(b.stun>0){if(ai.brace===undefined||Math.random()<dt*3)ai.brace=Math.random()<L.br;if(ai.brace){const v=hyp(b.vx,b.vy)||1;b.inp.x=-b.vx/v;b.inp.y=-b.vy/v}else if(Math.random()<.5){b.inp.x=rnd(-1,1);b.inp.y=rnd(-1,1)}}
 if(Math.random()<dt*.04)emote(b,ri(0,3))}

