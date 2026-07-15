// Runnable self-check for the synced-stack alignment (index.html `syncStack`).
// No framework: `node test/sync.test.js` — exits non-zero on failure.
// Dataset-agnostic: derives OFFSET straight from data.js and asserts the
// invariants the player relies on, so it keeps passing as Sundays are added.
//   OFFSET[k] = maxAnchor - anchor[k]   (anchor = the `delta` liturgy line)
//   - the clip with the latest anchor enters at master t=0
//   - every clip enters at t=OFFSET[k]; before that it is silent
//   - stackDuration = max(OFFSET[k] + duration[k])
const path = require('path');
global.window = {};
require(path.join(__dirname, '..', 'data.js'));
const { weeks: WEEKS, order: ORDER } = window.WKHR;

function anchorTime(k) {
  const L = WEEKS[k].lines;
  const ln = L.find(x => x[2] && x[2].includes('delta'))
          || L.find(x => /take WKHR along with you/.test(x[1]));
  return ln ? ln[0] : 0;
}
const SYNC_ANCHOR = Math.max(...ORDER.map(anchorTime));
const OFFSET = {}; ORDER.forEach(k => OFFSET[k] = +(SYNC_ANCHOR - anchorTime(k)).toFixed(2));

// synthetic uniform durations — only relative timing matters for the logic test
const DUR = {}; ORDER.forEach(k => DUR[k] = 100);
const au = {}; ORDER.forEach(k => au[k] = { paused: true, currentTime: 0, duration: DUR[k], muted: false });
function reconcile(T) {                    // mirrors syncStack play/pause decisions
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

// the latest-anchor clip leads (enters at 0); a partial/late clip enters last
const lead = ORDER.reduce((a, b) => OFFSET[a] <= OFFSET[b] ? a : b);
const late = ORDER.reduce((a, b) => OFFSET[a] >= OFFSET[b] ? a : b);

ok(OFFSET[lead] === 0, `${lead} (latest anchor) enters at master t=0`);
ok(ORDER.every(k => OFFSET[k] >= 0), 'every offset >= 0 (no clip needs negative lead)');

reconcile(0);
ok(sounding(0).includes(lead), 't=0 lead clip is sounding');
ok(!sounding(0).includes(late) || OFFSET[late] === 0, 't=0 the late clip is silent (unless it is also the lead)');

// the late clip is silent just before its entry, sounding just after
reconcile(OFFSET[late] - 0.5); ok(!sounding(OFFSET[late] - 0.5).includes(late), `${late} silent just before its entry (${OFFSET[late]}s)`);
reconcile(OFFSET[late] + 0.5); ok(sounding(OFFSET[late] + 0.5).includes(late), `${late} joins just after its entry`);
ok(Math.abs(au[late].currentTime - 0.5) < 0.3, `${late} starts near its own 0 when it joins`);

// clips pause once past their own end
reconcile(stackDuration + 1); ok(ORDER.every(k => au[k].paused), 'all clips paused past stack end');

// mute hides a sounding clip
au[lead].muted = true; reconcile(1); ok(!sounding(1).includes(lead), 'muted clip not sounding'); au[lead].muted = false;

ok(Math.abs(stackDuration - (OFFSET[late] + DUR[late])) < 0.01, 'stackDuration = latest clip end');

console.log(fail ? `\n${fail} FAILED` : `\nALL PASS (${ORDER.length} Sundays)`);
process.exit(fail ? 1 : 0);
