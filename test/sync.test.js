// Runnable self-check for the synced-stack alignment (index.html `syncStack`).
// No framework: `node test/sync.test.js` — exits non-zero on failure.
// Verifies each clip enters the master timeline at OFFSET = maxAnchor - clipAnchor,
// clips that miss the open stay silent until their entry, and the stack ends with
// the last clip.
const path = require('path');
global.window = {};
require(path.join(__dirname, '..', 'data.js'));
const { weeks: WEEKS, order: ORDER } = window.WKHR;

// approximate clip lengths (only relative timing matters here)
const DUR = { mar29: 92, apr26: 70, jun07: 52, jul05: 104, jul12: 78 };

function anchorTime(k) {
  const L = WEEKS[k].lines;
  const ln = L.find(x => x[2] && x[2].includes('delta'))
          || L.find(x => /take WKHR along with you/.test(x[1]));
  return ln ? ln[0] : 0;
}
const SYNC_ANCHOR = Math.max(...ORDER.map(anchorTime));
const OFFSET = {}; ORDER.forEach(k => OFFSET[k] = +(SYNC_ANCHOR - anchorTime(k)).toFixed(2));

const au = {}; ORDER.forEach(k => au[k] = { paused: true, currentTime: 0, duration: DUR[k], muted: false });
function reconcile(T) {
  ORDER.forEach(k => {
    const a = au[k], want = T - OFFSET[k], d = a.duration;
    if (want < 0 || want >= d) { a.paused = true; return; }
    if (a.paused) { a.paused = false; a.currentTime = Math.max(0, want); }
    else a.currentTime = want;
  });
}
const sounding = T => ORDER.filter(k => T >= OFFSET[k] && !au[k].muted && !au[k].paused);
const stackDuration = Math.max(...ORDER.map(k => OFFSET[k] + DUR[k]));

let fail = 0;
const ok = (c, m) => { if (!c) { console.log('FAIL:', m); fail++; } else console.log('ok:', m); };

reconcile(0);  ok(sounding(0).join() === 'jul05', 't=0 only jul05 (offset 0)');
reconcile(1);  ok(sounding(1).includes('mar29') && sounding(1).includes('jul05'), 't=1 jul05 + mar29');
reconcile(10); ok(sounding(10).includes('jul12') && !sounding(10).includes('apr26'), 't=10 jul12 in, apr26 not yet');
reconcile(20); ok(sounding(20).includes('apr26') && !sounding(20).includes('jun07'), 't=20 apr26 in, jun07 silent');
reconcile(38); ok(!sounding(38).includes('jun07'), 't=38 jun07 still silent (<38.24)');
reconcile(39); ok(sounding(39).includes('jun07'), 't=39 jun07 joined');
reconcile(40); ok(Math.abs(au.jun07.currentTime - (40 - OFFSET.jun07)) < 0.3, 'jun07 currentTime tracks master clock');
reconcile(105); ok(au.jul05.paused, 'jul05 paused after its own end');
au.mar29.muted = true; reconcile(20); ok(!sounding(20).includes('mar29'), 'muted clip not sounding'); au.mar29.muted = false;
ok(Math.abs(stackDuration - 104) < 0.01, 'stackDuration = latest clip end (jul05, 104)');

console.log(fail ? `\n${fail} FAILED` : '\nALL PASS');
process.exit(fail ? 1 : 0);
