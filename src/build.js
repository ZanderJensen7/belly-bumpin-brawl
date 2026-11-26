const fs=require('fs');const src=fs.readFileSync(__dirname+'/src.html','utf8');const pj=fs.readFileSync(__dirname+'/peerjs.min.js','utf8').replace(/<\/script/g,'<\\/script');
const bn=(fs.existsSync(__dirname+'/buildnum.txt')?fs.readFileSync(__dirname+'/buildnum.txt','utf8').trim():'dev');
fs.writeFileSync(__dirname+'/last-call-brawl.html',src.replace('/*__PEERJS__*/',()=>pj).replace('__BUILD__',bn));console.log('built',fs.statSync(__dirname+'/last-call-brawl.html').size);
