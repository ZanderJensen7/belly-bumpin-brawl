// 05-settings.js: saved settings (store / localStorage) and your profile
// ============================================================ settings (local)
const store={get(k,d){try{const v=localStorage.getItem('lcb_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('lcb_'+k,JSON.stringify(v))}catch(e){}}};
let me={name:store.get('name',pick(['Sloppy Joe','Tipsy Tina','Hammered Hank','Wobbly Wes','Drunk Dan','Pint Pat'])),color:store.get('color',ri(0,7)),hat:store.get('hat',ri(0,7)),fc:store.get('fc',0),bk:store.get('bk',0),tag:cleanTag(store.get('tag','')),ic:store.get('ic',0)};
let muted=store.get('muted',false), voiceOn=store.get('voice',true), vol=store.get('vol',80), musVol=store.get('musvol',60);

