// 13-match.js: host game state, players, spawning, rounds, knock-outs, crates, drinks, emotes
// ============================================================ HOST SIMULATION
let S=null; // authoritative state (host only)
function newState(code){return {code,phase:'lobby',pt:0,rt:0,t:0,round:0,mut:[],arenaR:BASE_R,rot:0,rotV:0,tiltA:0,gx:0,gy:0,sudden:false,
 players:[],kegs:[],bumpers:[],bomb:null,bombNext:0,kegT:0,evq:[],outOrder:[],card:null,over:null,rails:[],railT:0,settings:{target:5,drinks:1,mode:'classic',map:'random',guns:1,lives:3,pub:0,bots:1,ghosts:0},endT:0,slowT:0,hs:0,lastMut:[],map:'round',zone:null,matchT:0,nextMutT:30,mutT:0,items:[],corks:[],loose:[],itemT:4,nuts:[]}}
function newPlayer(id,name,color,hat,bot){return {id,gun:1,name:String(name||'???').slice(0,24),color,hat,bot:!!bot,x:CX,y:CY,vx:0,vy:0,face:Math.PI/2,r:26,alive:true,fall:0,
 charge:0,charging:0,full:0,dash:0,dpow:0,stun:0,buzz:0,score:0,emote:-1,emoteT:0,hitBy:null,hitT:-9,inp:{x:0,y:0,d:0},hicT:rnd(2,5),teeter:0,
 kos:0,falls:0,selfs:0,hics:0,wins:0,ph:Math.random()*TAU,respawn:0,emCd:0,inv:0,team:0,gun:0,pd:0,sx:CX,sy:CY}}
function ev(k,o){const e=Object.assign({k},o||{});S.evq.push(e);onEv(e)}
function P(id){return S.players.find(p=>p.id===id)}
function uniqueColor(want){const used=S.players.map(p=>p.color);if(!used.includes(want))return want;for(let i=0;i<COLORS.length;i++)if(!used.includes(i))return i;return want}
function balTeam(){const c0=S.players.filter(p=>p.team===0).length,c1=S.players.filter(p=>p.team===1).length;return c0<=c1?0:1}
function addBot(){if(S.players.length>=6)return;const used=S.players.map(p=>p.name);const n=pick(BOTNAMES.filter(b=>!used.includes(b)))||'Bot';
 const p=newPlayer('bot'+Math.random().toString(36).slice(2,7),n,uniqueColor(ri(0,7)),ri(0,7),true);p.fc=Math.random()<.5?ri(1,3):0;p.bk=Math.random()<.35?ri(1,2):0;p.team=balTeam();placeRandom(p);if(S.phase!=='lobby'){p.alive=false;if(S.phase==='play'&&isCont())p.respawn=1}S.players.push(p)}
// hard: [[x,y,minDist]] spots a point must keep clear of (bumpers, kegs). strict: return [] instead of falling back when nothing is clear. spawn: players, so stay off conveyor belts.
function safePoints(n,clear,avoid,tries,hard,strict,spawn){const m=MAPS[S.map]||MAPS.round;let c=[];for(let i=0;i<(tries||260);i++){const lx=rnd(-m.ext,m.ext),ly=rnd(-m.ext,m.ext);const w=toWorld(lx,ly,S);if(clearAt(w[0],w[1],clear,S))c.push([w[0],w[1],lx,ly])}
 if(spawn&&m.belts){const ok=c.filter(p=>!m.belts.some(b=>Math.abs(p[2]-b.x)<b.w/2&&Math.abs(p[3]-b.y)<b.h/2));if(ok.length)c=ok}
 if(hard&&hard.length){const ok=c.filter(p=>hard.every(q=>hyp(p[0]-q[0],p[1]-q[1])>=q[2]));if(ok.length||strict)c=ok}
 if(!c.length)return strict?[]:Array.from({length:n},()=>[CX,CY,0,0]);const out=[],av=(avoid||[]).slice().concat((hard||[]).map(q=>[q[0],q[1]]));
 for(let k=0;k<n;k++){let best=c[0],bd=-1;for(const p of c){let md=av.length?1e9:Math.random();for(const q of av)md=Math.min(md,hyp(p[0]-q[0],p[1]-q[1]));if(md>bd){bd=md;best=p}}out.push(best);av.push(best)}return out}
function hazards(pr){pr=pr||26;return (S.bumpers||[]).map(b=>[b.x,b.y,b.r+pr+45]).concat((S.kegs||[]).map(k=>[k.x,k.y,k.r+pr+90]))}
function placeRandom(p){if(S&&S.hub){p.x=p.sx=CX+rnd(-160,160);p.y=p.sy=CY+rnd(-90,90);p.vx=p.vy=0;return}const av=S.players.filter(q=>q!==p&&q.alive).map(q=>[q.x,q.y]);const pt=safePoints(1,50,av,200,hazards(p.r),0,1)[0];p.x=pt[0];p.y=pt[1];p.sx=pt[0];p.sy=pt[1];p.vx=p.vy=0}
// Bumpers go down after players spawn, and keep clear of every standing player and of each other.
function makeBumpers(){if(!S.mut.includes('bumpers'))return[];const out=[],pl=S.players.filter(p=>p.alive).map(p=>[p.x,p.y,30+p.r+45]);for(let i=0;i<4;i++){const hd=pl.concat(out.map(b=>[b.x,b.y,140])),q=safePoints(1,75,[[CX,CY]],260,hd,1)[0]||safePoints(1,45,[[CX,CY]],260,hd,1)[0];if(!q)break;out.push({lx:q[2],ly:q[3],x:q[0],y:q[1],r:30})}return out}
// More players, bigger table: the whole map scales up (camera still fits it).
function mapScale(n){return n<=2?1:n===3?1.08:n===4?1.15:1.22}
function pickMap(){const st=S.settings.map;if(st&&st!=='random'&&MAPS[st])return st;if(/[?&]donger/.test(location.search)||Math.random()<1/30){S.vote=null;return 'donger'}const vm=voteWinner();if(vm)return vm;return pick(Object.keys(MAPS).filter(k=>k!==S.map&&!MAPS[k].rare))}
function spawnRing(){S.players.forEach(p=>{p.pz=null;p.pzv=0});const pts=safePoints(S.players.length,60,[],400,hazards(S.mut.includes('big')?40:26),0,1);S.players.forEach((p,i)=>{p.x=pts[i][0];p.y=pts[i][1];p.sx=p.x;p.sy=p.y;
 p.vx=p.vy=0;p.face=Math.atan2(CY-p.y,CX-p.x);p.respawn=0;p.inv=0;p.slosh=0;p.gun=1+((p.pk&&p.pk.ammo)|0);p.aiming=0;p.parry=0;p.wob=0;p.pcd=0;p.armor=(p.pk&&p.pk.armor)?1:0;p.courage=0;p.gulp=0;p.alive=true;p.fall=0;p.stun=0;p.dash=0;p.charge=0;p.charging=0;p.hitBy=null;p.teeter=0;p.windUsed=0;p.r=S.mut.includes('big')?40:26;p.hicT=rnd(2,5)})}
function startMatch(){S.round=0;S.players.forEach(p=>{p.score=0;p.buzz=0;p.kos=0;p.falls=0;p.selfs=0;p.hics=0;p.taken=0;p.wins=0;p.gun=1;p.hits=0;p.parries=0;p.glassed=0;p.lastKB=null;p.pk={};p.pks=''});S.offers=null;S.over=null;S.lastMut=[];S.map='';S.matchT=0;S.nextMutT=30;S.zone=null;
 if(S.settings.mode==='teams'&&(!S.players.some(p=>p.team===0)||!S.players.some(p=>p.team===1)))S.players.forEach((p,i)=>p.team=i%2);nextRound()}
function chooseMuts(first){const r=S.round,mp=MAPS[S.map]||{};if(first)return (mp.noMut||[]).includes('rails')?['none']:['rails'];let pool=MUT_POOL.filter(m=>!S.lastMut.includes(m)&&!(mp.noMut||[]).includes(m));const a=pick(pool);
 if(r>=3&&Math.random()<.4){const b=pick(pool.filter(m=>m!==a&&!(a==='reverse'&&m==='goggles')&&!(a==='goggles'&&m==='reverse')));if(b)return[a,b]}return[a]}
function nextRound(){S.round++;S.mapS=mapScale(S.players.length);S.arenaR=BASE_R*S.mapS;S.rot=0;S.map=pickMap();S.mut=chooseMuts(S.round===1);S.mutT=0;S.zone=null;S.items=[];S.corks=[];S.loose=[];S.itemT=rnd(3,6);S.lastMut=S.mut.slice();S.phase='intro';S.pt=0;S.disco=Math.random()<1/12||/[?&]disco/.test(location.search);S.hydro=!S.disco&&['classic','draft'].includes(S.settings.mode)&&((S.round>1&&Math.random()<1/10)||/[?&]hydro/.test(location.search));S.hydroWin=null;if(S.hydro)setTimeout(()=>ev('say',{text:'Hydration break! Water round. Splash three people to win.',force:1}),50);S.rt=0;S.kegs=[];S.bomb=null;S.bombNext=2.5;S.kegT=1.5;
 S.arenaR=BASE_R*S.mapS;S.rot=0;S.rotV=0;S.tiltA=Math.random()*TAU;S.gx=S.gy=0;S.sudden=false;S.waveT=3;S.waveWarn=0;S.waveHit=0;S.outOrder=[];S.fb=0;S.players.forEach(p=>{p.rhit=0;p.streak=0;p.spl=0});S.card=null;S.endT=0;S.slowT=0;S.cd=0;
 S.bumpers=[];S.rails=makeRails();
 spawnRing();S.bumpers=makeBumpers();S.players.forEach(p=>{p.lives=S.settings.mode==='stock'?(S.settings.lives||3):0});const nm=S.mut.map(m=>MUTS[m].n).join(' plus ');ev('say',{text:(S.disco?'Disco round! ':'')+(isCont()?MODES[S.settings.mode].n+'! On '+MAPS[S.map].n+'.':'Round '+S.round+'. '+MAPS[S.map].n+'. '+nm+'.'),force:1})}
function alive(){return S.players.filter(p=>p.alive)}
function doDash(p,c){const l=hyp(p.inp.x,p.inp.y);let dx,dy;if(p.inp.m&&typeof p.inp.a==='number'){dx=Math.cos(p.inp.a);dy=Math.sin(p.inp.a);if(S.mut.includes('reverse')){dx=-dx;dy=-dy}}else if(l>.2){dx=p.inp.x/l;dy=p.inp.y/l;if(S.mut.includes('reverse')){dx=-dx;dy=-dy}}else{dx=Math.cos(p.face);dy=Math.sin(p.face)}
 p.dq=(p.dq==null?2:p.dq)-1;p.dqT=0;const sp=470+720*c;p.vx=dx*sp;p.vy=dy*sp;p.dash=.2+.25*c;p.dpow=.45+c;p.dc=c;p.face=Math.atan2(dy,dx);ev('dash',{id:p.id,c:Math.round(c*100)/100,x:p.x|0,y:p.y|0})}
function knockOut(p,cause){if(p.pz){p.pz.d++;ev('pzfall',{id:p.id,x:p.x|0,y:p.y|0});pzPut(p);return}if(S.phase==='play'&&p.pk&&p.pk.wind&&(p.windUsed|0)<p.pk.wind){p.windUsed=(p.windUsed|0)+1;placeRandom(p);p.vx=p.vy=0;p.stun=0;p.dash=0;p.inv=1.3;p.hitBy=null;ev('meme',{t:'👼 SECOND WIND',x:p.x|0,y:p.y|0,v:1});return}
 if(S.phase==='play'&&!S.hydro&&(Math.random()<1/35||/[?&]hand/.test(location.search))){p.hand=1.15;p.vx=p.vy=0;p.dash=0;p.charging=0;p.charge=0;p.full=0;p.aiming=0;p.stun=0;p.parry=0;p.inv=2.4;p.hitBy=null;ev('hand',{id:p.id,x:p.x|0,y:p.y|0});ev('say',{text:pick(['Wait. What is that.','A hand?! From the beer?!','The beer gods have spoken.']),force:1});return}
 if(S.hydro&&S.phase==='play'){p.alive=false;p.fall=1;p.charging=0;p.charge=0;p.respawn=1.4;const k=(p.hitBy&&S.t-p.hitT<3.5&&p.hitBy!==p.id)?P(p.hitBy):null;if(k){k.spl=(k.spl|0)+1;ev('meme',{t:'💦 '+k.spl+'/3',x:k.x|0,y:k.y|0});if(k.spl>=3)S.hydroWin=k.id}ev('splash',{x:p.x|0,y:p.y|0,id:p.id,self:k?0:1});return}
 p.alive=false;p.fall=1;p.charging=0;p.charge=0;p.gun=0;p.armor=0;p.courage=0;p.gulp=0;
 if(S.phase==='lobby'){p.respawn=1.6;ev('splash',{x:p.x|0,y:p.y|0,id:p.id,self:0});return}
 p.falls++;p.gun=0;const killer=(p.hitBy&&S.t-p.hitT<3.5&&p.hitBy!==p.id)?P(p.hitBy):null;const cont=isCont(),happy=S.settings.mode==='happy';
 const tk=killer&&S.settings.mode==='teams'&&killer.team===p.team;
 if(S.phase==='play'){const mx=p.x|0,my=p.y|0;
  if(killer){if(!S.fb){S.fb=1;ev('meme',{t:'FIRST BLOOD',x:mx,y:my,v:1})}
   if(S.t-(killer.lkT||-9)<4){killer.streak=(killer.streak||1)+1;ev('meme',{t:['','','DOUBLE KO!','TRIPLE KO!','RAMPAGE!','UNSTOPPABLE'][Math.min(5,killer.streak)],x:killer.x|0,y:killer.y|0,v:1,kid:killer.id})}else killer.streak=1;killer.lkT=S.t;
   if(p.lastKB===killer.id&&killer.lastKB!==undefined){}if(killer.lastKB===p.id){ev('meme',{t:'REVENGE!',x:killer.x|0,y:killer.y|0,v:1});killer.lastKB=null}p.lastKB=killer.id;
   if(p.score>0&&p.score===Math.max(...S.players.map(q=>q.score))&&p.score>killer.score)ev('meme',{t:'SHUTDOWN',x:mx,y:my})}
  else{if((p.selfs||0)>=2)ev('meme',{t:'GRAVITY '+(p.selfs+1)+', '+p.name.toUpperCase()+' 0',x:mx,y:my})}}
 if(S.phase==='play'&&p.pk&&p.pk.martyr){const bx=p.sx||p.x,by=p.sy||p.y;ev('boom',{x:bx|0,y:by|0});ev('meme',{t:'💣 MARTYRDOM',x:bx|0,y:by|0,v:1});for(const q of alive()){if(q===p)continue;const dx=q.x-bx,dy=q.y-by,d=hyp(dx,dy);if(d<230){const f=((1-d/230)*900+260)*slosh(q)*(p.pk.martyr>1?1.25:1);q.vx+=dx/(d||1)*f;q.vy+=dy/(d||1)*f;q.stun=.7;q.hitBy=p.id;q.hitT=S.t}}}
 if(S.phase==='play'&&killer&&p.pk&&p.pk.spite&&killer.alive){killer.stun=Math.max(killer.stun,1.1*p.pk.spite);killer.charging=0;killer.charge=0;ev('burp',{id:killer.id,x:killer.x|0,y:killer.y|0});ev('meme',{t:'😤 SPITE',x:killer.x|0,y:killer.y|0})}
 if(killer){killer.kos++;if(happy){killer.score++;ev('pts',{id:killer.id,v:1})}if(killer.bot&&Math.random()<.6)emote(killer,ri(0,3))}else{if(cause==='fall')p.selfs++;if(happy){p.score--;ev('pts',{id:p.id,v:-1})}}
 if(cont)p.respawn=2.2;
 if(S.settings.mode==='stock'&&S.phase==='play'){p.lives=Math.max(0,(p.lives||1)-1);if(p.lives>0){p.respawn=2;ev('lifelost',{id:p.id,n:p.lives})}else ev('lifelost',{id:p.id,n:0})}
 if(tk)ev('say',{text:killer.name+' just yeeted their own teammate!',force:1});
 const self=!killer&&cause==='fall';S.outOrder.push({id:p.id,killer:killer?killer.id:null,cause});
 ev('splash',{x:p.x|0,y:p.y|0,id:p.id,self:self?1:0});
 const v=p.name;if(cause==='boom')ev('say',{text:pick([v+' got the hot shot!',v+' exploded. Classic '+v+'.'])});
 else if(killer)ev('say',{text:pick([killer.name+' yeeted '+v+'!',v+' is sleeping with the fishes.',v+' has left the chat.',killer.name+' sends '+v+' swimming!'])});
 else ev('say',{text:pick([v+' fell off all by themselves. Incredible.',v+', are you okay?',v+' tripped over nothing.',v+' chose the beer.'])});
 if(S.bomb&&S.bomb.h===p.id){const a=alive();S.bomb=a.length>1?{h:pick(a).id,fuse:Math.max(S.bomb.fuse,3),cd:.8}:null}
 if(!cont&&S.phase==='play'&&roundOver()){S.slowT=1.1;ev('final',{x:p.x|0,y:p.y|0})}else if(S.phase==='play')crowdKO(p,killer,self)}
// Crowd cheers. The host decides when and how big, and sends a 'crowd' event, so everyone online hears the same cheer at the same moment.
// A cooldown keeps it to the big moments: small ones wait 3.5s since the last cheer, big ones 0.8s.
function crowdEv(c,v){const g=S.t-(S.crT??-99);if(g>=0&&g<(v>=2?.8:3.5))return;S.crT=S.t;ev('crowd',{c,v})}
function crowdKO(p,killer,self){if(killer){const hit=p.hitST===p.hitT,mug=hit&&p.hitC,shut=p.score>0&&p.score===Math.max(...S.players.map(q=>q.score))&&p.score>killer.score,big=mug||(hit&&p.hitB)||shut||killer.streak>=2;const v=killer.streak>=3?3:big?2:1;if(v===1&&Math.random()<.4)return;crowdEv('cheer',v)}else if(self&&Math.random()<.6)crowdEv('ooh',1)}
function handSlap(p){p.x=p.sx;p.y=p.sy;const o=alive().filter(q=>q!==p&&!q.hand);const tg=o.length&&Math.random()<.75?pick(o):null;let dx,dy;if(tg){dx=tg.x-p.x;dy=tg.y-p.y}else{dx=CX-p.x;dy=CY-p.y}const l=hyp(dx,dy)||1;dx/=l;dy/=l;
 const sp=tg?1350:650;p.vx=dx*sp;p.vy=dy*sp;p.face=Math.atan2(dy,dx);p.dash=tg?.55:.3;p.dpow=tg?1.6:.4;p.dc=tg?1:.2;p.inv=.8;ev('slap',{id:p.id,x:p.x|0,y:p.y|0,a:Math.round(p.face*100)/100,at:tg?1:0});ev('meme',{t:tg?'🖐️ HAND OF GOD → '+tg.name.toUpperCase():'🖐️ HAND OF GOD',x:p.x|0,y:p.y|0,v:0});ev('say',{text:tg?pick(['The hand chose violence. Sorry '+tg.name+'.','Divine intervention! Aimed at '+tg.name+'.']):pick(['Saved by the hand of God.','Back you go.']),force:1})}
function inPlay(){return S.settings.mode==='stock'?S.players.filter(p=>p.alive||p.respawn>0):alive()}
function roundOver(){const al=inPlay();if(S.settings.mode==='teams')return new Set(al.map(p=>p.team)).size<=1;return al.length<=1}
const CRATE=[['gun',.4,'+2 PINTS!'],['armor',.2,'BELLY ARMOR!'],['courage',.2,'LIQUID COURAGE!'],['gulp',.2,'BIG GULP!']];
function openCrate(p,it){let r=Math.random(),c=CRATE[0];for(const q of CRATE){if(r<q[1]){c=q;break}r-=q[1]}
 if(c[0]==='gun'){p.gun=2;p.aiming=0}else if(c[0]==='armor')p.armor=1;else if(c[0]==='courage')p.courage=9;else{p.gulp=9;p.r=44}
 ev('crate',{id:p.id,x:it.x|0,y:it.y|0,c:c[0],n:c[2]})}
function slosh(p){return .85*pk(p,'gut',.82)} // slosh meter disabled for now (was .6 + .15 per hit)
function absorb(p){if(p.armor>0){p.armor=0;ev('armor',{id:p.id,x:p.x|0,y:p.y|0});return .25}return 1}
function dropCork(c){if(S.loose.length<14&&onArena(c.x,c.y))S.loose.push({x:c.x,y:c.y})}
function fireCork(p){const a=p.aimA!=null?p.aimA:p.face,dx=Math.cos(a),dy=Math.sin(a);
 p.face=Math.atan2(dy,dx);S.corks.push({x:p.x+dx*(p.r+12),y:p.y-6+dy*(p.r+12),vx:dx*980*pk(p,'arm',1.25),vy:dy*980*pk(p,'arm',1.25),o:p.id,t:0});p.vx-=dx*120;p.vy-=dy*120;p.gun--;ev('shot',{id:p.id,x:p.x+dx*30|0,y:p.y+dy*30|0,last:p.gun?0:1})}
function endMatchCont(){if(S.phase!=='play')return;const c=[...S.players].sort((a,b)=>b.score-a.score)[0];S.phase='over';S.pt=0;S.items=[];S.corks=[];S.over=buildOver(c);ev('say',{text:c.name+' wins '+MODES[S.settings.mode].n+'!',force:1});ev('champ')}
function emote(p,k){if(p.emCd>0)return;p.emote=k;p.emoteT=2.2;p.emCd=.7;ev('emote',{id:p.id,em:k})}

