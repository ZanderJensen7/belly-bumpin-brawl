// Fails if any inline <script> in the built game doesn't parse. Run after build.js.
const fs=require('fs'),vm=require('vm');const html=fs.readFileSync(__dirname+'/last-call-brawl.html','utf8');
let n=0;for(const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)){n++;try{new vm.Script(m[1],{filename:'inline-script-'+n+'.js'})}catch(e){console.error('Script '+n+' does not parse:',e.message);process.exit(1)}}
console.log('ok,',n,'inline scripts parse');
