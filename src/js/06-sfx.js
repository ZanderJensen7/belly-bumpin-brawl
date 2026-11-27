// 06-sfx.js: audio setup and every sound effect (SFX)
// ============================================================ AUDIO
let AC=null,MG,SG,MUG,NB;
function initAudio(){
 if(AC){if(AC.state==='suspended')AC.resume();return}
 try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}
 MG=AC.createGain();MG.gain.value=muted?0:vol/100;MG.connect(AC.destination);
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=6;comp.connect(MG);
 SG=AC.createGain();SG.gain.value=.9;SG.connect(comp);
 MUG=AC.createGain();MUG.gain.value=.27*musVol/100;MUG.connect(comp);
 NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 Music.start();
}
const now=()=>AC.currentTime;
function env(g,t0,a,vol,dur){g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+a);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur)}
function tone(type,f0,f1,dur,vol,t0,dest){if(!AC)return;t0=t0||now();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);
 if(f1)o.frequency.exponentialRampToValueAtTime(f1,t0+dur);env(g,t0,.005,vol,dur);o.connect(g);g.connect(dest||SG);o.start(t0);o.stop(t0+dur+.05);return o}
function noise(dur,vol,ft,f0,f1,q,t0){if(!AC)return;t0=t0||now();const s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type=ft;f.frequency.setValueAtTime(f0,t0);
 if(f1)f.frequency.exponentialRampToValueAtTime(f1,t0+dur);f.Q.value=q||1;const g=AC.createGain();env(g,t0,.004,vol,dur);s.connect(f);f.connect(g);g.connect(SG);s.start(t0,Math.random()*.6);s.stop(t0+dur+.05)}
function vib(o,rate,depth,t0,dur){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=rate;lg.gain.value=depth;l.connect(lg);lg.connect(o.frequency);l.start(t0);l.stop(t0+dur+.05)}
const SFX={
 bonk(s){if(!AC)return;tone('sine',260,50,.2,.8);tone('square',140,40,.09,.18);noise(.07,.6,'lowpass',3000,300);if(s>1.1){const t=now()+.03,o=tone('sine',120,null,.45,.45,t);o.frequency.linearRampToValueAtTime(520,t+.4);vib(o,22,60,t,.45)}},
 bump(){tone('sine',180,90,.1,.35);noise(.04,.25,'lowpass',1500,300)},
 whoosh(c){noise(.22+.2*c,.3+.2*c,'bandpass',300,2600,2.5)},
 choir(){if(!AC)return;const t=now();[523,659,784,1047].forEach((f,i)=>{const o=tone('sine',f,null,.07,1.3,t+i*.03);vib(o,4,5,t,1.3)})},
 slap(){if(!AC)return;noise(.09,1,'highpass',1500,5000,.6);noise(.18,.6,'lowpass',2400,300);tone('sine',170,60,.3,.25)},
 splash(){if(!AC)return;noise(.8,.7,'lowpass',5000,200,.7);noise(.3,.4,'highpass',2000,6000,.5);const t=now();for(let i=0;i<7;i++)tone('sine',rnd(250,600),rnd(900,1800),.07,.16,t+.12+i*.06+Math.random()*.04)},
 boing(){if(!AC)return;const t=now(),o=tone('sine',110,null,.5,.55,t);o.frequency.linearRampToValueAtTime(440,t+.45);vib(o,18,50,t,.5);tone('triangle',220,null,.3,.15,t)},
 boom(){if(!AC)return;noise(1.4,1,'lowpass',2200,50,.6);tone('sine',100,22,.9,1);tone('sawtooth',60,20,.5,.25)},
 hic(p){if(!AC)return;p=p||1;noise(.05,.45,'bandpass',2600*p,null,4);tone('sine',650*p,1500*p,.08,.32)},
 burp(){if(!AC)return;const t=now(),o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';const f0=rnd(80,110);o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f0*.7,t+.7);
  vib(o,rnd(26,34),18,t,.8);f.type='lowpass';f.frequency.setValueAtTime(700,t);f.frequency.linearRampToValueAtTime(350,t+.7);f.Q.value=6;env(g,t,.03,.9,.8);o.connect(f);f.connect(g);g.connect(SG);o.start(t);o.stop(t+.85)},
 ding(n){const f=n?587:880;tone('triangle',f,null,.35,.5);tone('sine',f*2,null,.2,.15)},
 airhorn(){if(!AC)return;const t=now();[0,.13,.26].forEach((d,i)=>{[466,470].forEach(f=>{const o=tone('sawtooth',f,null,i==2?.5:.1,.07,t+d)})})},
 horn(){if(!AC)return;const t=now();[349,440,523].forEach((f,i)=>{const o=tone('square',f,null,.7,.12,t+i*.02);vib(o,6,8,t,.7)});noise(.6,.2,'bandpass',800,1200,1)},
 clang(){[523,1187,1650,2460,3100].forEach((f,i)=>tone(i%2?'square':'triangle',f,f*.98,.5-i*.06,.12))},
 tick(){tone('square',1600,null,.03,.12)},
 pop(){tone('sine',500,1100,.08,.3)},
 quack(){if(!AC)return;const t=now();[0,.16].forEach((d,i)=>{const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';o.frequency.setValueAtTime(i?520:620,t+d);o.frequency.exponentialRampToValueAtTime(i?380:430,t+d+.13);f.type='bandpass';f.frequency.value=1100;f.Q.value=3;env(g,t+d,.01,.7,.15);o.connect(f);f.connect(g);g.connect(SG);o.start(t+d);o.stop(t+d+.2)})},
 click(){tone('sine',800,1200,.05,.2)},
 pass(){tone('triangle',700,1400,.12,.35);tone('sine',1400,2000,.08,.15)},
 full(){tone('sine',1200,1800,.12,.25)},
 glass(big){if(!AC)return;const t=now();noise(big?.45:.15,big?.8:.5,'highpass',3000,8000,.7);for(let i=0;i<(big?8:3);i++)tone('sine',rnd(2200,5200),null,rnd(.05,.2),.12,t+i*.03+Math.random()*.04);if(big)tone('triangle',180,60,.15,.3)},
 cork(){if(!AC)return;noise(.06,.9,'bandpass',1800,600,2);tone('sine',900,180,.09,.5);noise(.5,.18,'highpass',4000,9000,.5,now()+.05)},
 pickup(){if(!AC)return;const t=now();[523,784,1047].forEach((f,i)=>tone('square',f,null,.1,.12,t+i*.06));noise(.15,.2,'highpass',3000,8000)},
 babble(pitch,n){if(!AC)return;const t=now();for(let i=0;i<n;i++){const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain(),st=t+i*.085;o.type='sawtooth';
  o.frequency.setValueAtTime(pitch*rnd(.85,1.35),st);f.type='bandpass';f.frequency.value=pick([350,600,850,1100,1500]);f.Q.value=5;env(g,st,.01,.9,.08);o.connect(f);f.connect(g);g.connect(SG);o.start(st);o.stop(st+.1)}},
 sad(){if(!AC)return;const t=now();[392,370,349,311].forEach((f,i)=>{const d=i==3?1:.32,st=t+i*.34,o=AC.createOscillator(),fl=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f,st);
  if(i==3)vib(o,5,9,st,d);fl.type='lowpass';fl.frequency.value=1100;env(g,st,.03,.22,d);o.connect(fl);fl.connect(g);g.connect(SG);o.start(st);o.stop(st+d+.05)})},
 cheer(){if(!AC)return;const t=now();for(let i=0;i<6;i++)noise(1.8,.18,'bandpass',rnd(900,3000),rnd(900,3000),3,t+Math.random()*.2);for(let i=0;i<3;i++){const st=t+.2+i*.35+Math.random()*.2;tone('sine',1800,2900,.25,.08,st)}},
 fanfare(){if(!AC)return;const t=now();[523,659,784,1047,784,1047].forEach((f,i)=>{tone('triangle',f,null,i>4?.6:.16,.3,t+i*.12);tone('square',f/2,null,i>4?.6:.16,.06,t+i*.12)})},
};
