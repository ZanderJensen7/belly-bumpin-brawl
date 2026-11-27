// 05b-options.js: player options (screen shake, flashes, colour-blind shapes, key bindings). The Settings panel that edits them is 31b-options.js.
const SHK=[0,.4,1];let shakeLv=store.get('shake',matchMedia('(prefers-reduced-motion: reduce)').matches?1:2),flashOn=store.get('flash',true)?1:0,cbOn=store.get('cb',false)?1:0;
const CBS=['●','■','▲','◆','★','✚','♥','⬟']; // colour-blind mode: one shape per player colour, shown before the name
// Keyboard bindings. The old extra keys (arrows, J/K/L, Enter, right Shift) still work unless one is rebound as a main key.
const KEYDEF={up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD',bump:'Space',parry:'ShiftLeft',throw:'KeyF'};
let KB=Object.assign({},KEYDEF,store.get('keys',{})),KBU=new Set(Object.values(KB));const altKey=c=>!KBU.has(c)&&keys[c];
