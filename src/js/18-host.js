// 18-host.js: WebRTC signalling, hosting, host-side messages, chat, snapshots (PROTO, PK)
// ---- direct WebRTC with signalling over the relay (fallback when the PeerJS server doesn't deliver)
function gathered(pc){return new Promise(res=>{if(pc.iceGatheringState==='complete')return res();const t=setTimeout(res,1500);pc.addEventListener('icegatheringstatechange',()=>{if(pc.iceGatheringState==='complete'){clearTimeout(t);res()}})})}
async function rtcUpgrade(){if(NET.mode!=='client'||!NET.relay||NET.rtcPc||typeof RTCPeerConnection==='undefined')return;try{
 const pc=new RTCPeerConnection(ICE);NET.rtcPc=pc;const dc=pc.createDataChannel('g',{ordered:true});
 NET.rst='offer';pc.oniceconnectionstatechange=()=>{if(NET.relay)NET.rst=pc.iceConnectionState;if(pc.iceConnectionState==='failed'){try{pc.close()}catch(e){}if(NET.rtcPc===pc&&NET.relay&&(NET.rtcTry|0)<2){NET.rtcTry=(NET.rtcTry|0)+1;NET.rtcPc=null;setTimeout(rtcUpgrade,3000)}}};
 dc.onopen=()=>{if(NET.mode!=='client'||!NET.relay){try{pc.close()}catch(e){}return}const old=NET.myId;const conn={open:true,send:d=>{if(dc.readyState==='open')dc.send(JSON.stringify(d))},close:()=>{try{pc.close()}catch(e){}}};
  try{if(NET.mq)NET.mq.close()}catch(e){}NET.mq=null;NET.relay=0;NET.hostConn=conn;conn.send({t:'h',v:PROTO,name:me.name,color:me.color,hat:me.hat,fc:me.fc|0,bk:me.bk|0,tag:me.tag,ic:me.ic|0,lv:myLv(),uid:MYUID,up:old});toast('Switched to a direct link. Less lag!',3)};
 dc.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}clientMsg(m)};dc.onclose=()=>{if(NET.mode==='client'&&NET.hostConn&&!NET.relay&&NET.rtcPc===pc){toast('The host left. Party\'s over (for now).',6);leaveToTitle(true)}};
 let sent=false;const sendSdp=()=>{if(sent||NET.rtcPc!==pc||!NET.relay||!pc.localDescription)return;sent=true;NET.hostConn.send({t:'rtc',sdp:pc.localDescription.sdp});NET.rst='sent'};
 pc.onicecandidate=e=>{if(e.candidate&&sent&&NET.relay&&NET.rtcPc===pc)NET.hostConn.send({t:'rtc',c:e.candidate.toJSON()})};
 setTimeout(()=>{if(!sent){if(pc.localDescription)sendSdp();else NET.rst='stuck '+NET.rst}},5000);
 const of=await pc.createOffer();NET.rst='local';await pc.setLocalDescription(of);NET.rst='gather';await gathered(pc);if(NET.rtcPc!==pc||!NET.relay){NET.rst='abort';return}sendSdp();setTimeout(()=>{if(NET.rtcPc===pc&&NET.rst==='sent')NET.rst='host silent'},8000)}catch(e){console.warn(e);NET.rst='err '+(e&&e.name||'')}}
async function rtcAnswer(c,sdp){try{c.send({t:'hst',s:'got offer'});const pc=new RTCPeerConnection(ICE),rid=connId(c);c.rpc=pc;c.rq=c.rq||[];let sent=false;pc.onicecandidate=e=>{if(e.candidate&&sent)c.send({t:'rtc',c:e.candidate.toJSON()})};pc.ondatachannel=ev=>{const dc=ev.channel,id='w_'+rid+'_'+Math.random().toString(36).slice(2,6);
  const conn={id,open:true,send:d=>{if(dc.readyState==='open')dc.send(JSON.stringify(d))},close:()=>{try{pc.close()}catch(e){}}};
  dc.onopen=()=>NET.conns.set(id,conn);dc.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}hostMsg(conn,m)};dc.onclose=()=>dropConn(id)};
 pc.oniceconnectionstatechange=()=>{try{c.send({t:'hst',s:pc.iceConnectionState})}catch(e){}};
 await pc.setRemoteDescription({type:'offer',sdp:String(sdp)});for(const q of c.rq.splice(0))pc.addIceCandidate(q).catch(()=>{});await pc.setLocalDescription(await pc.createAnswer());await gathered(pc);sent=true;c.send({t:'rtc',sdp:pc.localDescription.sdp})}catch(e){console.warn(e);try{c.send({t:'hst',s:'err '+(e&&e.name||e)})}catch(_){}}}
function kickPlayer(id){if(NET.mode!=='host'||!S||id===NET.myId)return;const q=P(id);if(!q)return;if(q.fill)S.qfill=0;const c=NET.conns.get(id);NET.banned=NET.banned||new Set();if(!q.bot){NET.banned.add(id);if(q.uid)NET.banned.add('u:'+q.uid)}
 if(c){try{c.send({t:'kick'})}catch(e){}setTimeout(()=>{try{c.close&&c.close()}catch(e){}},400);NET.conns.delete(id)}S.players=S.players.filter(x=>x!==q);if(!q.bot)toast('🚪 '+q.name+' got bounced',3);SFX.click()}
function dropConn(id){if(!NET.conns.has(id))return;NET.conns.delete(id);if(!S)return;S.players=S.players.filter(x=>x.owner!==id);const q=P(id);if(q){S.players=S.players.filter(x=>x!==q);toast(q.name+' left the bar')}}
setInterval(()=>{{const el=$('#netinfo');if(el)el.textContent=(FPS<45&&!document.hidden?' · ⚠️ '+FPS+'fps':'')+(NET.mode==='host'&&NET.hcheck&&S&&S.code!=='SOLO'?' · host direct: '+NET.hcheck:NET.mode==='client'&&NET.rtt!=null?' · '+(NET.relay?'relay ':'direct ')+Math.round(NET.rtt*1000)+'ms'+(NET.relay?' (pj: '+(NET.dfail||'-')+', rtc: '+(NET.rst||'-')+(NET.hrst?'/'+NET.hrst:'')+(NET.relayUrl?', '+NET.relayUrl.replace(/^wss?:\/\/(broker\.|mqtt\.|test\.)?/,'').split(/[.:]/)[0]:'')+')':''):'')}if(NET.mode==='client'&&NET.relay&&performance.now()-(NET.lastRx||0)>12000){toast('Lost the host. Party\'s over (for now).',6);leaveToTitle(true)}if(NET.mode!=='host')return;const n=performance.now();for(const c of [...NET.conns.values()])if(c.relay&&n-c.seen>15000)dropConn(c.id)},2000);
async function rtcSelfTest(){NET.hcheck='testing';try{if(typeof RTCPeerConnection==='undefined')throw {name:'missing'};const pc=new RTCPeerConnection(ICE);pc.createDataChannel('t');let srflx=0,any=0;pc.onicecandidate=e=>{if(e.candidate){any++;if(/ typ (srflx|relay)/.test(e.candidate.candidate))srflx++}};
 await pc.setLocalDescription(await pc.createOffer());await gathered(pc);await new Promise(r=>setTimeout(r,300));pc.close();NET.hcheck=srflx?'ok':any?'local only':'no candidates';if(!srflx)toast('⚠️ Your browser/network is blocking direct links ('+NET.hcheck+'). Friends will go through the laggy relay.',8)}catch(e){NET.hcheck='blocked '+(e&&e.name||'');toast('⚠️ Your browser is blocking WebRTC. Friends will go through the laggy relay.',8)}}
function hostStart(offline){NET.mode='host';NET.myId='host';const code=offline?'SOLO':genCode();S=newState(code);
 const p=newPlayer('host',me.name,me.color,me.hat,false);S.players.push(p);p.lv=myLv();p.fc=me.fc|0;p.bk=me.bk|0;p.tag=me.tag;p.ic=me.ic|0;S.settings.bots=store.get('botlv',1);S.settings.ghosts=store.get('ghosts',0)?1:0;placeRandom(p);S.rails=makeRails();
 if(offline){addBot();addBot();addBot();showLobby();return}
 if(LOCAL){NET.bc=new BroadcastChannel('lcb-'+code);NET.bc.onmessage=e=>{const m=e.data;if(m.to!=='host')return;let c=NET.conns.get(m.from);
   if(!c){c={id:m.from,send:d=>NET.bc.postMessage({to:m.from,from:'host',data:d})};NET.conns.set(m.from,c)}hostMsg(c,m.data)};showLobby();return}
 toast('Opening room...',8);rtcSelfTest();
 const open=code=>{if(FORCE_RELAY){S.code=code;relayHost(code);toast('Room '+code+' is open (relay)!');showLobby();return}const peer=new Peer(PID(code),PEEROPT);NET.peer=peer;
  peer.on('open',()=>{S.code=code;relayHost(code);toast('Room '+code+' is open!');showLobby()});
  peer.on('error',e=>{if(e.type==='unavailable-id'){peer.destroy();open(genCode())}else if(e.type!=='peer-unavailable'){toast('Network hiccup: '+e.type,4);console.warn(e)}});
  peer.on('disconnected',()=>{try{peer.reconnect()}catch(e){}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&NET.peer===peer&&peer.disconnected&&!peer.destroyed){try{peer.reconnect();toast('Reconnected the room',2)}catch(e){}}});
  peer.on('connection',conn=>{conn.on('open',()=>{NET.conns.set(conn.peer,conn)});conn.on('data',d=>hostMsg(conn,d));
   const drop=()=>dropConn(conn.peer);conn.on('close',drop);conn.on('error',drop)})};
 open(code)}
function connId(c){return c.peer||c.id}
function applyMe(p,m){if(!p||!S||S.phase!=='lobby')return;const n=String(m.name||'').replace(/[<>]/g,'').trim().slice(0,24);if(n)p.name=n;
 const c=m.color|0;if(c>=0&&c<COLORS.length&&!S.players.some(q=>q!==p&&q.color===c))p.color=c;const h=m.hat|0;if(h>=0&&h<HATS.length)p.hat=h;p.fc=clamp(m.fc|0,0,FACES.length-1);p.bk=clamp(m.bk|0,0,BACKS.length-1);p.tag=cleanTag(m.tag);p.ic=clamp(m.ic|0,0,ICONS.length-1);p.lv=clamp(m.lv|0,1,69)}
const BOTCHAT=['lol','gg','who invited this guy','one more round','im not even drunk','bet','skill issue','🍺','ok but who spilled','i will end you','ratio','hold my beer'];
function hostChat(p,x){if(!p||!S)return;x=String(x).replace(/[\u0000-\u001f]/g,'').trim().slice(0,80);if(!x)return;if(S.t-(p.chT||-9)<.6)return;p.chT=S.t;ev('chat',{id:p.id,n:dispName(p).slice(0,40),c:p.color|0,x,lv:p.bot?0:p.lv|0});
 if(!p.bot&&Math.random()<.25){const bs=S.players.filter(q=>q.bot);if(bs.length){const b=pick(bs);setTimeout(()=>{if(S&&S.players.includes(b))hostChat(b,pick(BOTCHAT))},rnd(900,2200))}}}
function sendChat(x){x=String(x||'').trim().slice(0,80);if(!x)return;if(S&&S.hub){hubChat(x);return}if(NET.mode==='host')hostChat(P(NET.myId),x);else if(NET.hostConn)try{NET.hostConn.send({t:'chat',x})}catch(e){}}
function sendMe(){const m={t:'me',name:me.name,color:me.color,hat:me.hat,fc:me.fc|0,bk:me.bk|0,tag:me.tag,ic:me.ic|0,lv:myLv(),uid:MYUID};if(NET.mode==='host')applyMe(P(NET.myId),m);else if(NET.hostConn)NET.hostConn.send(m)}
function hostMsg(c,m){if(!m||!S)return;const id=connId(c);if(NET.banned&&(NET.banned.has(id)||(m.t==='h'&&m.uid&&NET.banned.has('u:'+m.uid)))){if(m.t==='h')c.send({t:'kick'});return}let p=P(id);
 if(m.t==='h'&&!p&&m.up&&m.up!==id){const o=P(String(m.up));if(o&&!o.bot){NET.conns.delete(o.id);const old=o.id;o.id=id;p=o;S.players.forEach(q=>{if(q.owner===old){q.owner=id;q.id=id+q.id.slice(old.length)}});if(S.lastWinner===old)S.lastWinner=id;S.players.forEach(q=>{if(q.hitBy===old)q.hitBy=id})}}
 if(m.t==='h'){if(m.v!==PROTO){c.send({t:'old',v:PROTO});toast((String(m.name||'Someone').slice(0,24))+' has an old version. Tell them to refresh!',6);if(!(m.v>0))return}if(!p){if(S.players.length>=6&&S.qfill){const fb=S.players.find(q=>q.fill);if(fb)S.players=S.players.filter(x=>x!==fb)}if(S.players.length>=6){c.send({t:'full'});return}p=newPlayer(id,m.name,uniqueColor(m.color|0),clamp(m.hat|0,0,HATS.length-1),false);p.lv=clamp(m.lv|0,1,69);p.fc=clamp(m.fc|0,0,FACES.length-1);p.bk=clamp(m.bk|0,0,BACKS.length-1);p.tag=cleanTag(m.tag);p.ic=clamp(m.ic|0,0,ICONS.length-1);p.uid=String(m.uid||'').slice(0,16);p.team=balTeam();placeRandom(p);if(S.phase!=='lobby'){p.alive=false;p.fall=0;if(S.phase==='play'&&isCont())p.respawn=1}S.players.push(p);
   toast(p.name+' stumbled in!');ev('emote',{id:p.id,em:2});}c.send({t:'w',id});return}
 if(!p)return;
 if(m.t==='i'){p.inp.x=clamp(+m.x||0,-1,1);p.inp.y=clamp(+m.y||0,-1,1);p.inp.d=m.d?1:0;p.inp.f=m.f?1:0;p.inp.p=m.p?1:0;p.inp.a=(typeof m.a==='number'&&isFinite(m.a))?m.a:null;p.inp.m=m.m?1:0}
 else if(m.t==='e'){emote(p,clamp(m.k|0,0,EMOTES.length-1))}
 else if(m.t==='mv'){castVote(p.id,m.k|0)}
 else if(m.t==='lj'){const k=clamp(m.k|0,1,3);if(S.players.length>=6){c.send({t:'gfull',k});return}hostGuest(id,k,m)}
 else if(m.t==='ll'){const gid=id+'~'+clamp(m.k|0,1,3);S.players=S.players.filter(q=>q.id!==gid)}
 else if(m.t==='gi'){const g=P(id+'~'+clamp(m.k|0,1,3));if(g){g.inp.x=clamp(+m.x||0,-1,1);g.inp.y=clamp(+m.y||0,-1,1);g.inp.d=m.d?1:0;g.inp.f=m.f?1:0;g.inp.p=m.p?1:0;g.inp.a=null;g.inp.m=0}}
 else if(m.t==='ge'){const g=P(id+'~'+clamp(m.k|0,1,3));if(g)emote(g,clamp(m.e|0,0,3))}
 else if(m.t==='me'){applyMe(p,m)}
 else if(m.t==='rtc'&&c.relay&&typeof m.sdp==='string'&&m.sdp.length<20000){rtcAnswer(c,m.sdp)}
 else if(m.t==='rtc'&&c.relay&&m.c&&typeof m.c==='object'){if(c.rpc&&c.rpc.remoteDescription)c.rpc.addIceCandidate(m.c).catch(()=>{});else{c.rq=c.rq||[];if(c.rq.length<40)c.rq.push(m.c)}}
 else if(m.t==='pk'){const o=S.offers&&S.offers[id];if(o&&o[m.k|0])givePerk(p,o[m.k|0])}
 else if(m.t==='chat'&&typeof m.x==='string'){hostChat(p,m.x)}
 else if(m.t==='pg'){c.send({t:'po',k:m.k})}
 else if(m.t==='bye'){S.players=S.players.filter(x=>x!==p&&x.owner!==id)}}
function broadcast(){if(!S)return;const s=snapshot();const rl=new Set();for(const c of NET.conns.values()){if(c.relay){rl.add(c.mq);continue}try{if(c.open!==false)c.send({t:'s',s})}catch(e){}}if(rl.size){NET.rev=(NET.rev||[]).concat(s.ev);NET.rtick=(NET.rtick||0)+1;if(NET.rtick%(NET.rhalf?2:1)===0||NET.rev.length>12){const j=JSON.stringify({t:'s',s:Object.assign({},s,{ev:NET.rev})});NET.rev=[];for(const mq of rl)mq.pub(RT(S.code)+'all',j)}}S.evq=[]}
const PROTO=21;const PKI=new Set(['x','y','vx','vy','ghx','ghy']);const PKB=new Set(['alive','bot']);
const PK=['ghx','ghy','id','name','color','hat','bot','x','y','vx','vy','face','r','alive','fall','charge','dash','stun','buzz','score','emote','emoteT','teeter','kos','falls','team','inv','gun','armor','courage','gulp','aiming','aimA','aimC','thT','parry','wob','dodge','slosh','ctr','fullT','full','lives','lv','pks','fc','bk','spl','tag','ic','hand','pzv'];
const r2=v=>Math.round(v*100)/100;
let lastRails='',railsT=0;function snapshot(){const sn=snapshot0();const rj=JSON.stringify(sn.rails);railsT++;if(rj===lastRails&&railsT%30)delete sn.rails;else lastRails=rj;return sn}
function snapshot0(){return {st:r2(S.t),fl:(S.fl||[]).map(f=>[f.x|0,f.y|0,f.r,r2(f.flip),f.gold,r2(f.a)]),code:S.code,phase:S.phase,pt:r2(S.pt),rt:r2(S.rt),round:S.round,mut:S.mut,arenaR:r2(S.arenaR),rot:r2(S.rot),gx:S.gx|0,gy:S.gy|0,sudden:S.sudden,
 card:S.card,vote:S.vote&&S.phase==='results'?S.vote:null,over:S.over,rp:S.phase==='over'&&S.rp||null,settings:S.settings,lastWinner:S.lastWinner,map:S.map,matchT:r2(S.matchT),waveWarn:r2(S.waveWarn||0),disco:S.disco?1:0,hydro:S.hydro?1:0,waveA:r2(S.waveA||0),mutT:r2(S.mutT),
 zone:S.zone?{x:S.zone.x|0,y:S.zone.y|0,r:S.zone.r,own:S.zone.own,t:r2(S.zone.t)}:null,items:S.items.map(i=>({x:i.x|0,y:i.y|0})),loose:S.loose.map(c=>({x:c.x|0,y:c.y|0})),rails:S.rails.map(r=>({ax:r.ax|0,ay:r.ay|0,bx:r.bx|0,by:r.by|0,hp:r.hp})),corks:S.corks.map(c=>({x:c.x|0,y:c.y|0,vx:c.vx|0,vy:c.vy|0})),nuts:(S.nuts||[]).map(n=>[n.x|0,n.y|0,r2(n.t)]),
 pk:S.players.map(p=>PK.map(k=>{let v=p[k];if(typeof v==='number')v=(PKI.has(k)?Math.round(v):r2(v));else if(v===undefined)v=0;else if(v===false)v=0;else if(v===true)v=1;return v})),
 kegs:S.kegs.map(k=>({x:k.x|0,y:k.y|0,vx:k.vx|0,vy:k.vy|0,a:r2(k.a),warn:r2(k.warn),r:k.r})),bumpers:S.bumpers.map(b=>({x:b.x|0,y:b.y|0,r:b.r})),
 bomb:S.bomb?{h:S.bomb.h,fuse:r2(S.bomb.fuse)}:null,offers:S.offers||null,ev:S.evq}}
let V=null;const disp={};
const BR={mqs:null,rooms:new Map(),tick:null};
