// 30b-daily.js: daily challenges. Three per day, the same for everyone (picked from the date). Progress comes from finished
// online matches (recordStats calls dailyProgress; practice vs bots doesn't count). Rewards are XP. Saved under lcb_daily.
const DAILY_POOL=[['play','Play {n} matches',[2,3]],['win','Win {n} matches',[1,2]],['rounds','Win {n} rounds',[3,5]],['kos','Knock {n} players into the beer',[6,10]],['hits','Land {n} bumps',[15,25]],['parries','Parry {n} times',[3,6]],['glassed','Glass {n} players with a thrown drink',[2,4]]];
const DAILY_XP=40,DAILY_BONUS=100;
function dayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function dailyList(key){let s=7;for(const ch of key)s=(s*31+ch.charCodeAt(0))>>>0;const r=()=>(s=(s*1664525+1013904223)>>>0)/4294967296;r();const pool=DAILY_POOL.slice(),out=[];
 for(let i=0;i<3;i++){const c=pool.splice(Math.floor(r()*pool.length),1)[0],n=c[2][Math.floor(r()*c[2].length)];let t=c[1].replace('{n}',n);if(n===1)t=t.replace('matches','match').replace('rounds','round').replace('players','player').replace('times','time');out.push({k:c[0],n,t})}return out}
function dailyState(){const key=dayKey();let st=store.get('daily',null);if(!st||st.d!==key)st={d:key,p:{},done:{}};return st}
function dailyProgress(delta){const st=dailyState(),L=dailyList(st.d);let xp=0;const msgs=[];for(const k in delta)st.p[k]=(st.p[k]||0)+(delta[k]||0);
 L.forEach((c,i)=>{if(!st.done[i]&&(st.p[c.k]||0)>=c.n){st.done[i]=1;xp+=DAILY_XP;msgs.push(c.t)}});
 if(!st.all&&L.every((c,i)=>st.done[i])){st.all=1;xp+=DAILY_BONUS;msgs.push('All three! +'+DAILY_BONUS+' XP bonus')}store.set('daily',st);dailyBtn();return {xp,msgs}}
function dailyBtn(){const b=$('#bDaily');if(!b)return;const n=Object.keys(dailyState().done).length;b.textContent='📅 Daily challenges: '+n+'/3'+(n>=3?' ✔':'')}
function showDaily(){const st=dailyState(),L=dailyList(st.d),mid=new Date();mid.setHours(24,0,0,0);const h=Math.max(0,(mid-Date.now())/36e5);
 $('#dlist').innerHTML=L.map((c,i)=>{const v=Math.min(c.n,st.p[c.k]||0),dn=st.done[i];return '<div class="dq'+(dn?' dn':'')+'"><div class="dqt"><b>'+(dn?'✔ ':'')+esc(c.t)+'</b><span>+'+DAILY_XP+' XP</span></div><div class="dbar"><i style="width:'+Math.round(v/c.n*100)+'%"></i></div><div class="small">'+v+' / '+c.n+'</div></div>'}).join('')
  +'<div class="small" style="text-align:center;margin-top:8px">Finish all three for +'+DAILY_BONUS+' XP. Online matches only (Quick Match counts). New ones in '+(h>=1?Math.floor(h)+'h':Math.ceil(h*60)+'m')+'.</div>';
 $('#daily').classList.add('on')}
{const D=$('#daily'),close=()=>D.classList.remove('on');$('#bDaily').onclick=()=>{SFX.click();showDaily()};$('#dDone').onclick=()=>{SFX.click();close()};D.addEventListener('pointerdown',e=>{if(e.target===D)close()});
 addEventListener('keydown',e=>{if(e.code==='Escape'&&D.classList.contains('on')){e.preventDefault();e.stopImmediatePropagation();close()}},true);dailyBtn();setInterval(dailyBtn,60000)}
