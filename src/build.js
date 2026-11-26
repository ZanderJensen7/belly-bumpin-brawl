const fs=require('fs');const src=fs.readFileSync(__dirname+'/src.html','utf8');const pj=fs.readFileSync(__dirname+'/peerjs.min.js','utf8').replace(/<\/script/g,'<\\/script');
fs.writeFileSync(__dirname+'/last-call-brawl.html',src.replace('/*__PEERJS__*/',()=>pj));console.log('built',fs.statSync(__dirname+'/last-call-brawl.html').size);
