// 21-join.js: room browser, Quick Match, bot fill, joining a room, client messages, sending input
function startBrowse(){if(BR.mqs)return;BR.rooms.clear();BR.mqs=RELAYS.map(u=>{const mq=mqtt([u],(t,txt)=>{let m;try{m=JSON.parse(txt)}catch(e){return}if(!m||m.v!==PROTO||typeof m.c!=='string')return;BR.rooms.set(m.c.slice(0,6),{c:m.c.slice(0,6),n:String(m.n||'?').slice(0,24),p:m.p|0,m:MODES[m.m]?m.m:'classic',mp:m.mp,ph:m.ph,t:performance.now()})},()=>mq.pub(LOBQ,'1'));mq.sub(LOBA);return mq})}
function stopBrowse(){if(BR.mqs){BR.mqs.forEach(m=>m.close());BR.mqs=null}clearInterval(BR.tick);BR.tick=null}
function liveRooms(){const n=performance.now();for(const [k,r] of BR.rooms)if(n-r.t>11000)BR.rooms.delete(k);return [...BR.rooms.values()].sort((a,b)=>(a.ph==='lobby'?0:1)-(b.ph==='lobby'?0:1)||b.p-a.p)}
function drawRooms(){const L=liveRooms();$('#rlist').innerHTML=L.length?L.map(r=>{const mp=r.mp==='random'?'Random':(MAPS[r.mp]?MAPS[r.mp].n:'?');const full=r.p>=6;return '<div class="rm"><div><b>'+esc(r.n)+'\'s bar</b><span>'+r.p+'/6 · '+MODES[r.m].n+' · '+mp+(r.ph==='lobby'?'':' · in game')+'</span></div><button class="go" data-join="'+r.c+'"'+(full?' disabled>Full':'>Join')+'</button></div>'}).join(''):'<div class="none">Looking for rooms...</div>'}
function showBrowse(){showScreen('browse');startBrowse();drawRooms();BR.tick=setInterval(()=>{drawRooms();if(BR.tick&&Math.random()<.25&&BR.mqs)BR.mqs.forEach(m=>m.pub(LOBQ,'1'))},1000)}
function quickMatch(){const wasOpen=!!BR.mqs;startBrowse();toast('Finding a match...',4);const pick=()=>liveRooms().filter(r=>r.p<6).sort((a,b)=>(a.ph==='lobby'?0:1)-(b.ph==='lobby'?0:1)||b.p-a.p)[0];
 const t0=performance.now();const go=()=>{const r=pick();if(r){stopBrowse();joinStart(r.c);return}if(performance.now()-t0<(wasOpen?1500:3500)){setTimeout(go,300);return}stopBrowse();hostStart(false);if(S){S.settings.pub=1;S.qfill=1;fillTick();toast('🤖 Nobody here yet. Bots hold the seats, and real players swap in.',5)}};go()}
function fillTick(){if(NET.mode!=='host'||!S||!S.qfill||S.hub)return;const hum=S.players.filter(p=>!p.bot).length,fl=S.players.filter(p=>p.fill),want=Math.max(0,3-hum);
 if(fl.length<want&&S.phase==='lobby'){for(let i=fl.length;i<want&&S.players.length<6;i++){addBot();S.players[S.players.length-1].fill=1}}
 else if(fl.length>want){const q=S.phase==='lobby'?fl[fl.length-1]:fl.find(p=>!p.alive);if(q)S.players=S.players.filter(x=>x!==q)}}
setInterval(fillTick,500);
function joinStart(code){code=code.toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length<4){toast('Type the 4-letter room code first!');return}
 NET.mode='client';store.set('lastcode',code);
 if(LOCAL){NET.myId='c'+Math.random().toString(36).slice(2,8);NET.bc=new BroadcastChannel('lcb-'+code);const send=d=>NET.bc.postMessage({to:'host',from:NET.myId,data:d});
  NET.hostConn={send,open:true};NET.bc.onmessage=e=>{if(e.data.to===NET.myId||e.data.to==='*')clientMsg(e.data.data)};send({t:'h',v:PROTO,name:me.name,color:me.color,hat:me.hat,fc:me.fc|0,bk:me.bk|0,tag:me.tag,ic:me.ic|0,lv:myLv(),uid:MYUID});showLobby();return}
 toast('Finding room '+code+'...',10);let ok=false;
 const fail=setTimeout(()=>{if(!ok){toast('Could not reach room '+code+'. Check the code, or have the host refresh and re-host.',6);leaveToTitle(true)}},22000);
 let relayOn=false;const startRelay=()=>{if(ok||relayOn||NET.mode!=='client')return;relayOn=true;toast('Direct link failed, trying the relay...',10);const rid=Math.random().toString(36).slice(2,12);
  // connect to every broker at once; the first one to bring back the host's welcome is the fastest path, keep only that one
  const hello=()=>({t:'h',v:PROTO,name:me.name,color:me.color,hat:me.hat,fc:me.fc|0,bk:me.bk|0,tag:me.tag,ic:me.ic|0,lv:myLv(),uid:MYUID});let chosen=null;const tag={};const bt={};
  const benchBrokers=()=>{let n=0;const iv=setInterval(()=>{n++;if(NET.mode!=='client'||!NET.relay||NET.mq!==chosen){clearInterval(iv);for(const o of probes)if(o!==chosen&&o!==NET.mq)o.close();return}
    if(n<=8){probes.forEach((o,i)=>{if(o.up)o.pub(RT(code)+'h',JSON.stringify({f:rid,d:{t:'bp',b:i,k:performance.now()}}))});return}
    clearInterval(iv);const med=i=>{const a=(bt[i]||[]).slice().sort((x,y)=>x-y);return a.length>=3?a[a.length>>1]:1e9};let bi=probes.indexOf(chosen);const cur=med(bi);
    probes.forEach((o,i)=>{if(o.up&&med(i)<med(bi))bi=i});NET.bmed=probes.map((o,i)=>Math.round(med(i)));
    if(probes[bi]!==chosen&&med(bi)<cur*.8){chosen=probes[bi];NET.mq=chosen;NET.relayUrl=RELAYS[bi];toast('Found a faster relay ('+Math.round(med(bi))+'ms)',3)}
    for(const o of probes)if(o!==chosen)o.close()},400)};
  const probes=RELAYS.map(u=>{const mq=mqtt([u],(topic,txt)=>{let m;try{m=JSON.parse(txt)}catch(e){return}if(!m)return;if(m.t==='bq'){const l=performance.now()-m.k;const a=(bt[m.b]=bt[m.b]||[]);a.push(l);return}if(chosen&&mq!==chosen)return;NET.lastRx=performance.now();
    if(!ok){if(m.t==='w'){ok=true;chosen=mq;NET.mq=mq;clearTimeout(fail);clearInterval(hi);NET.relay=1;NET.relayUrl=u;NET.mqp=null;benchBrokers();toast('Joined room '+code+'!');showLobby();clientMsg(m);setTimeout(rtcUpgrade,QS.has('nortc')?1e9:300)}else if(m.t==='full'||m.t==='old')clientMsg(m);return}clientMsg(m)},
    ()=>{if(!ok)mq.pub(RT(code)+'h',JSON.stringify({f:rid,d:hello()}))});mq.sub(RT(code)+'c/'+rid);mq.sub(RT(code)+'all');return mq});
  NET.mqp=probes;NET.mq=probes[0];NET.hostConn={open:true,send:d=>{const mq=chosen||probes.find(o=>o.up);if(mq)mq.pub(RT(code)+'h',JSON.stringify({f:rid,d}))}};
  const hi=setInterval(()=>{if(ok||NET.mqp!==probes){clearInterval(hi);return}for(const o of probes)if(o.up)o.pub(RT(code)+'h',JSON.stringify({f:rid,d:hello()}))},800)};
 if(FORCE_RELAY){startRelay();return}
 const peer=new Peer(PEEROPT);NET.peer=peer;setTimeout(startRelay,QS.get('rdelay')?+QS.get('rdelay'):6000);
 NET.dfail='signal';peer.on('open',id=>{NET.dfail='no answer';if(ok&&!NET.relay)return;const conn=peer.connect(PID(code),{reliable:true,serialization:'json'});conn.on('iceStateChanged',st=>{NET.dfail='ice '+st});conn.on('error',e=>{NET.dfail='err '+(e&&e.type||e)})
  conn.on('open',()=>{if(NET.mode!=='client'||(ok&&!NET.relay)){try{conn.close()}catch(e){}return}
   const up=ok&&NET.relay?NET.myId:null;const wasOk=ok;ok=true;clearTimeout(fail);try{(NET.mqp||[]).forEach(o=>o.close())}catch(e){}NET.mqp=null;try{if(NET.mq)NET.mq.close()}catch(e){}NET.mq=null;NET.relay=0;
   if(!up)NET.myId=id;NET.hostConn=conn;conn.send({t:'h',v:PROTO,name:me.name,color:me.color,hat:me.hat,fc:me.fc|0,bk:me.bk|0,tag:me.tag,ic:me.ic|0,lv:myLv(),uid:MYUID,up});if(wasOk)toast('Switched to a direct link. Less lag!',3);else{toast('Joined room '+code+'!');showLobby()}});
  conn.on('data',clientMsg);conn.on('close',()=>{if(NET.hostConn!==conn)return;toast('The host left. Party\'s over (for now).',6);leaveToTitle(true)})});
 peer.on('error',e=>{if(e.type==='peer-unavailable'&&!relayOn){clearTimeout(fail);toast('No room called '+code+'. Typo? Drunk? Both?',5);leaveToTitle(true)}else{console.warn(e);NET.dfail=(NET.dfail||'')+' / '+e.type;if(!ok)startRelay()}})}
const LAG=+((location.search.match(/[?&]lag=(\d+)/)||[])[1]||0); // test flag: ?lag=200 fakes a 200 ms round trip for a joined player
function clientMsg(m){if(!m)return;if(LAG&&!m._lag){m._lag=1;setTimeout(()=>clientMsg(m),LAG/2);return}if(m.t==='gfull'){const g=LOC.get(m.k|0);if(g){LOC.delete(g.k);for(const i in PADS)if(PADS[i]===g.k)delete PADS[i]}toast('Room is full!',2);return}if(m.t==='hst'){NET.hrst=String(m.s).slice(0,14);return}if(m.t==='bq')return;if(m.t==='rtc'){const pc=NET.rtcPc;if(m.c){if(pc&&pc.remoteDescription)pc.addIceCandidate(m.c).catch(()=>{});return}if(pc&&pc.signalingState==='have-local-offer'){NET.rst='answered';}if(pc&&pc.signalingState==='have-local-offer')pc.setRemoteDescription({type:'answer',sdp:String(m.sdp)}).catch(e=>console.warn(e));return}if(m.t==='kick'){if(NET.mode==='client'){toast('🚪 The host kicked you out.',5);leaveToTitle(true)}return}if(m.t==='old'){toast(m.v>PROTO?'The host has a newer version. Refresh this page and rejoin!':'The host has an older version. Ask them to refresh!',8);leaveToTitle(true);return}if(m.t==='po'){const r=(performance.now()-m.k)/1000;if(r>=0&&r<5)NET.rtt=NET.rtt==null?r:NET.rtt*.8+r*.2;return}if(m.t==='w'){NET.myId=m.id;return}if(m.t==='full'){toast('Room is full (6 max)!',5);leaveToTitle(true);return}
 if(m.t==='s'){const s=m.s;if(s.pk){s.players=s.pk.map(a=>{const o={};PK.forEach((k,i)=>{o[k]=PKB.has(k)?!!a[i]:a[i]});return o});delete s.pk}if(!s.rails&&V)s.rails=V.rails;if(!s.rails)s.rails=[];
  for(const p of s.players){let d=disp[p.id];if(!d||!p.alive||hyp(d.x-p.x,d.y-p.y)>(p.id===NET.myId?(d.pd&&d.pd.w>0?700:260):160)){d=disp[p.id]={x:p.x,y:p.y,pd:d&&d.pd}}d.tx=p.x;d.ty=p.y;d.vx=p.vx;d.vy=p.vy;d.age=0}
  s._rx=performance.now();V=s;recFrame(s);for(const e of s.ev)onEv(e)}}
function leaveToTitle(silent){hubStop();couchReset();try{$('#clog').innerHTML=''}catch(e){}try{if(NET.mode==='client'&&NET.mq&&NET.hostConn)NET.hostConn.send({t:'bye'})}catch(e){}try{if(NET.mq)NET.mq.close()}catch(e){}NET.mq=null;try{(NET.mqp||[]).forEach(m=>m.close())}catch(e){}NET.mqp=null;try{(NET.mqs||[]).forEach(m=>m.close())}catch(e){}NET.mqs=null;NET.relay=0;try{if(NET.peer)NET.peer.destroy()}catch(e){}try{if(NET.bc)NET.bc.close()}catch(e){}try{if(NET.rtcPc)NET.rtcPc.close()}catch(e){}NET.rtcPc=null;NET.mode=null;NET.peer=null;NET.conns.clear();NET.banned=null;NET.hostConn=null;S=null;V=null;$('#esc').classList.remove('on');
 showScreen('title')}
let lastInp=null;function sendInput(dt){couchPads(dt);const inp=readInput();lastInp=inp;tutTick(inp,dt);
 if(NET.mode==='host'){const p=P('host');if(p)p.inp=inp;if(emoteQ>=0&&p)emote(p,emoteQ)}
 else if(NET.mode==='client'&&NET.hostConn){const q=v=>Math.round(v*20)/20,qx=q(inp.x),qy=q(inp.y),qa=inp.a==null?null:Math.round(inp.a*50)/50,bk=''+inp.d+inp.f+inp.p+inp.m,k=qx+','+qy+','+qa;NET.inT-=dt;NET.inGap=(NET.inGap||0)+dt;
  if(bk!==NET.lastBk||(k!==NET.lastIn&&NET.inGap>=(NET.relay?.05:.033))||NET.inT<=0){NET.lastBk=bk;NET.lastIn=k;NET.inT=.25;NET.inGap=0;const im={t:'i',x:qx,y:qy,d:inp.d,f:inp.f,p:inp.p,a:qa,m:inp.m},hc=NET.hostConn;try{if(LAG)setTimeout(()=>{try{hc.send(im)}catch(e){}},LAG/2);else hc.send(im)}catch(e){}}
  if(emoteQ>=0)try{NET.hostConn.send({t:'e',k:emoteQ})}catch(e){}
  NET.pgT=(NET.pgT||0)-dt;if(NET.pgT<=0){NET.pgT=1;const pm={t:'pg',k:performance.now()},hc=NET.hostConn;try{if(LAG)setTimeout(()=>{try{hc.send(pm)}catch(e){}},LAG/2);else hc.send(pm)}catch(e){}}}
 emoteQ=-1}

