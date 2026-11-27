// 31-menus.js: screens, lobby and menu UI, all the button wiring
function showScreen(id){if(id!=='lobby')$('#ward').classList.remove('on');document.body.classList.toggle('ingame',id==='lobby'||id==='none'||id==='hub');document.body.classList.toggle('chaton',id==='lobby'||id==='hub');if(id!=='lb')lbStop();['title','lobby','results','over','stats','browse','lb','hub'].forEach(s=>$('#'+s).classList.toggle('on',s===id));curScreen=id;if(id!=='browse'&&id!=='hub')stopBrowse();if(id==='title')lvBar()}
let curScreen='title',uiKey='';
function showLobby(){showScreen('lobby');uiKey='';lvBar()}
function syncUI(){if(S&&S.hub){if(curScreen!=='hub'&&curScreen!=='stats'&&curScreen!=='lb')showScreen('hub');hubUI();return}if(!V||curScreen==='title')return;const ph=V.phase,isHost=NET.mode==='host';
 const want=ph==='lobby'?'lobby':ph==='results'?'results':ph==='over'?'over':'none';if(want!==curScreen){showScreen(want);uiKey=''}
 if(ph==='lobby'){const key=JSON.stringify([V.code,V.players.map(p=>[p.id,p.name,p.color,p.bot,p.team,p.lv,p.fc,p.bk,p.tag,p.ic]),V.settings,isHost]);const st=V.settings,tm=st.mode==='teams';if(key!==uiKey){uiKey=key;
  $('#lcode').textContent=V.code;$('#plist').innerHTML=V.players.map(p=>'<li><span class="dot" style="background:'+COLORS[p.color]+'"></span>'+esc(dispName(p))+(p.id===NET.myId?' <span class="small">(you)</span>':'')+(p.bot?' <span class="small">🤖</span>':String(p.id).includes('~')?' <span class="small">🎮</span>':lvB(p.lv))+(tm?'<button class="tb" '+(isHost?'data-team="'+p.id+'"':'disabled')+' style="background:'+TEAMS[p.team].c+'">'+TEAMS[p.team].n.replace('Team ','')+'</button>':'')+(isHost&&p.id!==NET.myId?'<button class="x" data-kick="'+p.id+'" title="Kick">✕</button>':'')+'</li>').join('')+
   (V.players.length<2?'<li class="small" style="opacity:.6">Waiting for friends...</li>':'');
  {const mp=V.players.find(p=>p.id===NET.myId);if(mp){me.color=mp.color;me.hat=mp.hat;me.fc=mp.fc|0;me.bk=mp.bk|0;me.ic=mp.ic|0;refreshPick();$('#lcn').textContent=CNAMES[mp.color];$('#lhn').textContent=HNAMES[mp.hat];if(document.activeElement!==$('#lnm'))$('#lnm').value=mp.name}}
  $('#hostOpts').style.display=isHost?'':'none';$('#lwait').style.display=isHost?'none':'';$('#bCopy').style.display=V.code==='SOLO'?'none':'';
  $('#lhint').textContent=V.code==='SOLO'?'Practice vs bots':'Share this code';
  document.querySelectorAll('#segT button').forEach(b=>b.classList.toggle('sel',+b.dataset.v===V.settings.target));document.querySelectorAll('#segD button').forEach(b=>b.classList.toggle('sel',+b.dataset.v===V.settings.drinks));document.querySelectorAll('#segH button').forEach(b=>b.classList.toggle('sel',+b.dataset.v===(V.settings.ghosts|0)));
  document.querySelectorAll('#segM button').forEach(b=>b.classList.toggle('sel',b.dataset.v===st.mode));document.querySelectorAll('#segP button').forEach(b=>b.classList.toggle('sel',b.dataset.v===st.map));document.querySelectorAll('#segG button').forEach(b=>b.classList.toggle('sel',+b.dataset.v===st.guns));
  $('#mdesc').textContent=MODES[st.mode].d;$('#livesWrap').style.display=st.mode==='stock'?'':'none';document.querySelectorAll('#segL button').forEach(b=>b.classList.toggle('sel',+b.dataset.v===(st.lives||3)));$('#tgtWrap').style.display=(st.mode==='happy'||st.mode==='koth')?'none':'';
  $('#linfo').textContent='Mode: '+MODES[st.mode].n+'  ·  Map: '+(st.map==='random'?'Random':MAPS[st.map].n);
  document.querySelectorAll('#segV button').forEach(b=>b.classList.toggle('sel',+b.dataset.v===(st.pub|0)));$('#pubWrap').style.display=V.code==='SOLO'?'none':'';document.querySelectorAll('#segB button').forEach(b=>b.classList.toggle('sel',+b.dataset.v===(st.bots==null?1:st.bots)));$('#bStart').disabled=V.players.length<2;$('#bBot').disabled=V.players.length>=6}}
 if(ph==='results'&&V.card){const key='r'+V.round+isHost;if(key!==uiKey){uiKey=key;if(V.code!=='SOLO'){if(V.map==='donger')achEv('donger');if(V.disco)achEv('disco');if(V.hydro&&V.card.w===NET.myId)achEv('hydro')}const c=V.card,w=V.players.find(p=>p.id===c.w);
  $('#rround').textContent='ROUND '+c.round;$('#rtitle').textContent=c.title;$('#rtitle').style.color=c.team!=null?TEAMS[c.team].c:w?COLORS[w.color]:'#fff6e0';
  $('#rscores').innerHTML=V.settings.mode==='teams'?TEAMS.map((tt,i)=>{const m=V.players.find(p=>p.team===i);return '<div><span class="dot" style="display:inline-block;vertical-align:middle;width:16px;height:16px;background:'+tt.c+'"></span> '+tt.n+': '+(m?m.score:0)+'/'+V.settings.target+'</div>'}).join(''):[...V.players].sort((a,b)=>b.score-a.score).map(p=>'<div><span class="dot" style="display:inline-block;vertical-align:middle;width:16px;height:16px;background:'+COLORS[p.color]+'"></span> '+esc(p.name)+': '+p.score+'/'+V.settings.target+'</div>').join('');
  $('#rcardh').textContent=V.settings.drinks?'🍺 Drink card':'🧃 Commentary card';$('#rlines').innerHTML=c.lines.map(l=>'<p>'+l+'</p>').join('');$('#bNext').style.display=isHost?'':'none'}
  {const o=V.offers&&V.offers[NET.myId],pkk=JSON.stringify(o||0)+(V.offers?Object.keys(V.offers).length:0);if(pkk!==syncUI.pk){syncUI.pk=pkk;$('#rpick').innerHTML=!o&&V.offers&&Object.keys(V.offers).length?'<div class="pw">Losers are picking power-ups...</div>':'';$('#dcards').innerHTML=o?o.map((k,i)=>'<button data-pk="'+i+'"><b>'+PERKS[k][0]+'</b><i>'+PERKS[k][1]+'</i>'+PERKS[k][2]+'<br><kbd>'+(IS_TOUCH?'tap':'press '+(i+1))+'</kbd></button>').join(''):'';const was=$('#draft').classList.contains('on');$('#draft').classList.toggle('on',!!o);if(o&&!was){SFX.pickup&&SFX.pickup();say('Pick a power up!',0)}}}
  if(isHost){const wait=V.offers&&Object.keys(V.offers).some(id=>{const p=V.players.find(q=>q.id===id);return p&&!p.bot});$('#bNext').disabled=!!wait;$('#bNext').textContent=wait?'Waiting for picks...':'Next round ▶'}
  if(V.offers)$('#dbar').style.width=clamp(100-V.pt/15*100,0,100)+'%';
  $('#rbar').style.width=clamp(V.pt/(V.offers?15:10)*100,0,100)+'%'}
 if(ph==='over'&&V.over){const key='o'+V.over.id+isHost;if(key!==uiKey){uiKey=key;const o=V.over;$('#otitle').textContent=o.name;$('#otitle').style.color=o.tcol||COLORS[o.color];$('#oscores').innerHTML='<table class="stt"><tr><th></th><th>Pts</th><th>KOs</th><th>Bumps</th><th>Parries</th><th>Falls</th></tr>'+(o.board||[]).map(b=>'<tr'+(b[7]===NET.myId?' class="me"':'')+'><td><span class="dot" style="display:inline-block;vertical-align:middle;width:12px;height:12px;background:'+COLORS[b[1]]+'"></span> '+esc(b[0])+lvB(b[12])+'</td><td><b>'+b[2]+'</b></td><td>'+b[3]+'</td><td>'+b[4]+'</td><td>'+b[5]+'</td><td>'+b[6]+'</td></tr>').join('')+'</table>';recordStats(o);$('#oaw').innerHTML=o.awards.map(a=>'<p>'+a+'</p>').join('');
  $('#ohost').style.display=isHost?'':'none';$('#owait').style.display=isHost?'none':''}
  const cc=$('#champ'),g=cc.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,240,240);g.setTransform(2.4,0,0,2.4,120,150);const o=V.over;
  drawGuy(g,{x:0,y:0,vx:0,vy:Math.sin(gtime*8)*120,face:Math.PI/2,r:26,alive:true,fall:1,charge:0,dash:0,stun:0,buzz:4,teeter:0,color:o.pcolor!=null?o.pcolor:o.color,hat:o.hat,ph:0},A_('champ'),gtime,{noTag:1});
  }
}
// title preview & pickers
function refreshPick(){$('#cn').textContent=CNAMES[me.color];$('#hn').textContent=HNAMES[me.hat];$('#fnn').textContent=FNAMES[me.fc|0];$('#lfn').textContent=FNAMES[me.fc|0];$('#bnn').textContent=BNAMES[me.bk|0];$('#lbn').textContent=BNAMES[me.bk|0];$('#lin').textContent=me.ic?ICONS[me.ic]+' Icon':'No icon';store.set('bk',me.bk|0);store.set('ic',me.ic|0);store.set('color',me.color);store.set('hat',me.hat);store.set('fc',me.fc|0)}
document.querySelectorAll('.pick button').forEach(b=>b.onclick=()=>{initAudio();SFX.click();const k=b.dataset.p[0],d=+b.dataset.p.slice(1);if(k==='c')me.color=(me.color+d+COLORS.length)%COLORS.length;else if(k==='f')me.fc=nextFace(d);else if(k==='b')me.bk=nextBack(d);else if(k==='i')me.ic=nextIcon(d);else me.hat=nextHat(d);refreshPick();A_('pv').k=1});
document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{initAudio();SFX.click();const k=b.dataset.l[0],d=+b.dataset.l.slice(1);
 if(k==='c'){const used=(V&&V.players||[]).filter(p=>p.id!==NET.myId).map(p=>p.color);let c=me.color;for(let i=0;i<COLORS.length;i++){c=(c+d+COLORS.length)%COLORS.length;if(!used.includes(c))break}me.color=c}else if(k==='f')me.fc=nextFace(d);else if(k==='b')me.bk=nextBack(d);else if(k==='i')me.ic=nextIcon(d);else me.hat=nextHat(d);
 refreshPick();$('#lcn').textContent=CNAMES[me.color];$('#lhn').textContent=HNAMES[me.hat];$('#lfn').textContent=FNAMES[me.fc|0];$('#lbn').textContent=BNAMES[me.bk|0];sendMe()});
{let tm2=0;$('#ltag').oninput=e=>{me.tag=cleanTag(e.target.value);e.target.value=me.tag;store.set('tag',me.tag);clearTimeout(tm2);tm2=setTimeout(sendMe,250)};$('#ltag').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur()})}
{let tmo=0;$('#lnm').oninput=e=>{me.name=e.target.value.trim()||'Mystery Drunk';store.set('name',me.name);$('#nm').value=me.name;clearTimeout(tmo);tmo=setTimeout(sendMe,250)}}
$('#lnm').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur()});
let bgSound=store.get('bgsnd',true);const bgLbl=()=>{$('#eBg').textContent=bgSound?'🔊 Sound when tabbed out: ON':'🔇 Sound when tabbed out: OFF'};bgLbl();$('#eBg').onclick=()=>{bgSound=!bgSound;store.set('bgsnd',bgSound);bgLbl()};
$('#eTut').onclick=()=>{store.set('ftue',0);TUT.cur=null;TUT.a=0;tutHide();toggleEsc(false);toast('Tips will pop up again in your next match',3)};
document.addEventListener('visibilitychange',()=>{if(!MG||!AC)return;const off=document.hidden&&!bgSound;MG.gain.setTargetAtTime(off||muted?0:vol/100,AC.currentTime,.05);if(off&&'speechSynthesis' in window)speechSynthesis.cancel()});
$('#bTCust').onclick=()=>$('#bCust').click();$('#bHub').onclick=()=>{SFX.pop&&SFX.pop();initAudio();hubStart()};$('#bHubLeave').onclick=()=>leaveToTitle(true);
$('#bLB').onclick=()=>{SFX.pop&&SFX.pop();showLB()};$('#bLBBack').onclick=()=>showScreen('title');document.querySelectorAll('#lbTabs button').forEach(b=>b.onclick=()=>{LB.k=b.dataset.k;document.querySelectorAll('#lbTabs button').forEach(x=>x.classList.toggle('sel',x===b));lbRender()});setTimeout(lbPublish,6000);
$('#cin').addEventListener('keydown',e=>{if(e.key==='Enter'){sendChat(e.target.value);e.target.value='';e.target.blur()}else if(e.key==='Escape')e.target.blur();e.stopPropagation()});
const maimTxt=()=>document.querySelectorAll('.maim').forEach(b=>b.textContent=mouseAim?'🖱️ Mouse aim: ON (left click bumps toward cursor)':'🖱️ Mouse aim: OFF (bump where you move)');maimTxt();
document.querySelectorAll('.maim').forEach(b=>b.onclick=()=>{initAudio();SFX.click();mouseAim=mouseAim?0:1;store.set('maim',mouseAim);maimTxt()});
$('#nm').value=me.name;$('#nm').oninput=e=>{me.name=e.target.value.trim()||'Mystery Drunk';store.set('name',me.name)};
$('#code').value=(location.hash.slice(1)||'').toUpperCase().slice(0,5);
$('#bHost').onclick=()=>{initAudio();SFX.pop();hostStart(false)};
$('#bStats').onclick=()=>{initAudio();SFX.click();showStats()};$('#bStBack').onclick=()=>{SFX.click();showScreen('title')};
$('#bSolo').onclick=()=>{initAudio();SFX.pop();hostStart(true)};
$('#bJoin').onclick=()=>{initAudio();SFX.pop();joinStart($('#code').value)};
$('#code').addEventListener('keydown',e=>{if(e.key==='Enter')$('#bJoin').click()});
$('#bCopy').onclick=()=>{const link=location.protocol.startsWith('http')?location.href.split('#')[0]+'#'+V.code:'';const txt=link?('Join my Belly Bumpin\' Brawl room! '+link+'  (code '+V.code+')'):('Belly Bumpin\' Brawl room code: '+V.code);
 if(IS_TOUCH&&navigator.share){navigator.share({title:'Belly Bumpin\' Brawl',text:txt}).catch(()=>{});return}
 (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('Copied! Paste it to your friends.')).catch(()=>toast('Room code: '+V.code))};
$('#segT').onclick=e=>{const v=+e.target.dataset.v;if(v&&S){S.settings.target=v;SFX.click()}};
$('#segD').onclick=e=>{const v=e.target.dataset.v;if(v!==undefined&&S){S.settings.drinks=+v;SFX.click()}};
$('#segH').onclick=e=>{const v=e.target.closest('button')&&e.target.closest('button').dataset.v;if(v!==undefined&&S){S.settings.ghosts=+v;store.set('ghosts',+v);SFX.click()}};
$('#bBot').onclick=()=>{if(S){S.qfill=0;addBot();SFX.pop()}};
$('#plist').onclick=e=>{const d=e.target.dataset||{};if(d.kick&&S){kickPlayer(d.kick)}if(d.team&&S){const p=P(d.team);if(p){p.team=1-p.team;SFX.click()}}};
$('#segL').onclick=e=>{const v=+e.target.dataset.v;if(v&&S){S.settings.lives=v;SFX.click()}};
$('#segM').onclick=e=>{const v=e.target.dataset.v;if(v&&S&&MODES[v]){S.settings.mode=v;SFX.click()}};
$('#segV').onclick=e=>{const v=e.target.dataset.v;if(v!==undefined&&S){S.settings.pub=+v;SFX.click();if(+v)announce()}};
$('#bFind').onclick=()=>{initAudio();SFX.pop();showBrowse()};$('#bBrBack').onclick=()=>{SFX.click();showScreen('title')};$('#bQuick').onclick=()=>{initAudio();SFX.pop();quickMatch()};
$('#rlist').onclick=e=>{const c=e.target.dataset&&e.target.dataset.join;if(c){initAudio();SFX.pop();stopBrowse();joinStart(c)}};
$('#segB').onclick=e=>{const v=e.target.dataset.v;if(v!==undefined&&S){S.settings.bots=+v;store.set('botlv',+v);SFX.click()}};
$('#bCust').onclick=()=>{SFX.click();$('#ward').classList.add('on');$('#lcn').textContent=CNAMES[me.color];$('#lhn').textContent=HNAMES[me.hat];refreshPick();if(document.activeElement!==$('#lnm'))$('#lnm').value=me.name;{const l=myLv(),nx=nextUnlock(l);$('#wlock').textContent='Lv '+l+(nx?' · 🔒 '+nx[1]+' at Lv '+nx[0]:' · everything unlocked')}};document.body.appendChild($('#ward'));$('#bWard').onclick=()=>{SFX.pop();$('#ward').classList.remove('on')};$('#ward').onclick=e=>{if(e.target.id==='ward')$('#ward').classList.remove('on')};
function pickPerk(k){const o=V&&V.offers&&V.offers[NET.myId];if(!o||!o[k])return;SFX.pop();$('#draft').classList.remove('on');$('#dcards').innerHTML='';toast(PERKS[o[k]][0]+' '+PERKS[o[k]][1]+'!',2);if(NET.mode==='host'){const o=S.offers&&S.offers[NET.myId];if(o)givePerk(P(NET.myId),o[k])}else if(NET.hostConn)NET.hostConn.send({t:'pk',k})}
$('#dcards').onclick=e=>{const b=e.target.closest('[data-pk]');if(b)pickPerk(+b.dataset.pk)};
$('#bMenu').onclick=()=>{SFX.click();toggleEsc()};$('#eRes').onclick=()=>{SFX.click();toggleEsc(false)};$('#esc').onclick=e=>{if(e.target.id==='esc')toggleEsc(false)};
$('#eWard').onclick=()=>{toggleEsc(false);$('#bCust').click()};$('#eLob').onclick=()=>{toggleEsc(false);$('#bLob').onclick()};$('#ePl').onclick=e=>{const k=e.target.dataset&&e.target.dataset.ek;if(k){kickPlayer(k);escList()}};
$('#eSt').onclick=()=>{SFX.click();const g=$('#eGrid'),o=g.style.display==='none';if(o)showStats(1);g.style.display=o?'':'none'};$('#lvlL').onclick=()=>{SFX.click();toggleEsc(true);showStats(1);$('#eGrid').style.display=''};
$('#eQuit').onclick=()=>{SFX.click();if(!quitArm){quitArm=1;$('#eQuit').textContent='Tap again to leave';$('#eQuit').classList.add('go');setTimeout(()=>{quitArm=0;if($('#esc').classList.contains('on'))escList();$('#eQuit').classList.remove('go')},2500);return}toggleEsc(false);leaveToTitle(true)};
$('#segG').onclick=e=>{const v=e.target.dataset.v;if(v!==undefined&&S){S.settings.guns=+v;if(!+v){S.items=[];S.players.forEach(p=>p.gun=0)}SFX.click()}};
$('#segP').onclick=e=>{const v=e.target.dataset.v;if(v&&S){S.settings.map=v;SFX.click();if(S.phase==='lobby'){S.map=v==='random'?'round':v;S.items=[];S.players.forEach(p=>{p.alive=true;p.fall=0;p.respawn=0;placeRandom(p)});S.rails=makeRails()}}};
$('#bStart').onclick=()=>{if(S&&S.players.length>=2){SFX.pop();startMatch()}};
$('#bNext').onclick=()=>{if(S&&S.offers&&Object.keys(S.offers).some(id=>{const p=P(id);return p&&!p.bot})){toast('Waiting for power-up picks...',2);return}if(S&&S.phase==='results'){SFX.click();afterResults()}};
$('#bRe').onclick=()=>{if(S){SFX.pop();startMatch()}};
$('#bLob').onclick=()=>{if(S){S.phase='lobby';S.mut=[];S.bumpers=[];S.kegs=[];S.bomb=null;S.zone=null;S.items=[];S.corks=[];S.loose=[];S.arenaR=BASE_R;S.rot=0;S.rotV=0;S.gx=S.gy=0;S.map=S.settings.map==='random'?'round':S.settings.map;S.players.forEach(p=>{p.alive=true;p.fall=0;p.respawn=0;p.gun=1;p.r=26;placeRandom(p)});S.rails=makeRails()}};
function toggleMute(){muted=!muted;store.set('muted',muted);if(MG)MG.gain.value=muted?0:vol/100;$('#bMute').textContent=muted?'🔇':'🔊';if(muted&&'speechSynthesis' in window)speechSynthesis.cancel()}
$('#bMute').onclick=()=>{initAudio();toggleMute()};$('#bMute').textContent=muted?'🔇':'🔊';
$('#bVoice').onclick=()=>{if(!voiceOn){voiceOn=true;voxI=0}else if(voxI<VOX.length-1)voxI++;else voiceOn=false;store.set('voice',voiceOn);store.set('vox',voxI);$('#bVoice').style.opacity=voiceOn?1:.4;toast(voiceOn?'🗣️ '+VOX[voxI].n+((()=>{const vv=voxVoice(VOX[voxI],voxI);return vv?' ('+vv.name.replace(/Microsoft |Google | Online \(Natural\)| - English.*$/g,'')+')':''})()):'Announcer off');if(voiceOn)say('Hello, drunkards.',1)};$('#bVoice').style.opacity=voiceOn?1:.4;
$('#bFull').onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}};
addEventListener('beforeunload',()=>{try{if(NET.mode==='client'&&NET.hostConn)NET.hostConn.send({t:'bye'})}catch(e){}});
if(!hatOk(me.hat))me.hat=0;if(!faceOk(me.fc|0))me.fc=0;if(!backOk(me.bk|0))me.bk=0;if(!iconOk(me.ic|0))me.ic=0;$('#ltag').value=me.tag||'';refreshPick();lvBar();
$('#volM').value=vol;$('#volMu').value=musVol;
$('#volM').oninput=e=>{initAudio();vol=+e.target.value;store.set('vol',vol);if(muted&&vol>0)toggleMute();if(MG)MG.gain.value=muted?0:vol/100};
$('#volMu').oninput=e=>{initAudio();musVol=+e.target.value;store.set('musvol',musVol);if(MUG)MUG.gain.value=.27*musVol/100};

