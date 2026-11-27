// 08-announcer.js: the speech-synthesis announcer (say)
// ============================================================ ANNOUNCER (speech synthesis)
let lastSay=0;
const VOX=[{n:'Bar Boss',p:.75,r:1.08,v:/Microsoft David|Google UK English Male|Daniel|Alex/i},{n:'Big Deep',p:.25,r:.9,v:/Microsoft Mark|Microsoft Guy|Fred|Alex|David/i},{n:'Hype Man',p:1.4,r:1.25,v:/Google US English|Microsoft Guy|Microsoft Andrew|Aaron|Samantha/i},{n:'Posh Butler',p:.9,r:.95,v:/Google UK English Male|Microsoft George|Microsoft Ryan|Daniel|Arthur|en[-_]GB/i},
 {n:'Aussie Mate',p:1,r:1.12,v:/Microsoft James|Australia|Karen|Lee|en[-_](AU|NZ)/i},{n:'Lady Luck',p:1.1,r:1.05,v:/Microsoft Zira|Google UK English Female|Microsoft Aria|Microsoft Jenny|Samantha|Victoria|Female/i},{n:'Robo Bartender',p:.05,r:.85,v:/Microsoft Zira|Microsoft Hazel|Fred|Zarvox|Microsoft David/i},{n:'Chipmunk',p:2,r:1.4,v:/Microsoft Zira|Microsoft David|Samantha|Female/i}];
let voxI=store.get('vox',0)|0;
function voxVoice(v,i){try{const vs=speechSynthesis.getVoices().filter(x=>/^en/i.test(x.lang));if(!vs.length)return null;const loc=vs.filter(x=>x.localService);
 const m=(loc.find(x=>v.v.test(x.name)||v.v.test(x.lang)))||vs.find(x=>v.v.test(x.name)||v.v.test(x.lang));if(m)return m;const pool=loc.length?loc:vs;return pool[i%pool.length]}catch(e){return null}}
try{speechSynthesis.onvoiceschanged=()=>{}}catch(e){}
function say(text,force){if(RPL.on)return;if(!voiceOn||!('speechSynthesis' in window))return;if(document.hidden&&!store.get('bgsnd',true))return;const t=performance.now();if(!force&&(speechSynthesis.speaking||t-lastSay<1200))return;
 lastSay=t;try{if(force)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);{const v=VOX[voxI]||VOX[0];u.rate=v.r;u.pitch=v.p;const vv=voxVoice(v,voxI);if(vv){u.voice=vv;u.lang=vv.lang}}u.volume=muted?0:vol/100;speechSynthesis.speak(u)}catch(e){}}

