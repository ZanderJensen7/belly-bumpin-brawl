// 02-rules.js: bot names, mutators (MUTS), maps (MAPS), modes, perks, teams, shape maths
const BOTNAMES=['Big Gary','Tiny Tim','Brenda','Sir Hic','Moist Dave','Karen II','Chug Norris','Ale Gore','Beerdan','Lager Lou','Sippy','Mr. Spill'];
const MUTS={
 none:{n:'Warm-Up Round',d:'Just bellies.'},
 spill:{n:'Spilled Drinks',d:'Slippery!'},
 bumpers:{n:'Bar Stool Pinball',d:'Bouncy stools.'},
 kegs:{n:'Keg Stampede',d:'Runaway kegs!'},
 bomb:{n:'Hot Shot',d:'Bump to pass it. Don\'t hold it.'},
 tilt:{n:'Tipsy Table',d:'Everything slides.'},
 spin:{n:'Lazy Susan',d:'The table spins.'},
 shrink:{n:'Last Call Shrinkage',d:'The table shrinks.'},
 hic:{n:'The Hiccups',d:'*hic* random bumps *hic*'}, // retired: random dashes felt like a bug. Kept so an older host's rounds still show a name.
 big:{n:'Big Boned',d:'Everyone is huge.'},
 reverse:{n:'Mixed Up',d:'Controls reversed.'},
 goggles:{n:'Beer Goggles',d:'Double vision.'},
 slosh:{n:'Sloshing Pint',d:'Waves! Lean into them.'},
 rails:{n:'Glass Railings',d:'Two hits smash them.'},
 nolegs:{n:'No Legs',d:'No walking. Dash to move.'},
};
const MUT_POOL=['nolegs','rails','slosh','spill','bumpers','kegs','bomb','tilt','spin','shrink','big','reverse','goggles'];
const CUPS=[];[1,-1].forEach(sg=>{[[390,-66],[390,0],[390,66],[328,-33],[328,33],[266,0]].forEach(([x,y])=>CUPS.push({t:'c',x:sg*x,y,r:30}))});
const MAPS={
 round:{n:'The Round Table',solids:[{t:'c',x:0,y:0,r:290}],holes:[],ext:300,rim:'#4a2810'},
 counter:{n:'The Bar Counter',solids:[{t:'s',x:0,y:0,w:920,h:250}],holes:[],ext:470,rim:'#d4a84a',noMut:['spin']},
 pong:{n:'Beer Pong Table',solids:[{t:'r',x:0,y:0,w:880,h:420}],holes:CUPS,ext:450,rim:'#f4efe4',noMut:['spin']},
 coasters:{n:'Coaster Hop',solids:[{t:'c',x:0,y:0,r:115},{t:'c',x:-240,y:-150,r:100},{t:'c',x:240,y:-150,r:100},{t:'c',x:-240,y:150,r:100},{t:'c',x:240,y:150,r:100}],holes:[],ext:350,rim:'#8a5a2e',noMut:['rails']},
 donut:{n:'The Donut',solids:[{t:'c',x:0,y:0,r:295}],holes:[{t:'c',x:0,y:0,r:100}],ext:300,rim:'#a8652a'},
 pool:{n:'Pool Table',solids:[{t:'r',x:0,y:0,w:860,h:430}],holes:[[-430,-215],[0,-232],[430,-215],[-430,215],[0,232],[430,215]].map(q=>({t:'c',x:q[0],y:q[1],r:50})),ext:440,rim:'#5a2e12',noMut:['spin']},
 dance:{n:'Dance Floor',solids:[{t:'r',x:0,y:0,w:760,h:220},{t:'r',x:0,y:0,w:220,h:560}],holes:[],ext:390,rim:'#2a1640',noMut:['rails']},
 swiss:{n:'Swiss Cheese',solids:[{t:'c',x:0,y:0,r:300}],holes:[{t:'c',x:-140,y:-95,r:50},{t:'c',x:125,y:-140,r:40},{t:'c',x:160,y:105,r:56},{t:'c',x:-95,y:160,r:42},{t:'c',x:5,y:5,r:34},{t:'c',x:-215,y:60,r:30}],ext:310,rim:'#b98a1c',noMut:['spin']},
 hub:{n:'The Hub',solids:[{t:'r',x:0,y:0,w:1700,h:1000}],holes:[],ext:880,rim:'#4a2810',noMut:['rails'],rare:1,hub:1},
 donger:{n:'The Big Donger',solids:[{t:'c',x:-135,y:190,r:132},{t:'c',x:135,y:190,r:132},{t:'r',x:0,y:-55,w:210,h:470},{t:'c',x:0,y:-300,r:122}],holes:[],ext:430,rim:'#7a2f3f',noMut:['rails','spin'],rare:1},
 belt:{n:'The Keg Line',solids:[{t:'r',x:0,y:0,w:900,h:400}],holes:[],ext:460,rim:'#3a3f48',noMut:['spin','tilt'],belts:[{x:0,y:-112,w:900,h:150,vx:120},{x:0,y:112,w:900,h:150,vx:-120}]},
 ice:{n:'The Ice Bucket',solids:[{t:'c',x:0,y:0,r:300}],holes:[],ext:310,rim:'#7fb6d9',noMut:['spill'],ice:1,grip:[{x:0,y:0,r:62},{x:-190,y:-120,r:44},{x:190,y:-120,r:44},{x:-190,y:125,r:44},{x:190,y:125,r:44}]},
 seesaw:{n:'The Seesaw',solids:[{t:'r',x:0,y:0,w:1000,h:210}],holes:[],ext:510,rim:'#5c3a1c',noMut:['spin','tilt','rails']},
 bridge:{n:'Two Tables',solids:[{t:'c',x:-280,y:0,r:175},{t:'c',x:280,y:0,r:175},{t:'s',x:0,y:0,w:420,h:84}],holes:[],ext:460,rim:'#4a2810',noMut:['rails','spin']},
};
const MAP_TIPS={round:'',counter:'Long and skinny.',pong:'Mind the cups.',coasters:'Dash to hop the gaps.',donut:'Mind the hole.',pool:'Sink them in the pockets.',dance:'Show off your moves.',bridge:'Fight for the plank.',donger:'Don\'t ask.',swiss:'Holey moley.',belt:'Mind the belts.',ice:'Only the coasters grip.',seesaw:'Too many on one end? Wheee.'};
const MODES={
 classic:{n:'Last One Standing',d:'Last belly on the table wins.'},
 teams:{n:'Tag Team 2v2',d:'2v2. Friendly fire is on.'},
 happy:{n:'Happy Hour',d:'2:30 of respawns. +1 per KO.'},
 stock:{n:'Stock Brawl',d:'Lives each round. Last one left wins.'},
 draft:{n:'Sore Losers',d:'Lose a round, pick a power-up. They stack.'},
 koth:{n:'King of the Coaster',d:'Hold the gold coaster alone. First to 20.'},
};
const PERKS={gut:['🍔','Beer Gut','Take less knockback'],punch:['💥','Haymaker','Bumps hit harder'],kicks:['👟','Fresh Kicks','Move faster'],quick:['⚡','Quick Charge','Charge faster'],ammo:['🍺','Extra Round','+1 drink each life'],armor:['🛡️','Bouncer','Start rounds with a shield'],arm:['🎯','Rocket Arm','Faster throws'],
 martyr:['💣','Martyrdom','You explode when you fall'],wind:['👼','Second Wind','Saved from your first fall each round'],spite:['😤','Spite','Whoever KOs you gets stunned'],floaty:['🎈','Floaty','Hover over the edge before you fall'],iron:['🦾','Iron Stomach','Never burp from charging'],uno:['🔄','Uno Reverse','Parries launch them way harder'],last:['🩸','Last Stand','Stronger when 2 are left']};
const PKEYS=Object.keys(PERKS);function pk(p,k,m){const n=p&&p.pk&&p.pk[k];return n?Math.pow(m,n):1}
function givePerk(p,k){if(!PERKS[k])return;p.pk=p.pk||{};p.pk[k]=(p.pk[k]||0)+1;p.pks=(p.pks||'')+PERKS[k][0];if(S.offers)delete S.offers[p.id];ev('meme',{t:PERKS[k][0]+' '+PERKS[k][1].toUpperCase(),x:p.x|0,y:p.y|0})}
function draftDone(){const o=S.offers||{};for(const id in o){const p=P(id);if(!p){delete o[id];continue}if((p.bot&&S.pt>1.2+Math.random())||S.pt>=15)givePerk(p,pick(o[id]))}return Object.keys(o).length===0&&S.pt>3}
const TEAMS=[{n:'Team Lager',c:'#ffd23f'},{n:'Team Sangria',c:'#e0245e'}];
const KOTH_T=20,HAPPY_T=150,KOTH_MAX=210;
function inShape(s,x,y){const dx=x-s.x,dy=y-s.y;if(s.t==='c')return dx*dx+dy*dy<=s.r*s.r;if(s.t==='r')return Math.abs(dx)<=s.w/2&&Math.abs(dy)<=s.h/2;
 const hw=s.w/2-s.h/2,cx=clamp(dx,-hw,hw);return (dx-cx)*(dx-cx)+dy*dy<=(s.h/2)*(s.h/2)}
function toLocal(x,y,st){const sc=st.arenaR/BASE_R,c=Math.cos(-st.rot),sn=Math.sin(-st.rot),dx=x-CX,dy=y-CY;return [(dx*c-dy*sn)/sc,(dx*sn+dy*c)/sc]}
function toWorld(lx,ly,st){const sc=st.arenaR/BASE_R,c=Math.cos(st.rot),sn=Math.sin(st.rot);return [CX+(lx*c-ly*sn)*sc,CY+(lx*sn+ly*c)*sc]}
