// 16b-vote.js: map vote. When the lobby's map setting is Random, the results screen offers three maps and everyone can vote for the next one.
// Host state: S.vote={o:[map ids],v:{playerId:optionIndex}}. It rides in the snapshot during results. Most votes wins, ties are random, no votes = random map as before.
function startVote(){S.vote=null;if(S.settings.map!=='random'||S.hub||S.players.some(p=>p.score>=S.settings.target))return;
 S.vote={o:Object.keys(MAPS).filter(k=>k!==S.map&&!MAPS[k].rare).sort(()=>Math.random()-.5).slice(0,3),v:{}}}
function castVote(pid,i){if(S&&S.vote&&S.phase==='results'&&i>=0&&i<S.vote.o.length)S.vote.v[pid]=i}
function voteWinner(){const vt=S.vote;S.vote=null;if(!vt||S.round<=1)return null;const n=vt.o.map(()=>0);for(const id in vt.v)n[vt.v[id]]++;const mx=Math.max(...n);return mx>0?pick(vt.o.filter((_,i)=>n[i]===mx)):null}
function sendVote(i){if(NET.mode==='host')castVote(NET.myId,i);else if(NET.hostConn)try{NET.hostConn.send({t:'mv',k:i})}catch(e){}}
{let voteKey='';setInterval(()=>{const el=$('#rvote');if(!el)return;const vt=typeof V!=='undefined'&&V&&V.phase==='results'&&V.vote,key=vt?JSON.stringify(vt)+NET.myId:'';if(key===voteKey)return;voteKey=key;
 if(!vt){el.innerHTML='';return}const mine=vt.v[NET.myId],n=vt.o.map(()=>0);for(const id in vt.v)n[vt.v[id]]++;
 el.innerHTML='<div class="small H">🗳️ VOTE FOR THE NEXT MAP</div><div class="vrow">'+vt.o.map((k,i)=>'<button class="ghost'+(mine===i?' go':'')+'" data-v="'+i+'">'+esc(MAPS[k]?MAPS[k].n:k)+(n[i]?' <b>'+n[i]+'</b>':'')+'</button>').join('')+'</div>';
 el.querySelectorAll('button').forEach(b=>b.onclick=()=>{SFX.click();sendVote(+b.dataset.v)})},150)}
