// 20-leaderboard.js: the public leaderboard
// ---- public leaderboard: each player keeps one retained message per broker at lcb1/lb/<uid>
const LBT='lcb1/lb/';let lbPubT=null;
function lbEntry(){const st=getStats();return JSON.stringify({u:MYUID,n:String(me.name||'?').slice(0,24),tag:me.tag||'',ic:me.ic|0,c:me.color|0,lv:lvFor(st.xp),xp:st.xp|0,w:st.wins|0,k:st.kos|0,g:st.games|0,pz:+store.get('pzbest',0)||0,a:Object.keys(st.ach||{}).length,ts:Date.now()})}
function lbPublish(){clearTimeout(lbPubT);lbPubT=setTimeout(()=>{if(LOCAL||QS.has('nolb'))return;const st=getStats();if(!st.games&&!store.get('pzbest',0))return;const j=lbEntry();const ms=RELAYS.map(u=>{const mq=mqtt([u],()=>{},()=>{mq.pubR(LBT+MYUID,j);setTimeout(()=>mq.close(),1500)});return mq});setTimeout(()=>ms.forEach(m=>m.close()),9000)},1500)}
const LB={mqs:null,rows:new Map(),k:'lv'};
function lbStop(){if(LB.mqs){LB.mqs.forEach(m=>m.close());LB.mqs=null}}
function lbRender(){const k=LB.k,rows=[...LB.rows.values()].filter(r=>k!=='pz'||r.pz>0);rows.sort((a,b)=>k==='pz'?a.pz-b.pz:k==='lv'?((b.lv-a.lv)||(b.xp-a.xp)):(b[k]-a[k]));
 const fmt=r=>k==='pz'?Math.floor(r.pz/60)+':'+String(Math.floor(r.pz%60)).padStart(2,'0'):k==='lv'?'Lv '+r.lv:k==='a'?r.a+' 🏆':r[k];
 $('#lbList').innerHTML=rows.slice(0,50).map((r,i)=>'<div class="'+(r.u===MYUID?'me':'')+'"><i>#'+(i+1)+'</i><b style="color:'+shade(COLORS[r.c]||'#2a1608',-.35)+'">'+esc(dispName({ic:ICONS[r.ic]?r.ic:0,tag:cleanTag(r.tag),name:r.n}))+'</b>'+(k==='lv'?'':lvB(r.lv))+'<span>'+fmt(r)+'</span></div>').join('')||'<div class="small" style="display:block;opacity:.6">Nobody yet. Play a match to get on the board!</div>';
 $('#lbNote').textContent=LB.rows.size+' players · updates live'}
function showLB(){showScreen('lb');LB.rows.clear();lbRender();$('#lbNote').textContent='Loading...';lbPublish();
 LB.mqs=RELAYS.map(u=>{const mq=mqtt([u],(t,txt)=>{let r;try{r=JSON.parse(txt)}catch(e){return}if(!r||typeof r.u!=='string')return;const u2=r.u.replace(/[^a-z0-9]/gi,'').slice(0,16);
   const o={u:u2,n:String(r.n||'?').slice(0,24),tag:String(r.tag||''),ic:r.ic|0,c:clamp(r.c|0,0,COLORS.length-1),lv:clamp(r.lv|0,1,69),xp:clamp(r.xp|0,0,1e7),w:clamp(r.w|0,0,1e5),k:clamp(r.k|0,0,1e6),g:r.g|0,pz:clamp(+r.pz||0,0,36000),a:clamp(r.a|0,0,ACH.length),ts:+r.ts||0};
   const old=LB.rows.get(u2);if(!old||o.ts>=old.ts)LB.rows.set(u2,o);clearTimeout(LB.rt);LB.rt=setTimeout(lbRender,150)});mq.sub(LBT+'+');return mq})}

