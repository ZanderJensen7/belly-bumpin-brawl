// Builds the single-file game from the pieces in src/:
//   page.html  page skeleton + all HTML markup, with /*__CSS__*/ and /*__JS__*/ markers
//   style.css  all CSS (fonts/*.woff2 are inlined at its /*__FONTS__*/ line)
//   js/*.js    the game script, joined in file-name order into ONE <script> (order matters: keep the number prefixes)
// then inlines peerjs.min.js at /*__PEERJS__*/ and the build number at __BUILD__.
// Output: src/last-call-brawl.html (the Action copies it to index.html on main).
const fs=require('fs'),path=require('path');const D=__dirname,rd=f=>fs.readFileSync(path.join(D,f),'utf8');
if(fs.existsSync(path.join(D,'src.html'))){console.error('src/src.html is gone: the game is split into src/page.html, src/style.css and src/js/*.js. Move your change there and delete src/src.html.');process.exit(1)}
const js=fs.readdirSync(path.join(D,'js')).filter(f=>f.endsWith('.js')).sort().map(f=>rd('js/'+f)).join('');
const parts=rd('page.html').split(/\/\*__CSS__\*\/\n|\/\*__JS__\*\/\n/);
if(parts.length!==3){console.error('page.html needs exactly one /*__CSS__*/ line and one /*__JS__*/ line');process.exit(1)}
// Fonts are inlined as data URIs at the /*__FONTS__*/ line in style.css, so the game needs no network for its look and works offline.
const b64=f=>fs.readFileSync(path.join(D,'fonts',f)).toString('base64');
const fonts="@font-face{font-family:'Luckiest Guy';font-weight:400;font-display:swap;src:url(data:font/woff2;base64,"+b64('luckiest-guy.woff2')+") format('woff2')}@font-face{font-family:'Fredoka';font-weight:300 700;font-display:swap;src:url(data:font/woff2;base64,"+b64('fredoka.woff2')+") format('woff2')}";
const src=parts[0]+rd('style.css').replace('/*__FONTS__*/',()=>fonts)+parts[1]+js+parts[2];
if(process.argv[2]==='--src'){fs.writeSync(1,src);process.exit(0)}
const pj=rd('peerjs.min.js').replace(/<\/script/g,'<\\/script');
const bn=(fs.existsSync(path.join(D,'buildnum.txt'))?rd('buildnum.txt').trim():'dev');
fs.writeFileSync(path.join(D,'last-call-brawl.html'),src.replace('/*__PEERJS__*/',()=>pj).replace('__BUILD__',bn));console.log('built',fs.statSync(path.join(D,'last-call-brawl.html')).size);
