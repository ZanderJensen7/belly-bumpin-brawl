// 16-results.js: end of round and match: scorecards and awards
function endRound(){let al=inPlay();if(S.hydro){const mx=Math.max(0,...S.players.map(p=>p.spl|0)),top=S.players.filter(p=>(p.spl|0)===mx&&mx>0);al=S.hydroWin&&P(S.hydroWin)?[P(S.hydroWin)]:top.length===1?top:[]}let w=null,wt=null;
 if(S.settings.mode==='teams'){const ts=[...new Set(al.map(p=>p.team))];if(ts.length===1){wt=ts[0];S.players.filter(p=>p.team===wt).forEach(p=>{p.score++;p.wins++;if(p.alive)p.buzz++})}}
 else{w=al.length===1?al[0]:null;if(w){w.score++;w.wins++;w.buzz++;if(!w.rhit)ev('meme',{t:'FLAWLESS',x:w.x|0,y:w.y|0,v:1});else if(S.settings.mode==='stock'&&w.lives===1)ev('meme',{t:'CLUTCH',x:w.x|0,y:w.y|0,v:1})}}S.lastWinner=w?w.id:null;S.items=[];S.corks=[];
 if(S.settings.mode==='teams'){S.card=buildTeamCard(wt);startVote();S.phase='results';S.pt=0;S.bomb=null;S.kegs=[];ev('say',{text:wt===null?'Double knockout! Everybody drinks.':TEAMS[wt].n+' wins the round!',force:1});ev('win',{id:wt===null?null:'team'});return}
 S.card=buildCard(w);startVote();S.phase='results';S.pt=0;S.bomb=null;S.kegs=[];
 if(S.settings.mode==='draft'&&!S.players.some(p=>p.score>=S.settings.target)){S.offers={};for(const p of S.players)if(p!==w){const k=PKEYS.slice().sort(()=>Math.random()-.5).slice(0,3);S.offers[p.id]=k}}else S.offers=null;
 if(w)ev('say',{text:pick([w.name+' wins the round!',w.name+' is the last one standing!',w.name+' rules the table!']),force:1});else ev('say',{text:'Nobody wins. Everybody drinks.',force:1});ev('win',{id:w?w.id:null})}
function afterResults(){if(S.offers){for(const id in S.offers){const p=P(id);if(p)givePerk(p,pick(S.offers[id]))}S.offers=null}const champ=S.players.find(p=>p.score>=S.settings.target);if(champ){const tm=S.settings.mode==='teams'?TEAMS[champ.team].n:null;S.phase='over';S.pt=0;S.over=buildOver(champ,tm);ev('say',{text:(tm||champ.name)+' is the Belly Bumpin\' Brawl champion!',force:1});ev('champ')}else nextRound()}
function nm(p){return p?'<b style="background:'+COLORS[p.color]+'">'+esc(p.name)+'</b>':'?'}
function buildCard(w){const L=[],dr=S.settings.drinks,order=S.outOrder,ps=S.players.filter(p=>!(p.alive===false&&!order.find(o=>o.id===p.id)&&p!==w)),
 rp=()=>pick(S.players),lead=[...S.players].sort((a,b)=>b.score-a.score)[0],last=[...S.players].sort((a,b)=>a.score-b.score)[0];
 if(dr){
  if(w)L.push(nm(w)+' hands out 3 sips.');
  else L.push('Everyone fell. <b>Everyone drinks.</b>');
  const f=order[0];if(f){const fp=P(f.id);if(fp){if(f.cause==='boom')L.push(nm(fp)+' got blown up. 3 sips.');
   else if(!f.killer)L.push(nm(fp)+' fell off alone. 3 sips.');else L.push(nm(fp)+' out first. 2 sips.')}}
  const multi=S.players.filter(p=>order.filter(o=>o.killer===p.id).length>=2);multi.forEach(p=>L.push(nm(p)+' got '+order.filter(o=>o.killer===p.id).length+' KOs. Pick a drinker.'));
  if(Math.random()<.5){const a=rp(),b=pick(S.players.filter(p=>p!==a))||a;L.push('🎲 '+pick(['Everyone drinks.','Water break 💧',nm(a)+' toasts '+nm(b)+'.',nm(lead)+' pays leader tax: 2 sips.','Last to touch their nose drinks.',nm(a)+' talks like a pirate. Slip = sip.',nm(a)+' makes a rule.',nm(a)+' + '+nm(b)+' are drinking buddies.']))}
 }else{
  if(w)L.push(nm(w)+' survived!');else L.push('The table wins.');
  const f=order[0];if(f){const fp=P(f.id);if(fp)L.push(nm(fp)+' '+pick(['out first. Skill issue.','is fish food.','pressed F for themselves.']))}
  if(Math.random()<.6){const a=rp();L.push('🎲 '+pick([nm(a)+': victory dance.','Gang up on '+nm(lead)+'.',nm(a)+': pirate voice.']))}
 }
 return {w:w?w.id:null,lines:L,title:w?w.name+' WINS!':'EVERYBODY DROWNED',round:S.round}}
function buildTeamCard(wt){const L=[],dr=S.settings.drinks,tn=i=>'<b style="background:'+TEAMS[i].c+'">'+TEAMS[i].n+'</b>';
 if(wt===null)L.push(dr?'Both teams fell. <b>Everyone drinks.</b>':'Double KO.');
 else L.push(tn(wt)+' wins! '+(dr?tn(1-wt)+': 2 sips each.':''));
 const tk=S.outOrder.find(o=>o.killer&&P(o.killer)&&P(o.id)&&P(o.killer).team===P(o.id).team);
 if(tk)L.push(nm(P(tk.killer))+' yeeted a teammate. '+(dr?'3 sips.':'Traitor.'));
 else{const f=S.outOrder[0];if(f&&P(f.id))L.push(nm(P(f.id))+' out first.'+(dr?' 1 sip.':''))}
 return {w:null,team:wt,lines:L,title:wt===null?'DOUBLE KO':TEAMS[wt].n.toUpperCase()+' WINS!',round:S.round}}
function buildOver(c,title){const by=(f)=>[...S.players].sort((a,b)=>f(b)-f(a))[0];const A=[];
 const ko=by(p=>p.kos);if(ko&&ko.kos>0)A.push('🥊 Most KOs: '+nm(ko)+' ('+ko.kos+')');
 const fl=by(p=>p.falls);if(fl&&fl.falls>0)A.push('🐟 Fish food: '+nm(fl)+' ('+fl.falls+')');
 const sf=by(p=>p.selfs);if(sf&&sf.selfs>0)A.push('🤡 Self-yeets: '+nm(sf)+' ('+sf.selfs+')');
 const hc=by(p=>p.hics);if(hc&&hc.hics>0)A.push('😵 Hiccups: '+nm(hc)+' ('+hc.hics+')');
 const gl=by(p=>p.glassed||0);if(gl&&gl.glassed>0)A.push("🎯 Bartender's arm: "+nm(gl)+' ('+gl.glassed+')');
 const pr=by(p=>p.parries||0);if(pr&&pr.parries>0)A.push('🛡️ Not today: '+nm(pr)+' ('+pr.parries+' parries)');
 const hb=by(p=>p.taken||0);if(hb&&hb.taken>2)A.push('🥴 Human piñata: '+nm(hb)+' (hit '+hb.taken+'×)');
 if(S.players.length>2){const pc=S.players.filter(p=>!(p.hits>0)&&!(p.kos>0));if(pc.length===1)A.push('🕊️ Pacifist: '+nm(pc[0])+' (0 bumps landed)');const ut=S.players.filter(p=>!(p.falls>0));if(ut.length===1)A.push('🧲 Glued to the table: '+nm(ut[0])+' (never fell)')}
 while(A.length>6)A.splice(ri(2,A.length-1),1);
 A.push(S.settings.drinks?(isCont()?'🍻 1 sip per point behind the champ (max 5).':'🍻 Losers finish their drinks.'):'👑 Champ picks the snack.');
 const fmt=p=>S.settings.mode==='koth'?Math.floor(p.score)+'/'+KOTH_T:String(p.score);
 return {id:c.id,name:title||c.name,color:title?null:c.color,tcol:title?TEAMS[c.team].c:null,hat:c.hat,pcolor:c.color,awards:A,board:[...S.players].sort((a,b)=>b.score-a.score).map(p=>[p.name,p.color,fmt(p),p.kos||0,p.hits||0,p.parries||0,p.falls||0,p.id,p.wins||0,p.glassed||0,p.selfs||0,p.team,p.bot?0:p.lv|0])}}

