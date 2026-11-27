// 01-utils-data.js: helpers, screen size, colours, and the cosmetics catalogue (hats, faces, backs, icons, emotes)
'use strict';
// ============================================================ utils
const $=s=>document.querySelector(s);
const TAU=Math.PI*2, rnd=(a,b)=>a+Math.random()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t, hyp=Math.hypot;
const QS=new URLSearchParams(location.search);
const LOCAL=QS.has('local'); // BroadcastChannel transport for testing
const W=1280,H=720,CX=640,CY=388,BASE_R=290;
const COLORS=['#ff5a5f','#3fa7ff','#ffd23f','#4cd964','#c77dff','#ff9f1c','#ff7eb6','#2ee6d6'];
const CNAMES=['Ketchup','Blue Raspberry','Mustard','Lime','Grape','Tangerine','Bubblegum','Mint'];
const HATS=['lampshade','cone','tophat','party','viking','cowboy','propeller','chef','none','beanie','helmet','horns','pirate','wizard','halo','crown','glizzy','duck','goldmug'];
const FACES=['none','shades','stache','clown','monocle','3d','patch','beard','hero','lucha','hearts','goggles'];
const FNAMES=['No face','Shades','Mustache','Clown Nose','Monocle','3D Glasses','Eye Patch','Beard','Hero Mask','Luchador','Heart Shades','Ski Goggles'];
const FACE_LV=[1,1,1,1,2,3,4,6,8,10,11,13];
const BACKS=['none','cape','balloon','tail','flag','jetpack','wings','bat','fairy'];
const BNAMES=['No back','Hero Cape','Party Balloon','Devil Tail','Team Flag','Jetpack','Angel Wings','Bat Wings','Fairy Wings'];
const BACK_LV=[1,1,1,3,4,5,7,8,10];
const ICONS=['','🍺','🔥','💀','🤡','🦆','🌭','😈','🐐','👑','💎','🚀','🏆','🖐️','👋','🫧','💃','🪩','💧','🌀','⚡','⏱️','🍆','💰','😏'];const ICON_LV=[1,1,1,2,3,4,5,6,7,9,11,13,15,1,1,1,1,1,1,1,1,1,1,1,1];
const ICON_ACH={13:'hand',14:'slap',15:'burp',16:'dance',17:'disco',18:'hydro',19:'stow',20:'triple',21:'deepfast',22:'donger',23:'treasure',24:'nice'};
function hasAch(k){const a=getStats().ach;return !!(a&&a[k])}
const cleanTag=t=>String(t||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4);function dispName(p){return (p.ic?ICONS[p.ic]+' ':'')+(p.tag?'['+p.tag+'] ':'')+p.name}
const HAT_LV=[1,1,1,1,1,1,1,1,1,2,3,4,5,7,9,12,6,1,1];const HAT_ACH={17:'duck',18:'deep'};
const HNAMES=['Lampshade','Traffic Cone','Top Hat','Party Hat','Viking','Cowboy','Propeller','Chef','Bald','Beanie','Beer Helmet','Devil Horns','Pirate','Wizard','Halo','Crown','Glizzy','Rubber Duck','Golden Mug'];
const EMOTES=['HIC!','COME AT ME','♪ DANCE ♪','*BUUURP*'];
const BUZZ=['Sober-ish','Tipsy','Buzzed','Sloshed','Hammered','Legendary','Gone','Ascended'];
