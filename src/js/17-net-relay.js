// 17-net-relay.js: network setup, the MQTT relay client, room announcements, the Esc menu
// ============================================================ NETWORK
const NET={mode:null,peer:null,conns:new Map(),hostConn:null,myId:null,bc:null,lastIn:'',inT:0};
function genCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<4;i++)s+=A[Math.floor(Math.random()*A.length)];return s}
const PID=c=>'lastcallbrawl-v1-'+c.toUpperCase();
const ICE={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']},
 {urls:['turn:eu-0.turn.peerjs.com:3478','turn:us-0.turn.peerjs.com:3478'],username:'peerjs',credential:'peerjsp'},
 {urls:['turn:openrelay.metered.ca:80','turn:openrelay.metered.ca:443','turn:openrelay.metered.ca:443?transport=tcp','turns:openrelay.metered.ca:443?transport=tcp'],username:'openrelayproject',credential:'openrelayproject'}],sdpSemantics:'unified-plan'};
const PEEROPT=(()=>{const ps=QS.get('ps');if(!ps)return {debug:1,config:ICE};const [host,port]=ps.split(':');return {debug:1,host,port:+port,path:'/',secure:false}})();
// ---- tiny MQTT 3.1.1 over WebSocket client (QoS 0), used as a relay when WebRTC can't connect
const RELAYS=(QS.get('relay')?QS.get('relay').split(','):['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt','wss://mqtt.eclipseprojects.io:443/mqtt','wss://test.mosquitto.org:8081/mqtt']);
function mqtt(URLS,onMsg,onUp,onDown){const te=new TextEncoder(),td=new TextDecoder();let ws=null,buf=new Uint8Array(0),ping=null,idx=0,dead=false,up=false,pid=1,fails=0;const subs=[];
 const str=s=>{const b=te.encode(s);const o=new Uint8Array(2+b.length);o[0]=b.length>>8;o[1]=b.length&255;o.set(b,2);return o};
 const len=n=>{const o=[];do{let d=n%128;n=Math.floor(n/128);if(n>0)d|=128;o.push(d)}while(n>0);return o};
 const pkt=(h,parts)=>{let L=0;for(const p of parts)L+=p.length;const l=len(L),o=new Uint8Array(1+l.length+L);o[0]=h;o.set(l,1);let k=1+l.length;for(const p of parts){o.set(p,k);k+=p.length}return o};
 const send=b=>{try{if(ws&&ws.readyState===1)ws.send(b)}catch(e){}};
 const subPkt=t=>pkt(0x82,[new Uint8Array([pid>>8&255,pid++&255]),str(t),new Uint8Array([0])]);
 function parse(){while(buf.length>=2){let m=1,v=0,i=1,b;do{if(i>=buf.length)return;b=buf[i++];v+=(b&127)*m;m*=128}while(b&128);if(buf.length<i+v)return;
   const type=buf[0]>>4,body=buf.subarray(i,i+v);
   if(type===2){up=true;idx=0;for(const t of subs)send(subPkt(t));onUp&&onUp()}
   else if(type===3){const tl=(body[0]<<8)|body[1],topic=td.decode(body.subarray(2,2+tl));let off=2+tl;if((buf[0]>>1)&3)off+=2;try{onMsg(topic,td.decode(body.subarray(off)))}catch(e){console.warn(e)}}
   buf=buf.slice(i+v)}}
 function go(){if(dead)return;const url=URLS[idx%URLS.length];try{ws=new WebSocket(url,['mqtt'])}catch(e){idx++;setTimeout(go,500);return}ws.binaryType='arraybuffer';
  const to=setTimeout(()=>{if(!up){try{ws.close()}catch(e){}}},5000);
  ws.onopen=()=>{send(pkt(0x10,[str('MQTT'),new Uint8Array([4,2,0,30]),str('lcb'+Math.random().toString(36).slice(2,12))]));clearInterval(ping);ping=setInterval(()=>send(new Uint8Array([0xC0,0])),20000)};
  ws.onmessage=e=>{const d=new Uint8Array(e.data),n=new Uint8Array(buf.length+d.length);n.set(buf);n.set(d,buf.length);buf=n;parse()};
  ws.onclose=()=>{clearTimeout(to);clearInterval(ping);const was=up;up=false;buf=new Uint8Array(0);if(dead)return;if(was){fails=0;onDown&&onDown()}else{idx++;fails++}setTimeout(go,was?300:Math.min(8000,400*Math.pow(1.6,Math.max(0,fails-URLS.length))))};ws.onerror=()=>{}}
 go();
 return {sub(t){subs.push(t);if(up)send(subPkt(t))},pub(t,s){if(up)send(pkt(0x30,[str(t),te.encode(s)]))},pubR(t,s){if(up)send(pkt(0x31,[str(t),te.encode(s)]))},get up(){return up},close(){dead=true;clearInterval(ping);try{ws&&ws.close()}catch(e){}}}}
const RT=c=>'lcb1/'+c+'/';
const FORCE_RELAY=QS.has('forcerelay');
function relayHost(code){if(NET.mqs)return;NET.mqs=RELAYS.map(u=>{const mq=mqtt([u],(topic,txt)=>onRelay(mq,txt,topic));mq.sub(RT(code)+'h');mq.sub(LOBQ);return mq})}
const LOBQ='lcb1/rooms/q',LOBA='lcb1/rooms/a';
function roomInfo(){const h=S.players.find(p=>p.id==='host');return JSON.stringify({c:S.code,n:h?h.name:'?',p:S.players.length,m:S.settings.mode,mp:S.settings.map,ph:S.phase,v:PROTO})}
function announce(){if(NET.mode!=='host'||!S||!S.settings.pub||!NET.mqs||S.code==='SOLO')return;const j=roomInfo();for(const mq of NET.mqs)mq.pub(LOBA,j)}
setInterval(announce,4000);
function onRelay(mq,txt,topic){{if(!S)return;if(topic===LOBQ){if(S.settings.pub&&NET.mode==='host')mq.pub(LOBA,roomInfo());return}let m;try{m=JSON.parse(txt)}catch(e){return}if(!m||typeof m.f!=='string')return;const rid=m.f.replace(/[^a-z0-9]/gi,'').slice(0,16),id='r_'+rid;let c=NET.conns.get(id);
  if(m.d&&m.d.t==='bp'){mq.pub(RT(S.code)+'c/'+rid,JSON.stringify({t:'bq',b:m.d.b,k:m.d.k}));return}
  if(!c){if(m.d&&m.d.t==='bye')return;c={id,relay:1,open:true,rid,mq,send:d=>{if(d.t==='s')return;c.mq.pub(RT(S.code)+'c/'+rid,JSON.stringify(d))}};NET.conns.set(id,c)}c.seen=performance.now();c.mq=mq;
  if(m.d&&m.d.t==='bye'){dropConn(id);return}hostMsg(c,m.d)}}
function escList(){const isH=NET.mode==='host';$('#eLob').style.display=isH&&S&&S.phase!=='lobby'?'':'none';$('#eWard').style.display=V&&V.phase==='lobby'?'':'none';$('#eQuit').textContent=isH?(V&&V.code==='SOLO'?'Quit practice':'Close room'):'Leave room';
 const L=isH&&V?V.players.filter(p=>p.id!==NET.myId):[];$('#ePl').innerHTML=L.length?'<div class="small" style="border:0;background:none;padding:0">Players</div>'+L.map(p=>'<div><span style="color:'+COLORS[p.color]+'">●</span><span>'+esc(p.name)+(p.bot?' 🤖':'')+'</span><button data-ek="'+p.id+'">Kick</button></div>').join(''):''}
function toggleEsc(on){if(!NET.mode&&!S){$('#esc').classList.remove('on');return}const o=on==null?!$('#esc').classList.contains('on'):on;$('#esc').classList.toggle('on',o);if(!o)$('#mst').classList.remove('on');if(o){escList();quitArm=0;$('#eQuit').classList.remove('go')}}
let quitArm=0;setInterval(()=>{if($('#esc').classList.contains('on'))escList();document.body.classList.toggle('inroom',!!NET.mode)},500);
const MYUID=(()=>{let u=store.get('uid','');if(!u){u=Math.random().toString(36).slice(2,12);store.set('uid',u)}return u})();
