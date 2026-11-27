// 07-music.js: the procedural music
// ---- music: 5 procedural songs (lobby lounge, polka, ska, shanty, disco), sections + intensity
const MAJ=[0,2,4,5,7,9,11],MIN=[0,2,3,5,7,8,10];
const RH={8:[[1,0,1,0,1,0,1,0],[1,0,1,1,1,0,1,0],[1,1,1,0,1,0,0,0],[1,0,0,1,0,0,1,0],[1,0,1,0,1,1,1,1],[0,0,1,1,1,0,1,0]],6:[[1,0,1,1,0,1],[1,0,0,1,0,0],[1,1,1,1,0,1],[1,0,1,1,1,0]],
 16:[[1,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0],[1,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0],[0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,0],[1,0,0,0,1,0,1,0,0,0,1,1,0,0,1,0]],
 lounge:[[1,0,0,1,0,0,1,0],[0,0,1,0,1,1,0,0],[1,0,0,0,1,0,1,1],[0,1,1,0,1,0,0,0]]};
function mrng(a){return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
function snapS(m,key,sc){for(let k=0;k<3;k++){const d=((m-key-k)%12+12)%12;if(sc.includes(d))return m-k}return m}
function genMel(seed,ch,key,sc,steps,rk,lo,hi){const r=mrng(seed),rhs=RH[rk||steps],out=[];let prev=key+7,offs=[];
 for(let i=0;i<ch.length;i++){const root=key+ch[i][0],tones=(ch[i][1]==='m'?[0,3,7]:[0,4,7]).map(x=>root+x),bar=new Array(steps).fill(-1);
  if(i===ch.length-1){let m=root;while(m<lo)m+=12;while(m>hi)m-=12;bar[0]=m;if(steps>=8)bar[steps/2]=-1;out.push(bar);offs.push(null);continue}
  if(i%4>=2&&offs[i-2]){offs[i-2].forEach((o,e)=>{if(o!=null){let m=snapS(root+o,key,sc);while(m<lo)m+=12;while(m>hi)m-=12;bar[e]=m}});offs.push(offs[i-2]);out.push(bar);continue}
  const rh=rhs[Math.floor(r()*rhs.length)],of=new Array(steps).fill(null);
  for(let e=0;e<steps;e++){if(!rh[e])continue;let m;
   if(e%(steps===6?3:4)===0){let best=tones[0],bd=99;for(const t0 of tones)for(const o of [-12,0,12]){const d=Math.abs(t0+o-prev)+r()*3;if(d<bd){bd=d;best=t0+o}}m=best}
   else{const dir=r()<.5?-1:1,stp=r()<.7?1:2;let deg=sc.indexOf(((snapS(prev,key,sc)-key)%12+12)%12);const oct=Math.floor((snapS(prev,key,sc)-key)/12);deg+=dir*stp;m=key+oct*12+Math.floor(deg/7)*12+sc[((deg%7)+7)%7]}
   while(m<lo)m+=12;while(m>hi)m-=12;bar[e]=m;of[e]=m-root;prev=m}
  offs.push(of);out.push(bar)}
 return out}
const C=(...a)=>a.map(x=>typeof x==='number'?[x,'M']:[x[0],x[1]]);
const SONGDEF={
 lobby:{sd:.25,steps:8,swing:.3,key:65,sc:MAJ,style:'lounge',rk:'lounge',lead:['vib','vib','brass','vib'],form:'ABAC',
  ch:{A:C(0,[2,'m'],[-5,'7'],0,[-3,'m'],[2,'m'],[-5,'7'],0),B:C(5,5,0,[-3,'m'],[2,'m'],[-5,'7'],0,0),C:C([-3,'m'],[2,'m'],[-5,'7'],0,5,[-7,'M'],[-5,'7'],0)}},
 polka:{sd:.2,steps:8,key:60,sc:MAJ,style:'polka',lead:['saw2','sq','saw2','acc'],form:'ABAC',
  hand:{A:[[64,67,64,67,72,-1,67,-1],[71,74,71,67,62,-1,-1,-1],[64,67,64,67,72,-1,76,-1],[77,76,74,72,69,-1,65,-1],[67,-1,72,-1,76,74,72,-1],[74,-1,71,-1,67,69,71,-1],[72,71,69,67,65,64,62,-1],[60,-1,64,67,72,-1,-1,-1]]},
  ch:{A:C(0,-5,0,-7,0,-5,-7,0),B:C(5,0,7,0,5,0,[7,'7'],0),C:C([-3,'m'],5,7,0,[-3,'m'],[2,'m'],7,0)}},
 ska:{sd:.1875,steps:8,key:55,sc:MAJ,style:'ska',lead:['brass','sq','brass','saw2'],form:'AABA',
  ch:{A:C(0,[-3,'m'],5,7,0,[-3,'m'],5,7),B:C(5,5,0,0,[2,'m'],[2,'m'],7,7)}},
 shanty:{sd:.2,steps:6,key:62,sc:MIN,style:'shanty',lead:['acc','acc','sq','acc'],form:'AABA',
  ch:{A:C([0,'m'],[0,'m'],-2,-2,[0,'m'],[-4,'M'],-2,[0,'m']),B:C(3,3,-2,-2,-4,-4,[-5,'m'],[0,'m'])}},
 disco:{sd:.125,steps:16,key:57,sc:MIN,style:'disco',lead:['synth','synth','brass','synth'],form:'ABAB',
  ch:{A:C([0,'m'],[0,'m'],-4,-2,[0,'m'],[0,'m'],-4,-2),B:C([-7,'m'],-4,-2,[0,'m'],[-7,'m'],-4,-2,[0,'m'])}}};
const SONGS={};
function buildSongs(){let sd=11;for(const k in SONGDEF){const D=SONGDEF[k],bars=[];const lo=D.key-2,hi=D.key+17;const secs={};
 for(const sc of new Set(D.form))secs[sc]=(D.hand&&D.hand[sc])||genMel(sd++*7919,D.ch[sc],D.key,D.sc,D.steps,D.rk,lo,hi);
 [...D.form].forEach((sc,si)=>secs[sc].forEach((mel,i)=>bars.push({mel,ch:D.ch[sc][i],root:D.key+D.ch[sc][i][0],lead:D.lead[si%D.lead.length],sec:si})));SONGS[k]=Object.assign({bars},D)}}
const Music={next:0,step:0,timer:null,wob:0,cur:'lobby',int:0,
 start(){buildSongs();this.next=AC.currentTime+.1;if(!this.timer)this.timer=setInterval(()=>this.tick(),50)},
 want(){const v=typeof V!=='undefined'?V:null;if(!v||v.phase==='lobby'||v.phase==='over')return 'lobby';if(v.disco)return 'disco';const L=['polka','ska','shanty'];let h=0;for(const c of String(v.code||''))h+=c.charCodeAt(0);return L[(h+(v.round||1))%3]},
 tick(){if(!AC)return;const v=typeof V!=='undefined'?V:null;
  if(v&&v.phase==='play'&&v.players){const al=v.players.filter(p=>p.alive).length;this.int+=((al<=2&&v.players.length>2?1:al<=3?.5:0)-this.int)*.05}else this.int*=.95;
  while(this.next<AC.currentTime+.2){let S0=SONGS[this.cur];if(this.step%S0.steps===0){const w=this.want();if(w!==this.cur){this.cur=w;this.step=0;S0=SONGS[w]}}
   const t=this.next+((S0.swing&&this.step%2)?S0.swing*S0.sd:0);this.play(S0,this.step,t);this.next+=S0.sd;this.step++}},
 mf(m){return 440*Math.pow(2,(m-69)/12)},
 note(type,m,t,d,v,cut,det,att){const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type=type;o.frequency.value=this.mf(m);o.detune.value=det||0;
  f.type='lowpass';f.frequency.value=cut;env(g,t,att||.008,v,d);o.connect(f);f.connect(g);g.connect(MUG);o.start(t);o.stop(t+d+.05);return o},
 nz(t,d,v,hp,bp){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type=bp?'bandpass':'highpass';f.frequency.value=hp;env(g,t,.002,v,d);s.connect(f);f.connect(g);g.connect(MUG);s.start(t,Math.random());s.stop(t+d+.02)},
 kick(t,v){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);env(g,t,.002,v||.8,.17);o.connect(g);g.connect(MUG);o.start(t);o.stop(t+.2)},
 snare(t,v){this.nz(t,.14,v||.3,1800,1);this.note('triangle',50,t,.06,(v||.3)*.8,3000)},
 hat(t,v,open){this.nz(t,open?.16:.04,v||.1,7500)},
 lead(L,m,t,d,wob){const w=wob;switch(L){
  case 'saw2':[-9,9].forEach(x=>this.note('sawtooth',m,t,d,.12,2300,w+x));this.note('square',m-12,t,d,.035,1500,w);break;
  case 'sq':this.note('square',m,t,d,.09,1900,w);this.note('triangle',m+12,t,d*.6,.05,4000,w);break;
  case 'brass':{const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';o.frequency.value=this.mf(m);o.detune.value=w;f.type='lowpass';f.Q.value=3;f.frequency.setValueAtTime(500,t);f.frequency.exponentialRampToValueAtTime(2800,t+.05);f.frequency.exponentialRampToValueAtTime(900,t+d);env(g,t,.02,.16,d);o.connect(f);f.connect(g);g.connect(MUG);o.start(t);o.stop(t+d+.05);break}
  case 'vib':this.note('sine',m,t,Math.max(d,.5),.2,5000,w,.004);this.note('sine',m+24,t,.12,.04,6000,w,.002);break;
  case 'acc':{[-14,14].forEach(x=>{const o=this.note('sawtooth',m,t,d,.08,1500,w+x,.02);vib(o,5.5,4,t,d)});this.note('square',m-12,t,d,.03,900,w,.02);break}
  case 'synth':[-7,7].forEach(x=>this.note('square',m,t,d,.06,3200,w+x));this.note('sawtooth',m+12,t,d*.5,.03,4000,w);break}},
 chord(type,root,q,t,d,v,cut,w){(q==='m'?[0,3,7]:q==='7'?[0,4,7,10]:[0,4,7]).forEach(iv=>this.note(type,root+iv,t,d,v,cut,w))},
 play(S0,s,t){const n=S0.bars.length,bi=Math.floor(s/S0.steps)%n,B=S0.bars[bi],e=s%S0.steps,st=S0.steps,sd=S0.sd,I=this.int,q=B.ch[1],r=B.root;
  const wob=Math.sin(t*.9)*(8+this.wob*25),fill=bi%4===3;
  const tones=(q==='m'?[0,3,7]:[0,4,7]);
  switch(S0.style){
  case 'lounge':
   if(e%2===0){const wk=[0,tones[1],7,e===6?11:tones[1]][e/2];this.note('triangle',r-24+wk,t,sd*1.8,.5,700,0)}
   if(e===0||e===3||(e===6&&bi%2))this.chord('sine',r-12+12,q,t,sd*(e===0?3:1.5),.05,2000,0);
   if(e%2===0)this.hat(t,.06+I*.04);if(e===2||e===6)this.nz(t,.18,.07,2500,1);if(e===0&&I>.3)this.kick(t,.4);break;
  case 'polka':
   if(e===0||e===4)this.note('triangle',(e===0?r:r+7)-12,t,.22,.9,600,wob);
   if(e===2||e===6)this.chord('square',r+12,q,t,.12,.11,1400,wob);
   if(e%2===1)this.hat(t,.11);if(I>.2){if(e===0||e===4)this.kick(t,.55);if(e===2||e===6)this.snare(t,.18+I*.12)}
   if(fill&&e>=6)this.snare(t,.25);break;
  case 'ska':
   if(e%2===0){const wk=[0,tones[1],7,tones[1]+(bi%2?2:0)][e/2];this.note('triangle',r-12+wk,t,sd*1.6,.85,700,wob)}
   if(e%2===1)this.chord('square',r+12,q,t,.07,.09,2600,wob);
   this.hat(t,e%2?.12:.07);if(e===0||e===4||(I>.5&&e===7))this.kick(t,.6);if(e===2||e===6)this.snare(t,.22);if(fill&&e>=5)this.snare(t,.2);break;
  case 'shanty':
   if(e===0)this.note('triangle',r-12,t,.35,.9,600,wob);if(e===3)this.note('triangle',r-5,t,.3,.7,600,wob);
   if(e===1||e===2||e===4||e===5)this.chord('sawtooth',r+12,q,t,.14,.035,1100,wob);
   if(e===0||e===3)this.kick(t,.5+I*.2);if(e===3)this.nz(t,.1,.18+I*.1,1200,1);if(I>.4&&e%3===2)this.hat(t,.08);if(fill&&e>=4)this.snare(t,.2);break;
  case 'disco':
   if(e%4===0)this.kick(t,.75);if(e===4||e===12)this.snare(t,.25);if(e%4===2)this.hat(t,.13,1);else if(I>.3&&e%2===1)this.hat(t,.05);
   if(e%2===0)this.note('sawtooth',r-24+(e%4===2?12:0),t,sd*1.6,.35,900+I*900,wob);
   if(e===6||e===14)this.chord('square',r+12,q,t,.1,.06,2600,wob);if(fill&&e>=12)this.snare(t,.18);break}
  const m=B.mel[e];if(m>0){let k=1;while(e+k<st&&B.mel[e+k]<0&&k<3)k++;this.lead(B.lead,m,t,Math.max(.12,sd*k*.9),wob)}}
};

