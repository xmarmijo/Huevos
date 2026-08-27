const fs = require('fs');
const path = require('path');
const root = __dirname;
const vp = path.join(root, 'version.txt');

// leer version actual (mayor.minor)
let [maj, min] = fs.readFileSync(vp, 'utf8').trim().split('.').map(n => parseInt(n, 10));

// incrementar: minor +1; si pasa 9 -> mayor+1, minor=0
min += 1;
if (min > 9) { maj += 1; min = 0; }
const nv = maj + '.' + min;
fs.writeFileSync(vp, nv);

// texto a mostrar: si minor=0 -> "vN", sino -> "vN.M"
const display = (min === 0) ? ('v' + maj) : ('v' + maj + '.' + min);

// HTML: reemplazar solo el texto dentro de <span id="appVer">
const htmlPath = path.join(root, 'MisHuevos_Movil.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/(<span id="appVer"[^>]*>)v[^<]*(<\/span>)/, '$1' + display + '$2');
fs.writeFileSync(htmlPath, html);

// sw.js: actualizar CACHE_NAME para forzar renovacion de cache
const swPath = path.join(root, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/const CACHE_NAME = 'mis-huevos-[^']*'/, "const CACHE_NAME = 'mis-huevos-" + nv + "'");
fs.writeFileSync(swPath, sw);

console.log('Version bump -> ' + display + '  (interna ' + nv + ')');
